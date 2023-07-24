interface geoData {
  teams: string;
  venue: string;
  postCode: string;
  geoJson: string;

  // Other properties if needed
}
interface countryData {
  country: string;
  name: string;
  id: string;
}
async function footballAreas() {
  "use server";
  console.log("fetching.....");
  const headers = {
    "X-Auth-Token": "07948112c7f542e9bb7b7b45c073ca35",
  };
  const footballRes = await fetch("http://api.football-data.org/v4/areas", {
    headers,
  });
  const footballResData = await footballRes.json();

  const countries = footballResData.areas
    .filter((country: countryData) =>
      ["England", "Wales", "Scotland", "Northern Ireland"].includes(
        country.name
      )
    )
    .map((code: countryData) => code.id)
    .toString();
  // finding all competitions in filtered countries
  const countriesList = await footballCompetitions(countries);
  const teamsList = await footballTeams(countriesList);

  // dont leave this here need to correct type
  const geoCodeInfo: any = await geoCodingTeamsData(teamsList);
  const finalGeoJSONData = await addGeoData(geoCodeInfo);

  return { geoJSON: finalGeoJSONData, sideBar: geoCodeInfo };
}
async function footballCompetitions(countries: string) {
  "use server";

  const headers = {
    "X-Auth-Token": "07948112c7f542e9bb7b7b45c073ca35",
  };
  const footballCompRes = await fetch(
    `http://api.football-data.org/v4/competitions/?areas=${countries}`,
    {
      headers,
    }
  );
  const footballCompResData = await footballCompRes.json();
  return footballCompResData.competitions.map((input: any) => input.code);
}

async function footballTeams(teams: geoData[]) {
  "use server";

  const teamsData = [];
  const headers = {
    "X-Auth-Token": "07948112c7f542e9bb7b7b45c073ca35",
  };

  for (const team of teams) {
    const footballTeamRes = await fetch(
      `http://api.football-data.org/v4/competitions/${team}/teams`,
      {
        headers,
      }
    );
    const footballTeamResData = await footballTeamRes.json();
    teamsData.push(footballTeamResData);
  }

  return teamsData;
}
// function which will be used for map interactivity
async function geoCodingTeamsData(teams: geoData[]) {
  "use server";

  const teamsAddressData = teams.flatMap((res) => res.teams);

  return teamsAddressData;
}

async function addGeoData(teams: geoData[]) {
  "use server";
  const newArray = [];
  for (const area of teams) {
    const footballTeamRes = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${area.venue}.json?access_token=sk.eyJ1IjoibmF0aGFuYWRvbHBodXNzaGF3IiwiYSI6ImNsa2ZvdG1jNjBpYXgzZXFzMGFrNDI1Nm0ifQ.tUxZh9s-CzVO-X8b66-aDw&country=GB`
    );
    const data = await footballTeamRes.json();
    // area.postCode += data.features;

    newArray.push(data);
  }
  const flatGeoMap = newArray.map((i) => i.features[0]);

  return flatGeoMap;
}

export async function crimeByLocation(currentFeature: string[], date: string) {
  "use server";
  const longitude = currentFeature[0];
  const latitude = currentFeature[1];

  const postCode = await fetch(
    `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}`
  );
  const data = await postCode.json();

  return data;
}
export default footballAreas;
