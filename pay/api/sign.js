/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信支付签名加密
 * @Since 2020/2/4
 */

const crypto = require('crypto');

module.exports = function (oParam) {
	const conf = this.config;
	const aResult = [];
	for (let v of Object.keys(oParam)) {
		if (oParam[v]) {
			aResult.push(v + '=' + oParam[v]);
		}
	}
	let sResult = aResult.sort().join('&');
	sResult += '&key=' + conf.pay.mchKey;
	return crypto.createHash('md5').update(sResult).digest('hex').toUpperCase();
};
