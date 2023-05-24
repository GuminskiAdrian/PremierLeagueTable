// zapisywanie danych z API do pliku JSOn żeby nie pobierać za każdym ---------------------------razem--------------------------------
const fs = require('fs');

function saveAsJSON(data){
    const jsonData = JSON.stringify(data);
    
    fs.writeFile("../wynikiUnited.json", jsonData, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Dane zostały zapisane do pliku!");
    });
}
// ---------------------------------------------------------------------------

// ---fetchowanie danych i zapisanie ich do pliku JSON-------------------------
const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "4c8e528503msh645768f10b3a13bp1d992djsn76cea7cfff2c",
      "X-RapidAPI-Host": "api-football-beta.p.rapidapi.com",
    },
  };

  fetch(
    "https://api-football-beta.p.rapidapi.com/fixtures?season=2022&league=39&team=33",
    options
  )
    .then((response) => response.json())
    .then((data) => {
        saveAsJSON(data);
    })
    .catch((error) => console.error(error));
// ---------------------------------------------------------------------------