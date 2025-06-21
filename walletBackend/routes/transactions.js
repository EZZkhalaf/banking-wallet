const express = require('express');
const {sql} = require('../config/db');
const { getTransByUserId, deleteTransById, addTrans, getUserBalance } = require('../controllers/transactionsControllers');
const router = express.Router();

router.get('/:userId' , getTransByUserId)

router.delete('/:id' , deleteTransById)

router.post('/' , addTrans)

router.get('/summary/:userId' ,getUserBalance )

module.exports = router;