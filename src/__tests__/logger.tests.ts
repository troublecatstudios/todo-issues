import * as core from '@actions/core';
import { verbose, info, warn, error } from './../logger';

jest.mock('@actions/core');

const mockDebug = core.debug as jest.MockedFunction<typeof core.debug>;
const mockInfo = core.info as jest.MockedFunction<typeof core.info>;
const mockWarning = core.warning as jest.MockedFunction<typeof core.warning>;
const mockError = core.error as jest.MockedFunction<typeof core.error>;

describe('the logger', () => {
  describe('the verbose function', () => {
    it('exists', async () => {
      expect(verbose).toBeDefined();
    });
    it('calls core.debug', () => {
      verbose(`testing`);
      expect(mockDebug).toHaveBeenCalled();
      expect(mockDebug).toHaveBeenCalledWith(`testing`);
    });
    describe('when given attributes', () => {
      it('includes the attributes in the log message', () => {
        verbose(`testing`, { test: 10 });
        expect(mockDebug).toHaveBeenCalled();
        expect(mockDebug).toHaveBeenCalledWith(`testing attributes=(test: 10)`);
      });
    });
  });
  describe('the info function', () => {
    it('exists', async () => {
      expect(info).toBeDefined();
    });
    it('calls core.info', () => {
      info(`testing`);
      expect(mockInfo).toHaveBeenCalled();
      expect(mockInfo).toHaveBeenCalledWith(`testing`);
    });
    describe('when given attributes', () => {
      it('includes the attributes in the log message', () => {
        info(`testing`, { test: 10 });
        expect(mockInfo).toHaveBeenCalled();
        expect(mockInfo).toHaveBeenCalledWith(`testing attributes=(test: 10)`);
      });
    });
  });
  describe('the warn function', () => {
    it('exists', async () => {
      expect(warn).toBeDefined();
    });
    it('calls core.warning', () => {
      warn(`testing`);
      expect(mockWarning).toHaveBeenCalled();
      expect(mockWarning).toHaveBeenCalledWith(`testing`);
    });
    describe('when given attributes', () => {
      it('includes the attributes in the log message', () => {
        warn(`testing`, { test: 10 });
        expect(mockWarning).toHaveBeenCalled();
        expect(mockWarning).toHaveBeenCalledWith(`testing attributes=(test: 10)`);
      });
    });
  });
  describe('the error function', () => {
    it('exists', async () => {
      expect(error).toBeDefined();
    });
    it('calls core.error', () => {
      error(`testing`);
      expect(mockError).toHaveBeenCalled();
      expect(mockError).toHaveBeenCalledWith(`testing`);
    });
    describe('when given attributes', () => {
      it('includes the attributes in the log message', () => {
        error(`testing`, { test: 10 });
        expect(mockError).toHaveBeenCalled();
        expect(mockError).toHaveBeenCalledWith(`testing attributes=(test: 10)`);
      });
    });
  });
});
