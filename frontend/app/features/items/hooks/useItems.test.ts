import { describe, it, expect } from "vitest";
import { mapItem } from "./useItems";

const apiItem = {
  id: 1,
  name: "Banana",
  image_url: "https://example.com/banana.jpg",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
};

describe("mapItem", () => {
  it("maps image_url to imageUrl and also preserves id, name, and timestamps", () => {
    expect(mapItem(apiItem)).toEqual({
      id: 1,
      name: "Banana",
      imageUrl: "https://example.com/banana.jpg",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    });
  });
});
