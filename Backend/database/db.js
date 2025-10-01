import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


 export const dbConnections = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
             dbName: "RealChate",
        })
        .then((con) => {
            console.log("MongoDB Database connected . " );
        })
        .catch((err) => {
            console.log(`Database is  not Connected .${ err.message || err } `);
        });
}