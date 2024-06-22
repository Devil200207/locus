const express = require("express");
const {addUser,verifyUser} = require("./types");
const {User} = require("./database/db");
const app = express();

app.use(express.json());

app.post("/user/signup", async(req, res) => {
    const userbody = req.body;
    const userParse = addUser.safeParse(userbody); // zod verification
    console.log(userParse);

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
        }
        catch
        {
            res.status(400).send("Invalid add user data");
            return;
        }
    }
    else
    {
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

app.listen(3000);