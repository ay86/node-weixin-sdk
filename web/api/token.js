/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 网页应用获取 TOKEN
 * @Since 2020/2/3
 * @returns {Promise<Object>}
 *  {
	  "access_token":"ACCESS_TOKEN",
	  "expires_in":7200,
	  "refresh_token":"REFRESH_TOKEN",
	  "openid":"OPENID",
	  "scope":"SCOPE"
	 }
   or
    {"errcode":40029,"errmsg":"invalid code"}
 */

const axios = require('axios');

module.exports = function (code) {
	const conf = this.config;
	return new Promise((resolve, reject) => {
		axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
			params: {
				appid     : conf.appId,
				secret    : conf.secret,
				code,
				grant_type: 'authorization_code'
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
};
