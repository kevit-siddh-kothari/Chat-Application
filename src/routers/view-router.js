const express = require('express');
const {viewHome, joinHome} = require('../controller/view-controller');


const router = express.Router();

router.get('/home',viewHome);
router.get('/join', joinHome);

module.exports={
    router
};