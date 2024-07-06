const express = require('express');
const mongoose = require ('mongoose');
const multer = require('multer')
const path = require ('path')
const dotenv = require ('dotenv')
const authRoute = require ('./routes/auth') //here im importing the auth.js file to start accessing the data from that file
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const categoryRoute = require ('./routes/categories');

dotenv.config()
const LOCAL =  process.env.SERVER_LOCAL
const MONGO = process.env.MONGO_URL
const CLIENT = process.env.REACT_APP_CLIENT

const app = express();

app.use(express.json());
// here im using the the path package that i installed to make the images folder in this back end to it public so that way the images uploaded will display in the Front End
app.use('/images', express.static(path.join(__dirname,'/images')))

// here im connecting my local DB with Mongoose, i also can connect my MongoDB Atlas thru this line of code but for testing im doing it
// in the local machine im also cons.log for any errors
mongoose.connect(MONGO, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(console.log("Connected to MongoDB")).catch((err) => console.log(err));

// here we are going to use multer to storage our images and then we are going to indicate the folder we are going to use
const storage = multer.diskStorage({
  // here im going to indicate the destination that is going to take 3 parameters a request, the file, and a call back function
  // that is going to take care off any errors
  destination: (req, file, cb) => {
    // so it basically is going to take the file save it in the images folder
    cb(null, "images");
  },
  // and here will be the name we are providing
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  }
})

const upload = multer({storage:storage})
app.post('/server/upload', upload.single("file"), (req, res) => {
  res.status(200).json('Files has been uploaded')
})  

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", CLIENT); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// in here we use the app.use to start sending data to our DB, and i can use the Postman to test using localhost:5000/server/auth/register
// creating a route for ex /server/auth and then we step in to the authRoute to grab the /register from the auth.js file 
app.use('/server/auth', authRoute)
app.use('/server/users', usersRoute)
app.use('/server/posts', postsRoute)
app.use('/server/categories', categoryRoute)

app.listen (process.env.PORT || LOCAL, () => {  
    console.log("backend is running");
})