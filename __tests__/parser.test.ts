/**
 * Unit tests for the action's parser, src/parser.ts
 */

import { parseFile, rebuildCoverageFile } from "../src/parser";

describe("file parsing", () => {
  it("Ensure file parsing is correct given an xml file", async () => {
    let expected =
      '{"coverage":{"$":{"version":"7.4.1","timestamp":"1707085342228","lines-valid":"1' +
      '9","lines-covered":"11","line-rate":"0.5789","branches-covered":"0","branches-va' +
      'lid":"0","branch-rate":"0","complexity":"0"},"sources":[{"source":["/Users/loic.' +
      'diridollou/Documents/Code/test-repo/lib"]}],"packages":[{"package":[{"$":{"name"' +
      ':".","line-rate":"0","branch-rate":"0","complexity":"0"},"classes":[{"class":[{"' +
      '$":{"name":"setup.py","filename":"setup.py","complexity":"0","line-rate":"0","br' +
      'anch-rate":"0"},"methods":[""],"lines":[{"line":[{"$":{"number":"9","hits":"0"}}' +
      ',{"$":{"number":"12","hits":"0"}},{"$":{"number":"14","hits":"0"}},{"$":{"number' +
      '":"22","hits":"0"}}]}]}]}]},{"$":{"name":"test_repo","line-rate":"0.4286","branc' +
      'h-rate":"0","complexity":"0"},"classes":[{"class":[{"$":{"name":"__init__.py","f' +
      'ilename":"test_repo/__init__.py","complexity":"0","line-rate":"1","branch-rate":' +
      '"0"},"methods":[""],"lines":[""]},{"$":{"name":"new_file.py","filename":"test_re' +
      'po/new_file.py","complexity":"0","line-rate":"0","branch-rate":"0"},"methods":["' +
      '"],"lines":[{"line":[{"$":{"number":"1","hits":"0"}},{"$":{"number":"4","hits":"' +
      '0"}},{"$":{"number":"6","hits":"0"}}]}]},{"$":{"name":"utils.py","filename":"tes' +
      't_repo/utils.py","complexity":"0","line-rate":"0.75","branch-rate":"0"},"methods' +
      '":[""],"lines":[{"line":[{"$":{"number":"1","hits":"1"}},{"$":{"number":"2","hit' +
      's":"1"}},{"$":{"number":"5","hits":"1"}},{"$":{"number":"6","hits":"0"}}]}]}]}]}' +
      ',{"$":{"name":"test_repo.module","line-rate":"1","branch-rate":"0","complexity":' +
      '"0"},"classes":[{"class":[{"$":{"name":"__init__.py","filename":"test_repo/modul' +
      'e/__init__.py","complexity":"0","line-rate":"1","branch-rate":"0"},"methods":[""' +
      '],"lines":[""]},{"$":{"name":"file.py","filename":"test_repo/module/file.py","co' +
      'mplexity":"0","line-rate":"1","branch-rate":"0"},"methods":[""],"lines":[{"line"' +
      ':[{"$":{"number":"1","hits":"1"}},{"$":{"number":"2","hits":"1"}}]}]}]}]},{"$":{' +
      '"name":"test_repo.module.tests","line-rate":"1","branch-rate":"0","complexity":"' +
      '0"},"classes":[{"class":[{"$":{"name":"__init__.py","filename":"test_repo/module' +
      '/tests/__init__.py","complexity":"0","line-rate":"1","branch-rate":"0"},"methods' +
      '":[""],"lines":[""]},{"$":{"name":"test_file.py","filename":"test_repo/module/te' +
      'sts/test_file.py","complexity":"0","line-rate":"1","branch-rate":"0"},"methods":' +
      '[""],"lines":[{"line":[{"$":{"number":"1","hits":"1"}},{"$":{"number":"4","hits"' +
      ':"1"}},{"$":{"number":"5","hits":"1"}}]}]}]}]},{"$":{"name":"test_repo.tests","l' +
      'ine-rate":"1","branch-rate":"0","complexity":"0"},"classes":[{"class":[{"$":{"na' +
      'me":"test_utils.py","filename":"test_repo/tests/test_utils.py","complexity":"0",' +
      '"line-rate":"1","branch-rate":"0"},"methods":[""],"lines":[{"line":[{"$":{"numbe' +
      'r":"3","hits":"1"}},{"$":{"number":"6","hits":"1"}},{"$":{"number":"8","hits":"1' +
      '"}}]}]}]}]}]}]}}';
    let actual = parseFile("./__tests__/coverage.xml");
    expect(JSON.stringify(actual)).toBe(expected);
  });
});

describe("file parsing", () => {
  it("Ensure file parsing is correct given an xml file", async () => {
    let json_input =
      '{"coverage":{"$":{"version":"7.4.1","timestamp":"1707085342228","lines-valid":"1' +
      '9","lines-covered":"11","line-rate":"0.5789","branches-covered":"0","branches-va' +
      'lid":"0","branch-rate":"0","complexity":"0"},"sources":[{"source":["/Users/loic.' +
      'diridollou/Documents/Code/test-repo/lib"]}],"packages":[{"package":[{"$":{"name"' +
      ':".","line-rate":"0","branch-rate":"0","complexity":"0"},"classes":[{"class":[{"' +
      '$":{"name":"setup.py","filename":"setup.py","complexity":"0","line-rate":"0","br' +
      'anch-rate":"0"},"methods":[""],"lines":[{"line":[{"$":{"number":"9","hits":"0"}}' +
      ',{"$":{"number":"12","hits":"0"}},{"$":{"number":"14","hits":"0"}},{"$":{"number' +
      '":"22","hits":"0"}}]}]}]}]},{"$":{"name":"test_repo","line-rate":"0.4286","branc' +
      'h-rate":"0","complexity":"0"},"classes":[{"class":[{"$":{"name":"__init__.py","f' +
      'ilename":"test_repo/__init__.py","complexity":"0","line-rate":"1","branch-rate":' +
      '"0"},"methods":[""],"lines":[""]},{"$":{"name":"new_file.py","filename":"test_re' +
      'po/new_file.py","complexity":"0","line-rate":"0","branch-rate":"0"},"methods":["' +
      '"],"lines":[{"line":[{"$":{"number":"1","hits":"0"}},{"$":{"number":"4","hits":"' +
      '0"}},{"$":{"number":"6","hits":"0"}}]}]},{"$":{"name":"utils.py","filename":"tes' +
      't_repo/utils.py","complexity":"0","line-rate":"0.75","branch-rate":"0"},"methods' +
      '":[""],"lines":[{"line":[{"$":{"number":"1","hits":"1"}},{"$":{"number":"2","hit' +
      's":"1"}},{"$":{"number":"5","hits":"1"}},{"$":{"number":"6","hits":"0"}}]}]}]}]}' +
      ',{"$":{"name":"test_repo.module","line-rate":"1","branch-rate":"0","complexity":' +
      '"0"},"classes":[{"class":[{"$":{"name":"__init__.py","filename":"test_repo/modul' +
      'e/__init__.py","complexity":"0","line-rate":"1","branch-rate":"0"},"methods":[""' +
      '],"lines":[""]},{"$":{"name":"file.py","filename":"test_repo/module/file.py","co' +
      'mplexity":"0","line-rate":"1","branch-rate":"0"},"methods":[""],"lines":[{"line"' +
      ':[{"$":{"number":"1","hits":"1"}},{"$":{"number":"2","hits":"1"}}]}]}]}]},{"$":{' +
      '"name":"test_repo.module.tests","line-rate":"1","branch-rate":"0","complexity":"' +
      '0"},"classes":[{"class":[{"$":{"name":"__init__.py","filename":"test_repo/module' +
      '/tests/__init__.py","complexity":"0","line-rate":"1","branch-rate":"0"},"methods' +
      '":[""],"lines":[""]},{"$":{"name":"test_file.py","filename":"test_repo/module/te' +
      'sts/test_file.py","complexity":"0","line-rate":"1","branch-rate":"0"},"methods":' +
      '[""],"lines":[{"line":[{"$":{"number":"1","hits":"1"}},{"$":{"number":"4","hits"' +
      ':"1"}},{"$":{"number":"5","hits":"1"}}]}]}]}]},{"$":{"name":"test_repo.tests","l' +
      'ine-rate":"1","branch-rate":"0","complexity":"0"},"classes":[{"class":[{"$":{"na' +
      'me":"test_utils.py","filename":"test_repo/tests/test_utils.py","complexity":"0",' +
      '"line-rate":"1","branch-rate":"0"},"methods":[""],"lines":[{"line":[{"$":{"numbe' +
      'r":"3","hits":"1"}},{"$":{"number":"6","hits":"1"}},{"$":{"number":"8","hits":"1' +
      '"}}]}]}]}]}]}]}}';
    let expected = [
      { "test_repo.module": "1" },
      {
        "lib/setup.py": "0",
        "lib/test_repo/__init__.py": "1",
        "lib/test_repo/new_file.py": "0",
        "lib/test_repo/utils.py": "0.75",
        "lib/test_repo/module/__init__.py": "1",
        "lib/test_repo/module/file.py": "1",
        "lib/test_repo/module/tests/__init__.py": "1",
        "lib/test_repo/module/tests/test_file.py": "1",
        "lib/test_repo/tests/test_utils.py": "1",
      },
    ];
    let actual = rebuildCoverageFile(JSON.parse(json_input), "test_repo");
    expect(actual).toStrictEqual(expected);
  });
});
