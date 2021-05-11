const router = require('express').Router()
const User = require('../../../models/User')
const bcrypt = require('bcryptjs')

// Register
router.post('/register', async (req, res) => {
    const emailExists = await User.findOne({
        email: req.body.userEmail,
    })
    if (
        passwordValidation(req.body.userPassword) &&
        !emailExists &&
        letterValidation(req.body.userFirstName) &&
        letterValidation(req.body.userLastName)
    ) {
        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.userPassword, salt)
        const user = new User({
            first_name: req.body.userFirstName,
            last_name: req.body.userLastName,
            email: req.body.userEmail,
            password: hashPassword,
        })
        try {
            const saved = await user.save()
            res.json({ message: 'OK' })
        } catch (err) {
            console.log(err)
        }
    } else {
        res.json({ message: 'Error' })
    }
})

// Login
router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (validPassword) {
        // Redis
        req.session.email = req.body.email
        req.session.password = req.body.password

        res.json({ message: 'OK' })
    } else {
        res.json({ message: 'Error' })
    }
})

// Edit profile
router.post('/edit_profile', async (req, res) => {
    const user = await User.findOne({
        email: req.session.email,
    })

    user.first_name = req.body.first_name
    user.last_name = req.body.last_name
    user.email = req.body.email
    user.address = req.body.address
    user.gender = req.body.gender
    user.hobbies = req.body.hobbies
    user.civil_state = req.body.state
    user.profession = req.body.profession
    user.salary = req.body.salary
    user.sport = req.body.sport
    user.city_of_birth = req.body.city

    await user.save()
    res.json({ message: 'OK' })
})

// Change Password
router.post('/change_password', async (req, res) => {
    if (req.session) {
        const user = await User.findOne({
            email: req.session.email,
        })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        user.password = hashPassword

        await user.save()
        res.json({ message: 'OK' })
    }
})

// Validation
function passwordValidation(password) {
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$!%£&@])(?=.{10,})/
    if (password.match(passwordRegex)) {
        return true
    }
    console.log('password error')

    return false
}

function letterValidation(name) {
    const letterRegex = /^[A-Za-z]+$/

    if (name.match(letterRegex)) {
        return true
    }
    console.log('letter error')

    return false
}

module.exports = router
