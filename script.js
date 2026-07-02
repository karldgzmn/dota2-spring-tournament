/* =========================================================
   SPRING CLASH 2026 — TOURNAMENT LOGIC (STATIC / MANUAL EDIT)

   This version has NO editable inputs in the browser. To record a
   result, come into THIS file and type the score directly — the
   page just displays whatever numbers are set below and recalculates
   standings/seeding automatically from them.

   Nothing is saved in the browser. This file is the single source
   of truth every time the page loads.
   ========================================================= */

// ---- 1. TEAMS -------------------------------------------------
// id must stay 1-6 and unique. "glyph" is the 1-2 letter tag shown
// when a team has no logo yet. Set captain: true on exactly one
// player per team to show the 👑 next to their name.
//
// TO ADD A LOGO: drop an image file into the /logos folder next to
// this script, then set "logo" to its filename, e.g.:
//   logo: "logos/nephi-and-friends.png"
// Leave it as null to keep showing the letter badge instead.
// Square images (PNG with a transparent background works best)
// look cleanest — they'll be cropped into a circle automatically.
const TEAMS = [
  {
    id: 1, name: "Nephi and Friends", glyph: "NF", logo: null,
    players: [
      { name: "Karl De Guzman", captain: true },
      { name: "Dio Bondoc" },
      { name: "Mark Nephi Simene" },
      { name: "Andrie Simene" },
      { name: "Blaise Billones" },
      { name: "Maron Pilande" }
    ]
  },
  {
    id: 2, name: "Hyrum's Angels", glyph: "HA", logo: null,
    players: [
      { name: "Spencer Gaid", captain: true },
      { name: "Hyrum Busania" },
      { name: "John Dave Ugay" },
      { name: "Josh Gamil" },
      { name: "Eldon Senolos" }
    ]
  },
  {
    id: 3, name: "Gensan Gaming", glyph: "GG", logo: null,
    players: [
      { name: "Arvin Bermudo", captain: true },
      { name: "Janrhu Aquino" },
      { name: "Dan Manahan" },
      { name: "Shane Quinco" },
      { name: "Dean Heber" },
      { name: "Paul Sapan" }
    ]
  },
  {
    id: 4, name: "Reloaded", glyph: "RL", logo: null,
    players: [
      { name: "Jared Mariano", captain: true },
      { name: "Jim Mariano" },
      { name: "Jared Wenceslao" },
      { name: "Humphrey Valiente" },
      { name: "Christian Inigo" }
    ]
  },
  {
    id: 5, name: "Balikbayan Kings", glyph: "BK", logo: null,
    players: [
      { name: "Kyli", captain: true },
      { name: "Sheldon" },
      { name: "Hyrum" },
      { name: "Jared" },
      { name: "Charlie" }
    ]
  },
  {
    id: 6, name: "Unknown", glyph: "?", logo: null,
    players: [
      { name: "Kelly Cabato", captain: true },
      { name: "Christian Cabalza" },
      { name: "LTom Cabais" },
      { name: "Jared Depasupil" },
      { name: "Jared Rodrigo" }
    ]
  }
];

function teamById(id) {
  return TEAMS.find(t => t.id === id);
}

// ---- 2. ROUND ROBIN SCHEDULE -----------------------------------
// Standard circle-method schedule for 6 teams / 5 rounds / 3 matches
// each round, every team plays every other team exactly once.
// DO NOT reorder these pairs — RESULTS below lines up with this
// array position-for-position (same round index, same match index).
const SCHEDULE = [
  [[1, 6], [2, 5], [3, 4]], // Round 1
  [[1, 2], [3, 5], [4, 6]], // Round 2
  [[1, 3], [2, 6], [4, 5]], // Round 3
  [[1, 4], [2, 3], [5, 6]], // Round 4
  [[1, 5], [2, 4], [3, 6]]  // Round 5
];

// ---- 3. GROUP STAGE RESULTS — EDIT THESE BY HAND ------------------
// Same shape as SCHEDULE: 5 rounds x 3 matches. "a" is the score of
// the FIRST team listed in that SCHEDULE pair, "b" is the SECOND.
// Leave a match as { a: null, b: null } until it has been played.
//
// Example — Round 1, Match 1 was [1, 6] (Nephi and Friends vs Unknown)
// and Nephi and Friends won 2-0:
//   [{ a: 2, b: 0 }, { a: null, b: null }, { a: null, b: null }],
const RESULTS = [
  // Round 1: [1v6, 2v5, 3v4]
  [{ a: null, b: null }, { a: null, b: null }, { a: null, b: null }],
  // Round 2: [1v2, 3v5, 4v6]
  [{ a: null, b: null }, { a: null, b: null }, { a: null, b: null }],
  // Round 3: [1v3, 2v6, 4v5]
  [{ a: null, b: null }, { a: null, b: null }, { a: null, b: null }],
  // Round 4: [1v4, 2v3, 5v6]
  [{ a: null, b: null }, { a: null, b: null }, { a: null, b: null }],
  // Round 5: [1v5, 2v4, 3v6]
  [{ a: null, b: null }, { a: null, b: null }, { a: null, b: null }]
];

// ---- 4. PLAYOFF RESULTS — EDIT THESE BY HAND -----------------------
// Seeds (1st-4th) are calculated automatically from RESULTS above, so
// you only need to fill in scores here once the semifinal matchups
// are known. "a" = higher seed in that match, "b" = lower seed.
//   SF1 = Seed 1 vs Seed 4
//   SF2 = Seed 2 vs Seed 3
//   FINAL = winner of SF1 vs winner of SF2
const BRACKET_RESULTS = {
  sf1:   { a: null, b: null },
  sf2:   { a: null, b: null },
  final: { a: null, b: null }
};

// =========================================================
//  Nothing below this line needs to be edited for normal use.
// =========================================================

// ---- 5. RENDER: TEAMS -------------------------------------------
function teamGlyphHTML(t) {
  if (!t.logo) return t.glyph;
  // If the image fails to load (missing file, bad path), swap back
  // to the letter badge automatically instead of showing a broken icon.
  return `
    <img class="team-logo-img" src="${t.logo}" alt="${t.name} logo"
         onerror="this.replaceWith(Object.assign(document.createElement('span'), { className: 'team-glyph-fallback', textContent: '${t.glyph}' }))">
  `;
}

function renderTeams() {
  const grid = document.getElementById("teamGrid");
  grid.innerHTML = TEAMS.map(t => `
    <div class="team-card">
      <div class="roster-head">
        <div class="team-glyph">${teamGlyphHTML(t)}</div>
        <h3 class="roster-team-name">${t.name}</h3>
        <span class="roster-count">${t.players.length} players</span>
      </div>
      <ul class="roster-list">
        ${t.players.map(p => `
          <li class="roster-player ${p.captain ? "is-captain" : ""}">
            <span class="player-name">${p.name}</span>
            ${p.captain ? '<span class="captain-tag" title="Captain">👑 Captain</span>' : ""}
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");
}

// ---- 6. RENDER: GROUP STAGE --------------------------------------
function renderRounds() {
  const tabs = document.getElementById("roundTabs");
  const wrap = document.getElementById("roundsWrap");

  tabs.innerHTML = SCHEDULE.map((_, i) => `
    <button class="round-tab ${i === 0 ? "active" : ""}" data-round="${i}">
      Round ${i + 1}
    </button>
  `).join("");

  wrap.innerHTML = SCHEDULE.map((round, rIdx) => `
    <div class="round-panel ${rIdx === 0 ? "active" : ""}" data-round-panel="${rIdx}">
      <div class="match-list">
        ${round.map((pair, mIdx) => renderMatchCard(rIdx, mIdx, pair)).join("")}
      </div>
    </div>
  `).join("");

  tabs.querySelectorAll(".round-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.querySelectorAll(".round-tab").forEach(b => b.classList.remove("active"));
      wrap.querySelectorAll(".round-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      wrap.querySelector(`[data-round-panel="${btn.dataset.round}"]`).classList.add("active");
    });
  });
}

function scoreCell(value) {
  const empty = value === null || value === undefined;
  return `<span class="score-static ${empty ? "empty" : ""}">${empty ? "-" : value}</span>`;
}

function renderMatchCard(rIdx, mIdx, pair) {
  const score = RESULTS[rIdx][mIdx];
  const teamA = teamById(pair[0]);
  const teamB = teamById(pair[1]);
  const aWins = score.a !== null && score.b !== null && score.a > score.b;
  const bWins = score.a !== null && score.b !== null && score.b > score.a;

  return `
    <div class="match-card">
      <div class="match-team side-a ${aWins ? "winner" : ""}">${teamA.name}</div>
      ${scoreCell(score.a)}
      <div class="match-vs">VS</div>
      ${scoreCell(score.b)}
      <div class="match-team side-b ${bWins ? "winner" : ""}">${teamB.name}</div>
    </div>
  `;
}

// ---- 7. STANDINGS --------------------------------------------------
function computeStandings() {
  const rows = {};
  TEAMS.forEach(t => { rows[t.id] = { team: t, w: 0, l: 0, pts: 0, diff: 0 }; });

  SCHEDULE.forEach((round, rIdx) => {
    round.forEach((pair, mIdx) => {
      const score = RESULTS[rIdx][mIdx];
      if (!score || score.a === null || score.b === null || score.a === score.b) return;
      const [aId, bId] = pair;
      const winnerId = score.a > score.b ? aId : bId;
      const loserId = score.a > score.b ? bId : aId;
      rows[winnerId].w += 1;
      rows[winnerId].pts += 1;
      rows[loserId].l += 1;
      rows[aId].diff += (score.a - score.b);
      rows[bId].diff += (score.b - score.a);
    });
  });

  return Object.values(rows).sort((x, y) => y.pts - x.pts || y.diff - x.diff || x.team.id - y.team.id);
}

function renderStandings() {
  const body = document.getElementById("standingsBody");
  const standings = computeStandings();
  body.innerHTML = standings.map((row, i) => `
    <tr class="${i < 4 ? "qualified" : ""}">
      <td class="col-rank"><span class="rank-badge">${i + 1}</span></td>
      <td class="col-team">${row.team.name}</td>
      <td>${row.w}</td>
      <td>${row.l}</td>
      <td>${row.pts}</td>
    </tr>
  `).join("");
  return standings;
}

// ---- 8. PLAYOFF BRACKET --------------------------------------------
function renderBracket(standings) {
  const bracket = document.getElementById("bracket");

  // Seeds are only "locked in" once every group stage match has a result.
  const groupComplete = RESULTS.flat().every(m => m.a !== null && m.b !== null && m.a !== m.b);
  const seeds = groupComplete ? standings.slice(0, 4).map(r => r.team.id) : null;

  const slotName = (seedIdx) => {
    if (!seeds) return { label: `Seed ${seedIdx + 1}`, tbd: true };
    const t = teamById(seeds[seedIdx]);
    return { label: t ? t.name : `Seed ${seedIdx + 1}`, tbd: !t };
  };

  const sf1A = slotName(0), sf1B = slotName(3); // 1st vs 4th
  const sf2A = slotName(1), sf2B = slotName(2); // 2nd vs 3rd

  const sf1Winner = matchWinner(BRACKET_RESULTS.sf1, seeds ? seeds[0] : null, seeds ? seeds[3] : null);
  const sf2Winner = matchWinner(BRACKET_RESULTS.sf2, seeds ? seeds[1] : null, seeds ? seeds[2] : null);

  const finalA = sf1Winner ? teamById(sf1Winner).name : "Winner SF1";
  const finalB = sf2Winner ? teamById(sf2Winner).name : "Winner SF2";
  const finalAtbd = !sf1Winner;
  const finalBtbd = !sf2Winner;

  const champ = matchWinner(BRACKET_RESULTS.final, sf1Winner, sf2Winner);

  bracket.innerHTML = `
    <div class="bracket-col">
      <div>
        <div class="bracket-label">Semifinal 1 · 1st vs 4th</div>
        ${bmatchHTML(sf1A, sf1B, BRACKET_RESULTS.sf1)}
      </div>
      <div>
        <div class="bracket-label">Semifinal 2 · 2nd vs 3rd</div>
        ${bmatchHTML(sf2A, sf2B, BRACKET_RESULTS.sf2)}
      </div>
    </div>
    <div class="bracket-col bracket-col-final">
      <div>
        <div class="bracket-label">Grand Final</div>
        ${bmatchHTML({ label: finalA, tbd: finalAtbd }, { label: finalB, tbd: finalBtbd }, BRACKET_RESULTS.final, true)}
        <div class="champion-banner">${champ ? "🏆 " + teamById(champ).name + " — Champions" : ""}</div>
      </div>
    </div>
  `;
}

function bmatchHTML(slotA, slotB, score, isFinal) {
  const aWin = score.a !== null && score.b !== null && score.a > score.b;
  const bWin = score.a !== null && score.b !== null && score.b > score.a;
  return `
    <div class="bmatch ${isFinal ? "final" : ""}">
      <div class="bmatch-row ${aWin ? "win" : ""}">
        <span class="team-slot ${slotA.tbd ? "tbd" : ""}">${slotA.label}</span>
        ${scoreCell(slotA.tbd ? null : score.a)}
      </div>
      <div class="bmatch-row ${bWin ? "win" : ""}">
        <span class="team-slot ${slotB.tbd ? "tbd" : ""}">${slotB.label}</span>
        ${scoreCell(slotB.tbd ? null : score.b)}
      </div>
    </div>
  `;
}

function matchWinner(score, idA, idB) {
  if (!idA || !idB) return null;
  if (score.a === null || score.b === null || score.a === score.b) return null;
  return score.a > score.b ? idA : idB;
}

// ---- 9. INIT -----------------------------------------------------------
renderTeams();
renderRounds();
const standings = renderStandings();
renderBracket(standings);