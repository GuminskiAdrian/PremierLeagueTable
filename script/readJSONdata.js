let table, fixtures, matches, lineup;
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
    } catch (error) {
        console.log(error);
    }
}
// -------------------------------------------------------------------------------
async function prevAndNext(teamName) {
    await fetch(`JSONfiles/PrevAndNext/${teamName}prevAndNextMatch.json`)
        .then((response) => response.json())
        .then((data) => {
            matches = data;
        });
}

async function lastMatchLineup(teamName) {
    await fetch(`JSONfiles/lastGameSquads/lastGame${teamName}Squad.json`)
        .then((response) => response.json())
        .then((data) => {
            lineup = data;
        });
}

async function lastMatchStats(teamName) {
    await fetch(`JSONfiles/matchStatistics/matchStats${teamName}.json`)
        .then((response) => response.json())
        .then((data) => {
            stats = data;
        });
}

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
        // -----------obsluga template--------------------------------------------
        const template = document
            .getElementById("template")
            .content.cloneNode(true);
        const fixture = template.querySelectorAll(".fixture");

        prevAndNext(team.team.name).then(() => {
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

                    if (nextMatch === undefined) {
                        date.textContent =
                            "Team relegated, no upcoming games in this league";
                    } else {
                        let dateFormated = nextMatch.fixture.date;
                        date.textContent = converTime(dateFormated);

                        homeTeamName.textContent = `${nextMatch.teams.home.name}`;
                        homeTeamLogo.src = `${nextMatch.teams.home.logo}`;

                        let timestamp = nextMatch.fixture.timestamp * 1000;
                        timestamp = new Date(timestamp);
                        const hours = timestamp
                            .getHours()
                            .toString()
                            .padStart(2, "0");
                        const minutes = timestamp
                            .getMinutes()
                            .toString()
                            .padStart(2, "0");
                        timestamp = `${hours}:${minutes}`;
                        finalOrHour.textContent = `${timestamp}`;

                        awayTeamName.textContent = `${nextMatch.teams.away.name}`;
                        awayTeamLogo.src = `${nextMatch.teams.away.logo}`;
                    }
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
        });
        //---------------------------line ups---------------------------------
        const homeSquadList = template.getElementById("homeSquadList");
        const awaySquadList = template.getElementById("awaySquadList");
        lastMatchLineup(team.team.name).then(() => {
            const homeTeamLineup = lineup[0];
            const awayTeamLineup = lineup[1];

            const homeListOfPlayers = homeSquadList.querySelectorAll("p");
            const awayListOfPlayers = awaySquadList.querySelectorAll("p");

            squadList(homeTeamLineup, homeListOfPlayers);
            squadList(awayTeamLineup, awayListOfPlayers);
        });

        //---------------------wypełnianie statystyk------------------------------
        lastMatchStats(team.team.name).then(() => {
            const homeStats = stats[0];
            const awayStats = stats[1];

            const homeMatchStats = document.getElementById("homeMatchStats");
            fillUpStats("Home", homeStats);
            const awayMatchStats = document.getElementById("awayMatchStats");
            fillUpStats("Away", awayStats);
        });

        //-----------------------------------------------------------------------
        // -----------------------------------------------------------------------
        teamData.setAttribute("class", "show");
        tableBody.appendChild(teamData);
        tableBody.appendChild(template);

        // --------- koniec obslugi danych w template ----------------------------
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

    const squadStatsBttn = document.querySelectorAll(".squadStatsBttn");
    squadStatsBttn.forEach((squadBttn) => {
        squadBttn.addEventListener("click", (event) => {
            const closestDiv = squadBttn.nextElementSibling;
            changeSectionVisability(closestDiv);
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

    if (dateFormated == "Invalid Date") {
        dateFormated = "No upcoming matches planned yet";
    }
    return dateFormated;
}

function changeSectionVisability(element) {
    const homeSquad = element;
    const awaySquad = homeSquad.nextElementSibling;
    const homeStats = awaySquad.nextElementSibling;
    const awayStats = homeStats.nextElementSibling;
    homeSquad.classList.toggle("invisible");
    awaySquad.classList.toggle("invisible");
    homeStats.classList.toggle("invisible");
    awayStats.classList.toggle("invisible");
}

function squadList(sideLineup, sideList) {
    sideList;
    for (let i = 0; i < 21; i++) {
        if (i < 11) {
            sideList[i].textContent = sideLineup.startXI[i].player.name;
        } else if (i >= 11 && i < 20) {
            if (typeof sideLineup.substitutes[i - 11] === "undefined") {
                sideList[i].textContent = "";
            } else {
                sideList[i].textContent =
                    sideLineup.substitutes[i - 11].player.name;
            }
        } else if (i == 20) {
            sideList[i].textContent = sideLineup.coach.name;
        }
    }
}

function fillUpStats(side, stats) {
    const totalShots = document.getElementById(`totalShots${side}`);
    const onGoal = document.getElementById(`onGoal${side}`);
    const offGoal = document.getElementById(`offGoal${side}`);
    const fouls = document.getElementById(`fouls${side}`);
    const ballPosession = document.getElementById(`ballPosession${side}`);
    const totalPasses = document.getElementById(`totalPasses${side}`);
    const passesPerc = document.getElementById(`passesPerc${side}`);
    const yellowCards = document.getElementById(`yellowCards${side}`);
    const redCards = document.getElementById(`redCards${side}`);

    JSONballPosession =
        stats.statistics[9].value == null ? 0 : stats.statistics[9].value;
    JSONpassesPerc =
        stats.statistics[15].value == null ? 0 : stats.statistics[15].value;
    JSONtotalShots =
        stats.statistics[2].value == null ? 0 : stats.statistics[2].value;
    JSONonGoal =
        stats.statistics[0].value == null ? 0 : stats.statistics[0].value;
    JSONoffGoal =
        stats.statistics[1].value == null ? 0 : stats.statistics[1].value;
    JSONfouls =
        stats.statistics[6].value == null ? 0 : stats.statistics[6].value;
    JSONtotalPasses =
        stats.statistics[13].value == null ? 0 : stats.statistics[13].value;
    JSONyellowCards =
        stats.statistics[10].value == null ? 0 : stats.statistics[10].value;
    JSONredCards =
        stats.statistics[11].value == null ? 0 : stats.statistics[11].value;

    //percentage StatsPost
    ballPosession.style.width = `${JSONballPosession}`;
    passesPerc.style.width = `${JSONpassesPerc}`;
    //numbers  StatsPost
    totalShots.style.width = `${JSONtotalShots}%`;
    onGoal.style.width = `${JSONonGoal}%`;
    offGoal.style.width = `${JSONoffGoal}%`;
    fouls.style.width = `${JSONfouls * 2}%`;
    totalPasses.style.width = `${JSONtotalPasses / 10}%`;
    yellowCards.style.width = `${JSONyellowCards * 2}%`;
    redCards.style.width = `${JSONredCards * 2}%`;

    //percentage StatsText
    ballPosession.textContent = `${JSONballPosession}`;
    passesPerc.textContent = `${JSONpassesPerc}`;
    //numbers  StatsText
    totalShots.textContent = `${JSONtotalShots}`;
    onGoal.textContent = `${JSONonGoal}`;
    offGoal.textContent = `${JSONoffGoal}`;
    fouls.textContent = `${JSONfouls}`;
    totalPasses.textContent = `${JSONtotalPasses}`;
    yellowCards.textContent = `${JSONyellowCards}`;
    redCards.textContent = `${JSONredCards}`;
}
