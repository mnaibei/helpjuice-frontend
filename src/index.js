import { logSearch, fetchAndDisplayAnalytics } from "./modules/searchFunction";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

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

  fetchAndDisplayAnalytics();
});
