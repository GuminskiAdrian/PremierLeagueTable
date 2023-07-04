// zapisywanie danych z API do pliku JSOn żeby nie pobierać za każdym ---------------------------razem--------------------------------
const { match } = require("assert");
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

// ---------------------------------------------------------------------------

const options = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "api-football-beta.p.rapidapi.com",
    },
};

// ---------------------------Fetching data-----------------------------------
let table, nextMatch, prevMatch, lineup, matchStatistics;
async function fetchData() {
    try {
        await fetch(tableURL, options)
            .then((response) => response.json())
            .then((data) => {
                table = data.response[0];
            });

        await table.league.standings[0].forEach((element) => {
            const teamId = element.team.id;
            const teamName = element.team.name;
            // team score
            const teamScore = `https://api-football-beta.p.rapidapi.com/fixtures?season=2022&league=39&team=${teamId}`;
            // Prev and Next match
            const nextMatchUrl = `https://api-football-beta.p.rapidapi.com/fixtures?league=39&next=1&team=${teamId}`;
            const prevMatchUrl = `https://api-football-beta.p.rapidapi.com/fixtures?league=39&last=5&team=${teamId}`;

            const fixtures = {
                uppcomingMatch: undefined,
                previousMatch: undefined,
            };

            fetch(nextMatchUrl, options)
                .then((response) => response.json())
                .then((data) => {
                    nextMatch = data.response[0];
                    fixtures.uppcomingMatch = nextMatch;
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
                })
                .then(() => {
                    fetch(prevMatchUrl, options)
                        .then((response) => response.json())
                        .then((data) => {
                            prevMatch = data.response;
                        })
                        .then(() => {
                            fixtures.previousMatch = prevMatch;
                            saveAsJSON(
                                fixtures,
                                `PrevAndNext/${teamName}prevAndNextMatch`
                            );
                        })
                        .then(() => {
                            const lineupURL = `https://api-football-beta.p.rapidapi.com/fixtures/lineups?fixture=${fixtures.previousMatch[0].fixture.id}`;
                            fetch(lineupURL, options)
                                .then((response) => response.json())
                                .then((data) => {
                                    lineup = data.response;
                                })
                                .then(() => {
                                    saveAsJSON(
                                        lineup,
                                        `lastGameSquads/lastGame${teamName}Squad`
                                    );
                                });
                        })
                        .then(() => {
                            const statsURL = `https://api-football-beta.p.rapidapi.com/fixtures/statistics?fixture=${fixtures.previousMatch[0].fixture.id}`;
                            fetch(statsURL, options)
                                .then((response) => response.json())
                                .then((data) => {
                                    matchStatistics = data.response;
                                })
                                .then(() => {
                                    saveAsJSON(
                                        matchStatistics,
                                        `matchStatistics/matchStats${teamName}`
                                    );
                                });
                        });
                });
        });

        //------------------------------Testing-----------------------------------
        

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
