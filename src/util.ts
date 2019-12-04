import fs from 'fs';

export function checkIfHasDefaultExporting(filepath: string): boolean {
  let fileExist = false;
  let realFilePath = '';
  if (fs.existsSync(`${filepath}.ts`)) {
    realFilePath = `${filepath}.ts`;
    fileExist = true;
  } else if (fs.existsSync(`${filepath}.js`)) {
    realFilePath = `${filepath}.js`;
    fileExist = true;
  }

  if (!fileExist) {
    return false;
  }

  const fileContent = fs.readFileSync(realFilePath, 'utf8');
  const validationRegExp = /(export\s*default)|(exports\.default)|(module.exports[\s\S]*default)|(module.exports[\s\n]*=)/m;

  return validationRegExp.test(fileContent);
}
