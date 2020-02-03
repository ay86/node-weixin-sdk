/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 授权页面跳转
 * @Since 2020/2/3
 */

module.exports = function (backUrl,
                           state = 'wxWebRedirect',
                           scope = 'snsapi_base',
                           type  = 'client') {
	const conf = this.config;
	const url = encodeURIComponent(backUrl);
	const weixinApi = {
		client: 'https://open.weixin.qq.com/connect/oauth2/authorize',
		pc    : 'https://open.weixin.qq.com/connect/qrconnect'
	}[type];
	return `${weixinApi}?appid=${conf.appId}&redirect_uri=${url}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
};
