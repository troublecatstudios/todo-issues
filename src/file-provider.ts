import { create } from "@actions/glob";


export const getFiles = async function(workingDirectory: string, ...globs: string[]): Promise<string[]> {
  let globber = await create(globs.join('\n'));
  let lastCwd = process.cwd();
  process.chdir(workingDirectory);
  let files = await globber.glob();
  return files;
};
