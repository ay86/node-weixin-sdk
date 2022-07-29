/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 解密加密数据
 * @Since 2020/2/4
 */

const util = require('../../utils');

module.exports = function (sEncryptedData, sIv, sSessionKey) {
	const conf = this.config;
	const WXBizDataCrypt = util.WXBizDataCrypt;
	const pc = new WXBizDataCrypt(conf.appId, sSessionKey);
	return new Promise(resolve => {
		const data = pc.decryptData(sEncryptedData, sIv);
		resolve(data);
	});
};
