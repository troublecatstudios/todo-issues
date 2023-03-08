type GlobType = typeof import('@actions/glob');
import { Globber } from "@actions/glob";
import { HashFileOptions } from "@actions/glob/lib/internal-hash-file-options";
import { fixture } from "../../__tests__/fixture-helper";

const _glob = jest.requireActual('@actions/glob') as GlobType;
const files = [fixture('todo-single-comment.js')];

const mockCreateGlobber: jest.MockedFunction<GlobType['create']> = jest.fn(async (patterns:string): Promise<Globber> => {
  const globber = await _glob.create(files.join('\n'));
  return {
    ...globber,
    glob: async () => files
  };
});
export default {
  create: mockCreateGlobber,
  hashFiles: async (patterns: string, options?: HashFileOptions | undefined, verbose?: Boolean | undefined): Promise<string> => '',
} as GlobType;
export const create = mockCreateGlobber;
