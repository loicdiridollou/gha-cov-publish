"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findExistingComment = exports.getPyChangedFiles = exports.publishComment = exports.buildCommentBody = exports.generateCompareUrl = exports.getGhAuth = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
function getGhAuth() {
    return `Bearer ${process.env.GITHUB_TOKEN}`;
}
exports.getGhAuth = getGhAuth;
function generateCompareUrl(repo_url, base_sha, head_sha) {
    return `${repo_url}/compare/${base_sha.slice(0, 7)}...${head_sha.slice(0, 7)}`;
}
exports.generateCompareUrl = generateCompareUrl;
function buildCommentBody(modules, changed_files) {
    let body = "## :white_check_mark: Result of Pytest Coverage\n";
    if (Object.keys(modules).length > 0) {
        body += "### Results of coverage per module\n";
        body += "| Module name | Coverage (%)|\n";
        body += "| ------ | ------- |\n";
        for (let fname in modules) {
            body += `| ${fname} | ${Math.round(parseFloat(modules[fname]) * 10000) / 100}% |\n`;
        }
    }
    if (Object.keys(changed_files).length > 0) {
        body += "\n\n";
        body += "### Results of coverage for the files that changed\n";
        body += "| File name | Coverage (%)|\n";
        body += "| ------ | ------- |\n";
        for (let fname in changed_files) {
            body += `| ${fname} | ${Math.round(parseFloat(changed_files[fname]) * 10000) / 100}% |\n`;
        }
        body += "";
    }
    return body;
}
exports.buildCommentBody = buildCommentBody;
async function publishComment(body, repo_url, pr_number, comment_url = "") {
    let authorization = getGhAuth();
    console.log(comment_url);
    if (comment_url) {
        console.log("Deleting comment", comment_url);
        await (0, cross_fetch_1.default)(comment_url, {
            method: "DELETE",
            headers: {
                Authorization: authorization,
            },
        }).then((response) => response);
    }
    let url = `${repo_url}/issues/${pr_number}/comments`;
    createComment(url, body);
}
exports.publishComment = publishComment;
function createComment(url, body) {
    console.log("Called sync");
    let authorization = getGhAuth();
    (0, cross_fetch_1.default)(url, {
        method: "POST",
        body: JSON.stringify({ body: body }),
        headers: {
            Authorization: authorization,
        },
    });
}
async function getPyChangedFiles(compare_url) {
    let authorization = getGhAuth();
    console.log(compare_url);
    let result = await (0, cross_fetch_1.default)(compare_url, {
        headers: {
            Authorization: authorization,
        },
    }).then((response) => response.json());
    console.log(result);
    let files_changed = result["files"];
    console.log(files_changed);
    console.log(typeof files_changed);
    let changed_filenames = [];
    for (let file of files_changed) {
        if (file["filename"].endsWith(".py")) {
            changed_filenames.push(file["filename"]);
        }
    }
    return changed_filenames;
}
exports.getPyChangedFiles = getPyChangedFiles;
async function findExistingComment(repo_url, pr_number) {
    let url = `${repo_url}/issues/${pr_number}/comments`;
    let authorization = getGhAuth();
    let result = await (0, cross_fetch_1.default)(url, {
        headers: {
            Authorization: authorization,
        },
    }).then((response) => response.json());
    let comment_header = "## :white_check_mark: Result of Pytest Coverage\n";
    for (let comm in result) {
        if (result[comm]["body"].startsWith(comment_header) &&
            result[comm]["user"]["login"] == "github-actions[bot]") {
            return [true, result[comm]["url"]];
        }
    }
    return [false, ""];
}
exports.findExistingComment = findExistingComment;
//# sourceMappingURL=utils.js.map