/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 获取二维码图片
 * @Since 2020/2/3
 */

const axios = require('axios');

module.exports = function (sTicket) {
	return new Promise((resolve, reject) => {
		axios.get('https://mp.weixin.qq.com/cgi-bin/showqrcode', {
			params      : {
				ticket: sTicket
			},
			responseType: 'arraybuffer'
		}).then(
			jRes => {
				const oBuffer = Buffer.from(jRes.data);
				resolve(oBuffer);
			},
			error => {
				if (error.response) {
					let {status, statusText, data} = error.response;
					reject({errcode: status, errmsg: statusText, data});
				}
				else {
					reject({errcode: 400});
				}
			}
		);
	});
};
