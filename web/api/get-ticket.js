/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 获取授权凭证（实际上这是公众号开放的接口，但是应用是在网页应用上）
 * @Group gzh
 * @Since 2020/2/3
 */

const axios = require('axios');
const util = require('../../utils');
const cache = util.cache;

module.exports = function () {
	return this.$root.gzh.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				const sTicket = cache.get('web.ticket');
				if (!sTicket) {
					axios.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
						params: {
							access_token: sToken,
							type        : 'jsapi'
						}
					}).then(
						({data: jRes}) => {
							if (jRes.errcode) {
								reject(jRes);
							}
							else {
								cache.set('web.ticket', jRes.ticket, (jRes.expires_in - 100) * 1000);
								resolve(jRes.ticket);
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
					resolve(sTicket);
				}
			});
		},
		error => {
			return Promise.reject(error);
		}
	);
};
