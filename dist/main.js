"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const parser_1 = require("./parser");
const utils_1 = require("./utils");
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
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
        let json = (0, parser_1.parse_file)(path);
        let [module_cov, file_cov] = (0, parser_1.rebuild_coverage_file)(json, project_name);
        // list changed files in the PR
        let files_changed = await (0, utils_1.getPyChangedFiles)((0, utils_1.generateCompareUrl)(repo_url, base_sha, head_sha));
        let filtered_file_cov = {};
        for (let file of files_changed) {
            filtered_file_cov[file] = file_cov[file];
        }
        // build comment to be added to the PR
        let body = (0, utils_1.buildCommentBody)(module_cov, filtered_file_cov);
        let [_, comment_url] = await (0, utils_1.findExistingComment)(repo_url, pr_number).then((result) => result);
        // publish comment to the PR discussion
        (0, utils_1.publishComment)(body, repo_url, pr_number, comment_url);
        // publish check run
        (0, utils_1.publishCheckRun)(body, repo_url, head_sha);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;
//# sourceMappingURL=main.js.map