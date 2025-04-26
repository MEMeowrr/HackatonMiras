import { useState } from "react"
import SignupScreen from "./LoginScreens/signupScreen"
import LoginScreen from "./LoginScreens/loginScreen";
import SignupScreenManager from "./LoginScreens/signupScreenManager";


const LoginManager = () => {

    const [isLoggingIn, SetIsLoggingIn] = useState(true);

    const handlePageSwitch = (page) => {
        if (page == "login") {
            SetIsLoggingIn(true)
        } else if (page == "signup") {
            SetIsLoggingIn(false)
        }
    }

    return (
        <div>
            {isLoggingIn ? 
                <LoginScreen handlePageSwitch={handlePageSwitch}/> :
                <SignupScreenManager handlePageSwitch={handlePageSwitch}/>
            }
        </div>
    )

}

export default LoginManager;