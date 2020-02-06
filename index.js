/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description Weixin (WeChat) Node serve SDK
 * @Since 2020/2/3
 */

const GzhSDK = require('./gzh');
const WebSDK = require('./web');
const WxaSDK = require('./wxa');
const PaySDK = require('./pay');

class Gzh extends GzhSDK {
	constructor(config) {
		super(config);
	}
}

class Web extends WebSDK {
	constructor(config) {
		super(config);
	}
}

class Wxa extends WxaSDK {
	constructor(config) {
		super(config);
	}
}

class Pay extends PaySDK {
	constructor(config) {
		super(config);
	}
}

class WxSDK {
	constructor(config) {
		Object.assign(this.config, {}, config);
		this.gzh = new Gzh(this.config);
		this.web = new Web(this.config);
		this.wxa = new Wxa(this.config);
		this.pay = new Pay(this.config);
		this.gzh.$root = this;
		this.web.$root = this;
		this.wxa.$root = this;
		this.pay.$root = this;
	}

	getConfig(childName) {
		const allConfig = {
			GZH: this.gzh.config,
			WEB: this.web.config,
			WXA: this.wxa.config,
			PAY: this.pay.config
		};
		return childName ? allConfig[childName] : allConfig;
	}

	config = {
		appId : '',
		secret: '',

		token : '', // 公众号开发配置 token
		AESKey: '', // 公众号开发配置密钥

		pay: {
			mchId       : '', // 微信支付商户号
			mchKey      : '', // 微信支付 API key
			serverIp    : '', // 服务器 IP
			payNotify   : '', // 支付结果通知 URL
			refundNotify: '', // 退款结果通知 URL
			certPath    : ''  // 支付证书本地存放路径
		}
	};
}

module.exports = WxSDK;
