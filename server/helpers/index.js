const generateVerifyCode = (numberOfDigits) => {
  const n = parseInt(numberOfDigits);
  const number = Math.floor(Math.random() * Math.pow(10, n)) + 1;
  let numberStr = number.toString();
  for (let i = 0; i < 6 - numberStr.length; i++) {
    numberStr = '0' + numberStr;
  }
  return numberStr;
};

module.exports.helpers = {
  generateVerifyCode,
};
