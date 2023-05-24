const fs = require('fs');

function saveAsJSON(data){
    const jsonData = JSON.stringify(data);
    
    fs.writeFile("../dane.json", jsonData, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Dane zostały zapisane do pliku!");
    });
}

const options = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": "4c8e528503msh645768f10b3a13bp1d992djsn76cea7cfff2c",
        "X-RapidAPI-Host": "api-football-beta.p.rapidapi.com",
    },
};



// !!!!!!!!!!! żeby zapisać aktualną tabele nalezy zakomentowac linijki zawierajace odwołanie do documentu(34, 35-49)!!!!!!!!

fetch(
    "https://api-football-beta.p.rapidapi.com/standings?season=2022&league=39",
    options
)
    .then((response) => response.json())
    .then((data) => {
        saveAsJSON(data.response[0]);
        // const tableBody = document.getElementById("table-body");
        // data.response[0].league.standings[0].forEach((team) => {
        //     const row = document.createElement("tr");
        //     row.innerHTML = `
        //         <td>${team.rank}</td>
        //         <td>${team.team.name}</td>
        //         <td>${team.all.matchsPlayed}</td>
        //         <td>${team.all.win}</td>
        //         <td>${team.all.draw}</td>
        //         <td>${team.all.lose}</td>
        //         <td>${team.all.goalsFor}</td>
        //         <td>${team.all.goalsAgainst}</td>
        //         <td>${team.points}</td>
        //     `;
        //     tableBody.appendChild(row);
        // });
    })
    .catch((error) => console.error(error));
