import { Isummary, IpageInfo } from '../interface/globalTyping';

// 回應非200時
function resError(errMessage = '未知錯誤', errType) {
  let memo = '';

  switch (errType) {
    case 'params':
      memo = '參數錯誤: ';
      break;
    case 'db':
      memo = '資料庫錯誤: ';
      break;
    case 'operate':
      memo = '操作失敗: ';
    default:
      break;
  }

  return {
    code: -1,
    message: memo + errMessage,
  };
}

// 回應200時
function resOk(data = {}, warning = '') {
  if (warning.trim() === '') {
    return {
      code: 0,
      content: data,
    };
  }

  return {
    code: 0,
    content: data || '',
    warning,
  };
}

// 回應200且有頁數時
function resOkWithPage(items, pageInfo, summary) {
  return {
    code: 0,
    content: items,
    pageInfo,
    summary,
  };
}

// 回應200但沒資料時
function resOkWithZeroData(pageInfo, warning) {
  return {
    code: 0,
    content: [],
    pageInfo,
    summary,
    warning,
  };
}

export { resError, resOk, resOkWithPage, resOkWithZeroData };
