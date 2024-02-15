# TODO Issues

This action scours your codebase for `TODO:`, `BUG:`, `FIXME:` and other types of TODO comments and creates GitHub Issues for them. Each time the action runs the code comments are scanned and synchronized with their GitHub Issues. Removing a code comment will close its matching issue in GitHub.

297 languages are supported for code scanning [see the full list on PrismJS](https://prismjs.com/#supported-languages).

[CHANGELOG](./CHANGELOG.md) | [Building todo-issues](./docs/Building.md)

## Usage

```yaml
name: Sync Issues With Comments
on:
  push:
    branches:
      - main
permissions:
  contents: read
  issues: write
jobs:
  sync-todos:
    runs-on: [ 'ubuntu-latest' ]
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Sync TODOs
        uses: troublecatstudios/todo-issues@v1
```

## Configuration

|  Option Name  | Required | Description |
|---------------|----------|-------------|
| `markers`     | `false`  | The comment markers to search for when creating issues, in a new-line delimited list. By default the following markers are included: `TODO`, `FIXME`, `HACK`, `BUG`, `OPTIMIZE`, and `NOTE`. |
| `files`       | `false`  | A [file glob](https://github.com/actions/toolkit/tree/main/packages/glob) string that points to all the files that should be searched for code comments. By default this is set to `**` (all files in the repository). |
| `githubToken` | `false`  | The GitHub token to use when interacting with issues. By default this will use the token scoped to your repository. |


### Example with all configuration options

```yaml
      - name: Sync TODOs
        uses: troublecatstudios/todo-issues@v1
        with:
          markers: |
            TODO
            FIXME
            HACK
            BUG
            OPTIMIZE
            NOTE
          files: "**"
          githubToken: ${{ secrets.GITHUB_TOKEN }}
```

# License

The code and documentation in this project are released under the [MIT License](LICENSE)
