const router = require('express').Router();
const usercontroller = require('../controllers/UserController');
const itemcontroller = require('../controllers/ItemController');

router.get('/users', usercontroller.getalluser);
router.get('/users/user/:uid', usercontroller.getuser);
router.get('/users/userl/:login/:password', usercontroller.get_user_login);
router.post('/users/signup', usercontroller.create_new_account);
router.post('/users/login', usercontroller.login_account);
router.patch('/users/depositcash', usercontroller.deposit_cash);
router.delete('/users/admin/delete/:uid', usercontroller.deleteuser);
router.delete('/users/delete/:login/:password', usercontroller.deleteuser);
router.get('/searchitems/:login/:password', usercontroller.search_items);
router.post('/Purchase_item/:login/:password', usercontroller.Purchase_item);
router.get('/users/view_account/:login/:password', usercontroller.view_account);
router.get('/items', itemcontroller.getitems);
router.get('/items/item/:item_id', itemcontroller.getitem);
router.post('/items/add/:login/:password', itemcontroller.additem);
router.put('/items/edit/:login/:password', itemcontroller.edit_item);
router.delete('/items/delete/:item_id/:login/:password', itemcontroller.remove_item);

module.exports = router;