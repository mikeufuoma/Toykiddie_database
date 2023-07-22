const env = require("dotenv");
env.config();

const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const _ = require("lodash");

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'uploads')));

//importing routers
const user = require('./router/userRouter');
const toys = require('./router/toysRouter');
const preferece = require('./router/preferenceRouter');
const transaction = require('./router/transactionRouter');
const chat = require('./router/ChatRouter');


app.use('/api/user', user);
app.use('/api/toy', toys);
app.use('/api/chat', chat);
app.use('/api/preference', preferece);
app.use('/api/transaction',transaction)




  const config = require("./config");

  const url = `mongodb+srv://presh:n93MlI2dKMWnfxjk@cluster0.w9sy3.mongodb.net/kiddiesToy?retryWrites=true&w=majority`;

  const connectionParams={
      useNewUrlParser: true,
      useUnifiedTopology: true 
  }
  mongoose.connect(url,connectionParams)
      .then( () => {
          console.log('Connected to database ')
      })
      .catch( (err) => {
          console.error(`Error connecting to the database. \n${err}`);
      })
  

// const url = `mongodb+srv://presh:n93MlI2dKMWnfxjk@cluster0.w9sy3.mongodb.net/kiddiesToy?retryWrites=true&w=majority`;

// const connectionParams={
//     useNewUrlParser: true,
//     useUnifiedTopology: true 
// }
// mongoose.connect(url,connectionParams)
//     .then( () => {
//         console.log('Connected to database ')
//     })
//     .catch( (err) => {
//         console.error(`Error connecting to the database. \n${err}`);
//     })


// mongoose.connect('mongodb://127.0.0.1/kiddiesToys')
// .then(() => {
//     console.log('connected to mongodb');
//     // return getCurrent()
// })
// .catch(err => console.error('could not connect...', err))

const port = 3000;
app.listen(port,() => console.log(`listening on port ${port}...`));


