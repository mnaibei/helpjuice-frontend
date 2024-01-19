import "../index.css";
const axios = require("axios");
async function displayTopSearches() {
  const url1 = "https://search-api-2xru.onrender.com/logs/history";
  const url2 = "http://localhost:3000/logs/history";
  const url3 = "https://helpjuice-search-app.fly.dev/logs/history";

  const url = url2;
  const response = await axios.get(url);
  console.log(response.data);
  const searches = response.data.history; // Access the 'history' property
  console.log(searches);

  const rankedSearches = rankSearches(searches);

  const topSearchesContent = rankedSearches
    .slice(0, 5)
    .map(
      (search, index) =>
        `<br/> <div> ${index + 1}.  ${search.query} (searches: ${
          search.count
        })</div>`
    )
    .join("");
  const topSearchesContainer = document.getElementById("top-searches");

  topSearchesContainer.innerHTML = topSearchesContent;
}

function rankSearches(searches) {
  const count = searches.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  const rankedSearches = Object.keys(count).map((query) => ({
    query,
    count: count[query],
  }));

  return rankedSearches.sort((a, b) => b.count - a.count);
}

export { rankSearches, displayTopSearches };
