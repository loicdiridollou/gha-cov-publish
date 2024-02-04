# Python Code Coverage Action

This action leverages the xml coverage file from `pytest` and displaying the
coverage by module and file changed into a comment in the PR as well as a check
run in the Actions tab. This enables better visibility on the coverage of
modified files as well as a module-by-module

## Usage

Include the following snippet into your workflow file after the testing job.
It is important to make sure that the testing phase outputs a coverage file
that will be used by the action by passing the path of the file (in the path
metadata).

```yaml
steps:
  # Checkout and build files of a base ref.
  - name: Check out code
    uses: actions/checkout@v5

  - name: Testing code
    run: |
      ...

  # Capture page differences.
  - name: Build coverage report comment and check run
    uses: loicdiridollou/gha-cov-publish@main
    with:
      base_sha: ${{ github.event.pull_request.base.sha }}
      head_sha: ${{ github.event.pull_request.head.sha }}
      github_url: ${{ github.event.pull_request.head.repo.url }}
      github_ref: ${{ github.ref }}
      project_name: name_of_python_module
      path: coverage_file.xml
```

## Action Metadata

### Inputs

#### base_sha

This can be passed as an element of the github event. It represents the SHA
of the commit for the branch that the pull request will be merged to.

#### head_sha

This can be passed as an element of the github event. It represents the SHA
of the commit of the top of the current branch.

#### github_url

This is the URL of the repository for the API so we can construct the relative
endpoints to compare, push comment and check run.

#### github_ref

This is the reference of the event in order to be able to identify the number
of the PR and then publish the comment on the right PR.

#### project_name

For this action, the structure of the folder should be :

```
lib
 |
 |- project_name
     |
     |- __init__.py
```

This allows the total coverage not to be reported and only the coverage per
module.

#### path

## Development

`gha-cov-publish` using Node to run the action. The docker infrastructure would
take longer to run compared to Node since we don't need a custom configuration.

### Test

`npm run test` will trigger the test suite to ensure that none of the functions
were modified in a breaking way.
