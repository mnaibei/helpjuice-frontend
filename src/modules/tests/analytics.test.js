/**
 * @jest-environment jsdom
 */

import { rankSearches } from "../analyticsFunctions";

jest.mock("axios");

describe("rankSearches", () => {
  it("ranks searches correctly", () => {
    const searches = ["query1", "query2", "query1", "query3", "query2"];

    const result = rankSearches(searches);

    const expectedResult = [
      { query: "query1", count: 2 },
      { query: "query2", count: 2 },
      { query: "query3", count: 1 },
    ];

    expect(result).toEqual(expectedResult);
  });
});
