const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user_model"
    },
    content: {
        type: String,
        trim: true,
      },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user_model"
    },
    chart: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "chart_model"
    }

},
    {
    timestamps: true, 
    }
);

const messageModelSchema = mongoose.model("message_model", messageSchema);
module.exports = {messageModelSchema}