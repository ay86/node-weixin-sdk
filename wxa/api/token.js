/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信小程序用户授权 TOKEN
 * @Since 2020/2/4
 */

const axios = require('axios');
const util = require('../../utils');

const cache = util.cache;

module.exports = function () {
	const conf = this.config;
	return new Promise((resolve, reject) => {
		const sAccessToken = cache.get('wxa.accessToken');
		if (!sAccessToken) {
			axios.get('https://api.weixin.qq.com/cgi-bin/token', {
				params: {
					grant_type: 'client_credential',
					appid     : conf.appId,
					secret    : conf.secret
				}
			}).then(
				({data: jRes}) => {
					if (jRes.errcode) {
						reject(jRes);
					}
					else {
						cache.set('wxa.accessToken', jRes.access_token, 7000 * 1000);
						resolve(jRes.access_token);
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
		}
		else {
			resolve(sAccessToken);
		}
	});
};
