/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 创建临时小程序码
 * @Since 2020/2/4
 */

const axios = require('axios');

module.exports = function (sPage, sScene, nSize = 430) {
	return this.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				axios.post('https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + sToken, {
					scene     : sScene,
					page      : sPage,
					width     : nSize,
					is_hyaline: true
				}, {
					responseType: 'arraybuffer'
				}).then(
					({data: jRes}) => {
						if (jRes.errcode) {
							reject(jRes);
						}
						else {
							resolve(jRes);
						}
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
		},
		error => {
			return Promise.reject(error);
		}
	);
};
