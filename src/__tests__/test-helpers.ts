
const CRLF = '\r\n';

export const normalizeNewLines = (input: string): string => {
  return input.replace(new RegExp(CRLF, 'g'), '\n');
};

export const normalizeString = (input: string): string => {
  return normalizeNewLines(input).trim();
};
