import { useState } from 'react';
import Logo from '../../Images/letssavefoodimage.jpeg'

const SignupScreen = ({handlePageSwitch, increasesignup}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Address, setAddress] = useState('');
    const [Nr, setNr] = useState('');
    const [Phone, setPhone] = useState('');

    const handleSignUpButton = (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page

        const user = {
            'email': email,
            'password': password,
            'firstName': FirstName,
            'lastName': LastName,
            'streetName': Address,
            'streetNumber': Nr,
            'phoneNumber': Phone
        }

        increasesignup(user)
    }

    return (
        <div className='LoginScreen_Container'>
            <div className='SignUpScreen_Image'>
                <img src={Logo} alt="" />
            </div>
            <div className='SignUpScreen_Ellipse'></div>
            <div className='LoginScreen_Details'>
                <div className='LoginScreen_Title'>Sign up</div>
                <div>
                    <div className='SignupScreen_TextInput'>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div className='SignupScreen_TextInput' style={{width: '42%'}}>
                            <input type="FirstName" placeholder="FirstName" value={FirstName} onChange={(e) => setFirstName(e.target.value)}/>
                        </div>
                        <div className='SignupScreen_TextInput' style={{width: '42%'}}>
                            <input type="LastName" placeholder="LastName" value={LastName} onChange={(e) => setLastName(e.target.value)}/>
                        </div>
                    </div>
                    <div className='SignupScreen_TextInput'>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className='SignupScreen_TextInput'>
                        <input type="phone" placeholder="Phone" value={Phone} onChange={(e) => setPhone(e.target.value)}/>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div className='SignupScreen_TextInput' style={{width: '65%'}}>
                            <input type="Address" placeholder="Address" value={Address} onChange={(e) => setAddress(e.target.value)}/>
                        </div>
                        <div className='SignupScreen_TextInput' style={{width: '20%'}}>
                            <input type="HouseNr" placeholder="Nr." value={Nr} onChange={(e) => setNr(e.target.value)}/>
                        </div>
                    </div>
                </div>
                {/* <div className='LoginScreen_Error' style={invalidCreds ? {visibility: 'visible'} : {visibility: 'hidden'}}>Invalid credentials</div> */}
                <div className='LoginScreen_Button' onClick={handleSignUpButton}>Sign up</div>
                <div className='LoginScreen_Signup'>Allready have an account? <span className='LoginScreen_Signup_btn' onClick={() => handlePageSwitch('login')}>Log in</span></div>
            </div>
        </div>
    )
}

export default SignupScreen