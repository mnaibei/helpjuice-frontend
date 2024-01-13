/**
 * @jest-environment jsdom
 */
import {
  filterCompleteSearches,
  rankSearches,
  displayTopSearches,
} from "../analyticsFunctions";

describe("filterCompleteSearches", () => {
  it("should filter complete searches", () => {
    const analyticsData = [
      { id: 213, ip_address: "::1", query: "what is the weather like today" },
      { id: 216, ip_address: "::1", query: "it is beautiful outside" },
      { id: 215, ip_address: "::1", query: "hello good morning" },
    ];

    const result = filterCompleteSearches(analyticsData);

    expect(result).toHaveLength(3); // All three searches are complete
  });

  it("should handle empty input", () => {
    const result = filterCompleteSearches([]);
    expect(result).toHaveLength(0);
  });
});

describe("rankSearches", () => {
  it("should rank searches by count", () => {
    const searches = [
      { query: "orange", count: 7 },
      { query: "apple", count: 5 },
      { query: "banana", count: 3 },
    ];

    const result = rankSearches(searches);

    expect(result).toHaveLength(3);
    expect(result[0].query).toBe("orange");
    expect(result[1].query).toBe("apple");
    expect(result[2].query).toBe("banana");
  });

  it("should handle empty input", () => {
    const result = rankSearches([]);
    expect(result).toHaveLength(0);
  });
});

describe("displayTopSearches", () => {
  beforeEach(() => {
    // Setting up a simple HTML fixture with the container element
    document.body.innerHTML = '<div id="top-searches"></div>';
  });

  it("should display top searches", () => {
    const searches = [
      { query: "apple", count: 5 },
      { query: "banana", count: 3 },
      { query: "orange", count: 7 },
    ];

    displayTopSearches(searches);

    const topSearchesContainer = document.getElementById("top-searches");

    expect(topSearchesContainer.innerHTML).toContain("orange");
    expect(topSearchesContainer.innerHTML).toContain("apple");
    expect(topSearchesContainer.innerHTML).toContain("banana");
  });
  it("should handle empty input", () => {
    document.body.innerHTML = '<div id="top-searches"></div>';

    displayTopSearches([]);

    const topSearchesContainer = document.getElementById("top-searches");

    expect(topSearchesContainer.innerHTML).toBe("");
  });
});
