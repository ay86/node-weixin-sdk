/**
 * @Author AngusYoung <angusyoung@mrxcool.com>
 * @Description 获取临时素材
 * @Since 2024/6/21
 */

const axios = require('axios');

module.exports = function(mediaId) {
	return this.token().then(
		token => {
			return new Promise((resolve, reject) => {
				axios.get('https://api.weixin.qq.com/cgi-bin/media/get', {
					responseType: 'arraybuffer',
					params      : {
						access_token: token,
						media_id    : mediaId
					}
				}).then(
					({data}) => {
						if (data.errcode) {
							reject(data);
						}
						else {
							resolve(data);
						}
					}
				).catch(error => {
					if (error.response) {
						let {status, statusText, data} = error.response;
						reject({errcode: status, errmsg: statusText, data});
					}
					else {
						reject({errcode: 400});
					}
				});
			});
		},
		error => Promise.reject(error)
	);
}