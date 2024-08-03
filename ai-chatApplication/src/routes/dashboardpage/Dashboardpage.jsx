import { useMutation, useQueryClient } from '@tanstack/react-query';
import './dashboardpage.css'
import { useNavigate } from 'react-router-dom';

const Dashboardpage = ()=>{
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: (text)=>{
            return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats`,{
                method:"POST",
                credentials:"include",
                headers:{
                    "content-Type":"application/json"
                },
                body: JSON.stringify({ text: text})
            }).then((res)=>res.json());
        },
        onSuccess: (id) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['userChats'] })
          navigate(`/dashboard/chats/${id}`);
        },
      })

    const HandleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const text = e.target.text.value;
        //console.log(text);
        if(!text) return;
        mutation.mutate(text);

        } catch (error) {
            console.log(error)
            alert("something went wrong!")
        }
        
    }
    return(
        <div className="Dashboardpage">
            <div className="texts">
                <div className="logo">
                    <img src="/logo.png" alt="" />
                    <h1>RISHAB JAIN AI</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/chat.png" alt="" />
                        <span>create new chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="" />
                        <span>Analyse Image</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="" />
                        <span>Help me code</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit={(e)=>HandleSubmit(e)}>
                <input type="text" name='text' placeholder='Ask me anything' />
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
                </form>
            </div>
        </div>
    )
}

export default Dashboardpage;