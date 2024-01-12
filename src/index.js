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
    const completeQueryPattern = /^[\w\s]+[.?\s]*$/;
    const minimumWords = 2;
    const forbiddenCharacters = ["@", "#", "$", "%", "^", "&", "*"];
    const disallowedEndings = [
      "b",
      "c",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "m",
      "n",
      "p",
      "q",
      "r",
      "s",
      "t",
      "v",
      "w",
      "x",
      "y",
      "z",
      "a",
      "e",
      "o",
    ];

    // Checking if the query matches the pattern and has more than 5 characters
    const isPatternMatch =
      completeQueryPattern.test(query.trim()) && query.trim().length > 5;

    // Checking if the query contains the minimum number of words
    const isMinimumWords = query.trim().split(" ").length >= minimumWords;

    // Checking if the query does not contain any forbidden characters
    const noForbiddenCharacters = !forbiddenCharacters.some((char) =>
      query.includes(char)
    );

    // Checking if the last word of the query is a single character and does not end with a disallowed character
    const words = query.trim().split(" ");
    const lastWord = words[words.length - 1];
    const isSingleChar = lastWord.length === 1;
    const lastChar = lastWord.toLowerCase();
    const isAllowedEnding = !disallowedEndings.includes(lastChar);

    return (
      isPatternMatch &&
      isMinimumWords &&
      noForbiddenCharacters &&
      (!isSingleChar || isAllowedEnding)
    );
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
    const uniqueQueries = Array.from(
      new Set(searches.map((search) => search.query))
    );

    const queryCounts = {};
    searches.forEach((search) => {
      const { query } = search;
      queryCounts[query] = (queryCounts[query] || 0) + 1;
    });

    const rankedSearches = uniqueQueries.map((query) => ({
      query,
      count: queryCounts[query],
    }));

    return rankedSearches.sort((a, b) => b.count - a.count);
  }

  function displayTopSearches(searches) {
    const topSearchesContent = searches
      .slice(0, 5)
      .map(
        (search, index) =>
          `<br/> <div> ${index + 1}.  ${search.query} (searches: ${
            search.count
          })</div>`
      )
      .join("");

    topSearchesContainer.innerHTML = topSearchesContent;
  }

  fetchAndDisplayAnalytics();
});
