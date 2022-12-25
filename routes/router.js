const router = require('express').Router();
const usercontroller = require('../controllers/UserController');
const itemcontroller = require('../controllers/ItemController');

router.get('/users', usercontroller.getalluser);
router.get('/users/user/:uid', usercontroller.getuser);
router.get('/users/userl/:login', usercontroller.getuser);
router.post('/users/signup', usercontroller.create_new_account);
router.post('/users/login', usercontroller.login_account);
router.patch('/users/depositcash', usercontroller.deposit_cash);
router.delete('/users/delete/:id', usercontroller.deleteuser);
router.get('/searchitems/:login/:password', usercontroller.search_items);
router.post('/Purchase_item', usercontroller.Purchase_item);
router.get('/users/view_account/:login/:password', usercontroller.view_account);
router.get('/items', itemcontroller.getitems);
router.get('/items/item/:item_id', itemcontroller.getitem);
router.post('/items/add', itemcontroller.additem);
router.put('/items/edit', itemcontroller.edit_item);
router.delete('/items/delete/:item_id', itemcontroller.remove_item);

module.exports = router;