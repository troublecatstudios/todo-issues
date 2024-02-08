import * as prismComponents from 'prismjs/components/index';
import * as prism from 'prismjs';
import { extname } from 'path';
import { readFile } from 'fs/promises';

export const getGrammar = (fileName: string): prism.Grammar => {
  prismComponents.default();
  let extension = extname(fileName).substr(1);
  return prism.languages[extension];
};

export type TokenWithLineData<T> = {
  line: number;
  token: T;
  endLine: number;
}
export type TokenList = TokenWithLineData<string | Prism.Token>[];

export const getTokens = async (fileName: string): Promise<TokenList> => {
  let contents = (await readFile(fileName)).toString();
  let tokens = prism.tokenize(contents, getGrammar(fileName));
  let line = 1;
  let tokensWithLines: TokenList = [];
  for (var t of tokens) {
    tokensWithLines.push({
      line,
      token: t,
      endLine:
        t instanceof prism.Token
          ? line + t.content.toString().split('\n').length - 1
          : line,
    });
    if (t instanceof prism.Token) {
      line += t.content.toString().split('\n').length - 1;
      continue;
    }
    line += t.split('\n').length - 1;
  }
  return tokensWithLines;
};

