/**
 * @Author AngusYoung <angusyoung@mrxcool.com>
 * @Description 加解密消息
 * @Since 2024/6/11
 */

const {randomString} = require('../../utils');
const crypto = require('node:crypto');

const pkcs7 = {
	encode(text) {
		// 块长度32b
		const blockSize = 32;
		const len = text.length;
		// 计算需要填充的位数
		const padding = blockSize - (len % blockSize);
		const padBuffer = Buffer.alloc(padding);
		padBuffer.fill(padding);
		return Buffer.concat([text, padBuffer]);
	},
	decode(text) {
		// 判断最后一位是否补充字符，范围是在1-32之间
		// 再进行截取
		let maybePadding = text[text.length - 1];
		if (maybePadding < 1 || maybePadding > 32) {
			maybePadding = 0;
		}
		// 根据填充长度截取掉补充数据
		return text.slice(0, text.length - maybePadding);
	}
}

module.exports = {
	// 解密
	decrypt(data) {
		const aesKey = this.config.AESKey + '=';
		const key = Buffer.from(aesKey, 'base64');
		const iv = key.slice(0, 16);
		try {
			const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
			const decode = decipher.setAutoPadding(false).update(data, 'base64');
			const decrypted = Buffer.concat([decode, decipher.final()]);
			const fixPadding = pkcs7.decode(decrypted);
			// 去掉前16b的随机数据，前4b是消息长度，解析后用来获取消息原文+appid的数据
			const content = fixPadding.slice(16);
			const len = content.slice(0, 4).readUInt32BE(0);

			return [
				false, {
					content: content.slice(4, len + 4).toString(),
					appid  : content.slice(len + 4).toString()
				}
			];
		}
		catch (e) {
			return [true, e];
		}
	},
	// 加密
	encrypt(data) {
		const aesKey = this.config.AESKey + '=';
		const key = Buffer.from(aesKey, 'base64');
		const iv = key.slice(0, 16);
		// 随机16个字符
		const randomStr = Buffer.from(randomString()).slice(0, 16);

		const msg = Buffer.from(data);
		// 	获取4b的内容长度
		const bufLen = Buffer.alloc(4);
		bufLen.writeUInt32BE(msg.length, 0);

		const appid = Buffer.from(this.config.appId);
		const bufferMsg = Buffer.concat([randomStr, bufLen, msg, appid]);

		const content = pkcs7.encode(bufferMsg);

		const encipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		const encode = encipher.setAutoPadding(false).update(content);
		const encrypted = Buffer.concat([encode, encipher.final()]);

		return encrypted.toString('base64');
	}
}