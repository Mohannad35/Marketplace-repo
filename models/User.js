// const { string } = require('joi');
const db = require('../config/db')

class UserModel {
	static async getusers() {
		return new Promise(resolve => {
			db.query("select * from user", [], (error, result) => {
				if (!error)
					resolve(result);
			});
		});
	}
	static async getuser(id, login) {
		return new Promise(resolve => {
			if (id) {
				db.query("select * from user where uid=?", [id], (error, result) => {
					if (!error) {
						if (result.length) resolve(result);
						resolve("User not found")
					}
					else resolve(error.sqlMessage);
				});
			}
			db.query("select * from user where login=?", [login], (error, result) => {
				if (!error) {
					if (result.length) resolve(result);
					resolve("User not found")
				}
				else resolve(error.sqlMessage);
			});
		});
	}
	static async deluser(id) {
		return new Promise(resolve => {
			db.query("DELETE FROM user where uid=?", [id], (err, result) => {
				if (!err)
					resolve(true);
				else
					resolve(false);
			});
		})
	}
	static async add_account(name, login, balance, pass) {
		return new Promise(resolve => {
			db.query("INSERT INTO user (u_name, login, balance, u_password) VALUES (?,?,?,?)",
				[name, login, balance, pass], (err, result) => {
					if (!err)
						resolve("Created successfully");
					else {
						resolve(err.sqlMessage);
					}
				});
		})
	}
	static async login_user(login, pass) {
		return new Promise(resolve => {
			db.query("select * from user where login = ?", [login], (err, result) => {
				if (!err) {
					if (result.length) {
						if (result[0].u_password == pass) resolve("Login successfully");
						else resolve("Wrong password");
					}
					resolve("Wrong login");
				}
				else resolve(err.sqlMessage);
			});
		})
	}
}

module.exports = UserModel