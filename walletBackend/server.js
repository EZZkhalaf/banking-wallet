const express = require("express");
const dotenv = require('dotenv');
const { sql } = require("./config/db");
const  rateLimiter  = require("./middlware/rateLimiter");
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const transactions = require('./routes/transactions.js')


//middlwares
app.use(rateLimiter) 
app.use(express.json())


const dbInit = async() =>{
    try {
        await sql`CREATE TABLE IF NOT EXISTS trans(
            id serial primary key ,
            userId varchar(255) not null,
            title varchar(255) not null ,
            amount decimal(10,2) not null ,
            category varchar(255) not null ,
            created_at DATE not null DEFAULT CURRENT_DATE
        )`

        console.log("database initialized successfuly...");
    } catch (error) {
        console.log("error iniallizing the database : " , error);
        process.exit(1);
    }
}


app.use('/api/trans' , transactions);

dbInit().then(()=>{
    app.listen(PORT , () => console.log("listening to port " , PORT))
})