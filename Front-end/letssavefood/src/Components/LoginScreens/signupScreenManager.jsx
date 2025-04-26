import { useEffect, useState } from "react";
import SignupScreen from "./signupScreen"
import SignupScreenType from "./signupScreenType";
import SignupScreenLocation from "./signupScreenLocation";
import axios from 'axios';

const SignupScreenManager = ({handlePageSwitch}) => {

    const [indexer, setIndexer] = useState(0)
    const [user, setUser] = useState(null)

    const increasesignup = (userObject) => {
        setIndexer(prev => prev + 1)
        setUser(userObject)
    }

    useEffect(() => {
        if (indexer >= 3) {
            //send api call
            axios.post('http://localhost:5000/signup', {
                "email": user.email,
                "password": user.password,
                "firstName": user.FirstName,
                "lastName": user.LastName,
                "streetName": user.Address,
                "streetNumber": user.Nr,
                "phoneNumber": user.Phone,
                "type": user.type,
                "location": user.location
            })
            .then(response => {
                console.log(response) // Set the user data from the API
            })
            .catch(error => {
                console.error('There was an error fetching the data:', error);
            });

            handlePageSwitch('login', "Welcome to the team!")
        }
    }, [indexer])

    return (
        <>
            {indexer == 0 ? 
                <SignupScreen increasesignup={increasesignup} handlePageSwitch={handlePageSwitch}/>
                :
                indexer == 1 ?
                    <SignupScreenType user={user} increasesignup={increasesignup}/> 
                    : 
                    <SignupScreenLocation user={user} increasesignup={increasesignup}/>
            }
            
        </>
    )

}

export default SignupScreenManager;