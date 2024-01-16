/**
 * @jest-environment jsdom
 */

import axios from "axios";

jest.mock("axios"); // Mock Axios

test("sends a POST request with the search query after a delay", async () => {
  const mockResponse = { data: "Success" };
  axios.post.mockResolvedValue(mockResponse); // Mock successful response

  document.addEventListener("DOMContentLoaded", () => {
    // Your code under test (event listeners and logSearch function)
    const searchInput = document.getElementById("searchInput");
    console.log(searchInput);
    const query = "test query";

    searchInput.value = query;
    searchInput.dispatchEvent(new Event("input"));

    // Wait for the timeout
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "https://helpjuice-search-app.fly.dev/logs/search",
      { searchquery: query },
      { headers: { "Content-Type": "application/json" } }
    );
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
});
