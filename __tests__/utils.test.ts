import { buildCommentBody, generateCompareUrl, getGhAuth } from "../src/utils";

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

describe("index", () => {
  it("calls run when imported", async () => {
    let modules = { "test_repo.module": "1" };
    let changed_files = {
      "lib/setup.py": "0",
      "lib/test_repo/__init__.py": "1",
      "lib/test_repo/new_file.py": "0",
      "lib/test_repo/utils.py": "0.75",
      "lib/test_repo/module/__init__.py": "1",
      "lib/test_repo/module/file.py": "1",
      "lib/test_repo/module/tests/__init__.py": "1",
      "lib/test_repo/module/tests/test_file.py": "1",
      "lib/test_repo/tests/test_utils.py": "1",
    };
    let actual = buildCommentBody(modules, changed_files);
    let expected =
      "## :white_check_mark: Result of Pytest Coverage\n" +
      "### Results of coverage for the files that changed\n" +
      "| File name | Coverage (%)|\n" +
      "| ------ | ------- |\n" +
      "| `lib/setup.py` | 0% |\n" +
      "| `lib/test_repo/__init__.py` | 100% |\n" +
      "| `lib/test_repo/new_file.py` | 0% |\n" +
      "| `lib/test_repo/utils.py` | 75% |\n" +
      "| `lib/test_repo/module/__init__.py` | 100% |\n" +
      "| `lib/test_repo/module/file.py` | 100% |\n" +
      "| `lib/test_repo/module/tests/__init__.py` | 100% |\n" +
      "| `lib/test_repo/module/tests/test_file.py` | 100% |\n" +
      "| `lib/test_repo/tests/test_utils.py` | 100% |\n\n\n" +
      "### Results of coverage per module\n" +
      "| Module name | Coverage (%)|\n" +
      "| ------ | ------- |\n" +
      "| `test_repo.module` | 100% |\n";
    expect(actual).toBe(expected);
  });
});
