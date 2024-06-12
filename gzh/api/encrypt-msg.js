/**
 * @Author AngusYoung <angusyoung@mrxcool.com>
 * @Description 加密回复消息
 * @Since 2024/6/12
 */

const util = require('../../utils');

module.exports = function(data, nonce) {
	const msg = this.encrypt(data);
	const timestamp = Math.round(new Date().getTime() / 1000);
	const signature = util.sha1([this.config.token, timestamp, nonce, msg].sort().join(''));
	return {
		TimeStamp   : timestamp,
		Nonce       : nonce,
		MsgSignature: signature,
		Encrypt     : msg
	}
}