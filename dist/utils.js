"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPyChangedFiles = exports.generateCompareUrl = exports.getGhAuth = void 0;
function getGhAuth() {
    // return `Bearer ${process.env.GITHUB_TOKEN}`;
    return `Bearer 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`;
}
exports.getGhAuth = getGhAuth;
function generateCompareUrl(repo_url, base_sha, head_sha) {
    return `${repo_url}/compare/${base_sha.slice(7)}...${head_sha.slice(7)}`;
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
async function publishComment(body, repo_url, pr_number, comment_url = "") {
    let authorization = getGhAuth();
    if (comment_url) {
        console.log("test");
    }
    let url = `${repo_url}/issues/${pr_number}/comments`;
    let result = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ body: body }),
        headers: {
            Authorization: authorization,
        },
    }).then((response) => response.json());
    console.log(result);
}
async function getPyChangedFiles(compare_url) {
    let result = await fetch(compare_url, {
        headers: {
            Authorization: "Bearer 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",
        },
    }).then((response) => response.json());
    let files_changed = result["files"];
    let changed_filenames = [];
    for (let file of files_changed) {
        if (file["filename"].endsWith(".py")) {
            changed_filenames.push(file["filename"]);
        }
    }
    return changed_filenames;
}
exports.getPyChangedFiles = getPyChangedFiles;
let results = getPyChangedFiles("https://api.github.com/repos/loicdiridollou/gha-assign-by-comment/compare/17b1346...c956f1a");
results.then((result) => console.log(result));
// publishComment(
//   "## :white_check_mark: Result of Pytest Coverage\n",
//   "https://api.github.com/repos/loicdiridollou/gha-assign-by-comment",
//   "2",
// );
//
async function findExistingComment(repo_url, pr_number) {
    let url = `${repo_url}/issues/${pr_number}/comments`;
    let authorization = getGhAuth();
    let result = await fetch(url, {
        headers: {
            Authorization: authorization,
        },
    }).then((response) => response.json());
    let comment_header = "## :white_check_mark: Result of Pytest Coverage\n";
    for (let comm in result) {
        if (result[comm]["body"].startsWith(comment_header)) {
            return [true, result[comm]["url"]];
        }
    }
    return [false, ""];
}
findExistingComment("https://api.github.com/repos/loicdiridollou/gha-assign-by-comment", "2").then((results) => console.log(results));
//# sourceMappingURL=utils.js.map