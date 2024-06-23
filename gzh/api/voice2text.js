/**
 * @Author AngusYoung <angusyoung@mrxcool.com>
 * @Description 公众号语音转文字
 * @Since 2024/6/21
 */

const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const FormData = require('form-data');
const {Readable} = require('node:stream');

module.exports = function(voiceId) {
	return this.token().then(
		token => {
			// console.log(token)
			return new Promise(async (resolve, reject) => {
				// 获取语音文件
				const sound = await this.getMaterial(voiceId).then(
					buffer => {
						return new Promise((resolve, reject) => {
							try {
								// 创建一个从 buffer 读取的 stream
								const readable = new Readable({
									read(size) {
										// 当流需要数据时，这个方法会被调用
										// 我们检查 Buffer 是否还有数据可以读取
										if (buffer.length > 0) {
											// 将一部分数据推送到流中
											this.push(buffer.slice(0, size));
											// 更新 Buffer，移除已推送的数据
											buffer = buffer.slice(size);
										}
										else {
											// 没有更多数据时，推送 null 来结束流
											this.push(null);
										}
									}
								});
								// 从 stream 输入并转换格式后输出流
								const fileStream = ffmpeg(readable)
									.format('mp3')
									.audioBitrate('16k')
									// .preset('flashvideo')
									// setup event handlers
									// .on('end', function() {
									// 	console.log('done processing input stream');
									// })
									.on('error', function(err) {
										// console.log('an error happened: ' + err.message);
										reject();
									})
									// save to file
									// .save('test.mp3');
									// save to stream
									.pipe();

								const chunks = [];
								fileStream.on('data', chuck => {
									chunks.push(chuck);
								});
								fileStream.on('end', () => {
									const bf = Buffer.concat(chunks);
									resolve(bf);
								});
							}
							catch (e) {
								reject();
							}
						});
					},
					() => null
				);
				if (!sound) {
					return reject({errcode: 404, errmsg: '获取或转换语音文件失败'});
				}
				// console.log(sound)
				const formData = new FormData();
				formData.append('voice', sound);
				// 提交语音文件
				axios.post('https://api.weixin.qq.com/cgi-bin/media/voice/addvoicetorecofortext', formData, {
					params : {
						access_token: token,
						format      : 'mp3',
						voice_id    : voiceId,
						lang        : 'zh_CN'
					},
					headers: formData.getHeaders()
				}).then(
					({data}) => {
						if (data.errcode) {
							reject(data);
							return;
						}
						// 查询转换结果
						axios.post('https://api.weixin.qq.com/cgi-bin/media/voice/queryrecoresultfortext', null, {
							params: {
								access_token: token,
								voice_id    : voiceId,
								lang        : 'zh_CN'
							}
						}).then(
							({data: res}) => {
								// console.log(res);
								if (res.result) {
									resolve(res.result);
								}
								else {
									reject({errcode: 400, errmsg: '无法获取语音识别结果'});
								}
							}
						);
					}
				).catch(error => {
					if (error.response) {
						let {status, statusText, data} = error.response;
						reject({errcode: status, errmsg: statusText, data});
					}
					else {
						reject({errcode: 400});
					}
				});
			});
		},
		error => Promise.reject(error)
	);
}