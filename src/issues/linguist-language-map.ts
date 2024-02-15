import {readFile} from 'fs/promises';
import {load} from 'js-yaml';
import {resolve} from 'path';

const languagesYaml = resolve(__dirname, './languages.yml');

let languages: LanguageList | null = null;

export type LinguistLanguage = {
  type: 'data' | 'programming' | 'markup' | 'prose' | 'nil';
  color: string;
  extensions?: string[];
  tm_scope: string;
  language_id: number;
  ace_mode: string;
  aliases?: string[];
};

export type LanguageList = Record<string, LinguistLanguage>;

export const getLanguages = async (): Promise<LanguageList> => {
  if (languages == null) {
    let yaml = await readFile(languagesYaml);
    let languagesObject = load(yaml.toString()) as LanguageList;
    languages = languagesObject;
  }
  return languages as LanguageList;
};

export const getCodeForExtension = async (
  extension: string,
): Promise<string | null> => {
  if (languages === null) {
    await getLanguages();
  }
  for (var [name, lang] of Object.entries(languages!)) {
    if (lang.extensions && lang.extensions.includes(extension)) {
      if (lang.aliases?.at(0)) {
        return lang.aliases?.at(0)!;
      } else {
        return lang.ace_mode;
      }
    }
  }
  return null;
};
