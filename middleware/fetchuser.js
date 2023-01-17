var jwt = require('jsonwebtoken');
const JWT_SECRET = 'HereWeAutheticare$';


const fetchuser =(req,res,next)=>{
//get user from jwt token and add id to req object
const token = req.header('auth-token');
if(!token){
   return  res.status(401).send({error:"authenticate using valid creds1"})
}

try {
    const data = jwt.verify(token,JWT_SECRET);
req.user=data.user;
next();
} catch (error) {
    return res.status(401).send({error:"authenticate using valid creds2"})
}

}

module.exports= fetchuser;