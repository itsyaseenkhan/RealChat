import express from "express";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import {dbConnections} from "./database/db.js";
import userRouter from "./Routes/user.route.js";
import messageRoute from "./Routes/message.route.js";


const app = express();
app.use(express.json());

config({ path: "./config/config.env"});

app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./Upload/"
}));

dbConnections();

app.use("/api/v1/user" , userRouter);
app.use("/api/v1/message", messageRoute);



export default app;