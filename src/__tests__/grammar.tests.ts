import { readFile } from "fs/promises";
import * as Prism from './../../lib/prism';
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

  it('returns plaintext for unknown file types', async () => {
    let file = fixture('./unknown');
    let result = getGrammar(file);

    let expectedGrammar = Prism.languages['plaintext'];

    expect(result).toBe(expectedGrammar);
  });
});

describe('getTokens', () => {
  it('exists', async () => {
    let file = fixture('./no-comments.js');
    let result = getTokens(file);
  });

  describe('when the given file matches a prism grammar', () => {
    const fixtures = [
      {
        fixture: fixture('./unknown'),
        expect: []
      },
      {
        fixture: fixture('./only-multi-comment.js'),
        expect: [
          { line: 1, endLine: 4, valid: /of the body/mig }
        ]
      },
      {
        fixture: fixture('./todo-single-comment.js'),
        expect: [
          { line: 2, endLine: 2, valid: /convert this to typescript/mig }
        ]
      },
      {
        fixture: fixture('./various-comment-examples.js'),
        expect: [
          { line: 2, endLine: 2, valid: /is not linked/mig },
          { line: 3, endLine: 3, valid: /is linked/mig }
        ]
      },
    ];
    it.each(fixtures)('should return the tokens for the file, with start and end line numbers', async (fx) => {
      let file = fx.fixture;
      let result = await getTokens(file);

      let fileLines = (await readFile(file)).toString().split('\n').length;

      let comments = result.filter(r => r.token instanceof Prism.Token && (r.token as Prism.Token).type === 'comment');
      expect(result).toBeInstanceOf(Array);
      expect(comments.length).toBe(fx.expect.length);
      for(let i = 0; i < comments.length; i++) {
        let e = fx.expect[i];
        let c = comments[i];

        expect(c?.line).toBe(e.line);
        expect(c?.endLine).toBe(e.endLine);
        expect(c?.token).toBeInstanceOf(Prism.Token);
        expect(c?.token).toHaveProperty('type', 'comment');
        expect((c?.token as Prism.Token).content).toMatch(e.valid);
      }
    });
  });
});
