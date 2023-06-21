// zapisywanie danych z API do pliku JSOn żeby nie pobierać za każdym ---------------------------razem--------------------------------
const fs = require("fs");
const { type } = require("os");

function saveAsJSON(data) {
    const jsonData = JSON.stringify(data);

    fs.writeFile("../prevAndNextMatch.json", jsonData, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Dane zostały zapisane do pliku!");
    });
}
// ---------------------------------------------------------------------------

// --URL endpointów poprzedniego i następnego meczu i metody pobierania------
const nextMatchUrl =
    "https://api-football-beta.p.rapidapi.com/fixtures?league=39&next=1&team=33";
const prevMatchUrl =
    "https://api-football-beta.p.rapidapi.com/fixtures?league=39&last=5&team=33";
const options = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": "4c8e528503msh645768f10b3a13bp1d992djsn76cea7cfff2c",
        "X-RapidAPI-Host": "api-football-beta.p.rapidapi.com",
    },
};
// ---------------------------------------------------------------------------

let nextMatch, prevMatch;

// -------fetchowanie i przypisywanie pobranych danych do zmiennych-----------
async function fetchData() {
    try {
        await fetch(nextMatchUrl, options)
            .then((response) => response.json())
            .then((data) => {
                nextMatch = data.response[0];
                if (nextMatch === undefined) {
                    nextMatch = {
                        fixture: { date: "--.--.----", timestamp: "10201021" },
                        teams: {
                            home: { name: "home team", logo: "style/icons/unknownTeam.png" },
                            away: { name: "away team", logo: "style/icons/unknownTeam.png" },
                        },
                    };
                }
            });

        await fetch(prevMatchUrl, options)
            .then((response) => response.json())
            .then((data) => {
                prevMatch = data.response;
            });
    } catch (error) {
        console.log(error);
    }
}
// ---------------------------------------------------------------------------

// ------połącznie pobranych danych w jeden obiekt i zapisanie do pliku--------
fetchData().then(() => {
    const fixtures = { previousMatch: prevMatch, uppcomingMatch: nextMatch };
    saveAsJSON(fixtures);
});
// ---------------------------------------------------------------------------
