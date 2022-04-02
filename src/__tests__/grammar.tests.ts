import { readFile } from "fs/promises";
import Prism from "prismjs";
import { getGrammar, getTokens } from "../grammar";
import { fixture } from "./fixture-helper";

describe('getGrammar', () => {
  it('exists', async () => {
    let file = fixture('./no-comments.js');
    let result = getGrammar(file);
  });

  it('returns javacript for javascript files', async () => {
    let file = fixture('./no-comments.js');
    let result = getGrammar(file);

    let expectedGrammar = Prism.languages['js'];

    expect(result).toBe(expectedGrammar);
  });
});

describe('getTokens', () => {
  it('exists', async () => {
    let file = fixture('./no-comments.js');
    let result = getTokens(file);
  });

  describe('when the given file matches a prism grammar', () => {
    it('should return the tokens for the file, with start and end line numbers', async () => {
      let file = fixture('./only-multi-comment.js');
      let result = await getTokens(file);

      let fileLines = (await readFile(file)).toString().split('\n').length;

      let first = result.at(0);
      expect(result).toBeInstanceOf(Array);
      expect(first?.line).toBe(1);
      expect(first?.endLine).toBe(4);
      expect(first?.token).toBeInstanceOf(Prism.Token);
      expect(first?.token).toHaveProperty('type', 'comment');
    });
  });
});
