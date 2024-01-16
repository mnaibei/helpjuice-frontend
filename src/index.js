import axios from "axios";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  let delayTimeout = null;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value;

    // Clear any existing timeout
    clearTimeout(delayTimeout);

    // Set a new timeout
    delayTimeout = setTimeout(() => {
      logSearch(query);
    }, 1000); // Delay for 1000ms (1 second)
  });

  function logSearch(query) {
    const url1 = "https://search-api-2xru.onrender.com/logs/search";
    const url2 = "http://localhost:3000/logs/search";
    const url3 = "https://helpjuice-search-app.fly.dev/logs/search";
    const url = url3;

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
});
