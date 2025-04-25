import './loginScreen.css'
import Logo from '../../Images/letssavefoodimage.jpeg'
import { useState } from 'react'

const LoginScreen = ({handlePageSwitch}) => {

    const [invalidCreds, setInvalidCreds] = useState(false)

    const handleLoginButton = () => {
        console.log("button pressed")
        setInvalidCreds(true);
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
                        <input type="email" placeholder="Email" />
                    </div>
                    <div className='LoginScreen_TextInput'>
                        <input type="password" placeholder="Password" />
                    </div>
                </div>
                <div className='LoginScreen_Error' style={invalidCreds ? {visibility: 'visible'} : {visibility: 'hidden'}}>Invalid credentials</div>
                <div className='LoginScreen_Button' onClick={handleLoginButton}>Login</div>
                <div className='LoginScreen_Signup'>don't have an account? <span className='LoginScreen_Signup_btn' onClick={() => handlePageSwitch('signup')}>Sign up</span></div>
            </div>
        </div>
    )
}

export default LoginScreen