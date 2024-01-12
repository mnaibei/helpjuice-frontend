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
      { ip_address: "127.0.0.1", query: "Complete search" },
      { ip_address: "127.0.0.2", query: "Incomplete @search" },
    ];

    const result = filterCompleteSearches(analyticsData);

    expect(result).toHaveLength(1);
    expect(result[0].query).toBe("Complete search");
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
