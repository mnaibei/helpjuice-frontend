import axios from "axios";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const topSearchesContainer = document.getElementById("top-searches");
  let delayTimeout = null;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value;

    // Delay the request using setTimeout
    clearTimeout(delayTimeout); // Clear any existing timeout
    delayTimeout = setTimeout(() => {
      logSearch(query);
      fetchAndDisplayAnalytics();
    }, 3000); // Delay for 3000ms (3 seconds)
  });

  function logSearch(query) {
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

  function fetchAndDisplayAnalytics() {
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

          // Calculate completeness scores and rank searches
          const rankedSearches = rankSearches(filteredAnalytics);

          // Display top searches
          displayTopSearches(rankedSearches);
        }
      })
      .catch((error) => console.error("Error fetching analytics:", error));
  }

  function isCompleteSearch(query) {
    const completeQueryPattern = /^[\w\s]+(\s|\?)$/;

    return completeQueryPattern.test(query);
  }

  function filterCompleteSearches(analyticsData) {
    const completeSearches = {};

    analyticsData.forEach((search) => {
      const currentSearches = completeSearches[search.ip_address] || [];

      // Check for completeness based on regex pattern
      if (isCompleteSearch(search.query)) {
        currentSearches.push(search);
        completeSearches[search.ip_address] = currentSearches;
      }
    });

    return Object.values(completeSearches).flat(); // Combine all complete searches
  }

  function rankSearches(searches) {
    const queryCounts = {};

    searches.forEach((search) => {
      const { query } = search;
      queryCounts[query] = (queryCounts[query] || 0) + 1;
    });

    const rankedSearches = searches.map((search) => ({
      ...search,
      count: queryCounts[search.query],
    }));

    return rankedSearches.sort((a, b) => b.count - a.count);
  }

  function displayTopSearches(searches) {
    const topSearchesContent = searches
      .slice(0, 5)
      .map(
        (search) =>
          `<br/> <div>IP: ${search.ip_address} - ${search.query} (Count: ${search.count})</div>`
      )
      .join("");

    topSearchesContainer.innerHTML = topSearchesContent;
  }

  fetchAndDisplayAnalytics();
});
