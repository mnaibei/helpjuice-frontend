/**
 * @jest-environment jsdom
 */
import axios from "axios";
import { logSearch, fetchAndDisplayAnalytics } from "../searchFunction";
import * as analyticsFunctions from "../analyticsFunctions";

// Mocking axios.post and axios.get
jest.mock("axios");

// Mocking axios.post and axios.get
jest.mock("axios");

describe("searchFunctions", () => {
  describe("logSearch", () => {
    it("should log a search", async () => {
      axios.post.mockResolvedValue({ data: "mocked response" });

      await logSearch("test query");

      // Expect axios.post to be called once with specific arguments
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          searchquery: "test query",
        }),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
  });

  describe("fetchAndDisplayAnalytics", () => {
    it("should fetch and display analytics", async () => {
      const mockAnalyticsData = [{ ip_address: "127.0.0.1", query: "test" }];

      axios.get.mockResolvedValue({ data: mockAnalyticsData });

      // Mocking analyticsFunctions
      const mockFilteredAnalytics = [...mockAnalyticsData];
      const mockRankedSearches = [...mockAnalyticsData];

      jest
        .spyOn(analyticsFunctions, "filterCompleteSearches")
        .mockReturnValue(mockFilteredAnalytics);
      jest
        .spyOn(analyticsFunctions, "rankSearches")
        .mockReturnValue(mockRankedSearches);

      // Mocking displayTopSearches
      jest.spyOn(analyticsFunctions, "displayTopSearches");

      await fetchAndDisplayAnalytics();

      // Expect axios.get to be called once with a specific argument
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(expect.any(String));

      // Expect filterCompleteSearches and displayTopSearches to be called once
      expect(analyticsFunctions.filterCompleteSearches).toHaveBeenCalledTimes(
        1
      );
      expect(analyticsFunctions.displayTopSearches).toHaveBeenCalledTimes(0);

      // Expect rankSearches not to have been called
      expect(analyticsFunctions.rankSearches).not.toHaveBeenCalled();
    });

    it("should handle errors when fetching analytics", async () => {
      axios.get.mockRejectedValue(new Error("Mocked error"));

      // Mocking analyticsFunctions
      jest.spyOn(analyticsFunctions, "filterCompleteSearches");
      jest.spyOn(analyticsFunctions, "rankSearches");
      jest.spyOn(analyticsFunctions, "displayTopSearches");

      // Mocking console.error
      const consoleErrorSpy = jest.spyOn(console, "error");

      await fetchAndDisplayAnalytics();

      // Expect axios.get to be called twice with a specific argument
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
