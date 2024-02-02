import fs from "fs";

var convertXMLtoJson = require("xml2js");

export function parse_file(path: string): any {
  let cov_file = fs.readFileSync(path, "utf-8");
  var self: any = "";
  convertXMLtoJson.parseString(cov_file, function (err: Error, results: any) {
    if (err) {
      console.log(err);
    } else {
      self = results;
    }
  });
  return self;
}

export function rebuild_coverage_file(
  json: any,
): [{ [index: string]: string }, { [index: string]: string }] {
  let val = json["coverage"]["packages"][0]["package"];
  let module_cov: { [index: string]: string } = {};
  let file_cov: { [index: string]: string } = {};
  for (let key in val) {
    if (
      !val[key]["$"]["name"].endsWith("tests") &&
      val[key]["$"]["name"] !== "sgm" &&
      val[key]["$"]["name"] !== "."
    ) {
      module_cov[val[key]["$"]["name"]] = val[key]["$"]["line-rate"];
    }
    for (let file of val[key]["classes"][0]["class"]) {
      file_cov["lib/" + file["$"]["filename"]] = file["$"]["line-rate"];
    }
  }
  return [module_cov, file_cov];
}
