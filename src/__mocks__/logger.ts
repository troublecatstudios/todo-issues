import { LogAttributes } from './../logger';

const _void = () => undefined;

export const info = (message: string | Error, attributes: LogAttributes | null = null): void => _void();
export const verbose = (message: string | Error, attributes: LogAttributes | null = null): void => _void();
export const warn = (message: string | Error, attributes: LogAttributes | null = null): void => _void();
export const error = (message: string | Error, attributes: LogAttributes | null = null): void => _void();
