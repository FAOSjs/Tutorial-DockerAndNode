const authHandle = (req, res, next) => {
   const {user} = req.session

   if(!user) return res.status(401).json({status: "unauthorized: you must be connected"})

   req.user = user

   next()
}

module.exports = authHandle
