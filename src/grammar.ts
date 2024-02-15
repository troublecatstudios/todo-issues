import * as prism from './../lib/prism';
import { extname } from 'path';
import { readFile } from 'fs/promises';
import { verbose } from './logger';

const DefaultLanguage = 'plaintext';

export const getGrammar = (fileName: string): prism.Grammar => {
  let extension = extname(fileName).substr(1);
  return prism.languages[extension] || prism.languages[DefaultLanguage];
};

export type TokenWithLineData<T> = {
  line: number;
  token: T;
  endLine: number;
}
export type TokenList = TokenWithLineData<string | Prism.Token>[];

export const getTokens = async (fileName: string): Promise<TokenList> => {
  verbose(`tokenizing source file '${fileName}'`);
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

