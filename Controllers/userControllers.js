
const expressAsyncHandler = require('express-async-handler');
const {userModelSchema} = require('../modals/userModel');
const generateToken = require('../Config/generateToken');

const loginController = expressAsyncHandler(async(req, res) => {
    const {name, password} = req.body;
    const user = await userModelSchema.findOne({name});
    if(user &&(await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    }else{
        res.status(401);
        throw new Error("Invalid username or password")
    }
})

const registerController = expressAsyncHandler(
    async(req, res) => {
        const {name, email, password} = req.body;
       //  check for all fields
           if(!name || !email || !password){
               res.send(400);
               throw Error("All fields need to be filled")
           }
       
           // pre existing user
           const userExist = await userModelSchema.findOne({email})
           if(userExist){
               throw new Error("User already Exists");
           }
           const userNameExist = await userModelSchema.findOne({name})
           if(userNameExist){
               throw new Error("UserName already Exists");
           }
       
           // create an entry in DB for user
           const user = await userModelSchema.create({name, email, password });
           if(user){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)            
            });
           }
           else{
            res.status(400)
            throw new Error("Registration error")
           }
       }
)

const fetchAllUsersController = expressAsyncHandler(async(req, res) => {
    const keyword = req.query.search
    ? {
        $or: [
            {name : {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ],
    } : 
    {};
    
    const users = await userModelSchema.find(keyword).find({
        _id: { $ne: req.user._id },
    });
    res.send(users);
});



module.exports ={
    loginController,
    registerController,
    fetchAllUsersController,
};