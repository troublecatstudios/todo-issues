import * as glob from "@actions/glob";


export const getFiles = async function(workingDirectory: string, ...globs: string[]): Promise<string[]> {
  let globber = await glob.create(globs.join('\n'), { matchDirectories: false });
  let lastCwd = process.cwd();
  process.chdir(workingDirectory);
  let files = await globber.glob();
  return files;
};
