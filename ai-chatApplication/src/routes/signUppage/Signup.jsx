import './signup.css'
import {SignUp} from '@clerk/clerk-react'


const Signup = ()=>{
    return(
        <div className="SignupPG">
            <SignUp path="/sign-up" signInUrl='/sign-in'/>
        </div>
    )
}

export default Signup;