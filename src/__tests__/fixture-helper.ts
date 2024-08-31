import { readFile } from 'fs/promises';
import { resolve } from "path";

export const fixture = (filePath: string): string => {
  return resolve(__dirname, `../__fixtures__`, filePath);
};

export const readFixture = async (filePath: string): Promise<Buffer> => {
  const buffer = await readFile(fixture(filePath));
  return buffer;
};
