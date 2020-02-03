/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信公众号获取微信用户信息
 * @Since 2020/2/3
 */

const axios = require('axios');

module.exports = function (sOpenId) {
	return this.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				axios.get('https://api.weixin.qq.com/cgi-bin/user/info', {
					params: {
						access_token: sToken,
						openid      : sOpenId,
						lang        : 'zh_CN'
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
