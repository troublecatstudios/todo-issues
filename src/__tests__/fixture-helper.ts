import { resolve } from "path";

export const fixture = (filePath: string): string =>  {
  return resolve(__dirname, `../__fixtures__`, filePath);
};
