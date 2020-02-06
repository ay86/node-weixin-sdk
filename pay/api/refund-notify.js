/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 交易退款通知
 * @Since 2020/2/6
 */

const util = require('../../utils');

module.exports = function (request) {
	const conf = this.config;
	return new Promise((resolve, reject) => {
		if (!request) {
			return reject(null);
		}
		let buffer = '';
		request.setEncoding('utf8');
		request.on('data', chunk => {
			buffer += chunk;
		});
		request.on('end', () => {
			util.xmlParser(buffer, {trim: true, explicitArray: false}, (err, xmlResult) => {
				if (err) {
					return reject(null);
				}
				if (xmlResult.xml.return_code === 'SUCCESS') {
					const checkData = Object.assign({}, xmlResult.xml);
					const encodeStr = checkData.req_info;
					const key = util.md5(conf.pay.mchKey).toLowerCase();
					const decodeStr = util.PKCS7Padding(encodeStr, key);
					util.xmlParser(decodeStr, {trim: true, explicitArray: false}, (err, decodeResult) => {
						if (err) {
							return reject(null);
						}
						// TODO 需要支持退款状态的不同响应 refund_status SUCCESS CHANGE REFUNDCLOSE
						resolve(decodeResult.root);
					});
				}
				else {
					reject({error: xmlResult.xml.return_msg});
				}
			});
		});
	});
};
