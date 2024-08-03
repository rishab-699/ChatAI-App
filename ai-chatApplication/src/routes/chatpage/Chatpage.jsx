import './chatpage.css'
import NewPrompt from '../../components/newprompt/Newprompt';
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';

const Chatpage = ()=>{
    const path = useLocation().pathname;
    const chatId = path.split("/").pop()
    const { isPending, error, data } = useQuery({
        queryKey: ['userchats', chatId],
        queryFn: () =>
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats/${chatId}`,{
            credentials: "include"
          }).then((res) =>
            res.json(),
          ),
      })
      //console.log(data && data[0].history);
    return(
        <div className="Chatpage">
            <div className="wrapper">
                <div className="chat">
                    {isPending? "Loading...":error? "Cannot fetch chats" : data[0]?.history?.map((value, index)=>{
                    return <div className={value.role === 'user'? "message user":"message"} key={index}>
                            {value.img && value.img !=="" && (
                                
                                <IKImage
                                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_END_POINT}
                                    path={value.img}
                                    height={300}
                                    width={400}
                                    transformation={[{height:300, width:400}]}
                                    loading='lazy'
                                    lqip={{active: true, quality:20}}
                                    className={value.role === 'user'? "message user":"message"}
                                />
                            
                        )}
                                <Markdown>{value.parts[0].text}</Markdown>
                            </div>
                            
                })}
                    
                    {data && <NewPrompt data= {data}/>}
                </div>
            </div>
        </div>
    )
}

export default Chatpage;