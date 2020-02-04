/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信签名加密
 * @Since 2020/2/4
 */

const crypto = require('crypto');

module.exports = function (oParam) {
	const conf = this.config;
	let _array = [conf.token, oParam.timestamp, oParam.nonce];
	let sEncode = _array.sort().join('');
	const sEnSignCode = crypto.createHash('sha1').update(sEncode, 'utf-8').digest('hex');
	return sEnSignCode === oParam.signature;
};
