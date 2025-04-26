import { useState } from "react"
import SignupScreen from "./LoginScreens/signupScreen"
import LoginScreen from "./LoginScreens/loginScreen";
import SignupScreenManager from "./LoginScreens/signupScreenManager";


const LoginManager = () => {

    const [isLoggingIn, SetIsLoggingIn] = useState(true);
    const [info, setInfo] = useState("")

    const handlePageSwitch = (page, info = "") => {
        if (page == "login") {
            SetIsLoggingIn(true)
            if (info != "") {
                setInfo(info)
            }
        } else if (page == "signup") {
            SetIsLoggingIn(false)
        }
    }

    return (
        <div>
            {isLoggingIn ? 
                <LoginScreen handlePageSwitch={handlePageSwitch} info={info}/> :
                <SignupScreenManager handlePageSwitch={handlePageSwitch}/>
            }
        </div>
    )

}

export default LoginManager;