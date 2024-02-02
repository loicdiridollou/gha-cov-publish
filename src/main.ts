import * as core from "@actions/core";
import { parse_file, rebuild_coverage_file } from "./parser";
import { generateCompareUrl, getPyChangedFiles } from "./utils";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    let json = parse_file("coverage311.xml");
    let [module_cov, file_cov] = rebuild_coverage_file(json);
    console.log(module_cov, file_cov);
    let repo_url = process.env.GITHUB_URL as string;
    let base_sha = process.env.BASE_SHA as string;
    let head_sha = process.env.HEAD_SHA as string;
    let files_changed = await getPyChangedFiles(
      generateCompareUrl(repo_url, base_sha, head_sha),
    );
    let filtered_file_cov: { [index: string]: string } = {};
    for (let file of files_changed) {
      filtered_file_cov[file] = file_cov[file];
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
