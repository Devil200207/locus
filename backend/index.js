const express = require("express");
const {addUser,verifyUser} = require("./types");
const cors = require("cors");
const {User} = require("./database/db");
const {JWT_SECRET} = require('./config');
const {authverification} = require('./middlewares/middleware');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const fs = require('fs');
const csvParse = require("csv-parse");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cors());

app.post("/user/signup", async(req, res) => {
    const userbody = req.body;
    const userParse = addUser.safeParse(userbody); // zod verification

    if(userParse.success)
    {
        try
        {
            const exituser = await User.findOne({
                email:userbody.email
            }); // checking if user email exits

            if(exituser)
            {
                res.status(400).send("User already exists");
                return;
            }

            const NUser = await User.create(userbody);
            const userId = NUser._id;


            const token = jwt.sign({
                userId
            },JWT_SECRET)


            res.status(201).json({
                msg: "User created successfully",
                token:token
            });
            return;
        }
        catch
        {
            console.log("in catch");
            res.status(400).send("Invalid add user data");
            return;
        }
    }
    else
    {
        console.log("in else");
        res.status(400).send("Invalid add user data");
        return;
    }
});

// SignIn
app.post("/user/signin",async(req,res) => {
    const userBody = req.body;
    const userParse = verifyUser.safeParse(userBody);

    if(userParse.success)
    {
        try
        {
            const exituser = await User.findOne({
                email:userBody.email,
                password:userBody.password
            });

            if(exituser)
            {
                const userId = exituser._id;
                const token = jwt.sign({
                    userId
                },JWT_SECRET)

                res.status(200).json({
                    msg: "User login successfully",
                    token:token
                });
            }
            else
            {
                res.status(400).send("user does not exits !");
                return;
            }
        }
        catch
        {
            res.status(400).send("Invalid Login user data");
            return;
        }
    }
    else
    {
        res.status(400).send("Invalid Login user data");
        return;
    }
    
})

//file upload
app.post("/upload", authverification, upload.single("file"), async (req, res) => {
    const userId = req.userId; // Assuming authverification middleware sets this
    const file = {
        filename: req.file.originalname,
        content: req.file.buffer.toString("base64"),
        uploadedAt: new Date()
    };

    // Determine if the uploaded file is an image or CSV based on file extension or other criteria
    if (file.filename.endsWith(".csv")) {
        // Handle CSV file
        try {
            const csvData = await parseCSVFile(file);
            if (csvData) {
                const user = await User.findById(userId);
                if (user) {
                    user.csvFiles.push({
                        filename: file.filename,
                        content: file.content,
                        uploadedAt: file.uploadedAt
                    });
                    await user.save();
                    res.status(200).json({ message: "CSV file uploaded successfully" });
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            } else {
                res.status(400).json({ message: "Invalid CSV file" });
            }
        } catch (error) {
            console.error("Error uploading CSV file:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } 
    else {
        // Handle image file (assuming it's stored in images array)
        try {
            const user = await User.findById(userId);
            if (user) {
                user.images.push({
                    filename: file.filename,
                    content: file.content,
                    uploadedAt: file.uploadedAt
                });
                await user.save();
                res.status(200).json({ message: "Image file uploaded successfully" });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error("Error uploading image file:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

// Function to parse CSV file content
async function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        const csvString = Buffer.from(file.content, "base64").toString();
        csvParse(csvString, { columns: true }, (err, records) => {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        });
    });
}
app.listen(3000);