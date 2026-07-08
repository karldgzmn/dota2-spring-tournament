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
  [{ a: 1, b: 0 }, { a: 0, b: 1 }, { a: 0, b: 1 }],
  // Round 2: [1v2, 3v5, 4v6]
  [{ a: 1, b: 0 }, { a: 0, b: 1 }, { a: 1, b: 0 }],
  // Round 3: [1v3, 2v6, 4v5]
  [{ a: null, b: null }, { a: 1, b: 0 }, { a: 1, b: 0 }],
  // Round 4: [1v4, 2v3, 5v6]
  [{ a: 0, b: 1 }, { a: 1, b: 0 }, { a: null, b: null }],
  // Round 5: [1v5, 2v4, 3v6]
  [{ a: 1, b: 0 }, { a: 0, b: 1 }, { a: null, b: null }]
];

// ---- 4. PLAYOFF RESULTS — EDIT THESE BY HAND -----------------------
// Double elimination bracket. Seeds (1st-4th) are calculated
// automatically from RESULTS above, so you only need to fill in
// scores here once each matchup is known.
//
//   Match 1 (Winners R1):  Seed 1 vs Seed 4
//   Match 2 (Winners R1):  Seed 2 vs Seed 3
//   Match 3 (Losers R1):   Loser of 1 vs Loser of 2
//   Match 4 (Winners Final / "Semifinal"): Winner of 1 vs Winner of 2
//   Match 5 (Losers R2):   Winner of 3 vs Loser of 4
//   Match 6 (Grand Final): Winner of 4 (Winners Bracket champ)
//                           vs Winner of 5 (Losers Bracket champ)
//   Match 7 (Bracket Reset): ONLY played if the Losers Bracket team
//                           wins Match 6 — same two teams run it back,
//                           since the Winners Bracket team has to lose
//                           twice to be eliminated. Leave Match 7 blank
//                           if Match 6 is won by the Winners Bracket
//                           team (no reset needed, they're champions).
//   "a" is always the score of the FIRST team listed in that match's
//   description above, "b" is the second.
const BRACKET_RESULTS = {
  m1: { a: null, b: null },
  m2: { a: null, b: null },
  m3: { a: null, b: null },
  m4: { a: null, b: null },
  m5: { a: null, b: null },
  m6: { a: null, b: null },
  m7: { a: null, b: null }
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

// ---- 8. PLAYOFF BRACKET (DOUBLE ELIMINATION) ------------------------
function renderBracket(standings) {
  const bracket = document.getElementById("bracket");

  // Seeds are only "locked in" once every group stage match has a result.
  const groupComplete = RESULTS.flat().every(m => m.a !== null && m.b !== null && m.a !== m.b);
  const seeds = groupComplete ? standings.slice(0, 4).map(r => r.team.id) : null;

  const slot = (idOrNull, fallbackLabel) => {
    if (!idOrNull) return { label: fallbackLabel, tbd: true };
    const t = teamById(idOrNull);
    return { label: t ? t.name : fallbackLabel, tbd: !t };
  };

  const seed = (i) => (seeds ? seeds[i] : null);

  // Match 1 & 2 — Winners Round 1
  const m1A = seed(0), m1B = seed(3); // seed 1 vs seed 4
  const m2A = seed(1), m2B = seed(2); // seed 2 vs seed 3
  const w1 = matchWinner(BRACKET_RESULTS.m1, m1A, m1B);
  const l1 = matchLoser(BRACKET_RESULTS.m1, m1A, m1B);
  const w2 = matchWinner(BRACKET_RESULTS.m2, m2A, m2B);
  const l2 = matchLoser(BRACKET_RESULTS.m2, m2A, m2B);

  // Match 3 — Losers Round 1: loser of 1 vs loser of 2
  const w3 = matchWinner(BRACKET_RESULTS.m3, l1, l2);

  // Match 4 — Winners Final ("Semifinal"): winner of 1 vs winner of 2
  const w4 = matchWinner(BRACKET_RESULTS.m4, w1, w2); // Winners Bracket champion
  const l4 = matchLoser(BRACKET_RESULTS.m4, w1, w2);  // drops to Losers R2

  // Match 5 — Losers Round 2: winner of 3 vs loser of 4
  const w5 = matchWinner(BRACKET_RESULTS.m5, w3, l4); // Losers Bracket champion

  // Match 6 — Grand Final: Winners Bracket champ vs Losers Bracket champ
  const w6 = matchWinner(BRACKET_RESULTS.m6, w4, w5);
  const lowerBracketWonGF = w6 !== null && w6 === w5;

  // Match 7 — Bracket Reset: only relevant if the Losers Bracket team
  // won the Grand Final, forcing a rematch between the same two teams.
  const w7 = lowerBracketWonGF ? matchWinner(BRACKET_RESULTS.m7, w4, w5) : null;

  const champion = lowerBracketWonGF ? w7 : (w6 && !lowerBracketWonGF ? w6 : null);

  const s1A = slot(m1A, "Reloaded"), s1B = slot(m1B, "Seed 4");
  const s2A = slot(m2A, "Nephi and Friends"), s2B = slot(m2B, "Balikbayan Kings");
  const s3A = slot(l1, "Loser of 1"), s3B = slot(l2, "Loser of 2");
  const s4A = slot(w1, "Winner of 1"), s4B = slot(w2, "Winner of 2");
  const s5A = slot(w3, "Winner of 3"), s5B = slot(l4, "Loser of 4");
  const s6A = slot(w4, "Winner of 4"), s6B = slot(w5, "Winner of Losers Bracket");
  const s7A = slot(lowerBracketWonGF ? w4 : null, "Winner of 4");
  const s7B = slot(lowerBracketWonGF ? w5 : null, "Winner of Losers Bracket");

  bracket.innerHTML = `
    <div class="dbracket">
      <div class="dbracket-headers">
        <div class="dbracket-header-bar">Round 1</div>
        <div class="dbracket-header-bar">Semifinal</div>
        <div class="dbracket-header-bar">Finals</div>
      </div>
      <div class="dbracket-row">
        <div class="dbracket-col">
          ${dpairHTML(1, s1A, s1B, BRACKET_RESULTS.m1)}
          ${dpairHTML(2, s2A, s2B, BRACKET_RESULTS.m2)}
        </div>
        <div class="dbracket-col dbracket-col-center">
          ${dpairHTML(4, s4A, s4B, BRACKET_RESULTS.m4)}
        </div>
        <div class="dbracket-col dbracket-col-center">
          ${dpairHTML(6, s6A, s6B, BRACKET_RESULTS.m6, true)}
          ${lowerBracketWonGF ? dpairHTML(7, s7A, s7B, BRACKET_RESULTS.m7, true, "Bracket Reset") : `
            <div class="dbracket-reset-note">Match 7?</div>
          `}
        </div>
      </div>

      <div class="dbracket-headers dbracket-headers-losers">
        <div class="dbracket-header-bar">Losers Round 1</div>
        <div class="dbracket-header-bar">Losers Round 2</div>
        <div></div>
      </div>
      <div class="dbracket-row">
        <div class="dbracket-col">
          ${dpairHTML(3, s3A, s3B, BRACKET_RESULTS.m3)}
        </div>
        <div class="dbracket-col dbracket-col-center">
          ${dpairHTML(5, s5A, s5B, BRACKET_RESULTS.m5)}
        </div>
        <div class="dbracket-col"></div>
      </div>

      <div class="champion-banner">${champion ? "🏆 " + teamById(champion).name + " — Champions" : ""}</div>
    </div>
  `;
}

function dpairHTML(num, slotA, slotB, score, isFinal, labelOverride) {
  const aWin = score.a !== null && score.b !== null && score.a > score.b;
  const bWin = score.a !== null && score.b !== null && score.b > score.a;
  return `
    <div class="dbracket-pair">
      <span class="dbracket-num">${num}</span>
      <div class="bmatch ${isFinal ? "final" : ""}">
        ${labelOverride ? `<div class="bmatch-tag">${labelOverride}</div>` : ""}
        <div class="bmatch-row ${aWin ? "win" : ""}">
          <span class="team-slot ${slotA.tbd ? "tbd" : ""}">${slotA.label}</span>
          ${scoreCell(slotA.tbd ? null : score.a)}
        </div>
        <div class="bmatch-row ${bWin ? "win" : ""}">
          <span class="team-slot ${slotB.tbd ? "tbd" : ""}">${slotB.label}</span>
          ${scoreCell(slotB.tbd ? null : score.b)}
        </div>
      </div>
    </div>
  `;
}

function matchWinner(score, idA, idB) {
  if (!idA || !idB) return null;
  if (score.a === null || score.b === null || score.a === score.b) return null;
  return score.a > score.b ? idA : idB;
}

function matchLoser(score, idA, idB) {
  if (!idA || !idB) return null;
  if (score.a === null || score.b === null || score.a === score.b) return null;
  return score.a > score.b ? idB : idA;
}

// ---- 9. INIT -----------------------------------------------------------
renderTeams();
renderRounds();
const standings = renderStandings();
renderBracket(standings);