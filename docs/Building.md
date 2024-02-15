# Building todo-issues

## Prerequisites
* Node v18 or greater is required. You can install node from [its official website](https://nodejs.org/en), or use another program like [nvm](https://github.com/nvm-sh/nvm), or [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/)
* Yarn package manager for node is recommended, you can get it from [the official yarn site](https://yarnpkg.com/).


## Running the build
1. clone the repo locally
2. run `yarn` from the root of the directory
3. run `yarn run build` to build the code locally

This will generate several files in the `./dist` directory, these are the compiled javascript files that will get run during the action execution. You'll need to push these if you are creating a new release of todo-issues.


## Running just the tests
1. run `yarn test` to run the tests
