
import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    Chats:[{
        _id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        
    }]
},{timestamps: true});

//module.exports = mongoose.model("userchats", userChatsSchema);
export default mongoose.models.userchats || mongoose.model("userchats", userChatsSchema);