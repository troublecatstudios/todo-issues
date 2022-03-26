import { readFile } from "fs/promises";
import Prism from "prismjs";
import { getTokens, TokenWithLineData } from "./grammar";

export type CommentMarker = 'TODO' | 'FIXME' | 'HACK' | 'OPTIMIZE' | 'BUG';
export interface ITodo {
  line: number;
  reference: string;
  title: string;
  type: CommentMarker;
  endLine: number;
  surroundingCode: string;
};

const markerCheck:RegExp = /^\W+\s\w+(?: \[([^\]\s]+)\])?:(.*)$/img
export const getTitleAndReference = (contents: string): RegExpExecArray | null => {
  // https://stackoverflow.com/questions/4724701/regexp-exec-returns-null-sporadically
  // reset internal counter so regex matches correctly
  markerCheck.lastIndex = 0;
  return markerCheck.exec(contents);
};

export const getCommentsByMarker = async(marker: CommentMarker, filePath: string): Promise<ITodo[]> => {
  let tokens = await getTokens(filePath);
  let comments = tokens.filter((e) => e.token instanceof Prism.Token &&
                                      e.token.type === 'comment' &&
                                      e.token.content.toString().includes(marker) &&
                                      e.token.content.toString().match(markerCheck));
  let todos: ITodo[] = [];
  for(let comment of comments) {
    let todo = await createTodo(comment as TokenWithLineData<Prism.Token>, marker, filePath);
    todos.push(todo);
  }

  return todos;
};

const createTodo = async (token: TokenWithLineData<Prism.Token>, marker: CommentMarker, filePath: string): Promise<ITodo> => {
  const match = getTitleAndReference(token.token.content.toString());
  const contents = (await readFile(filePath)).toString().split('\n');
  return {
    line: token.line,
    endLine: token.endLine,
    type: marker,
    reference: match?.at(1) || '',
    title: (match?.at(2) || '').trim(),
    surroundingCode: contents.slice(Math.max(0, token.line - 3), Math.min(contents.length, token.endLine + 3)).join('\n')
  };
};
