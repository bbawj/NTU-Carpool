const router = require('express').Router();
const User = require("../models/User");
const Joi = require('joi');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//validate with joi
const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
});

router.post('/register', async (req, res) => {

    //validate data
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user already exists from db
    const userExists = await User.findOne({username: req.body.username});
    if (userExists) return res.status(400).send("Username already exists");
   
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        username: req.body.username,
        password: hashedPassword
    });

    try {
        const newUser = await user.save();
        res.send({id: newUser._id});
    } catch(err){
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {

    //check if user registered
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send("Email not found");

    //check if password valid
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).send("Invalid password");

    //assign JWT
    const accessToken = jwt.sign({_id: user.id}, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });

});

module.exports = router;