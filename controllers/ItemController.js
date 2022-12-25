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
    const validate_result = Validator.validate_add_item(req.body);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const item_id = req.body.item_id;
    const item_uid = req.body.item_uid;
    const item_name = req.body.item_name;
    const item_state = req.body.item_state;
    const item_price = req.body.item_price;
    const sale_date = req.body.sale_date;
    const purchased_by = req.body.purchased_by;
    const db_result = await itemModel.additem(item_id, item_uid, item_name,
      item_state, item_price, sale_date, purchased_by);
    if (db_result == "Database down!") res.status(503).send(db_result);
    else if (db_result == "Created successfully") res.status(201).send(db_result);
    else res.status(404).send(db_result);
  }
  static async edit_item(req, res) {
    const validate_result = Validator.validate_edit_item(req.body);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const item_id = req.body.item_id;
    const item_uid = req.body.item_uid;
    const item_name = req.body.item_name;
    const item_state = req.body.item_state;
    const item_price = req.body.item_price;
    const sale_date = req.body.sale_date;
    const purchased_by = req.body.purchased_by;
    const db_result = await itemModel.edit_item(item_id, item_uid, item_name,
      item_state, item_price, sale_date, purchased_by);
    if (db_result == "Database down!") res.status(503).send(db_result);
    else res.send(db_result);
  }
  static async remove_item(req, res) {
    const validate_result = Validator.validate_item(req.params);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const item_id = req.params.item_id;
    const db_result = await itemModel.remove_item(item_id);
    if (db_result == "Database down!") res.status(503).send(db_result);
    else if (db_result == "Item doesn't exist") res.status(404).send(db_result);
    else res.send(db_result);
  }

}

module.exports = ItemController;