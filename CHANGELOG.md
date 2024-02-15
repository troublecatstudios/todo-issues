# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.0] - 2024-02-15

### Added

- Source code is scanned for code comments matching those specified in the `markers` configuration option.
- 297 languages are supported for code scanning [see the full list on PrismJS](https://prismjs.com/#supported-languages).
- The source around the detected comment is hashed and used to match the code comment to its GitHub Issue.
- GitHub issues are created/updated and closed based on the source hash.
