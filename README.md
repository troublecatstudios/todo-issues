# TODO Issues

This action scours your codebase for `TODO:`, `BUG:`, `FIXME:` and other types of TODO comments and creats GitHub Issues for them. The code comments are tracked and synchronized with their GitHub Issues.


## Whats new

* Initial release
  * The first release of the action is out!

## Usage

```yaml
- uses: troublecat/todo-issues@v1
  with:
    # The set of markers that the action should search for. You can link markers to GitHub Labels by formatting entries as "Marker:Label".
    # Default: |
    #  TODO
    #  FIXME: bug
    #  HACK
    #  BUG: bug
    #  OPTIMIZE
    #  NOTE
    markers: ''

    # A glob pattern that matches the files that should be scanned for comment markers.
    # Default: **
    files: ''
```

## Scenarios
<!-- no toc -->
  - [Label `TODO` comments as enhancements](#label-todo-comments-as-enhancements)

## Label `TODO` comments as enhancements

```yaml
- uses: troublecat/todo-issues@v1
  with:
    markers: |
      TODO: enhancement
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
