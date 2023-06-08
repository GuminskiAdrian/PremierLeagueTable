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
                // tutaj nic nie ma ponieważ plik JSON nie jest przygotowany na
                // automatyczne uzupełnienie jeśli skończył się sezon
            } else {
                let dateFormated = matches.previousMatch[i-1].fixture.date;
                dateFormated = new Date(dateFormated);

                const options = {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                };

                dateFormated = dateFormated.toLocaleDateString("en-GB", options).split('/').join('.');
                date.textContent = `${dateFormated}`
                
            }
        }

        // -----------------------------------------------------------------------
        teamData.setAttribute("class", "show");
        tableBody.appendChild(teamData);
        tableBody.appendChild(template);
    });
    // ---------------------------------------------------------------------------

    // --------- poprzednie mecze ------------------------------------ -----------
    // for (let i = 0; i < 5; i++) {
    //     console.log(
    //         `${matches.previousMatch[i].teams.home.name} ${matches.previousMatch[i].score.fulltime.home} : ${matches.previousMatch[i].score.fulltime.away} ${matches.previousMatch[i].teams.away.name}`
    //     );
    // }
    //---------------------------------------------------------------------------
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
