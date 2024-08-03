import { Link } from 'react-router-dom';
import './homepage.css'
import {TypeAnimation} from 'react-type-animation';
import { useState } from 'react';

const Homepage = () =>{
    const [typingStatus, setTypingStatus] = useState("human1")

    
    return (

        <div className="Homepage">
            <img src="/orbital.png" alt="" className='orbital'/>
            <div className="left">
                <h1>Rishab Jain AI</h1>
                <h2>AI-Chat built with Gemini AI</h2>
                <h3>This is an AI chat application built using Gemini AI.
                    This Application uses Clerk Authentication Services</h3>
                <Link to='/dashboard'>Get Started</Link>
            </div>
            <div className="right">
                <div className="imgContainer">
                    <div className="bgContainer">
                        <div className="bg">

                        </div>
                    </div>
                    <img src="/bot.png" alt="" className='bot' />
                    <div className="chat">
                        <img src={typingStatus === "human1" ? "/human1.jpeg"
                                :typingStatus === "human2" ? "/human2.jpeg" : "bot.png"
                        } alt="" className='userBot' />
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                'Human: Hii, How are you',
                                1000, ()=>{
                                    setTypingStatus("bot")
                                },
                                'Bot: I am fine, how can I help you',
                                1000,()=>{
                                    setTypingStatus("human1")
                                },
                                'User: What is the weather today?',
                                1000,()=>{
                                    setTypingStatus("bot")
                                },
                                'Bot: Today is rainy day',
                                1000,()=>{
                                    setTypingStatus("human2")
                                },
                            ]}
                            wrapper="span"
                            speed={50}
                            
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt="" />
                <div className="links">
                    <Link to="/">Terms of Service</Link>
                    <span>|</span>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
};

export default Homepage;