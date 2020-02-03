/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description Utils
 * @Since 2020/2/3
 */

const Lru = require('lru-cache');

const cache = new Lru({
	max   : 2000,
	maxAge: 1000 * 60 * 60 * 2 // 2h
});

module.exports = {
	cache
};
