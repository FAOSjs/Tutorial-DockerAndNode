const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const session = require("express-session")
const redis = require("redis")
const ioRedisClient = require("ioredis")
const RedisStore = require("connect-redis")(session)
const { 
   MONGO_USERNAME, 
   MONGO_PASSWORD, 
   MONGO_HOST, 
   MONGO_PORT, 
   REDIS_PORT, 
   REDIS_URL, 
   SESSION_SECRET 
} = require("../config/config")

console.log(REDIS_URL, REDIS_PORT)

const redisClient = new ioRedisClient(`redis://${REDIS_URL}:${REDIS_PORT}`)
//const redisClient = redis.createClient({url: `redis://${REDIS_URL}:${REDIS_PORT}`})

/*const connectToRedisWithRetry = () => {
   redisClient.connect()
      .then(() => console.log("Succesfully connected to REDIS"))
      .catch((e) => {
         console.log("An error was found in REDIS connection: \n",e)
         console.log("Reconnecting to REDIS...")
         setTimeout(connectToRedisWithRetry)
      })
}
connectToRedisWithRetry()
*/
const postRoutes = require("./routes/post.routes")
const userRoutes = require("./routes/user.routes")

const app = express()

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`

const connectToMongoWithRetry = () => {
   mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("Succesfully connected to mongoDB"))
   .catch((e) => {
      console.log("An error was found in mongoDB connection: \n"+e)
      console.log("Reconnecting...")
      setTimeout(connectToMongoWithRetry, 40000)
   })
}
connectToMongoWithRetry()

const port = process.env.PORT || 4444

app.use(cors())
app.enable("trust proxy")
app.use(session({
   store: new RedisStore({client: redisClient}),
   name: "userSession",
   secret: SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
      secure: false,
      httpOnly: true, 
      maxAge: 60000
   }
}))
app.use(express.json())
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/users", userRoutes)
app.get("/api/v1/", (req, res) => {
   res.send("<h1>Hello World, my old friend!</h1>")
})

app.listen(port, () => console.log("Running on http://localhost:"+port))

