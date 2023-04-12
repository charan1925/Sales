const express = require('express')
const bcrypt = require('bcrypt')
var cookie = require('cookie-parser')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')

// getting setting
const settings = require('../../config/settings')

const router = express.Router()

const Person = require('./../../models/Person')

router.use(cookie())

router.post('/register', (req, res) => {

    Person
        .findOne({ username: req.body.username })
        .then(person => {
            if (person) {
                res.status(400).send('Username already there.')
            } else {

                const person = Person({
                    name: req.body.name,
                    username: req.body.username,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {

                    bcrypt.hash(person.password, salt, (err, hash) => {
                        if (err) {
                            return res.status(400).send('Not Registered, Contact Admin!')
                        } else {

                            person.password = hash

                            person
                                .save()
                                .then(person => res.send('Successfully added'))
                                .catch(err => res.send(err.message))
                        }
                    })
                })
            }
        })
        .catch(err => res.send(err))
})


router.post('/login', (req, res) => {
    username = req.body.username
    password = req.body.password


    Person
        .findOne({ username: req.body.username })
        .then(person => {
            if (person) {

                bcrypt
                    .compare(password, person.password)
                    .then(
                        (isCompared) => {
                            if (isCompared) {
                                const payload = {
                                    id: person.id,
                                    name: person.name,
                                    username: person.username
                                }


                                jsonwt.sign(payload, settings.secret, { expiresIn: 3600 },
                                    (err, token) => {
                                        console.log(err)
                                        // res.json({
                                        //     success: true,
                                        //     token: 'Bearer ' + token
                                        // })
                                        res.redirect('/api/sales-ui')
                                    }
                                )
                            } else {
                                res.status(401).send('Password is not correct')
                            }
                        }
                    )
                    .catch()
            } else {
                res.status(400).send('Username is not there.')
            }
        })
    
})
router.get('/get', passport.authenticate('jwt', { session: false }), async(req, res) => { 
    let people_un = []
    const cursor = await Person.find()
    cursor.forEach((person) => {
        people_un.push(person.username)
    })
    res.send(people_un)
})

module.exports = router