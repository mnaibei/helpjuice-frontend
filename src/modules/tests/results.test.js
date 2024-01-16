/**
 * @jest-environment jsdom
 */

import axios from "axios";
import { fetchAndDisplayAnalytics } from "../results";

it("should fetch analytics data and display it in the searchResults element", async () => {
  const axiosMock = jest.spyOn(axios, "get").mockResolvedValueOnce({
    data: [{ ip_address: "127.0.0.1", query: "test query" }],
  });
  const searchResultsMock = document.createElement("div");
  searchResultsMock.setAttribute("id", "searchResults");
  document.body.appendChild(searchResultsMock);

  const observer = new MutationObserver(() => {
    if (
      searchResultsMock.innerHTML ===
      "<br/> <div>IP: 127.0.0.1 - test query </div>"
    ) {
      observer.disconnect();
      expect(searchResultsMock.innerHTML).toBe(
        "<br/> <div>IP: 127.0.0.1 - test query </div>"
      );

      axiosMock.mockRestore();
      document.body.removeChild(searchResultsMock);
    }
  });

  observer.observe(searchResultsMock, { childList: true });

  fetchAndDisplayAnalytics();
});
