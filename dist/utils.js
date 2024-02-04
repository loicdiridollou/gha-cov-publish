"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findExistingComment = exports.getPyChangedFiles = exports.publishCheckRun = exports.publishComment = exports.buildCheckRunBody = exports.buildCommentBody = exports.generateCompareUrl = exports.getGhAuth = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const Icon = {
    good: ":white_check_mark:",
    mid: ":large_orange_diamond:",
    bad: ":x:",
};
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
    if (Object.keys(changed_files).length > 0) {
        body += "### Results of coverage for the files that changed\n";
        body += "| File name | Coverage (%)|\n";
        body += "| ------ | ------- |\n";
        for (let fname in changed_files) {
            body += `| \`${fname}\` | ${Math.round(parseFloat(changed_files[fname]) * 10000) / 100}% |\n`;
        }
        body += "";
    }
    if (Object.keys(modules).length > 0) {
        body += "\n\n";
        body += "### Results of coverage per module\n";
        body += "| Module name | Coverage (%)|\n";
        body += "| ------ | ------- |\n";
        for (let fname in modules) {
            body += `| \`${fname}\` | ${Math.round(parseFloat(modules[fname]) * 10000) / 100}% |\n`;
        }
    }
    return body;
}
exports.buildCommentBody = buildCommentBody;
function buildCheckRunBody(modules, changed_files) {
    let modules_body = "";
    if (Object.keys(modules).length > 0) {
        modules_body += "### Results of coverage per module\n";
        modules_body += "| Module name | Coverage (%)|\n";
        modules_body += "| ------ | ------- |\n";
        for (let fname in modules) {
            let cov = Math.round(parseFloat(modules[fname]) * 10000) / 100;
            let icon = "";
            if (cov > 80) {
                icon = Icon.good;
            }
            else if (cov > 50) {
                icon = Icon.mid;
            }
            else {
                icon = Icon.bad;
            }
            modules_body += `| ${icon} \`${fname}\` | ${cov}% |\n`;
        }
    }
    let changed_files_body = "";
    if (Object.keys(changed_files).length > 0) {
        changed_files_body += "\n\n";
        changed_files_body +=
            "### Results of coverage for the files that changed\n";
        changed_files_body += "| File name | Coverage (%)|\n";
        changed_files_body += "| ------ | ------- |\n";
        for (let fname in changed_files) {
            let cov = Math.round(parseFloat(changed_files[fname]) * 10000) / 100;
            let icon = "";
            if (cov > 80) {
                icon = Icon.good;
            }
            else if (cov > 50) {
                icon = Icon.mid;
            }
            else {
                icon = Icon.bad;
            }
            changed_files_body += `| ${icon} \`${fname}\` | ${cov}% |\n`;
        }
        changed_files_body += "";
    }
    return [changed_files_body, modules_body];
}
exports.buildCheckRunBody = buildCheckRunBody;
async function publishComment(body, repo_url, pr_number, comment_url = "") {
    let authorization = getGhAuth();
    if (comment_url) {
        await (0, cross_fetch_1.default)(comment_url, {
            method: "DELETE",
            headers: {
                Authorization: authorization,
            },
        }).then((response) => response);
    }
    let url = `${repo_url}/issues/${pr_number}/comments`;
    (0, cross_fetch_1.default)(url, {
        method: "POST",
        body: JSON.stringify({ body: body }),
        headers: {
            Authorization: authorization,
        },
    });
}
exports.publishComment = publishComment;
async function publishCheckRun(changed_files_body, modules_body, repo_url, head_sha) {
    let authorization = getGhAuth();
    let url = `${repo_url}/check-runs`;
    let date = new Date(Date.now()).toISOString();
    let body = {
        name: "Coverage Report",
        head_sha: head_sha,
        status: "completed",
        started_at: date,
        conclusion: "success",
        completed_at: date,
        output: {
            title: "Code Coverage Report",
            summary: changed_files_body,
            text: modules_body,
        },
    };
    (0, cross_fetch_1.default)(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            Authorization: authorization,
        },
    });
}
exports.publishCheckRun = publishCheckRun;
async function getPyChangedFiles(compare_url) {
    let authorization = getGhAuth();
    let result = await (0, cross_fetch_1.default)(compare_url, {
        headers: {
            Authorization: authorization,
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