import './signin.css'
import {SignIn} from '@clerk/clerk-react'

const Signin = ()=>{
    return(
        <div className="SigninPG">
            <SignIn path="/sign-in" signUpUrl='/sign-up' forceRedirectUrl="/dashboard"/>
        </div>
    )
}

export default Signin;