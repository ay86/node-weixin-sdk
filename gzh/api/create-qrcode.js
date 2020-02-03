/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 创建永久二维码
 * @Since 2020/2/3
 */

const axios = require('axios');

module.exports = function (nSceneId) {
	return this.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				axios.post('https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + sToken, {
					action_name: 'QR_LIMIT_SCENE',
					action_info: {
						scene: {
							scene_id: nSceneId
						}
					}
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
