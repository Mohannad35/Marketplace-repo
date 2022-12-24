
const express = require('express');
const router = require('express').Router();
const usercontroller = require('../controllers/UserController');
const itemcontroller = require('../controllers/ItemController');

router.get('/', (req, res, next) => {
  res.send("Hi there! From Router!");
})

router.get('/users', usercontroller.getalluser);
router.get('/items', itemcontroller.getitems);
router.post('/additem', itemcontroller.additem);
router.get('/user', usercontroller.getuser);
router.delete('/users/:id', usercontroller.deleteuser);
router.post('/signup', usercontroller.create_new_account);
router.post('/login', usercontroller.login_account);

module.exports = router;