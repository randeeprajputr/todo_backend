const User = require('../models/userModel')
const {ObjectId} = require('mongodb')
const bcrypt = require('bcrypt')
const {google} = require("googleapis")
const jwt = require('jsonwebtoken')
const {default: mongoose} = require('mongoose')

const userController = {

    register: async (req, res) => {
        try {
            const {name, email, password} = req.body
            if (!name || !email || !password)
                return res.status(400).json({message: "Please fill all fields"})
            if (!validateEmail(email))
                return res.status(400).json({message: "Please enter valid email!"})
            const user = await User.findOne({email})
            if (user) return res.status(400).json({message: "Email Already Exist!"})
            if (password.length < 6) return res.status(400).json({message: "Password must be atleast 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = new User({
                name, email, password:passwordHash
            })
            await newUser.save()
            const activation_token = createRefreshToken({newUser})
            res.status(200).send({message:"User created!",user:newUser,token:activation_token})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },

    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const refresh_token = createRefreshToken({id: user._id})
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.json({user: user, token: refresh_token})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({msg: "Please login now!"})

                const access_token = createAccessToken({id: user.id})
                res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({message: "Logged out."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateUser: async (req, res) => {
        try {
            console.log("Herer is user",req.user)
            const {name, email, gender, dob, phone, address, avatar} = req.body
            await User.findOneAndUpdate({_id: req.user.id}, {
                name: name, email: email, gender: gender, dob: dob, phone: phone, address: address, avatar: avatar
            })

            res.json({message: "Update Success!"})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const {role} = req.body

            await User.findOneAndUpdate({_id: req.params.id}, {
                role
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '15m'})
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '7d'})
}
module.exports = userController