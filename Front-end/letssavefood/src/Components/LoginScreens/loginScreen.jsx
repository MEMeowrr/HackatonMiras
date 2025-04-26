import './loginScreen.css'
import Logo from '../../Images/letssavefoodimage.jpeg'
import { useState } from 'react'
import axios from 'axios';

const LoginScreen = ({handlePageSwitch, info}) => {

    const [invalidCreds, setInvalidCreds] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLoginButton = () => {
        console.log("button pressed")

        //make login api call

        axios.post('http://localhost:5000/login', {
            email: email,
            password: password,
        })
        .then(response => {
            console.log(response) // Set the user data from the API
            if (response.data.success) {
                //navigate furthur
                console.log("login successfull")
            } else {
                setInvalidCreds(true)
            }
        })
        .catch(error => {
            console.error('There was an error fetching the data:', error);
        });
    
    }

    return (
        <div className='LoginScreen_Container'>
            <div className='LoginScreen_Image'>
                <img src={Logo} alt="" />
            </div>
            <div className='LoginScreen_Ellipse'></div>
            <div className='LoginScreen_Details'>
                <div className='LoginScreen_Title'>Login</div>
                <div>
                    <div className='LoginScreen_TextInput'>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className='LoginScreen_TextInput'>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </div>
                <div style={info != "" && !invalidCreds ? {display: 'block', color: 'green'} : {display: 'none'}}>{info}</div>
                <div style={invalidCreds ? {display: 'block', color: 'red'} : {display: 'none'}}>Invalid credentials</div>
                <div className='LoginScreen_Button' onClick={handleLoginButton}>Login</div>
                <div className='LoginScreen_Signup'>don't have an account? <span className='LoginScreen_Signup_btn' onClick={() => handlePageSwitch('signup')}>Sign up</span></div>
            </div>
        </div>
    )
}

export default LoginScreen