const itemModel = require('../models/Item');
const Validator = require('./Validator')

class ItemController {
  static async getitems(req, res) {
    var results = await itemModel.items();
    res.send(results);
  }
  static async getitem(req, res) {
    const validate_result = Validator.validate_item(req.params);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const item_id = req.params.item_id;
    var db_result = await itemModel.item(item_id);
    if (db_result == false) res.status(404).send("item not found");
    else if (db_result == "Database down!") res.status(503).send(db_result);
    else res.status(200).send(db_result);
  }
  static async additem(req, res) {
    const validate_params_result = Validator.validate_login(req.params);
    if (validate_params_result.error) return res.status(400).send(validate_params_result.error.details[0].message);
    const validate_body_result = Validator.validate_add_item(req.body);
    if (validate_body_result.error) return res.status(400).send(validate_body_result.error.details[0].message);
    const login = req.params.login;
    const password = req.params.password;
    const item_id = req.body.item_id;
    const item_name = req.body.item_name;
    const item_price = req.body.item_price;
    const db_result = await itemModel.additem(login, password, item_id, item_name, item_price);
    if (db_result == "Database down!") res.status(503).send(db_result);
    else res.send(db_result);
  }
  static async edit_item(req, res) {
    const validate_params_result = Validator.validate_login(req.params);
    if (validate_params_result.error) return res.status(400).send(validate_params_result.error.details[0].message);
    const validate_body_result = Validator.validate_edit_item(req.body);
    if (validate_body_result.error) return res.status(400).send(validate_body_result.error.details[0].message);
    const login = req.params.login;
    const password = req.params.password;
    const item_id = req.body.item_id;
    const item_name = req.body.item_name;
    const item_price = req.body.item_price;
    const db_result = await itemModel.edit_item(login, password, item_id, item_name, item_price);
    if (db_result == "Database down!") res.status(503).send(db_result);
    else res.send(db_result);
  }
  static async remove_item(req, res) {
    const validate_result = Validator.validate_delete(req.params);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const login = req.params.login;
    const password = req.params.password;
    const item_id = req.params.item_id;
    const db_result = await itemModel.remove_item(login, password, item_id);
    if (db_result == "Database down!") res.status(503).send(db_result);
    else if (db_result == "Item doesn't exist") res.status(404).send(db_result);
    else res.send(db_result);
  }

}

module.exports = ItemController;