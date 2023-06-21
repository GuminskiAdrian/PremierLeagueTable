let table, fixtures, matches;
// --------- pobieranie danych z JSON---------------------------------------------
async function fetchData() {
    try {
        await fetch("JSONfiles/table.json")
            .then((response) => response.json())
            .then((data) => {
                table = data.league.standings[0];
            });

        await fetch("JSONfiles/unitedScores.json")
            .then((response) => response.json())
            .then((data) => {
                fixtures = data;
            });

        await fetch("JSONfiles/prevAndNextMatch.json")
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

        // --------- obsluga danych w template -----------------------------------
        const template = document
            .getElementById("template")
            .content.cloneNode(true);

        const fixture = template.querySelectorAll(".fixture");
        for (let i = 0; i < 6; i++) {
            const date = fixture[i].querySelector(".date");

            const homeTeam = fixture[i].querySelector(".home");
            const homeTeamName = homeTeam.querySelector("p");
            const homeTeamLogo = homeTeam.querySelector("img");

            const finalOrHour = fixture[i].querySelector(".final");

            const awayTeam = fixture[i].querySelector(".away");
            const awayTeamName = awayTeam.querySelector("p");
            const awayTeamLogo = awayTeam.querySelector("img");

            if (i === 0) {
                const nextMatch = matches.uppcomingMatch;

                let dateFormated = nextMatch.fixture.date;
                date.textContent = converTime(dateFormated);

                homeTeamName.textContent = `${nextMatch.teams.home.name}`;
                homeTeamLogo.src = `${nextMatch.teams.home.logo}`;

                let timestamp = nextMatch.fixture.timestamp * 1000;
                timestamp = new Date(timestamp);
                const hours = timestamp.getHours().toString().padStart(2, "0");
                const minutes = timestamp
                    .getMinutes()
                    .toString()
                    .padStart(2, "0");
                timestamp = `${hours}:${minutes}`;
                finalOrHour.textContent = `${timestamp}`;

                awayTeamName.textContent = `${nextMatch.teams.away.name}`;
                awayTeamLogo.src = `${nextMatch.teams.away.logo}`;
            } else {
                const prevMatch = matches.previousMatch[i - 1];

                let dateFormated = prevMatch.fixture.date;
                date.textContent = converTime(dateFormated);

                homeTeamName.textContent = `${prevMatch.teams.home.name}`;
                homeTeamLogo.src = `${prevMatch.teams.home.logo}`;

                finalOrHour.textContent = `${prevMatch.goals.home}:${prevMatch.goals.away}`;

                awayTeamName.textContent = `${prevMatch.teams.away.name}`;
                awayTeamLogo.src = `${prevMatch.teams.away.logo}`;
            }
        }

        // -----------------------------------------------------------------------
        teamData.setAttribute("class", "show");
        tableBody.appendChild(teamData);
        tableBody.appendChild(template);
    });
    // ---------------------------------------------------------------------------

    //----------------ukrywanie pokazywanie rozwijanej sekcji---------------
    const showHideElement = document.querySelectorAll(".show");
    showHideElement.forEach((element) => {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            const currentRow = event.target.closest("tr");
            const expandable = currentRow.nextElementSibling;
            expandable.classList.toggle("invisible");
        });
    });
    //---------------------------------------------------------------------------
});

function converTime(date) {
    dateFormated = new Date(date);

    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    dateFormated = dateFormated
        .toLocaleDateString("en-GB", options)
        .split("/")
        .join(".");
    
    if(dateFormated == 'Invalid Date'){
        dateFormated = 'No upcoming matches planned yet'
    }
    return dateFormated;
}
