import { truncate } from "../utils/utils.js";
import { formatMenuTitle, getSearchUrl } from "../utils/utils.js";

describe("truncate", () => {
  it("returns the string unchanged if under max length", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });
  it("truncates and adds ... if over max length", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });
  it("returns empty string for non-string input", () => {
    expect(truncate(null, 5)).toBe("");
    expect(truncate(undefined, 5)).toBe("");
    expect(truncate(12345, 5)).toBe("");
  });
  it("handles exact max length", () => {
    expect(truncate("abcdef", 6)).toBe("abcdef");
  });
});

describe("formatMenuTitle", () => {
  it("formats the menu title with emoji, engine, and text", () => {
    expect(formatMenuTitle("GoogleMaps", "🔍", "foo")).toBe(
      "🔍 Search GoogleMaps for 'foo'",
    );
    expect(formatMenuTitle("Amazon", "🛒", "bar")).toBe(
      "🛒 Search Amazon for 'bar'",
    );
  });
});

describe("getSearchUrl", () => {
  it("returns correct Google Maps URL", () => {
    expect(getSearchUrl("searchGoogleMaps", "pizza")).toBe(
      "https://www.google.com/maps/search/?q=pizza",
    );
  });
  it("returns correct AllTrails URL", () => {
    expect(getSearchUrl("searchAllTrails", "hiking")).toBe(
      "https://www.google.com/search?q=site:alltrails.com hiking",
    );
  });
  it("returns correct IMDB URL", () => {
    expect(getSearchUrl("searchIMDB", "star wars")).toBe(
      "https://www.imdb.com/find?q=star%20wars",
    );
  });
  it("returns correct Wikipedia URL", () => {
    expect(getSearchUrl("searchWikipedia", "cats")).toBe(
      "https://en.wikipedia.org/wiki/Special:Search?search=cats",
    );
  });
  it("returns correct YouTube URL", () => {
    expect(getSearchUrl("searchYouTube", "music")).toBe(
      "https://www.youtube.com/results?search_query=music",
    );
  });
  it("returns correct Amazon URL with default domain", () => {
    expect(getSearchUrl("searchAmazon", "shoes")).toBe(
      "https://www.amazon.com/s?k=shoes",
    );
  });
  it("returns correct Amazon URL with custom domain", () => {
    expect(
      getSearchUrl("searchAmazon", "shoes", { amazonDomain: "co.uk" }),
    ).toBe("https://www.amazon.co.uk/s?k=shoes");
  });
  it("returns empty string for unknown engine", () => {
    expect(getSearchUrl("searchUnknown", "foo")).toBe("");
  });
});
