import { IApi } from 'umi-types';
import path from 'path';
import getContextContent from './getContextContent';
import getRootContainerContent from './getRootContainerContent';
import getAccessContent from './getAccessContent';
import { checkIfHasDefaultExporting } from './util';

const ACCESS_DIR = 'plugin-access'; // plugin-access 插件创建临时文件的专有文件夹

export default function(api: IApi) {
  const umiTmpDir = api.paths.absTmpDirPath;
  const srcDir = api.paths.absSrcPath;
  const accessTmpDir = path.resolve(umiTmpDir, ACCESS_DIR);
  const accessFilePath = path.resolve(srcDir, 'access');

  api.onGenerateFiles(() => {
    // 判断 acces 工厂函数存在并且 default 暴露了一个函数
    if (!checkIfHasDefaultExporting(accessFilePath)) {
      api.log.warn(
        `[plugin-access]: access.js or access.ts file should be defined at srcDir and default exporting a factory function.`
      );
    }

    // 创建 access 的 context 以便跨组件传递 access 实例
    api.writeTmpFile(`${ACCESS_DIR}/context.ts`, getContextContent(accessFilePath));

    // 生成 rootContainer 运行时配置的内容: 1. 生成 access 实例; 2. 遍历修改 routes; 3. 传给 context 的 Provider
    api.writeTmpFile(`${ACCESS_DIR}/rootContainer.ts`, getRootContainerContent());

    // 创建 access 的 hook
    api.writeTmpFile(`${ACCESS_DIR}/access.ts`, getAccessContent());
  });

  // 增加 rootContainer 运行时配置
  // TODO: eliminate this workaround
  api.addRuntimePlugin(`${api.paths.absTmpDirPath}/@tmp/${ACCESS_DIR}/rootContainer`);

  api.addUmiExports([
    {
      specifiers: ['useAccess', 'Access', 'AccessProps'],
      source: path.resolve(accessTmpDir, 'access'),
    },
  ]);

  api.addUmiExports([
    {
      specifiers: ['AccessInstance'],
      source: path.resolve(accessTmpDir, 'context'),
    },
  ]);
}
