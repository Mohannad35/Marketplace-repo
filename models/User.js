// const { string } = require('joi');
const [db, db2] = require('../config/db')

class UserModel {
  static async checkuser(id = 0, login) {
    return new Promise(resolve => {
      if (id) {
        db.query("select * from user where uid=?", [id], (error, result) => {
          if (!error) {
            if (result.length) resolve(true);
            resolve(false);
          }
          else {
            db2.query("select * from user where uid=?", [id], (error, result) => {
              if (!error) {
                if (result.length) resolve(true);
                resolve(false);
              }
            });
          }
        });
      }
      db.query("select * from user where login=?", [login], (error, result) => {
        if (!error) {
          if (result.length) resolve(true);
          resolve(false);
        }
        else {
          db2.query("select * from user where login=?", [login], (error, result) => {
            if (!error) {
              if (result.length) resolve(true);
              resolve(false);
            }
          });
        }
      });
    });
  }
  static async getusers() {
    return new Promise(resolve => {
      db.query("select * from user", [], (error, result) => {
        if (!error) {
          if (result.length) resolve(result);
          resolve("Database is empty!");
        }
        db2.query("select * from user", [], (error, result) => {
          if (!error) {
            if (result.length) resolve(result);
            resolve("Database is empty!");
          }
          else resolve("Database down!");
        });
      });
    });
  }
  static async getuser(id, login) {
    return new Promise(resolve => {
      if (id) {
        db.query("select * from user where uid=?", [id], (error, result) => {
          if (!error) {
            if (result.length) resolve(result);
            resolve("User not found");
          }
          else {
            db2.query("select * from user where uid=?", [id], (error, result) => {
              if (!error) {
                if (result.length) resolve(result);
                resolve("User not found");
              }
            });
          }
        });
      }
      db.query("select * from user where login=?", [login], (error, result) => {
        if (!error) {
          if (result.length) resolve(result);
          resolve("User not found");
        }
        else {
          db2.query("select * from user where login=?", [login], (error, result) => {
            if (!error) {
              if (result.length) resolve(result);
              resolve("User not found");
            }
          });
        }
      });
    });
  }
  static async add_account(id, name, login, balance, pass) {
    return new Promise(async resolve => {
      let exist = await this.checkuser(id, login);
      if (exist) {
        if (id) resolve("User id already exist. try again with different id");
        resolve("User login already exist. try again with different login");
      }
      if (id) {
        db.query("INSERT INTO user (uid, u_name, login, balance, u_password) VALUES (?,?,?,?,?)",
          [id, name, login, balance, pass], (err, result) => {
            if (!err) {
              resolve("Created successfully");
            }
            else {
              db2.query("INSERT INTO user (uid, u_name, login, balance, u_password) VALUES (?,?,?,?,?)",
                [id, name, login, balance, pass], (err, result) => {
                  if (!err) {
                    resolve("Created successfully");
                  }
                  else {
                    resolve("Database down!");
                  }
                });
            }
          });
      }
      db.query("INSERT INTO user (u_name, login, balance, u_password) VALUES (?,?,?,?)",
        [name, login, balance, pass], (err, result) => {
          if (!err) {
            resolve("Created successfully");
          }
          else {
            db2.query("INSERT INTO user (u_name, login, balance, u_password) VALUES (?,?,?,?,?)",
              [name, login, balance, pass], (err, result) => {
                if (!err) {
                  resolve("Created successfully");
                }
                else {
                  resolve("Database down!");
                }
              });
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
        else {
          db2.query("select * from user where login = ?", [login], (err, result) => {
            if (!err) {
              if (result.length) {
                if (result[0].u_password == pass) resolve("Login successfully");
                else resolve("Wrong password");
              }
              resolve("Wrong login");
            }
            else {
              resolve("Database down!");
            }
          });
        }
      });
    })
  }
  static async deposit_cash(login, pass, balance) {
    return new Promise(async resolve => {
      const login_user_result = await this.login_user(login, pass);
      const list1 = ["Database down!", "Wrong login", "Wrong password"];
      if (list1.includes(login_user_result)) {
        resolve(login_user_result);
      }
      else if (login_user_result == "Login successfully") {
        const user1 = await this.getuser(0, login);
        const new_balance = user1[0].balance + balance;
        db.query("UPDATE user SET balance=? WHERE login=?", [new_balance, login],
          (err, result) => {
            if (err) {
              db2.query("UPDATE user SET balance=? WHERE login=?", [new_balance, login],
                (err, result) => {
                  if (err) {
                    resolve("Database down!")
                    return;
                  }
                });
            }
          });
        resolve(user1);
      }
    });
  }
  static async search_items(login, pass) {
    return new Promise(async resolve => {
      const login_user_result = await this.login_user(login, pass);
      const list1 = ["Database down!", "Wrong login", "Wrong password"];
      if (list1.includes(login_user_result)) {
        resolve(login_user_result);
      }
      else if (login_user_result == "Login successfully") {
        const user1 = await this.getuser(0, login);
        db.query("select * from item WHERE item_uid!=?", [user1[0].uid], (error, result) => {
          if (!error) {
            if (result.length) resolve(result);
            resolve("No items found!");
          }
          db2.query("select * from item WHERE item_uid!=?", [user1[0].uid], (error, result) => {
            if (!error) {
              if (result.length) resolve(result);
              resolve("No items found!");
            }
            else resolve("Database down!");
          });
        });
      }
    });
  }
  static async deluser(id, login) {
    return new Promise(async resolve => {
      let exist = await this.checkuser(id, login);
      if (!exist) resolve("User dosn't exist")
      const user1 = this.getuser(id, login);
      if (id)
        db.query("DELETE FROM user where uid=?", [id], (err, result) => {
          if (!err) {
            resolve(user1);
          }
          else {
            db2.query("DELETE FROM user where uid=?", [id], (err, result) => {
              if (!err) {
                resolve(user1);
              }
              else {
                resolve("Database down!");
              }
            });
          }
        });
      db.query("DELETE FROM user where login=?", [login], (err, result) => {
        if (!err) {
          resolve(user1);
        }
        else {
          db2.query("DELETE FROM user where login=?", [login], (err, result) => {
            if (!err) {
              resolve(user1);
            }
            else {
              resolve("Database down!");
            }
          });
        }
      });
    });
  }
}

module.exports = UserModel