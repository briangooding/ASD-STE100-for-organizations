// Local state: learner progress and organization settings.
// Everything is stored in this browser only (localStorage). An
// administrator can also deploy an org-config.json file next to index.html
// to give every employee the same organization settings.

const KEY = "steCoach.v1";

export const DEFAULT_ORG = {
  name: "",
  approvedTerms: [], // ["landing gear", "retaining ring", ...]
  orgTerms: [], // [{ word, alternatives: [], note }]
  disabledRules: [],
  styleNotes: "",
  source: "default", // "default" | "file" | "local"
};

const DEFAULT_STATE = {
  progress: {
    modules: {}, // id -> { completed: bool, quizScore: 0..1, completedAt }
    exercises: {}, // id -> { done: bool, bestScore, attempts }
    quizzes: [], // [{ date, score, total }]
    checks: 0,
    wordsChecked: 0,
  },
  org: { ...DEFAULT_ORG },
  orgLocked: false, // true when org-config.json says "locked": true
  checkerDraft: "",
};

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      progress: { ...structuredClone(DEFAULT_STATE.progress), ...(parsed.progress || {}) },
      org: { ...DEFAULT_ORG, ...(parsed.org || {}) },
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode, blocked). The app still works for this session.
  }
  for (const fn of listeners) fn(state);
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function update(mutator) {
  mutator(state);
  save();
}

export function resetProgress() {
  state.progress = structuredClone(DEFAULT_STATE.progress);
  save();
}

export function normalizeOrg(cfg) {
  const out = { ...DEFAULT_ORG };
  if (!cfg || typeof cfg !== "object") return out;
  if (typeof cfg.name === "string") out.name = cfg.name.slice(0, 120);
  if (typeof cfg.styleNotes === "string") out.styleNotes = cfg.styleNotes.slice(0, 5000);
  if (Array.isArray(cfg.approvedTerms)) {
    out.approvedTerms = cfg.approvedTerms
      .map((t) => (typeof t === "string" ? t : t && t.word))
      .filter((t) => typeof t === "string" && t.trim())
      .map((t) => t.trim());
  }
  if (Array.isArray(cfg.orgTerms)) {
    out.orgTerms = cfg.orgTerms
      .filter((t) => t && typeof t.word === "string" && t.word.trim())
      .map((t) => ({
        word: t.word.trim(),
        alternatives: Array.isArray(t.alternatives) ? t.alternatives.map(String).filter(Boolean) : [],
        note: typeof t.note === "string" ? t.note : "",
      }));
  }
  if (Array.isArray(cfg.disabledRules)) out.disabledRules = cfg.disabledRules.map(String);
  return out;
}

export function exportOrg() {
  const { source, ...rest } = state.org;
  return JSON.stringify({ format: "ste-coach-org", version: 1, ...rest }, null, 2);
}

// Load a deployment-wide org-config.json if one exists. A local
// configuration that the user saved takes priority, unless the file says
// "locked": true.
export async function loadDeployedOrgConfig() {
  try {
    const res = await fetch("org-config.json", { cache: "no-cache" });
    if (!res.ok) return false;
    const cfg = await res.json();
    const locked = Boolean(cfg.locked);
    if (locked || state.org.source !== "local") {
      state.org = { ...normalizeOrg(cfg), source: "file" };
      state.orgLocked = locked;
      save();
    }
    return true;
  } catch {
    return false;
  }
}
