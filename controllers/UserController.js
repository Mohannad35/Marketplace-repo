const userMod = require('../models/User');
const Validator = require('./Validator')

class UserController {

	static async getalluser(req, res) {
		var results = await userMod.getusers();
		if (results)
			res.send(results);
	}
	static async getuser(req, res) {
		const result = Validator.validate_user(req.body);
		if (result.error) return res.status(404).send(result.error.details[0].message);
		var results = await userMod.getuser(req.body.uid, req.body.login);
		res.send(results);
	}
	static async deleteuser(req, res) {
		var x = await userMod.deluser(req.params.id);
		// Response with the deleted course
		if (x)
			res.send("deleted successfully")
		else
			res.send("delete failed")
	}
	static async create_new_account(req, res) {
		// validate body params
		const result = Validator.validate_new_account(req.body);
		if (result.error) return res.status(404).send(result.error.details[0].message);
		const name = req.body.name;
		const login = req.body.login;
		const balance = req.body.balance;
		const password = req.body.password;
		const db_result = await userMod.add_account(name, login, balance, password);
		res.send(db_result);
	}
	static async login_account(req, res) {
		// validate body params
		const result = Validator.validate_login(req.body);
		if (result.error) return res.status(404).send(result.error.details[0].message);
		const login = req.body.login;
		const password = req.body.password;
		var db_result = await userMod.login_user(login, password);
		res.send(db_result);
	}
}

module.exports = UserController;