const express = require('express');
const userModel = require('../models/User');
const path = require('path');
const { default: mongoose } = require('mongoose');
const app = express();

app.post('/signup', async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Body cannot be empty"
        });
    }

    const userData = req.body;
    userData.createdOn = Date.now().toString();

    try {
        const user = new userModel(userData);
        const newUser = await user.save()
        res.send({"user_id": newUser._id, "token": newUser._id });
    }
    catch(err) {
        res.status(500).send({message: err.message});
    }
})

app.post('/addinfo', async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Body cannot be empty"
        });
    }

    const userData = req.body;
    try {
        const user = await userModel.findOne({ _id: userData.id });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstname = userData.firstname;
        user.lastname = userData.lastname;

        const newUser = await user.save();
        res.send({"message": "User updated successfully", "user_id":newUser._id});
    }
    catch(err) {
        res.status(500).send({message: err.message});
    }
});

app.post('/login',  (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Body cannot be empty"
        });
    }

    const data = req.body;
    userModel.findOne({username: req.body.username})
        .then(user => {
            if (user) {
                if (data.password == user.password) {
                    res.send({user_id: user._id, token: user._id});
                } else {
                    res.status(401).send({message: "Wrong Password"});
                }
            }
            else {
                res.status(401).send({message: "Wrong username"});
            }
        }).catch(err => {
        res.status(500).send({message: err.message});
    })
});

app.get('/user/:id', async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id });
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Exclude password before sending response
        const { password, ...userWithoutPassword } = user.toObject();

        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = app