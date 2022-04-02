import { readFile } from 'fs/promises';
import {getCommentsByMarker, getTitleAndReference} from './../todo-parser';
import { fixture } from './fixture-helper';
import { normalizeString } from './test-helpers';

describe('getCommentsByMarker', () => {
  it('exists', async () => {
    expect(getCommentsByMarker).toBeDefined();
  });

  it('takes two arguments', async () => {
    expect(getCommentsByMarker).toHaveLength(2);
  });

  it('returns a promise', async () => {
    let result = getCommentsByMarker('BUG', fixture('./no-comments.js'));

    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve to an array of ITODO items', async () => {
    let result = await getCommentsByMarker('BUG', fixture('./no-comments.js'));

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  describe('when the given file doesn\'t exist', () => {
    it('should return an empty array', async () => {
      let result = await getCommentsByMarker('BUG', fixture('./no-comments.js'));

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe('when the file doesn\'t contain any matching comments', () => {
    it('should return an empty array', async () => {
      let result = await getCommentsByMarker('BUG', fixture('./no-comments.js'));

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe('when the file contains a matching comment', () => {
    it('should return each comment in an array', async () => {
      let file = fixture('./todo-single-comment.js');
      let result = await getCommentsByMarker('TODO', file);

      let first = result.at(0);

      expect(result).toHaveLength(1);
      expect(first?.title).toBe('convert this to typescript');
    });

    describe('each todo', () => {
      it('should contain the surrounding code', async () => {
        let file = fixture('./todo-single-comment.js');
        let result = await getCommentsByMarker('TODO', file);

        let first = result.at(0);

        let expectedCode = [
          '',
          '// TODO: convert this to typescript',
          'function add() {',
          '  var i = 0;',
          '  for(var x of arguments) {'
        ].join('\r\n');

        expect(normalizeString(first?.surroundingCode!)).toBe(normalizeString(expectedCode));
      });
    });
  });
});

describe('getTitleAndReference', () => {
  it('should extract the title from single line comments', async () => {
    let file = fixture('./todo-single-comment.js');
    let contents = (await readFile(file)).toString();
    let match = getTitleAndReference(contents)!;

    expect(match).toBeDefined();
    expect(match).not.toBeNull();
    expect(match[2]).toBe(' convert this to typescript');
  });
});
