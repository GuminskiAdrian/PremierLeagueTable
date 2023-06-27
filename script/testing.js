// zapisywanie danych z API do pliku JSOn żeby nie pobierać za każdym ---------------------------razem--------------------------------
const fs = require("fs");
require("dotenv").config();
const apiKey = process.env.APIkey;

function saveAsJSON(data, fileName) {
    const jsonData = JSON.stringify(data);

    fs.writeFile(`../JSONfiles/${fileName}.json`, jsonData, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Dane zostały zapisane do pliku ${fileName}!`);
    });
}
// ---------------------------------------------------------------------------

// ------------------------------URLs-----------------------------------------
// Table
const tableURL =
    "https://api-football-beta.p.rapidapi.com/standings?season=2022&league=39";
// Prev and Next match
const nextMatchUrl =
    "https://api-football-beta.p.rapidapi.com/fixtures?league=39&next=1&team=33";
const prevMatchUrl =
    "https://api-football-beta.p.rapidapi.com/fixtures?league=39&last=5&team=33";

// ---------------------------------------------------------------------------

const options = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "api-football-beta.p.rapidapi.com",
    },
};

// ---------------------------Fetching data-----------------------------------
let table, nextMatch, prevMatch, scores;
async function fetchData() {
    try {
        await fetch(tableURL, options)
            .then((response) => response.json())
            .then((data) => {
                table = data.response[0];
            });

        //------------------------------Testing-----------------------------------
        await table.league.standings[0].forEach((element) => {
            const teamId = element.team.id;
            const teamName = element.team.name;
            // team score
            const teamScore = `https://api-football-beta.p.rapidapi.com/fixtures?season=2022&league=39&team=${teamId}`;
            // Prev and Next match
            const nextMatchUrl = `https://api-football-beta.p.rapidapi.com/fixtures?league=39&next=1&team=${teamId}`;
            const prevMatchUrl = `https://api-football-beta.p.rapidapi.com/fixtures?league=39&last=5&team=${teamId}`;

            fetch(nextMatchUrl, options)
                .then((response) => response.json())
                .then((data) => {
                    nextMatch = data.response[0];
                    if (nextMatch === undefined) {
                        nextMatch = {
                            fixture: {
                                date: "--.--.----",
                                timestamp: "10201021",
                            },
                            teams: {
                                home: {
                                    name: "home team",
                                    logo: "style/icons/unknownTeam.png",
                                },
                                away: {
                                    name: "away team",
                                    logo: "style/icons/unknownTeam.png",
                                },
                            },
                        };
                    }
                });

            fetch(prevMatchUrl, options)
                .then((response) => response.json())
                .then((data) => {
                    prevMatch = data.response;
                })
                .then(() => {
                    const fixtures = {
                        previousMatch: prevMatch,
                        uppcomingMatch: nextMatch,
                    };
                    saveAsJSON(
                        fixtures,
                        `PrevAndNext/${teamName}prevAndNextMatch`
                    );
                });
        });

        //------------------------------Testing-----------------------------------
    } catch (error) {
        console.log(error);
    }
}

// ---------------------------------------------------------------------------
// -----------------------saving data to JSON---------------------------------
fetchData().then(() => {
    saveAsJSON(table, "table");
});
