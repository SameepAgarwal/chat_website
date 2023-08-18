const mongoose = require('mongoose');
//Set up default mongoose connection
const DB = process.env.DATABASE;
const ConnectToDB = async () => {
    try {

        const connection = await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connection To DB is Successful`);
    } catch (e) {
        console.log(e);
    }
};

ConnectToDB();