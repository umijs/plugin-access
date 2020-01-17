import { IApi } from 'umi-types';
import { join } from 'path';
import getContextContent from './utils/getContextContent';
import getAccessProviderContent from './utils/getAccessProviderContent';
import getAccessContent from './utils/getAccessContent';
import getRootContainerContent from './utils/getRootContainerContent';
import { checkIfHasDefaultExporting } from './utils';

const ACCESS_DIR = 'plugin-access'; // plugin-access 插件创建临时文件的专有文件夹

export default function(api: IApi) {
  const umiTmpDir = api.paths.absTmpDirPath;
  const srcDir = api.paths.absSrcPath;
  const accessTmpDir = join(umiTmpDir, ACCESS_DIR);
  const accessFilePath = join(srcDir, 'access');

  api.onGenerateFiles(() => {
    const enableAccess = checkIfHasDefaultExporting(accessFilePath);

    // 判断 access 工厂函数存在并且 default 暴露了一个函数
    if (!enableAccess) {
      api.log.warn(
        `[plugin-access]: access.js or access.ts file should be defined at srcDir and default exporting a factory function.`,
      );
    }

    // 创建 access 的 context 以便跨组件传递 access 实例
    api.writeTmpFile(`${ACCESS_DIR}/context.ts`, getContextContent());

    // 创建 AccessProvider，1. 生成 access 实例; 2. 遍历修改 routes; 3. 传给 context 的 Provider
    api.writeTmpFile(`${ACCESS_DIR}/AccessProvider.ts`, getAccessProviderContent());

    // 创建 access 的 hook
    api.writeTmpFile(`${ACCESS_DIR}/access.tsx`, getAccessContent());

    // 生成 rootContainer 运行时配置
    api.writeTmpFile(
      `${ACCESS_DIR}/rootContainer.ts`,
      enableAccess ? getRootContainerContent() : '/* keep file */',
    );
  });

  // 增加 rootContainer 运行时配置
  // TODO: eliminate this workaround
  api.addRuntimePlugin(join(umiTmpDir, '@tmp', ACCESS_DIR, 'rootContainer.ts'));

  api.addUmiExports([
    {
      exportAll: true,
      source: api.winPath(join(accessTmpDir, 'access')),
    },
  ]);

  api.addPageWatcher([`${accessFilePath}.ts`, `${accessFilePath}.js`]);
}
