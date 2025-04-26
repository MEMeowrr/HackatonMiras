import { useState } from 'react'
import Logo from '../../Images/letssavefoodimage.jpeg'

const SignupScreenLocation = ({user, increasesignup}) => {

    const [selectedLocation, setSelectedLocation] = useState(null)

    const handleChooseLocation = (location) => {
        setSelectedLocation(location)
        setTimeout(() => {
            const newUser = {
                ...user,
                location
            }
            increasesignup(newUser)
        }, 600) // wait 600ms for fade effect
    }

    return (
        <div className='LoginScreen_Container'>
            <div className='SignUpScreen_Image'>
                <img src={Logo} alt="" />
            </div>
            <div className='SignUpScreen_Ellipse'></div>
            <div className='LoginScreen_Details'>
                <div className='SignUpScreen_Welcome'>Welcome!</div>
                <div className='SignUpScreen_Description'>I would like to help this location</div>
                <div style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-evenly', rowGap: '20px'}}>
                    {/* gent, eeklo, kortrijk, wetteren */}
                    <div onClick={() => handleChooseLocation('eeklo')} className={`SignUpScreen_Location ${selectedLocation === 'eeklo' ? 'selected' : ''}`}>Eeklo</div>
                    <div onClick={() => handleChooseLocation('kortrijk')} className={`SignUpScreen_Location ${selectedLocation === 'kortrijk' ? 'selected' : ''}`}>Kortrijk</div>
                    <div onClick={() => handleChooseLocation('wetteren')} className={`SignUpScreen_Location ${selectedLocation === 'wetteren' ? 'selected' : ''}`}>Wetteren</div>
                    <div onClick={() => handleChooseLocation('gent-noord')} className={`SignUpScreen_Location ${selectedLocation === 'gent-noord' ? 'selected' : ''}`}>Gent-Noord</div>
                    <div onClick={() => handleChooseLocation('gent-zuid')} className={`SignUpScreen_Location ${selectedLocation === 'gent-zuid' ? 'selected' : ''}`}>Gent-Zuid</div>
                </div>
            </div>
        </div>
    )
}

export default SignupScreenLocation