const crypto = require('crypto');

function Cryptr(salt, iv, algorithm){

	if(!salt || typeof salt !== 'string'){
		salt = 'defaultkey';
		throw new Error('Cryptr: key must be a non-0-length string');
	}

	if(!iv || typeof iv !== 'string'){
		iv = 'defaultiv';
		throw new Error('Cryptr: IV must be a non-0-length string');
	}

	algorithm = algorithm || 'aes-256-ctr';

	if(typeof algorithm !== 'string'){
		throw new Error('Cryptr: algorithm must be a string, see https://nodejs.org/api/crypto.html for details');
	}

	let key_hash = crypto.createHash('sha256');
	let iv_hash = crypto.createHash('md5');

	key = key_hash.update(salt).digest().slice(0, 32);
	iv = iv_hash.update(iv).digest().slice(0, 16);

	this.encrypt = function encrypt(value){
		if(value == null){
			throw new Error('value must not be null or undefined');
		}

		value = String(value);

		let cipher = crypto.createCipheriv(algorithm, key, iv);
		return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
	};

	this.decrypt = function decrypt(value){
		if(value == null){
			throw new Error('value must not be null or undefined');
		}

		value = String(value);

		let decipher = crypto.createDecipheriv(algorithm, key, iv);
		return decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
	};
}

module.exports = Cryptr;
