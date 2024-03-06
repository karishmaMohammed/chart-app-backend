const expressAsyncHandler = require("express-async-handler");
const {messageModelSchema} = require("../modals/messageModel");
const {chatModelSchema} = require("../modals/chartModel");
const {userModelSchema} = require("../modals/userModel");


const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await messageModelSchema.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("reciever")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await messageModelSchema.create(newMessage);

    console.log(message);
    message = await messageModelSchema.populate("sender", "name pic");
    message = await messageModelSchema.populate("chat");
    message = await messageModelSchema.populate("reciever");
    message = await userModelSchema.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await chatModelSchema.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };