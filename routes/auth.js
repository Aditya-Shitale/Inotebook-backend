const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'HereWeAutheticare$';

//Router 1:  create a user using :POST "/api/auth/createUser" No login required dosent require auth
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false;
    //if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    //check whether email exists already
    try {
      let user = await User.findOne({success, email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorryy..!!A user Already exist with this email id" });
      }

      const salt = await bcrypt.genSalt(10);
     const  secPass = await bcrypt.hash(req.body.password,salt);

      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data= {
        user:{
          id:user.id
        }
      }
      const authToken=jwt.sign(data,JWT_SECRET);
      // res.json(user)
      success=true;
      res.json({success,authToken})


    } catch (error) {
      console.error(error.message);
      res.status(500).send("error occured in code");
    }
  }
);


//Router 2:   Authenticate a user  using :POST "/api/auth/login" No login required dosent require auth
router.post( '/login',[
    body('email', 'Enter valid email').isEmail(),
    body('password','password cannot be blank').exists(),
  ], async (req, res) => {
    let success=false;
      //if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring used 
    const {email,password}= req.body;
    try {
      let user =await User.findOne({email});
      if (!user) {
        success=false
        return res.status(400).json({success,error: 'Login with valid credentials'});
      }

const passwordCompare = await bcrypt.compare(password,user.password);
if(!passwordCompare){
  success=false
  return res.status(400).json({success,error: 'Login with valid credentials'});
}
const data= {
  user: {
    id: user.id
  }
}
const authToken=jwt.sign(data,JWT_SECRET);
success=true;
res.json({ success,authToken })

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occured");
    }


    });


    //Router 3:   get logged in user detail  using :POST "/api/auth/getuser"  login required 

    router.post('/getuser',fetchuser, async (req, res) => {
        
        try {
         userId =req.user.id;
         const user =await User.findById(userId).select("-password")
         res.send(user)
    
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal error occured");
        }
        });

module.exports = router
