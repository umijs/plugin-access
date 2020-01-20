import { IApi } from 'umi-types';
import registerAccessPlugin, { Options } from '../index';

jest.mock('fs');

let mockApi: IApi;

describe('PluginAccess', () => {
  beforeEach(() => {
    mockApi = {
      paths: {
        absTmpDirPath: '/workspace/project/src/page/.umi',
        absSrcPath: '/workspace/project/src',
      },
      log: {
        warn: jest.fn(),
      },
      onGenerateFiles: (cb: () => void) => {
        cb();
      },
      writeTmpFile: jest.fn(),
      addRuntimePlugin: jest.fn(),
      addUmiExports: jest.fn(),
      addPageWatcher: jest.fn(),
      winPath: jest.fn(),
      onOptionChange: (cb: (opts: Options) => void) => {
        cb({ showWarning: true });
      },
      rebuildTmpFiles: jest.fn(),
    } as any;
  });

  it('should call rebuildTmpFiles when optionChange', () => {
    registerAccessPlugin(mockApi);
    expect(mockApi.rebuildTmpFiles).toHaveBeenCalledTimes(1);
  });

  it('should call log.warn when access file does not exist', () => {
    registerAccessPlugin(mockApi);
    expect(mockApi.log.warn).toHaveBeenCalledTimes(1);
  });

  it('should call log.warn when access file exist but has not default exporting', () => {
    mockApi.paths.absSrcPath = 'path/to/no/export';
    registerAccessPlugin(mockApi);
    expect(mockApi.log.warn).toHaveBeenCalledTimes(1);
  });

  it('should NOT call log.warn when access file does not exist but showWarning option is false', () => {
    registerAccessPlugin(mockApi, { showWarning: false });
    expect(mockApi.log.warn).not.toHaveBeenCalled();
  });

  it('should run correctly when access file is defined and default exporting a function', () => {
    mockApi.paths.absSrcPath = 'path/to';
    registerAccessPlugin(mockApi, { showWarning: true });
    expect(mockApi.log.warn).not.toHaveBeenCalled();
    expect(mockApi.writeTmpFile).toHaveBeenCalledTimes(4);
    expect(mockApi.addUmiExports).toHaveBeenCalledTimes(1);
    expect(mockApi.addPageWatcher).toHaveBeenCalledTimes(1);
    expect(mockApi.winPath).toHaveBeenCalledTimes(1);
  });
});
