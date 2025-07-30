const app = require("./app");
const dotenv = require("dotenv");
const databaseConnection = require("./config/databaseConnection");










dotenv.config({path: "./config/config.env"});

databaseConnection();


app.listen(process.env.PORT, () => {
    console.log(`Server is connected with PORT ${process.env.PORT}`);
    
})






















