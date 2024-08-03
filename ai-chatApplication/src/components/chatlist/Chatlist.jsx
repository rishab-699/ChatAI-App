import { useEffect } from 'react'
import './chatlist.css'
import {Link} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const Chatlist = ()=>{
    const { isPending, error, data } = useQuery({
        queryKey: ['userChats'],
        queryFn: () =>
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userchats`,{
            credentials: "include"
          }).then((res) =>
            res.json(),
          ),
      })

    return (
        <div className="ChatList">
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create New Chat</Link>
            <Link to="/">Explore RJ-AI</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className="title">Recent Chats</span>
            <div className="list">
                {isPending? "Loading...":error? "No Chats available" :data && data.map((value, index)=>{
                    return <Link key={index} to={`/dashboard/chats/${value._id}`}>{value.title}</Link>
                })}
                
                
            </div>
            <hr />
            <div className="updrade">
                <img src="/logo.png" alt="" />
                <div className="texts">
                    <span>Upgrade to PRO</span>
                    <span>Get unlimited access to all features</span>
                </div>
            </div>
        </div>
    )
}

export default Chatlist;