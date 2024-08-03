import { useEffect, useRef, useState } from 'react';
import './newprompt.css'
import Upload from '../upload/Uploadimg';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPrompt = ({data})=>{
    const endRef = useRef(null);
    const [inputvalue, setInputValue] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [img, setImg] = useState({
        isLoading: false,
        error:"",
        dbData: {},
        aiData: {}
    });
    const chat = model.startChat({
        history:[
            data?.history.map((role, parts)=>{
                role,
                parts[{text: parts[0].text}]

            })
        ],
        generationConfig: {
          //maxOutputTokens: 100,
        },
      });

    
    //console.log(data);
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: ()=>{
            //console.log('inside mutation', `${import.meta.env.VITE_BACKEND_URL}/api/chats/${data[0]._id}`);
            return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats/${data[0]._id}`,{
                method:"PUT",
                credentials:"include",
                headers:{
                    "content-Type":"application/json"
                },
                body: JSON.stringify({ 
                    question: inputvalue === null? inputvalue : undefined,
                    answer: answer,
                    img: img.dbData?.filePath || undefined
                })
            }).then((res)=>res.json());
        },
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['userchats', data[0]._id] }).then(()=>{
            setInputValue(null)
            setAnswer(null)
            setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {}
            })
            //alert('message saved');
          }
        )
          
        },
        onError: (err)=>{
            console.log(err);
        }
      })


    const requestAI = async(promptValue, isInitial)=>{
        if(!isInitial) setInputValue(promptValue);
        console.log('prompt value is called:', promptValue);
        try {
            const result = await chat.sendMessageStream(Object.entries(img.aiData).length ?[img.aiData,promptValue]:[promptValue]);
            let accumulatedText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                //console.log(chunkText);
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }
            mutation.mutate();
            
        } catch (error) {
            console.error(error)
        }

    }

    const HandleSubmit= async(e)=>{
        e.preventDefault();
        setIsFetching(true);
        const InputQusetion = e.target.Question.value;
        if(!InputQusetion){
            setIsFetching(false);
            return;
        }
        
        await requestAI(InputQusetion, false);
        
        e.target.Question.value = null;
        
        setIsFetching(false);
            
        
    }
    //IN PRODUCTION WE DONT NEED THIS USEREF
    const hasRun = useRef(false);
    useEffect(()=>{
        if(!hasRun.current){
            const fetchData = async()=>{
                if(data[0]?.history?.length === 1){
                    try {
                        const text =  data?.[0].history?.[0]?.parts?.[0].text
                        //console.log(text);
                        await requestAI(text , true);
                        console.log("response:");
                    } catch (error) {
                        //console.log(error);
                        //console.log(data);
                        //console.log('History:', data?.[0].history);
                        //console.log('First History Item:', data?.[0].history?.[0]);
                        //console.log('Parts of First History Item:', data?.[0].history?.[0]?.parts?.[0].text);
                    }
                    
                }else{
                    //console.log("conditions not met!", data && data?.history?.length)
                    //console.log('Data:', data);
                    //console.log('History:', data?.history);
                    //console.log('First History Item:', data?.history?.[0]);
                    //console.log('Parts of First History Item:', data?.history?.[0]?.parts);

                }
            }
            fetchData();
        }
        hasRun.current= true
    },[]);
    useEffect(()=>{
        endRef.current.scrollIntoView({behavior: "smooth"})
    },[data, answer, inputvalue, img.dbData]);
    return(
        <>
            {img.isLoading && <div>Loading... </div>}
            
            {img.dbData.filePath && img.dbData.filePath !== "" &&
                
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_END_POINT}
                    path={img.dbData.filePath}
                    width={380}
                    height={200}
                />
                
            }
            {inputvalue && <div className='message user'>{inputvalue}</div>}
            {isFetching && <div>Loading... </div>}
            {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
            <div className="endChat" ref={endRef}></div>
            <form onSubmit={(e)=>HandleSubmit(e)} className='newForm'>
                <Upload
                    setImg={setImg}
                />
                <input type="file" multiple={false} id='file' hidden />

                <input type="text" name='Question' placeholder='Ask Me Anything' />
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    )
}
export default NewPrompt;