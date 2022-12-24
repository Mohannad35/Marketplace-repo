// const { string } = require('joi');
const [db, db2] = require('../config/db')

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
  static async check_item_user(item_uid) {
    return new Promise(resolve => {
      db.query("select * from user where uid=?", [item_uid], (error, result) => {
        if (!error) {
          if (result.length) resolve(true);
          resolve(false);
        }
        else {
          db2.query("select * from user where uid=?", [item_uid], (error, result) => {
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
  static async item() {

  }
  static async additem(item_id, item_uid, item_name, item_state = "new", item_price,
    sale_date = null, purchased_by = null) {
    return new Promise(async resolve => {
      const exist_id = await this.checkitem(item_id);
      const exist_sell = await this.check_item_user(item_uid);
      const exist_buy = await this.check_item_user(purchased_by);
      if (exist_id) resolve("item id already exist. try again with different id");
      if (!exist_sell) resolve("item owner id dosn't exist. try again with a valid user id");
      if ((purchased_by) && (!exist_buy)) resolve("item buyer id dosn't exist. try again with a valid user id");
      if (item_id) {
        db.query("INSERT INTO item (item_id, item_uid, item_name, item_state, item_price,\
          sale_date, purchased_by) VALUES (?,?,?,?,?,?,?)",
          [item_id, item_uid, item_name, item_state, item_price, sale_date, purchased_by],
          (err, result) => {
            if (!err) {
              resolve("Created successfully");
            }
            else {
              db2.query("INSERT INTO item (item_id, item_uid, item_name, item_state, item_price,\
                sale_date, purchased_by) VALUES (?,?,?,?,?,?,?)",
                [item_id, item_uid, item_name, item_state, item_price, sale_date, purchased_by],
                (err, result) => {
                  if (!err) {
                    resolve("Created successfully");
                  }
                  else {
                    resolve(err.sqlMessage);
                  }
                });
            }
          });
      }
      else {
        db.query("INSERT INTO item (item_uid, item_name, item_state, item_price,\
          sale_date, purchased_by) VALUES (?,?,?,?,?,?)",
          [item_uid, item_name, item_state, item_price, sale_date, purchased_by],
          (err, result) => {
            if (!err) {
              resolve("Created successfully");
            }
            else {
              db2.query("INSERT INTO item (item_uid, item_name, item_state, item_price,\
                sale_date, purchased_by) VALUES (?,?,?,?,?,?)",
                [item_uid, item_name, item_state, item_price, sale_date, purchased_by],
                (err, result) => {
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
    });
  }
}

module.exports = ItemModel