const express = require('express')
const router = express.Router()
const carController = require('../controllers/cars') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, carController.getCars)

router.post('/addCar', carController.addCar)

router.put('/markComplete', carController.markComplete)

router.put('/markIncomplete', carController.markIncomplete)

router.delete('/deleteTodo', carController.deleteTodo)

module.exports = router