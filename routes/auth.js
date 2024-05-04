var express = require("express");
var router = express.Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send({
    status:"success",
    message:"OK"
  })
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

//要存到資料庫可以在這邊寫
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // res.send({
    //   status: true,
    //   data: {
    //     id: req.user.id,
    //     name: req.user.displayName,
    //   },
    // });
    // console.log(req.user)
    const data = {
      name:req.user.displayName,
      email:req.user.emails[0].value,
      photo:req.user.photos[0].value
    }
    console.log(data)
    const token = jwt.sign(data, JWT_SECRET);
    try{
      res.cookie('user', token);
      console.log(token)
    }catch(err){
      console.log(err)
    }
    
    res.redirect('/')
  }
);

router.get("/login",(req,res)=>{
  const token = req.header('Authorization').slice(5);
  //console.log(token)
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err)
        return res.sendStatus(403)
      }
        res.status(200).send({
        status:"success",
        data:user
      })
    });
  } else {
    res.sendStatus(401);
  }
})

router.get("/logout",(req,res)=>{
  const token = req.header('Authorization').slice(5);
  console.log(token)
  if(token){
    res.clearCookie('user')
    res.status(200).send({
      status:"success",
      message:"已登出"
    })
  }else{
    res.status(200).send({
      status:"success",
      message:"已登出"
    })
  }
})

module.exports = router;
