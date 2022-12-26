const mysql = require('mysql')

const db1 = {
  host: "localhost",
  port: "3306",
  user: "sqluser",
  password: "1234",
  database: "marketplace"
};
const db2 = {
  host: "localhost",
  port: "3307",
  user: "sqluser",
  password: "12345678",
  database: "marketplace"
};

const db_con_1 = mysql.createConnection(db1);
db_con_1.connect(async (err) => {
  if (err) console.log("Database 1 Connection Failed");
  else console.log("connected to Database 1");
});
const db_con_2 = mysql.createConnection(db2);
db_con_2.connect(async (err) => {
  if (err) console.log("Database 2 Connection Failed");
  else {
    console.log("connected to Database 2");
    const result = await sync_dbs(db_con_1, db_con_2);
    console.log(result);
  }
});

async function sync_dbs(db, db2) {
  return new Promise(resolve => {
    db.query("select * from user", [], (error, result) => {
      if (!error) {
        let flag = false;
        for (let index = 0; index < result.length; index++) {
          flag = true;
          const element = result[index];
          db2.query("select * from user where uid=?", [element.uid], (err, result2) => {
            if (!err) {
              db2.query("update user set u_name=?, login=?, u_password=?, balance=? where uid=?",
                [element.u_name, element.login, element.u_password, element.balance, element.uid],
                (error, result1) => {
                  if (!error) {
                    flag = false;
                  }
                })
            }
          });
          if (flag) {
            db2.query("insert into user (uid, u_name, login, u_password, balance) VALUES (?,?,?,?,?)",
              [element.uid, element.u_name, element.login, element.u_password, element.balance],
              (err, result2) => {
                if (!err) {
                }
              });
          }
        }
      }
    });
    db.query("select * from item", [], (error, result) => {
      if (!error) {
        let flag = false;
        for (let index = 0; index < result.length; index++) {
          flag = true;
          const element = result[index];
          db2.query("select * from item where item_id=?", [element.item_id], (err, result2) => {
            if (!err) {
              db2.query("update user set item_uid=?, item_name=?, item_state=?, item_price=?, created_date=?, sale_date=?, purchased_by=? where item_id=?",
                [element.item_uid, element.item_name, element.item_state, element.item_price, element.created_date, element.sale_date, element.purchased_by, element.item_id],
                (error, result1) => {
                  if (!error) {
                    flag = false;
                  }
                })
            }
          });
          if (flag) {
            db2.query("insert into item (item_id, item_uid, item_name, item_state, item_price, created_date, sale_date, purchased_by) VALUES (?,?,?,?,?,?,?,?)",
              [element.item_id, element.item_uid, element.item_name, element.item_state, element.item_price, element.created_date, element.sale_date, element.purchased_by],
              (err, result2) => {
                if (!err) {
                }
              });
          }
        }
      }
    });
    resolve("Datebases sync");
  });
}

module.exports = [db_con_1, db_con_2];