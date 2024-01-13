// searchFunctions.js
import axios from "axios";
import {
  filterCompleteSearches,
  rankSearches,
  displayTopSearches,
} from "./analyticsFunctions";

export function logSearch(query) {
  const url = "https://search-api-2xru.onrender.com/logs/search";
  axios
    .post(
      url,
      { searchquery: query },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => console.error("Error:", error));
}

export function fetchAndDisplayAnalytics() {
  axios
    .get("https://search-api-2xru.onrender.com/search_analytics")
    .then((response) => {
      const analyticsData = response.data;
      console.log(analyticsData);

      // Filtering and displaying only the most complete searches
      const filteredAnalytics = filterCompleteSearches(analyticsData);

      if (filteredAnalytics.length === 0) {
        // If not, display "No analytics at the moment" message
        searchResults.innerHTML = "No analytics at the moment";
      } else {
        // Formatting and displaying filtered searches
        const analyticsContent = filteredAnalytics
          .map(
            (search) =>
              `<br/> <div>IP: ${search.ip_address} - ${search.query} </div>`
          )
          .join("");

        searchResults.innerHTML = analyticsContent;

        // rank searches
        const rankedSearches = rankSearches(filteredAnalytics);

        // Display top searches
        displayTopSearches(rankedSearches);
      }
    })
    .catch((error) => console.log("Error fetching analytics:", error));
}
