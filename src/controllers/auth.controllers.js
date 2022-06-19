const User = require("../models/user.model")

const bcrypt = require("bcryptjs")

exports.signUp = async (req, res) => {
   try {
      const {username, password} = req.body
      const hashPassword = await bcrypt.hashSync(password+"", 8)
      const newUser = await User.create({
         username, 
         password: hashPassword
      })
      req.session.user = newUser
      return res.status(201).json({
         status: "created",
         data: {
            user: newUser
         }
      })
   }catch (e){
      console.log(e)

      return res.status(400).json({
         status: "signUp error: invalid data"
      })
   }
}  


exports.login = async (req, res) => {
   //if(req.session.user) return  res.status(200).json({ status: "you already logged"})
   const { username, password } = req.body

   try{
      const user = await User.findOne({username})
      
      if(!user) return res.status(404).json({status: "login error: user not found"})
      const isCorrectPassword = await bcrypt.compareSync(password+"", user.password)
      if(!isCorrectPassword) return res.status(404).json({status: "login error: invalid password"})

      req.session.user = user.username

      return res.status(200).json({
         status: "success",
      })

   }catch(e){
      console.log("error: ")

      return res.status(400).json({
         status: "login error: invalid data"
      })
   }
}
