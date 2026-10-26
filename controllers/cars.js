const Car = require('../models/Car')

module.exports = {
    getCars: async (req,res)=>{
        console.log(req.user)
        try{
            const carItems = await Car.find({userId:req.user.id})
            const carLeft = await Car.countDocuments({userId:req.user.id,completed: false})
            res.render('cars.ejs', {vehicles: carItems, left: carLeft, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    addCar: async (req, res)=>{
        try{
            await Car.create({carName: req.body.carItem, imageSrc: req.body.carImage, imageAlt: req.body.carDesc, completed: false, userId: req.user.id})
            console.log('Todo has been added!')
            res.redirect('/cars')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Car.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Car.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Car.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    