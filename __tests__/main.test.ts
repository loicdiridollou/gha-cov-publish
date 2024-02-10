/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as main from "../src/main";
import * as core from "@actions/core";
import * as parser from "../src/parser";
import * as utils from "../src/utils";

describe("run", () => {
  beforeEach(() => {
    // Clear all mock function calls and reset mock implementation
    jest.clearAllMocks();
  });

  it("should add label to the pull request", async () => {
    // Mock the return values for getInput
    const getInputSpy = jest
      .spyOn(core, "getInput")
      .mockImplementation((name, _) => {
        switch (name) {
          case "github_url":
            return "https://github.com/api/v3";
          case "path":
            return "./coverage.xml";
          case "base_sha":
            return "vtu4839ptv283ty";
          case "head_sha":
            return "ngireognjioergr";
          case "project_name":
            return "test_repo";
          case "github_ref":
            return "refs/pulls/3";
          default:
            return "";
        }
      });

    const setFailedSpy = jest.spyOn(core, "setFailed");
    const parseFileSpy = jest.spyOn(parser, "parseFile");

    // Run the function
    await main.run();

    // Assertions
    expect(getInputSpy).toHaveBeenCalledTimes(6);
    expect(parseFileSpy).toHaveBeenCalled();
    expect(setFailedSpy).not.toHaveBeenCalled();
  });
});
