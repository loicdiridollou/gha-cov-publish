import { generateCompareUrl, getGhAuth } from "../src/utils";

describe("Getting Github Authentication", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("will receive process.env variables", () => {
    // Set the variables
    process.env.GITHUB_TOKEN = "mock_token";

    expect(getGhAuth()).toBe("Bearer mock_token");
  });
});

describe("index", () => {
  it("calls run when imported", async () => {
    let url = "https://github_server.com";
    let base_sha = "a49e59132f05a379684e8d2d6305093e87aee732";
    let head_sha = "080f3c4002fe16cfbbb4662c73e1f9e4a05c5841";

    let expected = "https://github_server.com/compare/a49e591...080f3c4";

    expect(generateCompareUrl(url, base_sha, head_sha)).toBe(expected);
  });
});
