const [db, db2] = require('../config/db');

class ItemModel {
  static async checkitem(item_id) {
    return new Promise(resolve => {
      db.query("select * from item where item_id=?", [item_id], (error, result) => {
        if (!error) {
          if (result.length) resolve(true);
          resolve(false);
        }
        else {
          db2.query("select * from item where item_id=?", [item_id], (error, result) => {
            if (!error) {
              if (result.length) resolve(true);
              resolve(false);
            }
          });
        }
      });
    });
  }
  static async items() {
    return new Promise(resolve => {
      db.query("select * from item", [], (error, result) => {
        if (!error) {
          if (result.length) resolve(result);
          resolve("Database is empty!");
        }
        db2.query("select * from item", [], (error, result) => {
          if (!error) {
            if (result.length) resolve(result);
            resolve("Database is empty!");
          }
          else resolve("Database down!");
        });
      });
    });
  }
  static async item(item_id) {
    return new Promise(resolve => {
      db.query("select * from item WHERE item_id=?", [item_id], (error, result) => {
        if (!error) {
          if (result.length) resolve(result[0]);
          else {
            resolve(false);
            return;
          }
        }
        db2.query("select * from item WHERE item_id=?", [item_id], (error, result) => {
          if (!error) {
            if (result.length) resolve(result[0]);
            else {
              resolve(false);
              return;
            }
          }
          else resolve("Database down!");
        });
      });
    });
  }
  static async get_user_items(item_uid) {
    return new Promise(resolve => {
      db.query("select * from item WHERE item_uid=?", [item_uid], (error, result) => {
        if (!error) {
          if (result.length) resolve(result);
          else {
            resolve(false);
            return;
          }
        }
        db2.query("select * from item WHERE item_uid=?", [item_uid], (error, result) => {
          if (!error) {
            if (result.length) resolve(result);
            else {
              resolve(false);
              return;
            }
          }
          else resolve("Database down!");
        });
      });
    });
  }
  static async get_user_purchased_items(purchased_by) {
    return new Promise(resolve => {
      db.query("select * from item WHERE purchased_by=?", [purchased_by], (error, result) => {
        if (!error) {
          if (result.length) resolve(result);
          else {
            resolve(false);
            return;
          }
        }
        db2.query("select * from item WHERE purchased_by=?", [purchased_by], (error, result) => {
          if (!error) {
            if (result.length) resolve(result);
            else {
              resolve(false);
              return;
            }
          }
          else resolve("Database down!");
        });
      });
    });
  }
  static async edit_item(login, password, item_id, item_name, item_price) {
    return new Promise(async resolve => {
      const exist_id = await this.checkitem(item_id);
      if (!exist_id) resolve("item id dosn't exist. try again with different id");
      const login_user_result = await this.login_user(login, password);
      const list1 = ["Database down!", "Wrong login", "Wrong password"];
      if (list1.includes(login_user_result)) {
        resolve(login_user_result);
      }
      else if (login_user_result == "Login successfully") {
        const user1 = await this.get_user_login(login, password);
        const item1 = await this.item(item_id);
        if (user1.uid != item1.item_uid) {
          resolve("you can only edit your items.")
          return;
        }
        if (item_name) {
          db.query("UPDATE item SET item_name=? WHERE item_id=?", [item_name, item_id],
            (err, result) => {
              if (err) {
                db2.query("UPDATE item SET item_name=? WHERE item_id=?", [item_name, item_id],
                  (err, result) => {
                    if (err) {
                      resolve("Database down!")
                      return;
                    }
                  });
              }
            });
        }
        if (item_price) {
          db.query("UPDATE item SET item_price=? WHERE item_id=?", [item_price, item_id],
            (err, result) => {
              if (err) {
                db2.query("UPDATE item SET item_price=? WHERE item_id=?", [item_price, item_id],
                  (err, result) => {
                    if (err) {
                      resolve("Database down!")
                      return;
                    }
                  });
              }
            });
        }
        const new_item = this.item(item_id);
        resolve(new_item);
      }
    });
  }
  static async additem(login, password, item_id, item_name, item_price) {
    return new Promise(async resolve => {
      const exist_id = await this.checkitem(item_id);
      if (exist_id) resolve("item id already exist. try again with different id");
      const login_user_result = await this.login_user(login, password);
      const list1 = ["Database down!", "Wrong login", "Wrong password"];
      if (list1.includes(login_user_result)) {
        resolve(login_user_result);
      }
      else if (login_user_result == "Login successfully") {
        const user1 = await this.get_user_login(login, password);
        if (item_id) {
          db.query("INSERT INTO item (item_id, item_uid, item_name, item_state, item_price) VALUES (?,?,?,?,?)",
            [item_id, user1.uid, item_name, "new", item_price],
            async (err, result) => {
              if (!err) {
                const item1 = await this.item(item_id);
                resolve(item1);
              }
              else {
                db2.query("INSERT INTO item (item_id, item_uid, item_name, item_state, item_price) VALUES (?,?,?,?,?)",
                  [item_id, user1.uid, item_name, "new", item_price],
                  async (err, result) => {
                    if (!err) {
                      const item1 = await this.item(item_id);
                      resolve(item1);
                    }
                    else {
                      resolve("Database down!");
                    }
                  });
              }
            });
        }
        else {
          db.query("INSERT INTO item (item_uid, item_name, item_state, item_price) VALUES (?,?,?,?)",
            [user1.uid, item_name, "new", item_price],
            (err, result) => {
              if (!err) {
                db.query("select last_insert_id();", [], async (err, result) => {
                  const item_id = result[0]['last_insert_id()'];
                  const new_item = await this.item(item_id);
                  resolve(new_item);
                });
              }
              else {
                db2.query("INSERT INTO item (item_uid, item_name, item_state, item_price) VALUES (?,?,?,?)",
                  [user1.uid, item_name, "new", item_price],
                  (err, result) => {
                    if (!err) {
                      db.query("select last_insert_id();", [], async (err, result) => {
                        const item_id = result[0]['last_insert_id()'];
                        const new_item = await this.item(item_id);
                        resolve(new_item);
                      });
                    }
                    else {
                      resolve("Database down!");
                    }
                  });
              }
            });
        }
      }
    });
  }
  static async remove_item(login, password, item_id) {
    return new Promise(async resolve => {
      let exist = await this.checkitem(item_id);
      if (!exist) resolve("Item doesn't exist")
      const item1 = await this.item(item_id);
      const login_user_result = await this.login_user(login, password);
      const list1 = ["Database down!", "Wrong login", "Wrong password"];
      if (list1.includes(login_user_result)) {
        resolve(login_user_result);
      }
      else if (login_user_result == "Login successfully") {
        const user1 = await this.get_user_login(login, password);
        if (user1.uid != item1.item_uid) {
          resolve("you can only delete your items.");
          return;
        }
        db.query("DELETE FROM item where item_id=?", [item_id], (err, result) => {
          if (!err) {
            resolve(item1);
          }
          else {
            db2.query("DELETE FROM item where item_id=?", [item_id], (err, result) => {
              if (!err) {
                resolve(item1);
              }
              else {
                resolve("Database down!");
              }
            });
          }
        });
      }
    });
  }
  static async reset_item(item_id, item_state, sale_date, purchased_by) {
    return new Promise(async resolve => {
      const exist_id = await this.checkitem(item_id);
      if (!exist_id) resolve("item id dosn't exist. try again with different id");
      if (purchased_by) {
        const exist_buy = await this.checkuser(purchased_by, null);
        if ((purchased_by) && (!exist_buy)) resolve("item buyer id dosn't exist. try again with a valid user id");
      }
      if (item_state) {
        db.query("UPDATE item SET item_state=? WHERE item_id=?", [item_state, item_id],
          (err, result) => {
            if (err) {
              db2.query("UPDATE item SET item_state=? WHERE item_id=?", [item_state, item_id],
                (err, result) => {
                  if (err) {
                    resolve("Database down!")
                    return;
                  }
                });
            }
          });
      }
      if (sale_date == "") {
        db.query("UPDATE item SET sale_date=? WHERE item_id=?", [null, item_id],
          (err, result) => {
            if (err) {
              db2.query("UPDATE item SET sale_date=? WHERE item_id=?", [null, item_id],
                (err, result) => {
                  if (err) {
                    resolve("Database down!")
                    return;
                  }
                });
            }
          });
      }
      else if (sale_date == "now") {
        db.query("UPDATE item SET sale_date=current_timestamp WHERE item_id=?", [item_id],
          (err, result) => {
            if (err) {
              db2.query("UPDATE item SET sale_date=current_timestamp WHERE item_id=?", [item_id],
                (err, result) => {
                  if (err) {
                    resolve("Database down!")
                    return;
                  }
                });
            }
          });
      }
      if (purchased_by == 0) {
        db.query("UPDATE item SET purchased_by=? WHERE item_id=?", [null, item_id],
          (err, result) => {
            if (err) {
              db2.query("UPDATE item SET purchased_by=? WHERE item_id=?", [null, item_id],
                (err, result) => {
                  if (err) {
                    resolve("Database down!")
                    return;
                  }
                });
            }
          });
      }
      else if (purchased_by) {
        db.query("UPDATE item SET purchased_by=? WHERE item_id=?", [purchased_by, item_id],
          (err, result) => {
            if (err) {
              db2.query("UPDATE item SET purchased_by=? WHERE item_id=?", [purchased_by, item_id],
                (err, result) => {
                  if (err) {
                    resolve("Database down!")
                    return;
                  }
                });
            }
          });
      }
      const new_item = this.item(item_id);
      resolve(new_item);
    });
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
  static async checkuser(id) {
    return new Promise(resolve => {
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
    });
  }
}

module.exports = ItemModel