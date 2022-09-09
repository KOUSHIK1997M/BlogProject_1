const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
// const { default: mongoose } = require('mongoose');
const app = express();
const connection = require("./db");
require("dotenv").config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


connection()
// mongoose.connect("mongodb+srv://project_1:Llgfqe5Is4BXArKU@cluster0.u6u38bx.mongodb.net/project_1?retryWrites=true&w=majority", {
//     useNewUrlParser: true

// })
// .then( () => console.log("MongoDb is connected"))
// .catch ( err => console.log(err) )

// app.use (
//     function (req, res, next) {
//         console.log ("inside GLOBAL MW");
//         next();
//   }
//   );

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
