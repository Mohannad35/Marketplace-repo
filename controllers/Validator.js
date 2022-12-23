
const { func } = require('joi');
const Joi = require('joi');

class Validator {
	static validate_new_account(new_account) {
		const Schema = Joi.object({
			name: Joi.string().min(3).max(40).required(),
			login: Joi.string().alphanum().min(3).max(60).required(),
			password: Joi.string().min(8).max(30)
				.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
			balance: Joi.number().positive().precision(2).required()
		});
		const result = Schema.validate(new_account);
		return result;
	}
	static validate_login(account) {
		const Schema = Joi.object({
			login: Joi.string().alphanum().min(3).max(60).required(),
			password: Joi.string().min(8).max(30)
				.pattern(new RegExp('^[a-zA-Z0-9]')).required(),
		});
		var result = Schema.validate(account);
		return result;
	}
	static validate_user(account) {
		const Schema = Joi.object({
			uid: Joi.number().positive().integer(),
			login: Joi.string().alphanum().min(3).max(60)
		}).xor('uid', 'login');
		var result = Schema.validate(account);
		return result;
	}

}

module.exports = Validator;