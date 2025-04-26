import Logo from '../../Images/letssavefoodimage.jpeg'
import CourierImage from '../../Images/courierImage.png'
import DispatcherImage from '../../Images/dispatcherImage.png'
import BothImage from '../../Images/bothImage.png'
import './signupScreenType.css'

const SignupScreenType = ({user, increasesignup}) => {

    const handleChooseType = (type) => {

        const newUser = {
            ...user,
            'type': type
        }

        increasesignup(newUser)

    }

    return (
        <div className='LoginScreen_Container'>
                    <div className='SignUpScreen_Image'>
                        <img src={Logo} alt="" />
                    </div>
                    <div className='SignUpScreen_Ellipse'></div>
                    <div className='LoginScreen_Details'>
                        <div className='SignUpScreen_Welcome'>Welcome!</div>
                        <div className='SignUpScreen_Description'>I would like to volunteer as</div>
                        <div>
                            {/* options here */}
                            <div className="Signup_Card_Container" onClick={() => handleChooseType('courier')}>
                                <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', marginRight: 20}}><img height={'80%'} src={CourierImage} alt="" /></div>
                                <div style={{height: '100%', textAlign: 'left', display: 'flex', flexFlow: 'column nowrap', justifyContent: 'space-evenly'}}>
                                    <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Courier</div>
                                    <div style={{fontWeight: 'bold', opacity: 0.5}}>
                                        <div>- Pick-up or drop off</div>
                                        <div>- Choose your orders</div>
                                        <div>- Flexibility</div>
                                    </div>
                                </div>
                            </div>
                            <div className="Signup_Card_Container" onClick={() => handleChooseType('dispatcher')}>
                                <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', marginRight: 20}}><img src={DispatcherImage} alt="" /></div>
                                <div style={{height: '100%', textAlign: 'left', display: 'flex', flexFlow: 'column nowrap', justifyContent: 'space-evenly'}}>
                                    <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Dispatcher</div>
                                    <div style={{fontWeight: 'bold', opacity: 0.5}}>
                                        <div>- Manage couriers</div>
                                        <div>- Create events</div>
                                        <div>- Order pick-ups</div>
                                    </div>
                                </div>
                            </div>
                            <div className="Signup_Card_Container" onClick={() => handleChooseType('both')}>
                                <div style={{display: 'flex', height: '100%', justifyContent: 'center', width: 110, alignItems: 'center', marginRight: 20}}><img src={BothImage} alt="" /></div>
                                <div style={{height: '100%', textAlign: 'left', display: 'flex', flexFlow: 'column nowrap', justifyContent: 'space-evenly'}}>
                                    <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Both</div>
                                    <div style={{fontWeight: 'bold', opacity: 0.5}}>
                                        <div>- Pick-up or drop off</div>
                                        <div>- Manage couriers</div>
                                        <div>- Best of both worlds</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    )
}

export default SignupScreenType