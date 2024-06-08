const axios = require('axios');

/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Since 2020/2/3
 * @Description 上传素材到微信服务器
 * @param file
 * @param materialType image|video|voice|thumb
 * @param fileOption
 * @returns {any}
 */
module.exports = function(file, materialType = 'image', fileOption = {filename: 'qr.png', contentType: 'image/png'}) {
	return this.token().then(
			token => {
				return new Promise((resolve, reject) => {
					const FormData = require('form-data');
					const oData = new FormData();
					oData.append('media', file, fileOption);
					const _header = oData.getHeaders();
					_header['Content-Length'] = oData.getLengthSync();
					axios.post('https://api.weixin.qq.com/cgi-bin/media/upload', oData, {
						params : {
							access_token: token,
							type        : materialType
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
