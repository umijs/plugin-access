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
        cb({ integrated: false });
      },
      rebuildTmpFiles: jest.fn(),
    } as any;
  });

  it('should call rebuildTmpFiles when optionChange', () => {
    registerAccessPlugin(mockApi);
    expect(mockApi.rebuildTmpFiles).toHaveBeenCalledTimes(1);
  });

  it('should call log.warn when access file has not default exporting and plugin is not in integrated mode', () => {
    registerAccessPlugin(mockApi, { integrated: false });
    expect(mockApi.log.warn).toHaveBeenCalledTimes(1);
  });

  it('should call log.warn when access file exist but has not default exporting and plugin is in integrated mode', () => {
    mockApi.paths.absSrcPath = 'path/to/no/export';
    registerAccessPlugin(mockApi, { integrated: true });
    expect(mockApi.log.warn).toHaveBeenCalledTimes(1);
  });

  it('should NOT call log.warn when access file not exist and plugin is in integrated mode', () => {
    registerAccessPlugin(mockApi, { integrated: true });
    expect(mockApi.log.warn).not.toHaveBeenCalled();
  });

  it('should run correctly when access file is defined and default exporting a function', () => {
    mockApi.paths.absSrcPath = 'path/to';
    registerAccessPlugin(mockApi, { integrated: false });
    expect(mockApi.log.warn).not.toHaveBeenCalled();
    expect(mockApi.writeTmpFile).toHaveBeenCalledTimes(4);
    expect(mockApi.addUmiExports).toHaveBeenCalledTimes(1);
    expect(mockApi.addPageWatcher).toHaveBeenCalledTimes(1);
    expect(mockApi.winPath).toHaveBeenCalledTimes(1);
  });
});
