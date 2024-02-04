import fetch from "cross-fetch";

export function getGhAuth(): string {
  return `Bearer ${process.env.GITHUB_TOKEN}`;
}

export function generateCompareUrl(
  repo_url: string,
  base_sha: string,
  head_sha: string,
): string {
  return `${repo_url}/compare/${base_sha.slice(0, 7)}...${head_sha.slice(0, 7)}`;
}

export function buildCommentBody(
  modules: { [index: string]: string },
  changed_files: { [index: string]: string },
): string {
  let body: string = "## :white_check_mark: Result of Pytest Coverage\n";

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

export async function publishComment(
  body: string,
  repo_url: string,
  pr_number: string,
  comment_url: string = "",
): Promise<void> {
  let authorization = getGhAuth();
  if (comment_url) {
    await fetch(comment_url, {
      method: "DELETE",
      headers: {
        Authorization: authorization,
      },
    }).then((response: any) => response);
  }
  let url = `${repo_url}/issues/${pr_number}/comments`;
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ body: body }),
    headers: {
      Authorization: authorization,
    },
  });
}

export async function publishCheckRun(
  body_content: string,
  repo_url: string,
  head_sha: string,
): Promise<void> {
  let authorization = getGhAuth();
  let url = `${repo_url}/check-runs`;
  let date = new Date(Date.now()).toISOString();
  let body: any = {
    name: "Coverage Report",
    head_sha: head_sha,
    status: "completed",
    started_at: date,
    conclusion: "success",
    completed_at: date,
    output: {
      title: "Code Coverage Report",
      summary: body_content, // "There are 0 failures, 2 warnings, and 1 notices.",
      text: "You may have some misspelled words on lines 2 and 4. You also may want to add a section in your README about how to install your app.",
      // annotations: [
      //   {
      //     path: "README.md",
      //     annotation_level: "warning",
      //     title: "Spell Checker",
      //     message: "Check your spelling for '''banaas'''.",
      //     raw_details: "Do you mean '''bananas''' or '''banana'''?",
      //     start_line: 2,
      //     end_line: 2,
      //   },
      //   {
      //     path: "README.md",
      //     annotation_level: "warning",
      //     title: "Spell Checker",
      //     message: "Check your spelling for '''aples'''",
      //     raw_details: "Do you mean '''apples''' or '''Naples'''",
      //     start_line: 4,
      //     end_line: 4,
      //   },
      // ],
    },
  };

  let result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: authorization,
    },
  }).then((result) => result.json());
  console.log(result);
}
export async function getPyChangedFiles(
  compare_url: string,
): Promise<string[]> {
  let authorization = getGhAuth();
  let result: { [index: string]: any } = await fetch(compare_url, {
    headers: {
      Authorization: authorization,
    },
  }).then((response: any) => response.json());
  let files_changed = result["files"] as { [index: string]: any }[];
  let changed_filenames: string[] = [];
  for (let file of files_changed) {
    if (file["filename"].endsWith(".py")) {
      changed_filenames.push(file["filename"]);
    }
  }

  return changed_filenames;
}

export async function findExistingComment(
  repo_url: string,
  pr_number: string,
): Promise<[boolean, string]> {
  let url = `${repo_url}/issues/${pr_number}/comments`;
  let authorization = getGhAuth();
  let result: { [index: string]: any } = await fetch(url, {
    headers: {
      Authorization: authorization,
    },
  }).then((response: any) => response.json());

  let comment_header = "## :white_check_mark: Result of Pytest Coverage\n";
  for (let comm in result) {
    if (
      result[comm]["body"].startsWith(comment_header) &&
      result[comm]["user"]["login"] == "github-actions[bot]"
    ) {
      return [true, result[comm]["url"]];
    }
  }

  return [false, ""];
}
