/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 验证 TOKEN 是否有效
 * @Since 2020/2/3
 */

const axios = require('axios');

module.exports = function (token, openId) {
	return new Promise((resolve, reject) => {
		axios.get(`https://api.weixin.qq.com/sns/auth?access_token=${token}&openid=${openId}`).then(
			({data: jRes}) => {
				if (jRes.errcode) {
					reject();
				}
				else {
					resolve();
				}
			},
			() => {
				reject();
			}
		);
	});
};
