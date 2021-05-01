import requireContext from 'require-context';

/**
 * @params
 *
 * 1. 欲搜尋的path
 * 2. 是否搜尋子path
 * 3. 匹配的RegExp
 */

// 取的目錄下所有檔案
const currFolderFiles = requireContext(__dirname, true, /\.js$/);

// 取得目錄下所有檔案名稱，並過濾不需要的檔案
const getModuleFiles = currFolderFiles.keys().filter((item) => {
  // 不需要的檔案寫進來
  const excludeFiles = ['index.js'];
  let isRemain = true;

  if (excludeFiles.indexOf(item) > -1) {
    isRemain = false;
  }

  return isRemain;
});

// 將需要的檔案export default組成物件
let modules = {};
getModuleFiles.forEach((path) => {
  const fileNameList = path.split('/');
  const fileNameListLength = fileNameList.length - 1;
  const moduleName = fileNameList[fileNameListLength].replace('.js', '');

  modules = Object.assign(
    {},
    { [moduleName]: currFolderFiles(path).default },
    modules
  );
});

export default modules;
