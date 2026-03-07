(function () {
  const STORAGE_KEY = "bankflow_sim_state_v2";
  const LOCAL_EVENT = "bankflow-sim-updated";

  const TYPES = {
    NORMAL: "NORMAL",
    PRIORITARIO: "PRIORITARIO"
  };

  const PRIORITY_CATEGORIES = ["60+", "80+", "CRIANCA_COLO", "GESTANTE", "LACTANTE", "PORTADOR_DEFICIENCIA", "PREFERENCIAL"];
  const NEWS = [
    "Atendimento digital cresce 12% no trimestre.",
    "Fila prioritaria recebeu reforco de guiche em horario de pico.",
    "Tempo medio de espera caiu apos redistribuicao de equipe.",
    "Painel TV em operacao com feed de noticias via proxy interno."
  ];

  function defaultState() {
    return {
      seq: { N: 41, P: 14 },
      queue: [],
      serving: null,
      history: [],
      events: [],
      completed: 0,
      skipped: 0,
      generated: 0,
      averageWaitSec: 0,
      attendants: {},
      hourlyFlow: Array.from({ length: 12 }, () => 0),
      lastServedType: null,
      priorityStreak: 0,
      mediaIndex: 0,
      newsIndex: 0,
      settings: {
        autoIssueMs: 5000,
        autoServiceMs: 7000
      },
      lastUpdate: Date.now()
    };
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const state = defaultState();
      saveState(state);
      return state;
    }

    try {
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return {
        ...base,
        ...parsed,
        settings: { ...base.settings, ...(parsed.settings || {}) }
      };
    } catch (error) {
      const state = defaultState();
      saveState(state);
      return state;
    }
  }

  function saveState(state) {
    state.lastUpdate = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(LOCAL_EVENT));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function pad(num) {
    return String(num).padStart(3, "0");
  }

  function ticketCode(type, seq) {
    return (type === TYPES.PRIORITARIO ? "P" : "N") + "-" + pad(seq);
  }

  function getHourBucketIndex() {
    const hour = new Date().getHours();
    if (hour < 8) return 0;
    if (hour > 19) return 11;
    return hour - 8;
  }

  function addEvent(state, channel, message) {
    state.events.unshift({
      id: Date.now() + Math.floor(Math.random() * 1000),
      channel,
      message,
      createdAt: nowIso()
    });
    state.events = state.events.slice(0, 30);
  }

  function priorityCategoryLabel(category) {
    return PRIORITY_CATEGORIES.includes(category) ? category : "PREFERENCIAL";
  }

  function issueTicket(type, options) {
    const state = loadState();
    const isPriority = type === TYPES.PRIORITARIO;
    const key = isPriority ? "P" : "N";
    const source = (options && options.source) || "Totem";

    state.seq[key] += 1;
    const code = ticketCode(type, state.seq[key]);
    const ticket = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      code,
      type,
      category: isPriority ? priorityCategoryLabel(options && options.category) : "NORMAL",
      createdAt: nowIso(),
      status: "QUEUE"
    };

    state.queue.push(ticket);
    state.generated += 1;
    state.hourlyFlow[getHourBucketIndex()] += 1;

    addEvent(state, "QUEUE", `${source}: senha ${ticket.code} emitida (${ticket.category}).`);
    addEvent(state, "HUB", `SignalR: TicketIssued -> ${ticket.code}`);

    saveState(state);
    return ticket;
  }

  function temporalScore(state, ticket) {
    const now = Date.now();
    const createdAt = new Date(ticket.createdAt).getTime();
    const waitSec = Math.max(1, Math.floor((now - createdAt) / 1000));

    let score = waitSec;
    if (ticket.type === TYPES.PRIORITARIO) {
      score += 45;
      if (state.priorityStreak >= 2) {
        score -= 18;
      }
    }
    if (ticket.type === TYPES.NORMAL && waitSec > 120) {
      score += 25;
    }
    return score;
  }

  function nextQueueIndex(state) {
    let bestIdx = 0;
    let bestScore = -1;

    state.queue.forEach((ticket, idx) => {
      const score = temporalScore(state, ticket);
      if (score > bestScore) {
        bestIdx = idx;
        bestScore = score;
      }
    });

    return bestIdx;
  }

  function callNext(payload) {
    const state = loadState();
    if (state.serving || state.queue.length === 0) {
      return null;
    }

    const idx = nextQueueIndex(state);
    const ticket = state.queue.splice(idx, 1)[0];
    ticket.status = "SERVING";
    ticket.calledAt = nowIso();
    ticket.guiche = (payload && payload.guiche) || "Guiche 01";
    ticket.attendant = (payload && payload.attendant) || "Atendente";

    state.serving = ticket;
    state.history.unshift({ ...ticket });
    state.history = state.history.slice(0, 12);

    state.priorityStreak = ticket.type === TYPES.PRIORITARIO ? state.priorityStreak + 1 : 0;
    state.lastServedType = ticket.type;

    addEvent(state, "CALL", `${ticket.attendant} chamou ${ticket.code} no ${ticket.guiche}.`);
    addEvent(state, "HUB", `SignalR: TicketCalled -> ${ticket.code}`);

    saveState(state);
    return ticket;
  }

  function finishCurrent() {
    const state = loadState();
    if (!state.serving) return null;

    const ticket = { ...state.serving };
    ticket.status = "DONE";
    ticket.finishedAt = nowIso();

    const created = new Date(ticket.createdAt).getTime();
    const finished = new Date(ticket.finishedAt).getTime();
    const waitSec = Math.max(1, Math.floor((finished - created) / 1000));

    state.averageWaitSec = state.completed === 0
      ? waitSec
      : Math.round((state.averageWaitSec * state.completed + waitSec) / (state.completed + 1));

    state.completed += 1;

    if (!state.attendants[ticket.attendant]) {
      state.attendants[ticket.attendant] = 0;
    }
    state.attendants[ticket.attendant] += 1;

    addEvent(state, "DONE", `Atendimento finalizado: ${ticket.code} (${ticket.attendant}).`);
    addEvent(state, "HUB", `SignalR: TicketFinished -> ${ticket.code}`);

    state.serving = null;
    saveState(state);
    return ticket;
  }

  function skipCurrent() {
    const state = loadState();
    if (!state.serving) return null;

    const ticket = { ...state.serving };
    ticket.status = "SKIPPED";
    ticket.skippedAt = nowIso();

    state.skipped += 1;
    addEvent(state, "SKIP", `Senha ${ticket.code} pulada e removida do atendimento.`);
    addEvent(state, "HUB", `SignalR: TicketSkipped -> ${ticket.code}`);

    state.serving = null;
    saveState(state);
    return ticket;
  }

  function nextNews() {
    const state = loadState();
    state.newsIndex = (state.newsIndex + 1) % NEWS.length;
    saveState(state);
    return NEWS[state.newsIndex];
  }

  function currentNews() {
    const state = loadState();
    return NEWS[state.newsIndex % NEWS.length];
  }

  function cycleMedia() {
    const state = loadState();
    state.mediaIndex = (state.mediaIndex + 1) % 4;
    saveState(state);
    return state.mediaIndex;
  }

  function autoIssueStep() {
    const isPriority = Math.random() > 0.62;
    if (isPriority) {
      const category = PRIORITY_CATEGORIES[Math.floor(Math.random() * PRIORITY_CATEGORIES.length)];
      return issueTicket(TYPES.PRIORITARIO, { source: "AutoFluxo", category });
    }
    return issueTicket(TYPES.NORMAL, { source: "AutoFluxo" });
  }

  function autoServiceStep() {
    const state = loadState();
    if (!state.serving) {
      return callNext({ attendant: "Operador Auto", guiche: "Guiche 02" });
    }
    if (Math.random() > 0.2) {
      return finishCurrent();
    }
    return skipCurrent();
  }

  function resetAll() {
    const state = defaultState();
    addEvent(state, "SYSTEM", "Simulacao reiniciada.");
    saveState(state);
    return state;
  }

  function subscribe(callback) {
    const handler = () => callback(loadState());
    window.addEventListener("storage", handler);
    window.addEventListener(LOCAL_EVENT, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(LOCAL_EVENT, handler);
    };
  }

  function seedDemoData() {
    const state = loadState();
    if (state.generated > 0) return state;

    issueTicket(TYPES.NORMAL, { source: "Seed" });
    issueTicket(TYPES.NORMAL, { source: "Seed" });
    issueTicket(TYPES.PRIORITARIO, { source: "Seed", category: "IDOSO" });
    const updated = loadState();
    addEvent(updated, "SYSTEM", "Seed inicial aplicado para demonstracao.");
    saveState(updated);
    return updated;
  }

  window.BankFlowSim = {
    TYPES,
    PRIORITY_CATEGORIES,
    loadState,
    issueTicket,
    callNext,
    finishCurrent,
    skipCurrent,
    nextNews,
    currentNews,
    cycleMedia,
    autoIssueStep,
    autoServiceStep,
    resetAll,
    subscribe,
    seedDemoData
  };
})();
