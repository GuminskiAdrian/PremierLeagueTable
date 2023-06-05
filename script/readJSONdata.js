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
                    <td class='teamRank' id='expand'>${team.rank}</td>
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

    // --------- poprzednie mecze ------------------------------------ -----------
    for(let i = 0; i<5; i++) {
        console.log(`${matches.previousMatch[i].teams.home.name} ${matches.previousMatch[i].score.fulltime.home} : ${matches.previousMatch[i].score.fulltime.away} ${matches.previousMatch[i].teams.away.name}`)
    }
    
    
    
    
    //---------------------------------------------------------------------------
});

// ------- testowa karta z poprzednim i następnym spotkaniem ---------------
// 
// ---------------------------------------------------------------------------
