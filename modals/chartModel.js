const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    chartName: {type : String},
    isGroupChart: {type: Boolean},
    users : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user_model"
    }],
    lastestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message_model"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user_model"
    },
},
{
    timestamps: true,
});

const chatModelSchema = mongoose.model("chart_model", chatSchema);
module.exports = {chatModelSchema}