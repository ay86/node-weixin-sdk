/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 获取微信用户信息
 * @Since 2020/2/3
 * @returns {Promise<Object>}
 *
		{
		  "openid":" OPENID",
		  "nickname": NICKNAME,
		  "sex":"1",
		  "province":"PROVINCE"
		  "city":"CITY",
		  "country":"COUNTRY",
		  "headimgurl": "http://thirdwx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
		  "privilege":[ "PRIVILEGE1" "PRIVILEGE2" ],
		  "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
		}
   or
      {"errcode":40029,"errmsg":"invalid code"}
 */

const axios = require('axios');

module.exports = function (token, openid, lang = 'zh_CN') {
	return new Promise((resolve, reject) => {
		axios.get('https://api.weixin.qq.com/sns/userinfo', {
			params: {
				access_token: token,
				openid      : openid,
				lang        : lang
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
