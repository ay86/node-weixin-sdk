/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 解密微信支付 V3 API 的回调数据
 * @Since 2024/10/16
 */

const utils = require('../../../utils');
module.exports = function(data) {
	const conf = this.config;
	return new Promise((resolve, reject) => {
		const {algorithm, ciphertext, associated_data, nonce} = data;
		if (algorithm !== 'AEAD_AES_256_GCM') {
			reject({errcode: 500, errmsg: '不支持的加密算法'});
		}
		const decryptData = utils.aes256gcmDecrypt(ciphertext, conf.pay.mchKeyV3, nonce, associated_data);
		if (!decryptData) {
			reject({errcode: 500, errmsg: '解密失败'});
			return;
		}
		resolve(JSON.parse(decryptData));
	});
}