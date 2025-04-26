import { useState } from "react";
import SignupScreen from "./signupScreen"
import SignupScreenType from "./signupScreenType";


const SignupScreenManager = ({handlePageSwitch}) => {

    const [indexer, setIndexer] = useState(0)
    const [user, setUser] = useState(null)

    const increasesignup = (userObject) => {
        setIndexer(prev => prev + 1)
        setUser(userObject)
    }

    return (
        <>
            {indexer == 0 ? 
                <SignupScreen increasesignup={increasesignup} handlePageSwitch={handlePageSwitch}/>
                :
                indexer == 1 ?
                    <SignupScreenType user={user} increasesignup={increasesignup}/> 
                    : 
                    <div>screen 3</div>
            }
            
        </>
    )

}

export default SignupScreenManager;