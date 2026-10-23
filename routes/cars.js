const express = require('express')
const router = express.Router()
const todosController = require('../controllers/cars') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, todosController.getCars)

router.post('/addCar', todosController.addCar)

router.put('/markComplete', todosController.markComplete)

router.put('/markIncomplete', todosController.markIncomplete)

router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router