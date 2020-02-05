/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信公众号签名加密方法
 * @Since 2020/2/3
 */

const util = require('../../utils');

module.exports = function (oParam) {
	const conf = this.config;
	let _array = [conf.token, oParam.timestamp, oParam.nonce];
	let sEncode = _array.sort().join('');
	const sEnSignCode = util.sha1(sEncode);
	return sEnSignCode === oParam.signature;
};
