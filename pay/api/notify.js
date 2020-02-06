/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 支付结果通知验证
 * @Since 2020/2/6
 */

const util = require('../../utils');

module.exports = function (request) {
	const _this = this;
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
				const checkData = Object.assign({}, xmlResult.xml);
				const signature = checkData.sign;
				delete checkData.sign;
				if (signature === _this.paySign(checkData)) {
					if (xmlResult.xml.return_code === 'SUCCESS') {
						if (xmlResult.xml.result_code === 'SUCCESS') {
							resolve(xmlResult.xml);
						}
						else {
							reject({error: xmlResult.xml.return_msg, data: xmlResult.xml});
						}
					}
					else {
						reject({error: xmlResult.xml.return_msg});
					}
				}
				else {
					reject(null);
				}
			});
		});
	});
};
