const express = require('express')
const router = express.Router()
const {User,Exercise} = require('./models.js')

router.post('/users',(req,res)=>{
    const {username} = req.body
    const user = new User({username})
    user.save((err,data)=>{
        if (err) return res.json({error:err})
        if(data) return res.json({username:data.username,_id:data._id})
    })
})

router.post('/users/:_id/exercises', async (req,res)=>{
    const _id = req.params._id
    const body = req.body
    console.log(body)
    const exercise = {
        description: body.description,
        duration: body.duration,
        date: body.date !== ''? new Date(body.date).toDateString(): new Date(Date.now()).toDateString()
    }
    console.log(exercise)
    const user = await User.findOneAndUpdate({_id},{ "$push": { "log": exercise}},{},(err,data)=>{
        if (err) return res.json({"error":"something went wrong"})
        if (data){
            console.log(data)
        }
    })
})

module.exports = router