const atlas = window.MATH_ATLAS_DATA;

const refs = {
  heroStats: document.querySelector("#hero-stats"),
  surpriseButton: document.querySelector("#surprise-button"),
  mapCount: document.querySelector("#map-count"),
  conceptMap: document.querySelector("#concept-map"),
  searchInput: document.querySelector("#search-input"),
  levelSelect: document.querySelector("#level-select"),
  routeSelect: document.querySelector("#route-select"),
  resetButton: document.querySelector("#reset-button"),
  strandFilters: document.querySelector("#strand-filters"),
  routeList: document.querySelector("#route-list"),
  resultsCaption: document.querySelector("#results-caption"),
  conceptGrid: document.querySelector("#concept-grid"),
  detailKicker: document.querySelector("#detail-kicker"),
  detailTitle: document.querySelector("#detail-title"),
  detailContent: document.querySelector("#detail-content"),
  shuffleButton: document.querySelector("#shuffle-button"),
  practiceConcept: document.querySelector("#practice-concept"),
  practiceQuestion: document.querySelector("#practice-question"),
  practiceHint: document.querySelector("#practice-hint"),
  practiceAnswer: document.querySelector("#practice-answer"),
  newPracticeButton: document.querySelector("#new-practice-button"),
  hintButton: document.querySelector("#hint-button"),
  answerButton: document.querySelector("#answer-button"),
};

const strandsById = new Map(atlas.strands.map((strand) => [strand.id, strand]));
const routesById = new Map(atlas.routes.map((route) => [route.id, route]));
const conceptsById = new Map(atlas.concepts.map((concept) => [concept.id, concept]));

const concepts = atlas.concepts.map((concept) => ({
  ...concept,
  searchText: [
    concept.title,
    concept.summary,
    concept.bigIdea,
    concept.region,
    concept.strand,
    concept.ages,
    ...concept.skills,
    ...concept.vocabulary,
  ]
    .join(" ")
    .toLowerCase(),
}));

const MAP_REGIONS = [
  {
    id: "operations-island",
    label: "Operations Island",
    strand: "operations",
    path:
      "M20 23 C25 14 38 12 47 17 C55 22 55 35 47 42 C39 49 25 49 17 42 C9 35 12 28 20 23 Z",
  },
  {
    id: "number-cove",
    label: "Number Cove",
    strand: "number-sense",
    path:
      "M4 22 C8 12 19 8 28 13 C36 18 36 30 27 37 C18 44 5 41 2 31 C1 27 2 24 4 22 Z",
  },
  {
    id: "fraction-fjord",
    label: "Fraction Fjord",
    strand: "fractions-ratios",
    path:
      "M51 10 C63 4 80 7 88 17 C96 27 94 43 84 51 C72 60 56 56 49 45 C42 34 42 17 51 10 Z",
  },
  {
    id: "measurement-bay",
    label: "Measurement Bay",
    strand: "measurement",
    path:
      "M4 35 C13 27 28 31 34 42 C39 53 31 68 18 69 C6 71 -1 61 1 49 C1 43 2 38 4 35 Z",
  },
  {
    id: "algebra-keys",
    label: "Algebra Keys",
    strand: "algebra",
    path:
      "M31 67 C41 57 59 58 68 68 C76 78 72 94 58 99 C45 104 30 98 25 86 C23 78 25 72 31 67 Z",
  },
  {
    id: "geometry-shores",
    label: "Geometry Shores",
    strand: "geometry",
    path:
      "M7 77 C18 69 34 71 43 81 C50 90 42 101 28 102 C14 104 3 98 1 89 C0 84 2 80 7 77 Z",
  },
  {
    id: "data-reef",
    label: "Data Reef",
    strand: "data-chance",
    path:
      "M78 11 C88 7 99 15 101 27 C103 39 96 51 85 55 C75 59 67 51 69 39 C70 27 70 16 78 11 Z",
  },
  {
    id: "story-summit",
    label: "Story Summit",
    strand: "problem-solving",
    path:
      "M41 38 C51 31 66 35 70 47 C74 59 64 70 51 70 C39 71 30 62 32 51 C33 45 36 41 41 38 Z",
  },
];

const MAP_ROUTES = [
  {
    id: "arithmetic-route",
    label: "Arithmetic route",
    path: "M14 18 C21 23 26 27 27 28 C30 22 37 20 40 20 C34 29 28 37 25 45 C29 50 34 52 38 52 C42 49 46 46 49 45",
  },
  {
    id: "fraction-route",
    label: "Fraction route",
    path: "M54 25 C59 21 63 18 66 18 C69 24 73 28 77 30 C80 36 82 43 82 49 C79 54 76 59 73 62",
  },
  {
    id: "algebra-route",
    label: "Algebra route",
    path: "M33 76 C38 77 43 79 46 80 C51 78 56 78 60 79 C65 76 69 76 72 77 C78 75 84 74 88 74",
  },
  {
    id: "geometry-route",
    label: "Geometry route",
    path: "M20 88 C25 91 29 91 32 91 C39 92 44 92 49 92 C55 91 59 91 63 91 C69 89 74 88 78 88",
  },
  {
    id: "everyday-route",
    label: "Everyday route",
    path: "M8 36 C12 47 15 56 18 60 C23 62 28 64 31 64 C40 63 50 62 57 61 C51 52 46 44 42 36",
  },
  {
    id: "data-route",
    label: "Data route",
    path: "M88 18 C91 24 92 31 92 36 C92 43 91 50 90 56 C85 58 78 60 73 62",
  },
];

const state = {
  query: "",
  strand: "all",
  level: "all",
  route: "all",
  selectedId: concepts[0].id,
  shuffle: false,
  practice: null,
};

function initialize() {
  hydrateFromHash();
  populateHeroStats();
  populateControls();
  bindEvents();
  render();
  pickPractice();
}

function hydrateFromHash() {
  const hashId = decodeURIComponent(window.location.hash.replace("#", ""));
  if (conceptsById.has(hashId)) {
    state.selectedId = hashId;
  }
}

function bindEvents() {
  refs.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    state.shuffle = false;
    render();
  });

  refs.levelSelect.addEventListener("change", (event) => {
    state.level = event.target.value;
    state.shuffle = false;
    render();
  });

  refs.routeSelect.addEventListener("change", (event) => {
    state.route = event.target.value;
    state.shuffle = false;
    render();
  });

  refs.resetButton.addEventListener("click", () => {
    state.query = "";
    state.strand = "all";
    state.level = "all";
    state.route = "all";
    state.shuffle = false;
    refs.searchInput.value = "";
    refs.levelSelect.value = "all";
    refs.routeSelect.value = "all";
    render();
  });

  refs.shuffleButton.addEventListener("click", () => {
    state.shuffle = true;
    render();
  });

  refs.surpriseButton.addEventListener("click", () => {
    const visible = getVisibleConcepts();
    const source = visible.length ? visible : concepts;
    selectConcept(source[Math.floor(Math.random() * source.length)].id);
  });

  refs.newPracticeButton.addEventListener("click", pickPractice);
  refs.hintButton.addEventListener("click", () => revealPractice("hint"));
  refs.answerButton.addEventListener("click", () => revealPractice("answer"));

  window.addEventListener("hashchange", () => {
    const hashId = decodeURIComponent(window.location.hash.replace("#", ""));
    if (conceptsById.has(hashId)) {
      state.selectedId = hashId;
      render();
    }
  });
}

function populateHeroStats() {
  const practiceCount = concepts.reduce((total, concept) => total + concept.practice.length, 0);
  refs.heroStats.innerHTML = [
    statCard(concepts.length, "math concepts"),
    statCard(atlas.routes.length, "guided routes"),
    statCard(practiceCount, "practice prompts"),
  ].join("");
}

function statCard(value, label) {
  return `<div class="stat-card"><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`;
}

function populateControls() {
  for (const route of atlas.routes) {
    const option = document.createElement("option");
    option.value = route.id;
    option.textContent = route.title;
    refs.routeSelect.append(option);
  }

  const allButton = document.createElement("button");
  allButton.className = "strand-chip is-active";
  allButton.type = "button";
  allButton.textContent = "All strands";
  allButton.style.setProperty("--strand-color", "#152338");
  allButton.dataset.strand = "all";
  refs.strandFilters.append(allButton);

  for (const strand of atlas.strands) {
    const button = document.createElement("button");
    button.className = "strand-chip";
    button.type = "button";
    button.textContent = strand.label;
    button.style.setProperty("--strand-color", strand.color);
    button.dataset.strand = strand.id;
    refs.strandFilters.append(button);
  }

  refs.strandFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-strand]");
    if (!button) return;
    state.strand = button.dataset.strand;
    state.shuffle = false;
    render();
  });

  refs.routeList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-route]");
    if (!button) return;
    state.route = button.dataset.route;
    refs.routeSelect.value = state.route;
    state.shuffle = false;
    render();
  });
}

function render() {
  const visible = getVisibleConcepts();
  ensureSelectedConcept(visible);
  renderStrandButtons();
  renderRoutes();
  renderMap(visible);
  renderConceptCards(visible);
  renderDetail();
  updatePracticeSource();
}

function getVisibleConcepts() {
  const route = state.route === "all" ? null : routesById.get(state.route);
  const routeSet = route ? new Set(route.conceptIds) : null;

  let visible = concepts.filter((concept) => {
    const matchesQuery = !state.query || concept.searchText.includes(state.query);
    const matchesStrand = state.strand === "all" || concept.strand === state.strand;
    const matchesLevel = state.level === "all" || String(concept.level) === state.level;
    const matchesRoute = !routeSet || routeSet.has(concept.id);
    return matchesQuery && matchesStrand && matchesLevel && matchesRoute;
  });

  if (state.shuffle) {
    visible = [...visible].sort(() => Math.random() - 0.5);
  } else {
    visible = [...visible].sort((a, b) => a.level - b.level || a.title.localeCompare(b.title));
  }

  return visible;
}

function ensureSelectedConcept(visible) {
  if (!visible.length) return;
  if (!visible.some((concept) => concept.id === state.selectedId)) {
    state.selectedId = visible[0].id;
  }
}

function renderStrandButtons() {
  refs.strandFilters.querySelectorAll("[data-strand]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.strand === state.strand);
  });
}

function renderRoutes() {
  refs.routeList.innerHTML = "";
  const allRoute = routeButton({
    id: "all",
    title: "Free Exploration",
    description: "Show every concept and let curiosity choose the path.",
    conceptIds: concepts.map((concept) => concept.id),
  });
  refs.routeList.append(allRoute);

  for (const route of atlas.routes) {
    refs.routeList.append(routeButton(route));
  }
}

function routeButton(route) {
  const concept = conceptsById.get(route.conceptIds[0]) || concepts[0];
  const strand = strandsById.get(concept.strand);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `route-card${state.route === route.id ? " is-active" : ""}`;
  button.dataset.route = route.id;
  button.style.setProperty("--strand-color", strand.color);
  button.innerHTML = `
    <h3>${escapeHtml(route.title)}</h3>
    <p>${escapeHtml(route.description)}</p>
    <div class="route-meta">
      <span class="tag">${route.conceptIds.length} stops</span>
      <span class="tag">${escapeHtml(concept.region)}</span>
    </div>
  `;
  return button;
}

function renderMap(visible) {
  const visibleIds = new Set(visible.map((concept) => concept.id));
  refs.conceptMap.innerHTML = "";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "map-art");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  const waterGroup = createSvg("g", { class: "map-watermarks" });
  for (const wave of [
    [8, 15],
    [21, 10],
    [35, 13],
    [64, 9],
    [94, 12],
    [12, 83],
    [84, 95],
    [96, 74],
    [4, 56],
  ]) {
    waterGroup.append(
      createSvg("path", {
        class: "map-wave",
        d: `M${wave[0] - 2} ${wave[1]} C${wave[0] - 1} ${wave[1] - 1.2}, ${wave[0] + 1} ${wave[1] + 1.2}, ${wave[0] + 2} ${wave[1]} C${wave[0] + 3} ${wave[1] - 1.2}, ${wave[0] + 5} ${wave[1] + 1.2}, ${wave[0] + 6} ${wave[1]}`,
      }),
    );
  }
  svg.append(waterGroup);

  const regionGroup = createSvg("g", { class: "map-regions" });
  for (const region of MAP_REGIONS) {
    const strand = strandsById.get(region.strand);
    const island = createSvg("path", {
      class: `map-island${state.strand !== "all" && state.strand !== region.strand ? " is-muted" : ""}`,
      d: region.path,
    });
    island.style.setProperty("--strand-color", strand.color);
    regionGroup.append(island);
  }
  svg.append(regionGroup);

  const routeGroup = createSvg("g", { class: "map-routes" });
  for (const route of MAP_ROUTES) {
    routeGroup.append(
      createSvg("path", {
        class: "map-route",
        d: route.path,
      }),
    );
  }
  svg.append(routeGroup);

  for (const region of MAP_REGIONS) {
    const strand = strandsById.get(region.strand);
    const match = region.path.match(/M([\d.-]+) ([\d.-]+)/);
    const labelPosition = labelPositionForRegion(region.id);
    const label = createSvg("text", {
      class: "map-region-label",
      x: labelPosition.x,
      y: labelPosition.y,
      "text-anchor": "middle",
    });
    label.style.setProperty("--strand-color", strand.color);
    label.textContent = region.label;
    if (match) regionGroup.append(label);
  }

  refs.conceptMap.append(svg);

  for (const concept of concepts) {
    const strand = strandsById.get(concept.strand);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-node";
    button.classList.toggle("is-selected", concept.id === state.selectedId);
    button.classList.toggle("is-muted", !visibleIds.has(concept.id));
    button.style.left = `${concept.map.x}%`;
    button.style.top = `${concept.map.y}%`;
    button.style.setProperty("--strand-color", strand.color);
    button.setAttribute("aria-label", `Open ${concept.title}`);
    button.innerHTML = `${escapeHtml(concept.symbol)}<span class="map-node-label">${escapeHtml(concept.title)}</span>`;
    button.addEventListener("click", () => selectConcept(concept.id));
    refs.conceptMap.append(button);
  }

  refs.mapCount.textContent = `${visible.length} shown`;
}

function createSvg(tagName, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  for (const [name, value] of Object.entries(attrs)) {
    element.setAttribute(name, value);
  }
  return element;
}

function labelPositionForRegion(id) {
  return {
    "operations-island": { x: 32, y: 18 },
    "number-cove": { x: 16, y: 14 },
    "fraction-fjord": { x: 69, y: 12 },
    "measurement-bay": { x: 17, y: 38 },
    "algebra-keys": { x: 49, y: 72 },
    "geometry-shores": { x: 24, y: 84 },
    "data-reef": { x: 88, y: 16 },
    "story-summit": { x: 52, y: 42 },
  }[id];
}

function renderConceptCards(visible) {
  refs.conceptGrid.innerHTML = "";
  refs.resultsCaption.textContent = visible.length
    ? `${visible.length} concept${visible.length === 1 ? "" : "s"} match the current view.`
    : "No concepts match yet. Try a broader search or reset the filters.";

  if (!visible.length) {
    refs.conceptGrid.innerHTML = `
      <div class="empty-state">
        No matching concepts. Clear a filter or try a different search term.
      </div>
    `;
    return;
  }

  for (const concept of visible) {
    const strand = strandsById.get(concept.strand);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `concept-card${concept.id === state.selectedId ? " is-selected" : ""}`;
    card.style.setProperty("--strand-color", strand.color);
    card.addEventListener("click", () => selectConcept(concept.id));
    card.innerHTML = `
      <span class="concept-symbol">${escapeHtml(concept.symbol)}</span>
      <h3>${escapeHtml(concept.title)}</h3>
      <p>${escapeHtml(concept.summary)}</p>
      <div class="concept-meta">
        <span class="level-tag">Level ${concept.level}</span>
        <span class="tag">${escapeHtml(concept.ages)}</span>
        <span class="tag">${escapeHtml(strand.label)}</span>
      </div>
    `;
    refs.conceptGrid.append(card);
  }
}

function renderDetail() {
  const concept = conceptsById.get(state.selectedId);
  if (!concept) return;
  const strand = strandsById.get(concept.strand);
  refs.detailKicker.textContent = `${strand.label} / ${concept.region}`;
  refs.detailKicker.style.borderColor = strand.color;
  refs.detailTitle.textContent = concept.title;

  refs.detailContent.innerHTML = `
    <p class="detail-copy">${escapeHtml(concept.bigIdea)}</p>
    <div class="detail-meta">
      <span class="level-tag">Level ${concept.level}</span>
      <span class="tag">${escapeHtml(concept.ages)}</span>
      <span class="tag">${concept.practice.length} practice prompts</span>
    </div>
    <div class="detail-block">
      <h3>Skills to practice</h3>
      ${listHtml(concept.skills)}
    </div>
    <div class="detail-block">
      <h3>Vocabulary</h3>
      <div class="tag-list">${concept.vocabulary.map((word) => `<span class="tag">${escapeHtml(word)}</span>`).join("")}</div>
    </div>
    <div class="detail-block">
      <h3>Example</h3>
      <div class="example-box">
        <p><strong>${escapeHtml(concept.example.question)}</strong></p>
        <ol>${concept.example.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <p class="example-answer">Answer: ${escapeHtml(concept.example.answer)}</p>
      </div>
    </div>
    <div class="detail-block">
      <h3>Try it</h3>
      ${concept.practice
        .map(
          (item) => `
            <div class="practice-mini">
              <p><strong>${escapeHtml(item.question)}</strong></p>
              <p>Hint: ${escapeHtml(item.hint)}</p>
              <p class="example-answer">Answer: ${escapeHtml(item.answer)}</p>
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="detail-block">
      <h3>Connected concepts</h3>
      <div class="connection-list">
        ${concept.connections
          .filter((id) => conceptsById.has(id))
          .map((id) => `<button class="connection-button" type="button" data-connection="${id}">${escapeHtml(conceptsById.get(id).title)}</button>`)
          .join("")}
      </div>
    </div>
  `;

  refs.detailContent.querySelectorAll("[data-connection]").forEach((button) => {
    button.addEventListener("click", () => selectConcept(button.dataset.connection));
  });
}

function updatePracticeSource() {
  if (!state.practice) return;
  const currentVisibleIds = new Set(getVisibleConcepts().map((concept) => concept.id));
  if (!currentVisibleIds.has(state.practice.conceptId)) {
    pickPractice();
  }
}

function pickPractice() {
  const visible = getVisibleConcepts();
  const source = visible.length ? visible : concepts;
  const concept = source[Math.floor(Math.random() * source.length)];
  const prompt = concept.practice[Math.floor(Math.random() * concept.practice.length)];
  state.practice = { conceptId: concept.id, ...prompt };
  refs.practiceConcept.textContent = concept.title;
  refs.practiceQuestion.textContent = prompt.question;
  refs.practiceHint.textContent = `Hint: ${prompt.hint}`;
  refs.practiceAnswer.textContent = `Answer: ${prompt.answer}`;
  refs.practiceHint.hidden = true;
  refs.practiceAnswer.hidden = true;
}

function revealPractice(part) {
  if (!state.practice) pickPractice();
  if (part === "hint") refs.practiceHint.hidden = false;
  if (part === "answer") {
    refs.practiceHint.hidden = false;
    refs.practiceAnswer.hidden = false;
  }
}

function selectConcept(id) {
  if (!conceptsById.has(id)) return;
  state.selectedId = id;
  history.replaceState(null, "", `#${encodeURIComponent(id)}`);
  render();
  document.querySelector("#atlas").scrollIntoView({ behavior: "smooth", block: "start" });
}

function listHtml(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

initialize();
