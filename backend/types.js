const zod = require("zod");

const user = zod.object({
    name: zod.string().min(3),    
    email: zod.string().email(),
    password:zod.string().min(5),
});

const signinUser = zod.object({
    email: zod.string().email(),
    password:zod.string().min(5)
});

module.exports = {
    addUser:user,
    verifyUser:signinUser,
}