"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuild_coverage_file = exports.parse_file = void 0;
const fs_1 = __importDefault(require("fs"));
var convertXMLtoJson = require("xml2js");
function parse_file(path) {
    let cov_file = fs_1.default.readFileSync(path, "utf-8");
    var self = "";
    convertXMLtoJson.parseString(cov_file, function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            self = results;
        }
    });
    return self;
}
exports.parse_file = parse_file;
function rebuild_coverage_file(json) {
    let val = json["coverage"]["packages"][0]["package"];
    let module_cov = {};
    let file_cov = {};
    for (let key in val) {
        if (!val[key]["$"]["name"].endsWith("tests") &&
            val[key]["$"]["name"] !== "sgm" &&
            val[key]["$"]["name"] !== ".") {
            module_cov[val[key]["$"]["name"]] = val[key]["$"]["line-rate"];
        }
        for (let file of val[key]["classes"][0]["class"]) {
            file_cov["lib/" + file["$"]["filename"]] = file["$"]["line-rate"];
        }
    }
    return [module_cov, file_cov];
}
exports.rebuild_coverage_file = rebuild_coverage_file;
//# sourceMappingURL=parser.js.map