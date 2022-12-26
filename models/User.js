const [db, db2] = require('../config/db');
const itemModel = require('./Item');

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
      else {
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
      }
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
  static async getuser(id) {
    return new Promise(resolve => {
      db.query("select * from user where uid=?", [id], (error, result) => {
        if (!error) {
          if (result.length) resolve(result[0]);
          resolve("User not found");
        }
        else {
          db2.query("select * from user where uid=?", [id], (error, result) => {
            if (!error) {
              if (result.length) resolve(result[0]);
              resolve("User not found");
            }
          });
        }
      });
    });
  }
  static async get_user_login(login, password) {
    return new Promise(resolve => {
      db.query("select * from user where login = ?", [login], (err, result) => {
        if (!err) {
          if (result.length) {
            if (result[0].u_password == password) {
              resolve(result[0]);
              return;
            }
            else {
              resolve("Wrong password");
              return;
            }
          }
          resolve("Wrong login");
        }
        else {
          db2.query("select * from user where login = ?", [login], (err, result) => {
            if (!err) {
              if (result.length) {
                if (result[0].u_password == password) {
                  resolve(result[0]);
                  return;
                }
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
          [id, name, login, balance, pass], async (err, result) => {
            if (!err) {
              const user1 = await this.getuser(id);
              resolve(user1);
            }
            else {
              db2.query("INSERT INTO user (uid, u_name, login, balance, u_password) VALUES (?,?,?,?,?)",
                [id, name, login, balance, pass], async (err, result) => {
                  if (!err) {
                    const user1 = await this.getuser(id);
                    resolve(user1);
                  }
                  else {
                    resolve("Database down!");
                  }
                });
            }
          });
      }
      db.query("INSERT INTO user (u_name, login, balance, u_password) VALUES (?,?,?,?)",
        [name, login, balance, pass], async (err, result) => {
          if (!err) {
            const user1 = await this.get_user_login(login, pass);
            resolve(user1);
          }
          else {
            db2.query("INSERT INTO user (u_name, login, balance, u_password) VALUES (?,?,?,?)",
              [name, login, balance, pass], async (err, result) => {
                if (!err) {
                  const user1 = await this.get_user_login(login, pass);
                  resolve(user1);
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
    });
  }
  static async edit_cash(login, pass, balance, deposit_withdraw) {
    return new Promise(async resolve => {
      const login_user_result = await this.login_user(login, pass);
      const list1 = ["Database down!", "Wrong login", "Wrong password"];
      if (list1.includes(login_user_result)) {
        resolve(login_user_result);
      }
      else if (login_user_result == "Login successfully") {
        const user1 = await this.get_user_login(login, pass);
        let new_balance;
        if (deposit_withdraw) {
          new_balance = user1.balance + balance;
        }
        else {
          new_balance = user1.balance - balance;
        }
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
        const new_user = await this.get_user_login(login, pass);
        resolve(new_user);
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
        const user1 = await this.get_user_login(login, pass);
        db.query("select * from item WHERE item_uid!=?", [user1.uid], (error, result) => {
          if (!error) {
            if (result.length) resolve(result);
            resolve("No items found!");
          }
          db2.query("select * from item WHERE item_uid!=?", [user1.uid], (error, result) => {
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
  static async purchase_item(login, pass, item_id) {
    return new Promise(async resolve => {
      const login_user_result = await this.login_user(login, pass);
      const list1 = ["Database down!", "Wrong login", "Wrong password"];
      if (list1.includes(login_user_result)) {
        resolve(login_user_result);
      }
      else if (login_user_result == "Login successfully") {
        const user1 = await this.get_user_login(login, pass);
        const item1 = await itemModel.item(item_id);
        const user2 = await this.getuser(item1.item_uid);
        if (item1.item_state == "sold") {
          resolve("item sold!");
          return;
        }
        else if (item1.item_price > user1.balance) {
          resolve("Not enough balance");
          return;
        }
        else if (user1.uid == user2.uid) {
          resolve("You can't buy your own items");
          return;
        }
        const new_item1 = await itemModel.reset_item(item1.item_id, "sold", "now", user1.uid);
        const new_balance1 = await this.edit_cash(login, pass, item1.item_price, false);
        const new_balance2 = await this.edit_cash(user2.login, user2.u_password, item1.item_price, true);
        resolve([new_item1, new_balance1, new_balance2]);
      }
    });
  }
  static async view_account(login, pass) {
    return new Promise(async resolve => {
      const login_user_result = await this.login_user(login, pass);
      const list1 = ["Database down!", "Wrong login", "Wrong password"];
      if (list1.includes(login_user_result)) {
        resolve(login_user_result);
      }
      else if (login_user_result == "Login successfully") {
        const user1 = await this.get_user_login(login, pass);
        let list1 = [];
        let sell_items = await itemModel.get_user_items(user1.uid);
        let purchased_items = await itemModel.get_user_purchased_items(user1.uid);
        list1.push(user1);
        list1.push(sell_items);
        list1.push(purchased_items);
        resolve(list1);
      }
    });
  }
  static async deluser(id, login, password) {
    return new Promise(async resolve => {
      let exist = await this.checkuser(id, login);
      if (!exist) resolve("User dosn't exist")
      if (id) {
        const user1 = this.getuser(id);
        const error_flag = false;
        db.query("DELETE FROM user where uid=?", [id], (err, result) => {
          db2.query("DELETE FROM user where uid=?", [id], (err, result) => {
            if (!err) {
              resolve(user1);
              return;
            }
            else {
              error_flag = true;
            }
          });
          if (err && error_flag) {
            resolve("Database down!");
          }
        });
      }
      else {
        let arr = ["Database down!", "Wrong login", "Wrong password"];
        const user1 = this.get_user_login(login, password);
        if (arr.includes(user1)) {
          resolve(user1);
          return;
        }
        else {
          const error_flag = false;
          db.query("DELETE FROM user where login=?", [login], (err, result) => {
            db2.query("DELETE FROM user where login=?", [login], (err, result) => {
              if (!err) {
                resolve(user1);
                return;
              }
              else {
                error_flag = true;
              }
            });
            if (err && error_flag) {
              resolve("Database down!");
            }
          });
        }
      }
    });
  }
}

module.exports = UserModel