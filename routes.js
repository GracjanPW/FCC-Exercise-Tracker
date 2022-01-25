const express = require('express')
const router = express.Router()
const { User } = require('./models.js')

router.post('/users', (req, res) => {
  const { username } = req.body
  const user = new User({ username })
  user.save((err, data) => {
    if (err) return res.json({ error: err })
    if (data) return res.json({ username: data.username, _id: data._id })
  })
})

router.get('/users', (req, res) => {
  const users = User.find({}).select('username')
  users.exec((err, data) => {
    if (err) return res.json({ error: "nothing found" })
    if (data) {
      res.json(data)
    }
  })
})

router.post('/users/:_id/exercises', (req, res) => {
  const _id = req.params._id
  const body = req.body
  const exercise = {
    description: body.description,
    duration: parseInt(body.duration),
    date: body.date === '' || new Date(body.date).toDateString() === "Invalid Date" ? new Date(Date.now()).toDateString() : new Date(body.date).toDateString()
  }
  console.log(exercise)
  const update = { "$push": { "log": exercise }, "$inc": { "count": 1 } }
  User.findOneAndUpdate({ _id }, update, {}, (err, data) => {
    if (err) return res.json({ error: "User not found" })
    console.log({_id:data._id,username:data.username,...exercise})
    if (data) {
      res.json({_id:data._id,username:data.username,...exercise})
    } else {
      res.json({ error: "did not update" })
    }
  })
})

router.get('/users/:_id/logs', (req, res) => {
  const _id = req.params._id
  const { from, to, limit } = req.query
  User.findOne({ _id }, (err, data) => {
    if (err) return res.json({ error: "User not found" })
    if (data) {
      let logs = data.log
      if (from) {
        logs = logs.filter(log => {
          const date1 = new Date(log.date)
          const date2 = new Date(from)
          return date2 < date1
        })
      }
      if (to) {
        logs = logs.filter(log => {
          const date1 = new Date(log.date)
          const date2 = new Date(to)
          return date1 < date2
        })
      }
      if (limit && logs.length > limit) {
        logs.sort((e1, e2) => {
          const date1 = new Date(e1.date)
          const date2 = new Date(e2.date)
          return date1 < date2 ? -1 : date1 === date2 ? 0 : 1
        })
        logs = logs.slice(0, limit)

      }
      console.log({
        username: data.username,
        count: data.count,
        _id: data._id,
        log: logs
      })
      res.json({
        username: data.username,
        count: data.count,
        _id: data._id,
        log: logs
      })
    }
    else res.json({ error: "No data" })
  })

})

module.exports = router