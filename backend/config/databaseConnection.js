const mongoose = require("mongoose");



const databaseConnection = async () => {
    try {
        const dbconnection = await mongoose.connect(process.env.DB_URI);
        console.log(`Database connected with ${dbconnection.connection.host}`);

    } catch (error) {
        console.log(`Database connection error ${error}`);

    }
}



module.exports = databaseConnection;