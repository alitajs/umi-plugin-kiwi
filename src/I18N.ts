/**
 * @file 多语言工具
 * @author 五灵
 */

import kiwiIntl from 'kiwi-intl';
import * as fs from 'fs-extra';
import * as path from 'path';

export enum LangEnum {
  "zh-CN" = 'zh-CN',
  "en-US" = "en-US",
  "zh-TW" = "zh-TW"
}

/**
 * 获取当前语言的Cookie
 */
export function getCurrentLang(): LangEnum {
  const urlLang = new URL(window.location.href).searchParams.get('lang');
  const cookieLang = (document.cookie.match(/kiwi-locale=([^;$]+)/) || [null, 'zh-CN'])[1];
  const lang = (cookieLang as string).split(' ')[0];
  if (Object.keys(LangEnum).includes(urlLang as string)) {
    return urlLang as LangEnum;
  }
  return lang as LangEnum;
}


/**
 * 获取文件夹下所有文件
 * @function getAllFiles
 * @param  {string} dir Dir path string.
 * @return {string[]} Array with all file names that are inside the directory.
 */
export const getAllFiles = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);

/**
 * 适配不同的语言文件夹位置
 */
function dirAdaptor(rootPath) {
  const kiwiLangPerfix = `${rootPath}/.kiwi/zh-CN/`;
  const langPrefix = `${rootPath}/langs/zh-CN/`;

  /** 兼容 zh_CN 情况 */
  const _kiwiLangPerfix = `${rootPath}/.kiwi/zh_CN/`;
  const _langPrefix = `${rootPath}/langs/zh_CN/`;

  if (fs.existsSync(kiwiLangPerfix)) {
    return kiwiLangPerfix;
  } else if (fs.existsSync(langPrefix)) {
    return langPrefix;
  } else if (fs.existsSync(_kiwiLangPerfix)) {
    return _kiwiLangPerfix;
  } else if (fs.existsSync(_langPrefix)) {
    return _langPrefix;
  } else {
    const files = getAllFiles(`${rootPath}/`);
    const matchFiles = files.filter((fileName) => {
      if (fileName.includes('/.kiwi/zh-CN/index.ts')
        || fileName.includes('/langs/zh-CN/index.ts')
        || fileName.includes('/.kiwi/zh_CN/index.ts')
        || fileName.includes('/langs/zh_CN/index.ts')) {
        return true;
      }
      return false;
    });

    if (matchFiles.length) {
      return matchFiles[0].replace('index.ts', '');
    }
  }
}

const langs = {
  // "en-US": enUsLangs,
  "zh-CN": {},
  // "zh-TW": zhTWLangs
};
// import enUsLangs from '../.kiwi/en-US/';
// import zhCNLangs from '../.kiwi/zh-CN/';
// import zhTWLangs from '../.kiwi/zh-TW/';
if (fs.existsSync(path.join(__dirname, "../.kiwi/zh-CN/"))) {
  langs["zh-CN"] = require(path.join(__dirname, "../.kiwi/zh-CN/"));
} else {
  console.log(path.join(__dirname, "../.kiwi/zh-CN/"));
  console.error('未找到相关文件，请执行umi kiwiinit');
}
// 从 Cookie 中取语言值, 默认为 zh-CN
const defaultLang = getCurrentLang();

let curLang;
if (Object.keys(langs).indexOf(defaultLang) > -1) {
  curLang = defaultLang;
} else {
  // 如果没有对应的语言文件, 置为中文
  curLang = 'zh-CN';
}

const I18N = kiwiIntl.init(curLang, langs);

export default I18N;
