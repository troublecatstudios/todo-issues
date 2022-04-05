import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import {compareHash, getCommentsByMarker, getHash, getTitleAndReference, InvalidHashInputFilePathError, InvalidHashInputTitleError} from './../todo-parser';
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

      it('should contain a reference string that is created by getHash', async () => {
        let file = fixture('./todo-single-comment.js');
        let result = await getCommentsByMarker('TODO', file);

        expect(result.length).toBeGreaterThan(0);

        if (result.length > 0) {
          let first = result.at(0)!;
          expect(first).toBeDefined();
          expect(first.reference).toBeDefined();
          expect(first.reference).not.toBe('');

          let expectedHash = getHash(first);
          expect(first.reference).toBe(expectedHash);
        }
      });
    });
  });
});

describe('getHash', () => {
  it('should exist', async () => {
    expect(getHash).toBeDefined();
  });

  it('should expect a title', async () => {
    try {
      getHash({ title: '', filePath: ''});
      fail();
    } catch (e) {
      expect(e).toBe(InvalidHashInputTitleError);
    }
  });

  it('should expect a filePath', async () => {
    try {
      getHash({ title: 'some title', filePath: ''});
      fail();
    } catch (e) {
      expect(e).toBe(InvalidHashInputFilePathError);
    }
  });

  it('should return a string value', async () => {
    let hash = getHash({ title: 'some title', filePath: '/some/file/path'});
    expect(hash).toBeDefined();
    expect(typeof(hash)).toBe('string');
  });

  it('should return separate md5 hashes of the title and filepath values', async () => {
    let filePathHash = createHash('md5').update('/some/file/path').digest('hex').substr(0, 8);
    let titleHash = createHash('md5').update('some title').digest('hex').substr(0, 8);
    let expectedHash = `${filePathHash}:${titleHash}`;
    let hash = getHash({ title: 'some title', filePath: '/some/file/path'});

    expect(hash).toBe(expectedHash);
  });

  it('should generate similar hashes for titles in the same file', async () => {
    let expectedFileHash = createHash('md5').update('/some/file/path').digest('hex');
    let hashA = getHash({ title: 'some title', filePath: '/some/file/path'});
    let hashB = getHash({ title: 'some title2', filePath: '/some/file/path'});

    expect(hashA).toContain(':');
    expect(hashB).toContain(':');
  });
});

describe('compareHash', () => {
  it('should exist', async () => {
    expect(compareHash).toBeDefined();
  });

  it('should return a boolean', async () => {
    let result = compareHash();
    expect(typeof(result)).toBe('boolean');
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
