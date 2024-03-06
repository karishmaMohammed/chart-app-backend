const asyncHandler = require("express-async-handler");
const {chatModelSchema} = require("../modals/chartModel");
const {userModelSchema} = require("../modals/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const {userId} = req.body;
    if(!userId) 
    {
        console.log("User Id not sent");
        return res.sendStatus(404)
    }

    var isChat = await chatModelSchema.find({
        isGroupChart: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id}}},
            {users: {$elemMatch: { $eq: userId}}},
        ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await userModelSchema.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email",
    });
    if(isChat.length > 0){
        res.send(isChat[0]);
    }else{
       var chatData = {
        chatName: "sender",
        isGroupChart: false,
        users: [req.user._id, userId],
       };
       
       try {
        const createdChat = await chatModelSchema.create(chatData);
        const fullChat = await chatData.findOne({_id: createdChat._id}).populate(
            "users",
            "-password"
        );
        res.status(200).json(fullChat);
       } catch (error) {
        res.status(400);
        throw new Error(error.message);
       }
    }
});


const fetchChats = asyncHandler(async (req, res) => {
    try {
      console.log("Fetch Chats aPI : ", req);
      chatModelSchema.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await userModelSchema.populate(results, {
            path: "latestMessage.sender",
            select: "name email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
  
  const fetchGroups = asyncHandler(async (req, res) => {
    try {
      const allGroups = await chatModelSchema.where("isGroupChat").equals(true);
      res.status(200).send(allGroups);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
  
  const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Data is insufficient" });
    }
  
    var users = JSON.parse(req.body.users);
    console.log("chatController/createGroups : ", req);
    users.push(req.user);
  
    try {
      const groupChat = await chatModelSchema.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await chatModelSchema.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
  
  const groupExit = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await chatModelSchema.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  });

module.exports = {
    accessChat,
    fetchChats,
    fetchGroups,
    createGroupChat,
    groupExit,
}