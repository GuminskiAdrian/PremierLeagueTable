let table, fixtures, matches;
// --------- pobieranie danych z JSON---------------------------------------------
async function fetchData() {
    try {
        await fetch("dane.json")
            .then((response) => response.json())
            .then((data) => {
                table = data.league.standings[0];
            });

        await fetch("wynikiUnited.json")
            .then((response) => response.json())
            .then((data) => {
                fixtures = data;
            });

        await fetch("prevAndNextMatch.json")
            .then((response) => response.json())
            .then((data) => {
                matches = data;
            });
    } catch (error) {
        console.log(error);
    }
}
// -------------------------------------------------------------------------------

fetchData().then(() => {
    // --------- generowanie tabeli-----------------------------------------------
    const tableBody = document.getElementById("table-body");
    table.forEach((team) => {
        const teamData = document.createElement("tr");
        teamData.innerHTML = `
                    <td class='teamRank'>${team.rank}</td>
                    <td class='teamNamesAndLogos'><img src="${team.team.logo}" alt="${team.team.name} logo" id="${team.team.name}Logo">${team.team.name}</td>
                    <td>${team.all.played}</td>
                    <td>${team.all.win}</td>
                    <td>${team.all.draw}</td>
                    <td>${team.all.lose}</td>
                    <td>${team.all.goals.for}</td>
                    <td>${team.all.goals.against}</td>
                    <td>${team.goalsDiff}</td>
                    <td>${team.points}</td>
                    <td class='teamForm'>${team.form}</td>
                    `;

        tableBody.appendChild(teamData);
    });
    // ---------------------------------------------------------------------------

    // --------- poprzedni mecz wraz z wynikiem oraz następny z datą -------------
    console.log(
        `poprzedni mecz -> ${matches.previousMatch.teams.home.name} ${matches.previousMatch.score.fulltime.home} : ${matches.previousMatch.score.fulltime.away} ${matches.previousMatch.teams.away.name}`
    );

    const timestamp = matches.uppcomingMatch.fixture.timestamp;
    const date = new Date(timestamp * 1000);
    const hour = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const time = `${hour}:${minutes}`;

    console.log(
        `nestepny mecz -> ${matches.uppcomingMatch.fixture.date.slice(0, 10)} ${
            matches.uppcomingMatch.teams.home.name
        } ${hour}:${minutes} ${matches.uppcomingMatch.teams.away.name}`
    );

    createDiv(
        matches.previousMatch.teams.home.name,
        matches.previousMatch.teams.home.logo,
        matches.previousMatch.teams.away.name,
        matches.previousMatch.teams.away.logo,
        matches.previousMatch.score.fulltime.home,
        matches.previousMatch.score.fulltime.away,
        matches.previousMatch.fixture.date.slice(0, 10),
        // matches.uppcomingMatch.fixture.date.slice(0, 10),
        time
    );
    //---------------------------------------------------------------------------
});

// ------- testowa karta z poprzednim i następnym spotkaniem ---------------
// async function createDiv(
//     homeTeam,
//     homeBadge,
//     awayTeam,
//     awayBadge,
//     homeScore,
//     awayScore,
//     date,
//     // nextDate,
//     nextHour = 0
// ) {
//     const prevFixtures = document.getElementById("prevFixtures");

//     // data na gorze
//     const ppp = document.createElement("p");
//     ppp.textContent = date;
//     // --------
//     //druzyna i wynik
//     const score = document.createElement("div");
//         //domowa i logo
//     const spanHome = document.createElement("span");
//     spanHome.innerHTML = `<img src="${homeBadge}" alt="${homeTeam} logo">${homeTeam}`;
//     score.appendChild(spanHome);
//         //-----
//         //wynik
//     const spanScore = document.createElement("span");
//     spanScore.textContent = `${homeScore}:${awayScore}`;
//     score.appendChild(spanScore);
//         //-----
//         //przyjezdne i logo
//     const spanAway = document.createElement("span");
//     spanAway.innerHTML = `<img src="${awayBadge}" alt="${awayTeam} logo">${awayTeam}`;
//     score.appendChild(spanAway);
//         //-----
//     //--------

//     const childs = [ppp, score];

//     prevFixtures.append(...childs);
//     // prevFixtures.appendChild(score);
// }
// ---------------------------------------------------------------------------
