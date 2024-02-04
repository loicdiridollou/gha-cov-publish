import * as core from "@actions/core";
import { parse_file, rebuild_coverage_file } from "./parser";
import {
  buildCommentBody,
  findExistingComment,
  generateCompareUrl,
  getPyChangedFiles,
  publishCheckRun,
  publishComment,
} from "./utils";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // setup environment
    let repo_url = core.getInput("github_url", { required: true });
    let base_sha = core.getInput("base_sha", { required: true });
    let head_sha = core.getInput("head_sha", { required: true });
    let path = core.getInput("path", { required: true });
    let project_name = core.getInput("project_name", { required: true });
    let pr_number = core
      .getInput("github_ref", { required: true })
      .split("/")[2];

    // parse file and rebuild coverage into dict structure
    let json = parse_file(path);
    let [module_cov, file_cov] = rebuild_coverage_file(json, project_name);

    // list changed files in the PR
    let files_changed = await getPyChangedFiles(
      generateCompareUrl(repo_url, base_sha, head_sha),
    );
    let filtered_file_cov: { [index: string]: string } = {};
    for (let file of files_changed) {
      filtered_file_cov[file] = file_cov[file];
    }

    // build comment to be added to the PR
    let body = buildCommentBody(module_cov, filtered_file_cov);
    let [_, comment_url] = await findExistingComment(repo_url, pr_number).then(
      (result) => result,
    );

    // publish comment to the PR discussion
    publishComment(body, repo_url, pr_number, comment_url);

    // publish check run
    publishCheckRun(repo_url, head_sha);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
