const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors  = require('cors')

require("dotenv/config");

//Routes

const productRouter = require('./routers/products')
const categoriesRouter = require('./routers/categories')
const ordersRouter = require('./routers/orders')
const usersRouter = require('./routers/users')


const app = express();

const api = process.env.API_URL;

//Middlewares

app.use(cors())
app.options('*',cors())
app.use(bodyParser.json());
app.use(morgan("tiny"));  


//Routers

app.use(`${api}/products`,productRouter)
app.use(`${api}/categories`,categoriesRouter)
app.use(`${api}/orders`,ordersRouter)
app.use(`${api}/users`,usersRouter)



//Connecting to database

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

//Running Server

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
