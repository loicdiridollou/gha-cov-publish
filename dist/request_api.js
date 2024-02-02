"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPyChangedFiles = void 0;
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
getPyChangedFiles("https://api.github.com/repos/loicdiridollou/gha-assign-by-comment/compare/17b1346...c956f1a").then((response) => console.log(response));
//# sourceMappingURL=request_api.js.map