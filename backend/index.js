import express from 'express';
import dotenv from 'dotenv';
import ImageKit from 'imagekit';
import cors from 'cors';
import mongoose from 'mongoose';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import userChats from './models/userChats.js';
import Chat from './models/chats.js';

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
app.use(cors({
    "origin":true,
    "credentials": true
}));

const PORT = process.env.PORT;

// MongoDB Connection
mongoose.connect(process.env.MONGOURL, { dbName: process.env.MONGODATABASE })
    .then(() => console.log("Backend database connected"))
    .catch((err) => console.log(err));

// ImageKit Configuration
const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_END_POINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

// Routes
app.get('/api/upload', (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.get('/api/test', ClerkExpressRequireAuth(), (req, res) => {
    const userId = req.auth.userId;
    //console.log("Success!", userId);
    res.send('success');
});

app.post('/api/chats', ClerkExpressRequireAuth(), async (req, res) => {
    const { text } = req.body;
    const userId = req.auth.userId;

    //console.log(text,"-", userId);

    try {
        // Create new chat
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }]
        });

        const saveChat = await newChat.save();
        console.log(saveChat._id, '-', text.substring(0, 40));

        // Check if userChats exists
        const userchats = await userChats.find({ userId: userId });

        if (!userchats.length) {
            // If not, create new userChats
            const newuserChats = new userChats({
                userId: userId,
                Chats: [
                    {
                        _id: saveChat._id,
                        title: text.substring(0, 40),
                    }
                ]
            });
            await newuserChats.save();
        } else {
            // If exists, push to existing array
            
            const res = await userChats.updateOne({ userId: userId }, {
                $push: {
                    Chats: {
                        _id: saveChat._id,
                        title: text.substring(0, 40),
                    }
                }
            },{new: true});
            console.log(res);
        }

        res.status(201).json(newChat._id);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating chat");
    }
});

app.get('/api/userchats', ClerkExpressRequireAuth(), async(req,res)=>{
    const userId = req.auth.userId;
    try {
        const getUserChats = await userChats.find({userId: userId});
        //console.log(getUserChats)
        res.status(200).send(getUserChats[0].Chats);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
})

app.get('/api/chats/:id', ClerkExpressRequireAuth(), async(req,res)=>{
    const userId = req.auth.userId;
    const chatId = req.params.id;
    //console.log(chatId);
    try {
        const getUserChats = await Chat.find({_id: chatId, userId: userId});
        //console.log(getUserChats)
        res.status(200).send(getUserChats);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
})

app.put('/api/chats/:id', ClerkExpressRequireAuth(), async(req,res)=>{
    const userId = req.auth.userId;
    const {question, answer, img} = req.body;
    console.log("Request was made",req.params.id);
    const conversationData = [
        ...(question?[{role:"user", parts:[{text:question}], ...(img && {img})}]:[]),
        {role:"model",parts:[{text:answer}]}
    ]
    try {
        const UpdatedChat = await Chat.updateOne({_id: req.params.id, userId:userId},{
            $push:{
                history:{
                    $each: conversationData
                }
            }
        })
        res.status(200).json(UpdatedChat);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log('App started on port', PORT);
});

console.log("Server started on port", PORT);
