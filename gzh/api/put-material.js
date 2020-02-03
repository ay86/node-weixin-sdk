/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 上传素材到微信服务器
 * @Since 2020/2/3
 */

const axios = require('axios');

module.exports = function (oFile, sType = 'image') {
	return this.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				const FormData = require('form-data');
				const oData = new FormData();
				// TODO 下一步要支持不同素材类型文件的上传
				oData.append('media', oFile, {filename: 'qr.png', contentType: 'image/jpg'});
				const _header = oData.getHeaders();
				_header['Content-Length'] = oData.getLengthSync();
				axios.post('https://api.weixin.qq.com/cgi-bin/media/upload', oData, {
					params : {
						access_token: sToken,
						type        : sType
					},
					headers: _header
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
