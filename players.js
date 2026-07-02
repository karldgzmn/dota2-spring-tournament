/* =========================================================
   SPRING CLASH 2026 — ROSTERS

   Edit the ROSTERS array below to add, remove, or rename players.
   Set captain: true on exactly one player per team to show the 👑.

   TO ADD A LOGO: drop an image file into the /logos folder next to
   this script, then set "logo" to its filename, e.g.:
     logo: "logos/nephi-and-friends.png"
   Leave it as null to keep showing the letter badge instead.
   ========================================================= */

const ROSTERS = [
  {
    team: "Nephi and Friends",
    glyph: "NF", logo: null,
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
    team: "Hyrum's Angels",
    glyph: "HA", logo: null,
    players: [
      { name: "Spencer Gaid", captain: true },
      { name: "Hyrum Busania" },
      { name: "John Dave Ugay" },
      { name: "Josh Gamil" },
      { name: "Eldon Senolos" }
    ]
  },
  {
    team: "Gensan Gaming",
    glyph: "GG", logo: null,
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
    team: "Reloaded",
    glyph: "RL", logo: null,
    players: [
      { name: "Jared Mariano", captain: true },
      { name: "Jim Mariano" },
      { name: "Adam Manahan" },
      { name: "Humphrey Valiente" },
      { name: "Christian Inigo" }
    ]
  },
  {
    team: "Balikbayan Kings",
    glyph: "BK", logo: null,
    players: [
      { name: "Kyli", captain: true },
      { name: "Sheldon" },
      { name: "Hyrum" },
      { name: "Jared" },
      { name: "Charlie" }
    ]
  },
  {
    team: "Unknown",
    glyph: "?", logo: null,
    players: [
      { name: "Kelly Cabato", captain: true },
      { name: "Christian Cabalza" },
      { name: "LTom Cabais" },
      { name: "Jared Depasupil" },
      { name: "Jared Rodrigo" }
    ]
  }
];

function teamGlyphHTML(team) {
  if (!team.logo) return team.glyph;
  return `
    <img class="team-logo-img" src="${team.logo}" alt="${team.team} logo"
         onerror="this.replaceWith(Object.assign(document.createElement('span'), { className: 'team-glyph-fallback', textContent: '${team.glyph}' }))">
  `;
}

function renderRosters() {
  const grid = document.getElementById("rosterGrid");

  grid.innerHTML = ROSTERS.map(team => `
    <div class="roster-card">
      <div class="roster-head">
        <div class="team-glyph">${teamGlyphHTML(team)}</div>
        <h3 class="roster-team-name">${team.team}</h3>
        <span class="roster-count">${team.players.length} players</span>
      </div>
      <ul class="roster-list">
        ${team.players.map(p => `
          <li class="roster-player ${p.captain ? "is-captain" : ""}">
            <span class="player-name">${p.name}</span>
            ${p.captain ? '<span class="captain-tag" title="Captain">👑 Captain</span>' : ""}
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");
}

renderRosters();