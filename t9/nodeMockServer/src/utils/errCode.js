function convertErrCode(errCode) {
  const errCodeMapping = {
    1000: 'test error',
  };

  if (!errCodeMapping.hasOwnProperty(errCode)) {
    return '未知錯誤';
  } else errCodeMapping[errCode];
}

export default convertErrCode;
