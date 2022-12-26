const userMod = require('../models/User');
const Validator = require('./Validator')

class UserController {

  static async getalluser(req, res) {
    var results = await userMod.getusers();
    res.send(results);
  }
  static async getuser(req, res) {
    const validate_result = Validator.validate_user(req.params);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    var results = await userMod.getuser(req.params.uid);
    res.send(results);
  }
  static async get_user_login(req, res) {
    const validate_result = Validator.validate_login(req.params);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    var results = await userMod.get_user_login(req.params.login, req.params.password);
    res.send(results);
  }
  static async deleteuser(req, res) {
    if (req.params.uid) {
      const validate_body_result = Validator.validate_user(req.params);
      if (validate_body_result.error)
        return res.status(400).send(validate_body_result.error.details[0].message);
      const result = await userMod.deluser(req.params.uid);
      res.send(result);
    }
    else {
      const validate_params_result = Validator.validate_login(req.params);
      if (validate_params_result.error)
        return res.status(400).send(validate_params_result.error.details[0].message);
      const result = await userMod.deluser(0, req.params.login, req.params.password);
      res.send(result);
    }
  }
  static async create_new_account(req, res) {
    // validate body params
    const validate_result = Validator.validate_new_account(req.body);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const id = req.body.id;
    const name = req.body.name;
    const login = req.body.login;
    const balance = req.body.balance;
    const password = req.body.password;
    const db_result = await userMod.add_account(id, name, login, balance, password);
    res.status(201).send(db_result);
  }
  static async login_account(req, res) {
    // validate body params
    const validate_result = Validator.validate_login(req.body);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const login = req.body.login;
    const password = req.body.password;
    const db_result = await userMod.login_user(login, password);
    res.send(db_result);
  }
  static async deposit_cash(req, res) {
    // validate body params
    const validate_result = Validator.validate_deposit(req.body);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const login = req.body.login;
    const password = req.body.password;
    const balance = req.body.balance;
    const db_result = await userMod.edit_cash(login, password, balance, true);
    res.send(db_result);
  }
  static async search_items(req, res) {
    // validate body params
    const validate_result = Validator.validate_login(req.params);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const login = req.params.login;
    const password = req.params.password;
    const db_result = await userMod.search_items(login, password);
    res.send(db_result);
  }
  static async Purchase_item(req, res) {
    // validate body params
    const validate_params_result = Validator.validate_login(req.params);
    if (validate_params_result.error)
      return res.status(400).send(validate_params_result.error.details[0].message);
    const validate_body_result = Validator.validate_item(req.body);
    if (validate_body_result.error)
      return res.status(400).send(validate_body_result.error.details[0].message);
    const login = req.params.login;
    const password = req.params.password;
    const item_id = req.body.item_id;
    const db_result = await userMod.purchase_item(login, password, item_id);
    res.send(db_result);
  }
  static async view_account(req, res) {
    // validate body params
    const validate_result = Validator.validate_login(req.params);
    if (validate_result.error) return res.status(400).send(validate_result.error.details[0].message);
    const login = req.params.login;
    const password = req.params.password;
    const db_result = await userMod.view_account(login, password);
    res.send(db_result);
  }
}

module.exports = UserController;