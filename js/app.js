import { checkText, RULES } from "./checker.js";
import { MODULES } from "./data/lessons.js";
import { EXERCISES } from "./data/exercises.js";
import { DICTIONARY } from "./data/dictionary.js";
import { TIPS, REFERENCE, SAMPLE_TEXT } from "./data/reference.js";
import * as store from "./store.js";

const main = document.getElementById("main");
const QUIZ_PASS = 0.7;

// ---------- helpers ----------

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function h(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content;
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.textContent = msg;
  document.body.append(el);
  setTimeout(() => el.remove(), 2400);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function checkerOptions(extra = {}) {
  const org = store.getState().org;
  return {
    approvedTerms: org.approvedTerms,
    orgTerms: org.orgTerms,
    disabledRules: org.disabledRules,
    ...extra,
  };
}

function scoreColor(score) {
  if (score == null) return "var(--surface-2)";
  if (score >= 85) return "var(--good)";
  if (score >= 60) return "var(--warning)";
  return "var(--error)";
}

function scoreRing(score) {
  return `<div class="score-ring" style="--p:${score ?? 0};--c:${scoreColor(score)}" role="img" aria-label="Score ${score ?? "not available"} of 100"><span>${score ?? "–"}</span></div>`;
}

function download(filename, text, type = "application/json") {
  const blob = new Blob([text], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function moduleProgress() {
  const p = store.getState().progress.modules;
  const done = MODULES.filter((m) => p[m.id]?.completed).length;
  return { done, total: MODULES.length };
}

function exerciseProgress() {
  const p = store.getState().progress.exercises;
  const done = EXERCISES.filter((e) => p[e.id]?.done).length;
  return { done, total: EXERCISES.length };
}

// ---------- annotated checker output ----------

function renderAnnotated(text, result) {
  const { sentences, issues } = result;
  let out = "";
  let pos = 0;
  for (const s of sentences) {
    out += esc(text.slice(pos, s.start));
    const sIssues = issues.filter((i) => i.sentenceIndex === s.index && i.scope === "sentence");
    const worst = sIssues.find((i) => i.severity === "error") || sIssues.find((i) => i.severity === "warning") || sIssues[0];
    const wordIssues = issues
      .map((i, idx) => ({ ...i, idx }))
      .filter((i) => i.scope === "word" && i.start >= s.start && i.end <= s.end)
      .sort((a, b) => a.start - b.start || rank(a.severity) - rank(b.severity));
    let inner = "";
    let p = s.start;
    for (const w of wordIssues) {
      if (w.start < p) continue; // overlap: the earlier mark wins
      inner += esc(text.slice(p, w.start));
      inner += `<mark class="sev-${w.severity}" data-issue="${w.idx}" title="${esc(w.title + ": " + w.message)}">${esc(text.slice(w.start, w.end))}</mark>`;
      p = w.end;
    }
    inner += esc(text.slice(p, s.end));
    const title = sIssues.map((i) => `${i.title}: ${i.message}`).join("\n");
    out += `<span class="sent ${worst ? "sev-" + worst.severity : ""}" data-sentence="${s.index}"${title ? ` title="${esc(title)}"` : ""}>${inner}</span>`;
    pos = s.end;
  }
  out += esc(text.slice(pos));
  return out;
}

const rank = (s) => (s === "error" ? 0 : s === "warning" ? 1 : 2);

function renderIssues(text, result, filter) {
  const list = result.issues
    .map((i, idx) => ({ ...i, idx }))
    .filter((i) => filter[i.severity]);
  if (!result.issues.length) {
    return `<p class="badge done">No issues found</p><p class="muted small">The checker cannot find every problem. Read the text again for correct meaning, consistent technical names and omitted words.</p>`;
  }
  if (!list.length) return `<p class="muted">No issues match the filter.</p>`;
  return `<ul class="issues">${list
    .map((i) => {
      const s = result.sentences[i.sentenceIndex];
      const quote = i.scope === "word" ? i.match : s ? s.text : "";
      return `<li class="issue sev-${i.severity}" tabindex="0" data-issue="${i.idx}" data-sentence="${i.sentenceIndex ?? ""}">
        <div class="issue-head"><span class="badge ${i.severity}">${i.severity}</span><strong>${esc(i.title)}</strong><span class="muted small">${esc(i.section)}</span></div>
        <p>${esc(i.message)}</p>
        ${quote ? `<div class="quote">“${esc(quote.length > 140 ? quote.slice(0, 140) + "…" : quote)}”</div>` : ""}
      </li>`;
    })
    .join("")}</ul>`;
}

function wireIssueClicks(root) {
  root.querySelectorAll(".issue").forEach((li) => {
    const go = () => {
      const idx = li.dataset.issue;
      let target = root.querySelector(`.annotated mark[data-issue="${idx}"]`);
      if (!target && li.dataset.sentence !== "") target = root.querySelector(`.annotated .sent[data-sentence="${li.dataset.sentence}"]`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.remove("flash");
        void target.offsetWidth;
        target.classList.add("flash");
      }
    };
    li.addEventListener("click", go);
    li.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), go()));
  });
  root.querySelectorAll(".annotated mark").forEach((m) => {
    m.addEventListener("click", () => {
      const li = root.querySelector(`.issue[data-issue="${m.dataset.issue}"]`);
      if (li) {
        li.scrollIntoView({ behavior: "smooth", block: "nearest" });
        li.classList.remove("flash");
        void li.offsetWidth;
        li.classList.add("flash");
      }
    });
  });
}

function countsBadges(counts) {
  return `<div class="counts">
    <span class="badge error">${counts.error} error${counts.error === 1 ? "" : "s"}</span>
    <span class="badge warning">${counts.warning} warning${counts.warning === 1 ? "" : "s"}</span>
    <span class="badge info">${counts.info} suggestion${counts.info === 1 ? "" : "s"}</span>
  </div>`;
}

// ---------- views ----------

function viewHome() {
  const st = store.getState();
  const mp = moduleProgress();
  const ep = exerciseProgress();
  const quizzes = st.progress.quizzes;
  const best = quizzes.length ? Math.max(...quizzes.map((q) => Math.round((q.score / q.total) * 100))) : null;
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];
  const next = MODULES.find((m) => !st.progress.modules[m.id]?.completed);
  const orgName = st.org.name;

  main.replaceChildren(
    h(`
    <section class="hero">
      <div>
        <h1>Write clear technical documents with STE</h1>
        <p class="lead">Learn the rules of ASD-STE100 Simplified Technical English, practice with real examples, and check your own text${orgName ? ` against the ${esc(orgName)} style` : ""}.</p>
        <div class="row">
          ${next ? `<a class="btn btn-primary" href="#/learn/${next.id}">${mp.done ? "Continue" : "Start"}: ${esc(next.title)}</a>` : `<a class="btn btn-primary" href="#/quiz">Take a quiz</a>`}
          <a class="btn" href="#/checker">Check my text</a>
        </div>
      </div>
      <div class="card">
        <h3>Your progress</h3>
        <div class="stat-row">
          <div class="stat"><strong>${mp.done}/${mp.total}</strong><span>modules complete</span></div>
          <div class="stat"><strong>${ep.done}/${ep.total}</strong><span>exercises complete</span></div>
          <div class="stat"><strong>${best == null ? "–" : best + "%"}</strong><span>best quiz score</span></div>
          <div class="stat"><strong>${st.progress.wordsChecked.toLocaleString()}</strong><span>words checked</span></div>
        </div>
        <div class="progress" style="margin-top:14px" aria-label="Overall progress"><span style="width:${Math.round(((mp.done + ep.done) / (mp.total + ep.total)) * 100)}%"></span></div>
      </div>
    </section>

    <div class="card notice" style="margin-bottom:24px">
      <strong>Tip of the day:</strong> <span class="tip">${esc(tip)}</span>
    </div>

    <div class="grid">
      <div class="card feature"><h3>Learn</h3><p>${MODULES.length} short modules that explain each STE rule with examples, and a quiz at the end.</p><a href="#/learn">Open the modules →</a></div>
      <div class="card feature"><h3>Checker</h3><p>Paste your procedure or description. Get a score and an explanation for each problem.</p><a href="#/checker">Open the checker →</a></div>
      <div class="card feature"><h3>Practice</h3><p>Rewrite real non-STE sentences. Compare your answer with a model answer.</p><a href="#/practice">Start practice →</a></div>
      <div class="card feature"><h3>Word list</h3><p>Find STE alternatives for common words and your organization's approved terms.</p><a href="#/dictionary">Search words →</a></div>
      <div class="card feature"><h3>Quick reference</h3><p>A one-page summary of the rules to print or keep open while you write.</p><a href="#/reference">Open reference →</a></div>
      <div class="card feature"><h3>Organization</h3><p>Add your technical names and preferred terms. Share the settings with your team.</p><a href="#/org">Settings →</a></div>
    </div>
  `)
  );
}

function viewLearn() {
  const p = store.getState().progress.modules;
  const mp = moduleProgress();
  main.replaceChildren(
    h(`
    <h1>Learn</h1>
    <p class="lead">Do the modules in sequence. Pass the quiz at the end of a module (${Math.round(QUIZ_PASS * 100)}% or more) to complete it.</p>
    <div class="row" style="margin-bottom:20px"><div class="progress" style="flex:1;max-width:360px"><span style="width:${(mp.done / mp.total) * 100}%"></span></div><span class="muted small">${mp.done} of ${mp.total} complete</span></div>
    <div class="module-list">
      ${MODULES.map(
        (m, i) => `
        <a class="card module-item ${p[m.id]?.completed ? "done" : ""}" href="#/learn/${m.id}">
          <span class="module-num" aria-hidden="true">${p[m.id]?.completed ? "✓" : i + 1}</span>
          <span class="meta">
            <h3>${esc(m.title)}</h3>
            <p>${esc(m.summary)}</p>
          </span>
          <span class="badge">${esc(m.section)}</span>
          <span class="badge">${m.minutes} min</span>
        </a>`
      ).join("")}
    </div>
  `)
  );
}

function renderQuiz(container, questions, onDone) {
  container.innerHTML = `
    <form class="quiz">
      ${questions
        .map(
          (q, qi) => `
        <div class="question">
          <fieldset>
            <legend>${qi + 1}. ${esc(q.q)}</legend>
            ${q.order
              .map(
                (oi) => `
              <label class="option"><input type="radio" name="q${qi}" value="${oi}" required> <span>${esc(q.options[oi])}</span></label>`
              )
              .join("")}
            <div class="explain" hidden>${esc(q.explain)}</div>
          </fieldset>
        </div>`
        )
        .join("")}
      <div class="row"><button class="primary" type="submit">Submit answers</button><span class="quiz-result"></span></div>
    </form>`;
  const form = container.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let correct = 0;
    questions.forEach((q, qi) => {
      const chosen = form.querySelector(`input[name="q${qi}"]:checked`);
      const val = chosen ? Number(chosen.value) : -1;
      if (val === q.answer) correct++;
      form.querySelectorAll(`input[name="q${qi}"]`).forEach((inp) => {
        const opt = inp.closest(".option");
        opt.classList.toggle("correct", Number(inp.value) === q.answer);
        opt.classList.toggle("wrong", inp.checked && Number(inp.value) !== q.answer);
        inp.disabled = true;
      });
      form.querySelectorAll(".explain")[qi].hidden = false;
    });
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    const ratio = correct / questions.length;
    form.querySelector(".quiz-result").innerHTML = `<strong>${correct} of ${questions.length} correct (${Math.round(ratio * 100)}%).</strong> ${
      ratio >= QUIZ_PASS ? "Well done." : "Read the explanations, then try again."
    } <button type="button" class="link retry">Try again</button>`;
    form.querySelector(".retry").addEventListener("click", () => renderQuiz(container, questions.map((q) => ({ ...q, order: shuffle(q.order) })), onDone));
    onDone(correct, questions.length);
  });
}

function prepQuestions(qs) {
  return qs.map((q) => ({ ...q, order: shuffle(q.options.map((_, i) => i)) }));
}

function viewModule(id) {
  const idx = MODULES.findIndex((m) => m.id === id);
  const m = MODULES[idx];
  if (!m) return viewNotFound();
  const prog = store.getState().progress.modules[m.id];
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];

  main.replaceChildren(
    h(`
    <div class="breadcrumb"><a href="#/learn">Learn</a> / ${esc(m.section)}</div>
    <h1>${esc(m.title)}</h1>
    <p class="lead">${esc(m.summary)}</p>
    ${prog?.completed ? `<p><span class="badge done">Complete · quiz ${Math.round(prog.quizScore * 100)}%</span></p>` : ""}
    <div class="card">
      ${m.body.map((p) => `<p>${esc(p)}</p>`).join("")}
      ${m.benefits ? `<h3>Benefits</h3><ul>${m.benefits.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    </div>
    <h2>Rules and examples</h2>
    ${m.rules
      .map(
        (r) => `
      <div class="rule">
        <h3>${esc(r.rule)}</h3>
        <p class="muted">${esc(r.explain)}</p>
        <div class="example"><div class="ex bad">${esc(r.bad)}</div><div class="ex good">${esc(r.good)}</div></div>
        <div class="row" style="margin-top:8px"><button class="link try" data-text="${esc(r.bad)}">Try the “not STE” example in the checker →</button></div>
      </div>`
      )
      .join("")}
    <h2>Quiz</h2>
    <div class="card" id="quiz"></div>
    <div class="row" style="margin-top:24px">
      ${prev ? `<a class="btn" href="#/learn/${prev.id}">← ${esc(prev.title)}</a>` : ""}
      <span class="spacer"></span>
      ${next ? `<a class="btn" href="#/learn/${next.id}">${esc(next.title)} →</a>` : `<a class="btn" href="#/quiz">Take the final quiz →</a>`}
    </div>
  `)
  );

  main.querySelectorAll(".try").forEach((b) =>
    b.addEventListener("click", () => {
      store.update((s) => (s.checkerDraft = b.dataset.text));
      location.hash = "#/checker";
    })
  );

  renderQuiz(main.querySelector("#quiz"), prepQuestions(m.quiz), (correct, total) => {
    const ratio = correct / total;
    store.update((s) => {
      const cur = s.progress.modules[m.id] || {};
      s.progress.modules[m.id] = {
        completed: cur.completed || ratio >= QUIZ_PASS,
        quizScore: Math.max(cur.quizScore || 0, ratio),
        completedAt: cur.completedAt || (ratio >= QUIZ_PASS ? new Date().toISOString() : undefined),
      };
    });
    if (ratio >= QUIZ_PASS && !prog?.completed) toast("Module complete");
  });
}

function viewChecker() {
  const st = store.getState();
  const filter = { error: true, warning: true, info: true };
  main.replaceChildren(
    h(`
    <h1>STE checker</h1>
    <p class="lead">Paste a procedure or a description. The checker finds common problems and explains the STE rule for each one.</p>
    <div class="checker-layout">
      <div class="checker-input">
        <div class="card">
          <label for="ck-text">Your text</label>
          <textarea id="ck-text" spellcheck="true" placeholder="Paste or type your text here. Use numbered lines for steps, and WARNING:, CAUTION: or NOTE: at the start of a line for safety notices."></textarea>
          <div class="row" style="margin-top:10px">
            <label class="inline" for="ck-mode">Text type</label>
            <select id="ck-mode" style="width:auto">
              <option value="auto">Automatic (detect each sentence)</option>
              <option value="procedural">Procedure (max 20 words)</option>
              <option value="descriptive">Description (max 25 words)</option>
            </select>
            <span class="spacer"></span>
            <button id="ck-sample" type="button">Load sample</button>
            <button id="ck-clear" type="button">Clear</button>
          </div>
        </div>
        <div id="ck-annotated"></div>
        <details class="card" style="margin-top:16px" id="ck-sentences-wrap">
          <summary><strong>Sentence details</strong></summary>
          <div id="ck-sentences"></div>
        </details>
      </div>
      <div>
        <div class="card">
          <div class="score-box" id="ck-score"></div>
          <div class="filters">
            <label class="inline"><input type="checkbox" data-sev="error" checked> Errors</label>
            <label class="inline"><input type="checkbox" data-sev="warning" checked> Warnings</label>
            <label class="inline"><input type="checkbox" data-sev="info" checked> Suggestions</label>
          </div>
          <div id="ck-issues"></div>
        </div>
        ${st.org.approvedTerms.length || st.org.orgTerms.length ? `<p class="muted small" style="margin-top:10px">Uses ${st.org.approvedTerms.length} approved terms and ${st.org.orgTerms.length} organization terms from <a href="#/org">Organization settings</a>.</p>` : `<p class="muted small" style="margin-top:10px">Tip: add your technical names in <a href="#/org">Organization settings</a> so that the checker does not flag them.</p>`}
      </div>
    </div>
  `)
  );

  const ta = main.querySelector("#ck-text");
  const mode = main.querySelector("#ck-mode");
  ta.value = st.checkerDraft || "";
  let timer;
  let counted = false;

  const run = () => {
    const text = ta.value;
    store.update((s) => (s.checkerDraft = text));
    const result = checkText(text, checkerOptions({ mode: mode.value }));
    main.querySelector("#ck-score").innerHTML = text.trim()
      ? `${scoreRing(result.score)}<div><div><strong>${result.stats.words}</strong> words · <strong>${result.stats.sentences}</strong> sentences · avg ${result.stats.averageSentenceLength} words</div><div class="muted small">${result.stats.procedural} procedural, ${result.stats.descriptive} descriptive</div>${countsBadges(result.stats.counts)}</div>`
      : `${scoreRing(null)}<div class="muted">Type or paste text to see the score.</div>`;
    main.querySelector("#ck-annotated").innerHTML = text.trim() ? `<div class="annotated" aria-label="Annotated text">${renderAnnotated(text, result)}</div>` : "";
    main.querySelector("#ck-issues").innerHTML = text.trim() ? renderIssues(text, result, filter) : "";
    main.querySelector("#ck-sentences").innerHTML = result.sentences.length
      ? `<table class="sentence-table"><thead><tr><th>#</th><th>Sentence</th><th>Type</th><th class="num">Words</th></tr></thead><tbody>${result.sentences
          .map((s) => {
            const max = s.mode === "procedural" ? 20 : 25;
            return `<tr><td>${s.index + 1}</td><td>${esc(s.text)}</td><td>${s.mode}${s.blockType !== "text" ? ` (${s.blockType})` : ""}</td><td class="num ${s.wordCount > max ? "over" : ""}">${s.wordCount}/${max}</td></tr>`;
          })
          .join("")}</tbody></table>`
      : `<p class="muted">No sentences.</p>`;
    wireIssueClicks(main);
    if (text.trim() && !counted) {
      counted = true;
      store.update((s) => s.progress.checks++);
    }
    return result;
  };

  const commitWords = () => {
    const r = checkText(ta.value, checkerOptions({ mode: mode.value }));
    if (r.stats.words) store.update((s) => (s.progress.wordsChecked += r.stats.words));
  };

  ta.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(run, 300);
  });
  ta.addEventListener("change", commitWords);
  mode.addEventListener("change", run);
  main.querySelector("#ck-sample").addEventListener("click", () => {
    ta.value = SAMPLE_TEXT;
    run();
  });
  main.querySelector("#ck-clear").addEventListener("click", () => {
    ta.value = "";
    run();
    ta.focus();
  });
  main.querySelectorAll(".filters input").forEach((cb) =>
    cb.addEventListener("change", () => {
      filter[cb.dataset.sev] = cb.checked;
      run();
    })
  );
  run();
}

function viewPractice() {
  const p = store.getState().progress.exercises;
  const ep = exerciseProgress();
  const levels = ["Beginner", "Intermediate", "Advanced"];
  main.replaceChildren(
    h(`
    <h1>Practice</h1>
    <p class="lead">Rewrite each text in STE. The checker gives feedback on your answer. Then compare your answer with the model answer.</p>
    <div class="row" style="margin-bottom:20px"><div class="progress" style="flex:1;max-width:360px"><span style="width:${(ep.done / ep.total) * 100}%"></span></div><span class="muted small">${ep.done} of ${ep.total} complete</span></div>
    ${levels
      .map(
        (lvl) => `
      <h2>${lvl}</h2>
      <div class="grid">
        ${EXERCISES.filter((e) => e.level === lvl)
          .map((e) => {
            const mod = MODULES.find((m) => m.id === e.module);
            return `<a class="card module-item ${p[e.id]?.done ? "done" : ""}" href="#/practice/${e.id}" style="align-items:flex-start">
              <span class="meta"><p style="color:var(--text);margin-bottom:8px">${esc(e.original.length > 110 ? e.original.slice(0, 110) + "…" : e.original)}</p>
              <span class="badge">${esc(mod?.title || "")}</span> ${p[e.id]?.done ? `<span class="badge done">Best ${p[e.id].bestScore}</span>` : ""}</span>
            </a>`;
          })
          .join("")}
      </div>`
      )
      .join("")}
  `)
  );
}

function viewExercise(id) {
  const idx = EXERCISES.findIndex((e) => e.id === id);
  const ex = EXERCISES[idx];
  if (!ex) return viewNotFound();
  const next = EXERCISES[idx + 1];
  const mod = MODULES.find((m) => m.id === ex.module);
  const orig = checkText(ex.original, checkerOptions({ mode: ex.mode }));

  main.replaceChildren(
    h(`
    <div class="breadcrumb"><a href="#/practice">Practice</a> / ${esc(ex.level)}</div>
    <h1>Rewrite in STE</h1>
    <div class="grid-2">
      <div>
        <div class="card">
          <h3>Original text</h3>
          <div class="ex bad">${esc(ex.original)}</div>
          <p class="muted small" style="margin-top:8px">The checker finds ${orig.issues.length} issue${orig.issues.length === 1 ? "" : "s"} in the original. Related module: <a href="#/learn/${ex.module}">${esc(mod?.title || "")}</a></p>
          <details><summary>Show hints</summary><ul>${ex.hints.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></details>
        </div>
        <div class="card">
          <label for="ex-answer">Your STE version</label>
          <textarea id="ex-answer" placeholder="Write your version here. Use numbered lines for steps."></textarea>
          <div class="row" style="margin-top:10px">
            <button class="primary" id="ex-check" type="button">Check my answer</button>
            <button id="ex-model" type="button">Show model answer</button>
          </div>
        </div>
        <div class="card" id="ex-model-box" hidden>
          <h3>Model answer</h3>
          <div class="ex good">${esc(ex.model)}</div>
          <p class="muted small" style="margin-top:8px">Other correct answers are possible. Make sure that your answer has the same technical meaning.</p>
        </div>
      </div>
      <div>
        <div class="card" id="ex-feedback"><p class="muted">Write your answer, then select “Check my answer”.</p></div>
        <div class="row" style="margin-top:16px">
          <span class="spacer"></span>
          ${next ? `<a class="btn" href="#/practice/${next.id}">Next exercise →</a>` : `<a class="btn" href="#/practice">All exercises</a>`}
        </div>
      </div>
    </div>
  `)
  );

  const ta = main.querySelector("#ex-answer");
  main.querySelector("#ex-model").addEventListener("click", () => {
    main.querySelector("#ex-model-box").hidden = false;
  });
  main.querySelector("#ex-check").addEventListener("click", () => {
    const text = ta.value;
    const fb = main.querySelector("#ex-feedback");
    if (!text.trim()) {
      fb.innerHTML = `<p class="muted">Write your answer first.</p>`;
      return;
    }
    if (text.trim().toLowerCase() === ex.original.trim().toLowerCase()) {
      fb.innerHTML = `<p>Your answer is the same as the original. Change the text to use STE.</p>`;
      return;
    }
    const r = checkText(text, checkerOptions({ mode: ex.mode }));
    const passed = r.stats.counts.error === 0 && r.stats.counts.warning === 0;
    fb.innerHTML = `
      <div class="score-box">${scoreRing(r.score)}<div>${countsBadges(r.stats.counts)}<p style="margin-top:8px">${
        passed ? "<strong>Good.</strong> The checker finds no errors or warnings. Compare your answer with the model answer." : "Correct the errors and warnings, then check again."
      }</p></div></div>
      <div class="annotated">${renderAnnotated(text, r)}</div>
      <div style="margin-top:12px">${renderIssues(text, r, { error: true, warning: true, info: true })}</div>`;
    wireIssueClicks(fb);
    store.update((s) => {
      const cur = s.progress.exercises[ex.id] || { attempts: 0, bestScore: 0, done: false };
      s.progress.exercises[ex.id] = {
        attempts: cur.attempts + 1,
        bestScore: Math.max(cur.bestScore, r.score ?? 0),
        done: cur.done || passed,
      };
      s.progress.wordsChecked += r.stats.words;
    });
    if (passed) main.querySelector("#ex-model-box").hidden = false;
  });
}

function viewQuiz() {
  const pool = MODULES.flatMap((m) => m.quiz.map((q) => ({ ...q, module: m.title })));
  const count = Math.min(10, pool.length);
  const questions = prepQuestions(shuffle(pool).slice(0, count));
  const history = store.getState().progress.quizzes.slice(-5).reverse();
  main.replaceChildren(
    h(`
    <h1>Mixed quiz</h1>
    <p class="lead">${count} random questions from all modules. Every attempt gives a new set.</p>
    ${history.length ? `<p class="muted small">Recent scores: ${history.map((q) => `${Math.round((q.score / q.total) * 100)}%`).join(", ")}</p>` : ""}
    <div class="card" id="quiz"></div>
    <div class="row" style="margin-top:16px"><button id="new-quiz" type="button">New set of questions</button></div>
  `)
  );
  renderQuiz(main.querySelector("#quiz"), questions, (score, total) => {
    store.update((s) => s.progress.quizzes.push({ date: new Date().toISOString(), score, total }));
  });
  main.querySelector("#new-quiz").addEventListener("click", viewQuiz);
}

function viewDictionary() {
  const org = store.getState().org;
  let tab = "all";
  main.replaceChildren(
    h(`
    <h1>Word list</h1>
    <p class="lead">Find a better word. This list has common non-STE words with alternatives, your organization's terms, and your approved technical names.</p>
    <div class="notice warn small">This starter list is a training subset. It is not the official ASD-STE100 dictionary. Always confirm words against the current issue of the specification.</div>
    <div class="field"><label for="dict-q">Search</label><input id="dict-q" type="search" placeholder="Type a word, for example: ensure"></div>
    <div class="tabs" role="tablist">
      <button role="tab" data-tab="all" aria-selected="true">All</button>
      <button role="tab" data-tab="dictionary" aria-selected="false">Starter list (${DICTIONARY.length})</button>
      <button role="tab" data-tab="org" aria-selected="false">Organization terms (${org.orgTerms.length})</button>
      <button role="tab" data-tab="approved" aria-selected="false">Approved technical names (${org.approvedTerms.length})</button>
    </div>
    <div class="table-wrap" id="dict-table"></div>
  `)
  );
  const q = main.querySelector("#dict-q");
  const render = () => {
    const term = q.value.trim().toLowerCase();
    const rows = [];
    if (tab === "all" || tab === "dictionary") DICTIONARY.forEach((d) => rows.push({ ...d, source: "Starter list", kind: "avoid" }));
    if (tab === "all" || tab === "org") org.orgTerms.forEach((d) => rows.push({ ...d, source: org.name || "Organization", kind: "avoid" }));
    if (tab === "all" || tab === "approved") org.approvedTerms.forEach((w) => rows.push({ word: w, alternatives: [], note: "Approved technical name", source: org.name || "Organization", kind: "ok" }));
    const filtered = rows
      .filter((r) => !term || r.word.toLowerCase().includes(term) || (r.alternatives || []).some((a) => a.toLowerCase().includes(term)) || (r.note || "").toLowerCase().includes(term))
      .sort((a, b) => a.word.localeCompare(b.word));
    main.querySelector("#dict-table").innerHTML = filtered.length
      ? `<table class="data"><thead><tr><th>Word</th><th>Use instead</th><th>Note</th><th>Source</th></tr></thead><tbody>${filtered
          .map(
            (r) => `<tr><td>${r.kind === "avoid" ? `<span class="strike">${esc(r.word)}</span>` : `<strong>${esc(r.word)}</strong> <span class="badge done">approved</span>`}</td><td><strong>${esc((r.alternatives || []).join(", ")) || "–"}</strong></td><td class="muted">${esc(r.note)}</td><td class="small muted">${esc(r.source)}</td></tr>`
          )
          .join("")}</tbody></table>`
      : `<p class="muted">No words found.${tab !== "dictionary" && !org.orgTerms.length && !org.approvedTerms.length ? ` Add terms in <a href="#/org">Organization settings</a>.` : ""}</p>`;
  };
  q.addEventListener("input", render);
  main.querySelectorAll(".tabs button").forEach((b) =>
    b.addEventListener("click", () => {
      tab = b.dataset.tab;
      main.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      render();
    })
  );
  render();
  q.focus();
}

function viewReference() {
  main.replaceChildren(
    h(`
    <div class="row"><h1 style="margin:0">Quick reference</h1><span class="spacer"></span><button class="no-print" id="print" type="button">Print</button></div>
    <p class="lead">The most important STE rules and technical writing practices on one page.</p>
    ${(() => {
      const org = store.getState().org;
      if (!org.styleNotes && !org.orgTerms.length) return "";
      return `<div class="card" style="margin-bottom:16px"><h3>${esc(org.name || "Organization")} house style</h3>
        ${org.styleNotes ? `<p style="white-space:pre-wrap">${esc(org.styleNotes)}</p>` : ""}
        ${org.orgTerms.length ? `<p class="small"><strong>Use:</strong> ${org.orgTerms.slice(0, 30).map((t) => `${esc((t.alternatives || []).join("/") || "–")} <span class="muted">(not <span class="strike">${esc(t.word)}</span>)</span>`).join(" · ")}</p>` : ""}
      </div>`;
    })()}
    <div class="ref-grid">
      ${REFERENCE.map(
        (sec) => `<div class="card"><h3>${esc(sec.title)}</h3><ul>${sec.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`
      ).join("")}
    </div>
  `)
  );
  main.querySelector("#print").addEventListener("click", () => window.print());
}

function parseOrgTerms(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [word, alts = "", note = ""] = l.split("|").map((x) => x.trim());
      return { word, alternatives: alts.split(",").map((a) => a.trim()).filter(Boolean), note };
    })
    .filter((t) => t.word);
}

function formatOrgTerms(terms) {
  return terms.map((t) => [t.word, (t.alternatives || []).join(", "), t.note].filter((x, i) => i < 2 || x).join(" | ")).join("\n");
}

function viewOrg() {
  const st = store.getState();
  const org = st.org;
  const locked = st.orgLocked;
  main.replaceChildren(
    h(`
    <h1>Organization settings</h1>
    <p class="lead">Adapt the checker to your organization. Add your technical names and the terms that your writers must use. Export the settings and share the file with your team.</p>
    ${locked ? `<div class="notice">Your administrator manages these settings (org-config.json). You cannot change them here.</div>` : ""}
    ${org.source === "file" && !locked ? `<div class="notice small">These settings come from your organization's org-config.json. If you save changes here, your local settings are used instead.</div>` : ""}
    <form id="org-form" class="card">
      <fieldset ${locked ? "disabled" : ""} style="border:none;padding:0;margin:0">
      <div class="field">
        <label for="org-name">Organization or team name</label>
        <input id="org-name" type="text" value="${esc(org.name)}" placeholder="For example: Acme Aerospace Technical Publications">
      </div>
      <div class="field">
        <label for="org-approved">Approved technical names and technical verbs</label>
        <textarea id="org-approved" class="mono" placeholder="landing gear&#10;retaining ring&#10;safety-wire&#10;torque">${esc(org.approvedTerms.join("\n"))}</textarea>
        <div class="hint">One term on each line. The checker does not flag these terms (for example -ing words or noun clusters in part names).</div>
      </div>
      <div class="field">
        <label for="org-terms">Terms to avoid, with the approved term</label>
        <textarea id="org-terms" class="mono" placeholder="hose | fuel line | Use the name from the parts list.&#10;login | log in | Verb: two words.&#10;master | primary">${esc(formatOrgTerms(org.orgTerms))}</textarea>
        <div class="hint">One term on each line: <code>term to avoid | approved term(s), separated by commas | optional note</code></div>
      </div>
      <div class="field">
        <label>Checker rules</label>
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:6px">
          ${Object.entries(RULES)
            .map(
              ([id, r]) => `<label class="inline"><input type="checkbox" name="rule" value="${id}" ${org.disabledRules.includes(id) ? "" : "checked"}> ${esc(r.title)}</label>`
            )
            .join("")}
        </div>
        <div class="hint">Clear a rule to turn it off for everyone who uses these settings.</div>
      </div>
      <div class="field">
        <label for="org-notes">House style notes</label>
        <textarea id="org-notes" style="min-height:100px" placeholder="For example: Use the parts list names. Write UI labels in bold. Use SI units first.">${esc(org.styleNotes)}</textarea>
        <div class="hint">Shown on the Quick reference page.</div>
      </div>
      <div class="row"><button class="primary" type="submit">Save settings</button></div>
      </fieldset>
    </form>

    <div class="card">
      <h3>Share settings with your team</h3>
      <p class="muted">Export the settings to a JSON file. Your team can import the file. An administrator can also save it as <code>org-config.json</code> next to <code>index.html</code> on the server, so that every user gets the settings automatically. Add <code>"locked": true</code> to the file to prevent changes.</p>
      <div class="row">
        <button id="org-export" type="button">Export settings</button>
        <label class="btn" for="org-import" ${locked ? 'aria-disabled="true"' : ""}>Import settings</label>
        <input id="org-import" type="file" accept="application/json,.json" hidden ${locked ? "disabled" : ""}>
      </div>
    </div>

    <div class="card">
      <h3>Your progress</h3>
      <p class="muted">Your progress is saved in this browser only. Export it to keep a record or to send it to your trainer.</p>
      <div class="row">
        <button id="prog-export" type="button">Export progress</button>
        <button id="prog-reset" class="danger" type="button">Reset progress</button>
      </div>
    </div>
  `)
  );

  main.querySelector("#org-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (locked) return;
    const disabled = [...main.querySelectorAll('input[name="rule"]')].filter((c) => !c.checked).map((c) => c.value);
    store.update((s) => {
      s.org = {
        ...store.normalizeOrg({
          name: main.querySelector("#org-name").value.trim(),
          approvedTerms: main.querySelector("#org-approved").value.split("\n"),
          orgTerms: parseOrgTerms(main.querySelector("#org-terms").value),
          disabledRules: disabled,
          styleNotes: main.querySelector("#org-notes").value,
        }),
        source: "local",
      };
    });
    updateHeader();
    toast("Settings saved");
  });

  main.querySelector("#org-export").addEventListener("click", () => {
    const name = (store.getState().org.name || "organization").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    download(`ste-settings-${name}.json`, store.exportOrg());
  });

  main.querySelector("#org-import").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const cfg = JSON.parse(await file.text());
      store.update((s) => (s.org = { ...store.normalizeOrg(cfg), source: "local" }));
      updateHeader();
      toast("Settings imported");
      viewOrg();
    } catch {
      toast("The file is not a valid settings file");
    }
  });

  main.querySelector("#prog-export").addEventListener("click", () => {
    const st2 = store.getState();
    const report = {
      exportedAt: new Date().toISOString(),
      organization: st2.org.name,
      modules: MODULES.map((m) => ({ id: m.id, title: m.title, ...(st2.progress.modules[m.id] || { completed: false }) })),
      exercises: EXERCISES.map((e) => ({ id: e.id, level: e.level, ...(st2.progress.exercises[e.id] || { done: false }) })),
      quizzes: st2.progress.quizzes,
      wordsChecked: st2.progress.wordsChecked,
    };
    download("ste-progress.json", JSON.stringify(report, null, 2));
  });

  main.querySelector("#prog-reset").addEventListener("click", () => {
    if (confirm("Reset all your progress? You cannot undo this.")) {
      store.resetProgress();
      toast("Progress reset");
    }
  });
}

function viewNotFound() {
  main.replaceChildren(h(`<h1>Page not found</h1><p><a href="#/">Go to the home page</a></p>`));
}

// ---------- router ----------

function updateHeader() {
  const name = store.getState().org.name;
  document.getElementById("org-name-label").textContent = name || "ASD-STE100 training";
}

function route() {
  const [, section = "", id] = (location.hash || "#/").replace(/^#/, "").split("/");
  document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === (section || "home")));
  document.getElementById("nav").classList.remove("open");
  document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");
  const views = {
    "": viewHome,
    learn: () => (id ? viewModule(id) : viewLearn()),
    checker: viewChecker,
    practice: () => (id ? viewExercise(id) : viewPractice()),
    quiz: viewQuiz,
    dictionary: viewDictionary,
    reference: viewReference,
    org: viewOrg,
  };
  (views[section] || viewNotFound)();
  const titles = { "": "Home", learn: "Learn", checker: "Checker", practice: "Practice", quiz: "Quiz", dictionary: "Word list", reference: "Quick reference", org: "Organization" };
  document.title = `${titles[section] || "Not found"} · STE Writing Coach`;
  window.scrollTo(0, 0);
  if (section !== "dictionary") main.focus({ preventScroll: true });
}

document.getElementById("nav-toggle").addEventListener("click", (e) => {
  const nav = document.getElementById("nav");
  const open = nav.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", route);
updateHeader();
route();
store.loadDeployedOrgConfig().then((loaded) => {
  if (loaded) {
    updateHeader();
    route();
  }
});
