import axios from "axios";
import { displayTopSearches } from "./analyticsFunctions";

const searchResults = document.getElementById("searchResults");

async function fetchAndDisplayAnalytics() {
  searchResults.innerHTML = "Server spooling, please wait...";
  try {
    const url1 = "https://search-api-2xru.onrender.com/search_analytics";
    const url2 = "http://localhost:3000/search_analytics";
    const url3 = "https://helpjuice-search-app.fly.dev/search_analytics";

    const url = url3;
    const response = await axios.get(url);
    const analyticsData = response.data;
    console.log(analyticsData);

    // Formatting and displaying all searches
    const analyticsContent = analyticsData
      .map(
        (search) =>
          `<br/> <div>IP: ${search.ip_address} - ${search.query} </div>`
      )
      .join("");

    searchResults.innerHTML = analyticsContent;

    // Display top searches
    displayTopSearches(analyticsData);
  } catch (error) {
    console.log("Error fetching analytics:", error);
  }
}

fetchAndDisplayAnalytics();
