
import * as core from '@actions/core';

export type LogLevel = 'VERBOSE' | 'INFO' | 'WARN' | 'ERROR';
export type LogPrimitive = string | number | boolean;
export type LogAttributes = Record<string, LogPrimitive | Array<LogPrimitive>>;

const log = (message: string | Error, level: LogLevel = 'INFO', attributes: LogAttributes | null = null): void => {
  const attrs = [];
  if (attributes !== null) {
    for(const key of Object.keys(attributes)) {
      const value = attributes[key];
      attrs.push(`${key}: ${value}`);
    }
  }

  const messageParts = [
    message,
    attrs.length > 0 ? ` attributes=(${attrs.join(',')})` : '',
  ];
  const formattedMessage = messageParts.join('');
  if (level === 'VERBOSE') {
    core.debug(formattedMessage);
  } else if (level === 'WARN') {
    core.warning(formattedMessage);
  } else if (level === 'ERROR') {
    core.error(formattedMessage);
  } else {
    core.info(formattedMessage);
  }
};

export const info = (message: string | Error, attributes: LogAttributes | null = null): void => log(message, 'INFO', attributes);
export const verbose = (message: string | Error, attributes: LogAttributes | null = null): void => log(message, 'VERBOSE', attributes);
export const warn = (message: string | Error, attributes: LogAttributes | null = null): void => log(message, 'WARN', attributes);
export const error = (message: string | Error, attributes: LogAttributes | null = null): void => log(message, 'ERROR', attributes);
