import './dashboardOverview.css'
import Banana from '../../Images/banana.png'
import VariaBox from '../../Images/variaBox.png'

import { GoogleMap, LoadScript, Marker, InfoWindow  } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const DashboardOverview = () => {

    const [selectedMarker, setSelectedMarker] = useState(null);

    const handleAddOrder = (id) => {
        //find item by id
        const orderToAdd = availableOrders.find(item => item.id === id);

        if (orderToAdd) {
            // Remove from availableOrders
            setAvailableOrders(prev => prev.filter(item => item.id !== id));
    
            // Add to courier (assuming you have a courierOrders state)
            setCourierOrders(prev => [...prev, orderToAdd]);
            //
            geocodeAddress(orderToAdd.address)
            .then(coords => {
                const marker = {
                    address: orderToAdd.address,
                    position: {
                        lat: coords.lat,
                        lng: coords.lng,
                    },
                    weight: orderToAdd.weight // <--- save weight info for the marker
                }
                console.log(marker)
                setAddressMarkers(prev => [...prev, marker])
            })
            .catch(error => {
                console.error(error);
            });
        }
    };

    const [availableOrders, setAvailableOrders] = useState([
        { id: 1, address: 'Voskenslaan, 88, Gent', weight: '7kg aardappelen', vehicle: 'Big', type: 'Drop-off' },
        { id: 2, address: 'Rijselsesteenweg, 35, Gent', weight: '12kg sinaasappelen', vehicle: 'Small', type: 'Pick-up' },
        { id: 3, address: 'Sluizeken, 12, Gent', weight: '8kg courgettes', vehicle: 'Big', type: 'Pick-up' },
        { id: 4, address: 'Winkelstraat, 101, Gent', weight: '15kg appels', vehicle: 'Big', type: 'Pick-up' },
        { id: 5, address: 'Sluizeken, 99, Gent' , weight: '4kg komkommers', vehicle: 'Small', type: 'Drop-off' },
        { id: 6, address: 'Voskenslaan, 100, Gent', weight: '6kg bananen', vehicle: 'Small', type: 'Pick-up' },
        { id: 7, address: 'Rijselsesteenweg, 82, Gent', weight: '10kg sla', vehicle: 'Big', type: 'Drop-off' }
    ]);
    
    const unavailableOrders = [
        { id: 1, address: 'Krijgslaan, 45, Gent', weight: '5kg appels', vehicle: 'Fridge', type: 'Drop-off' },
        { id: 2, address: 'Langemunt, 23, Gent', weight: '9kg wortelen', vehicle: 'Fridge', type: 'Pick-up' },
        { id: 3, address: 'Kleine Dijk, 55, Gent', weight: '2kg aubergines', vehicle: 'Fridge', type: 'Drop-off' },
        { id: 4, address: 'Langemunt, 55, Gent', weight: '3kg tomaten', vehicle: 'Fridge', type: 'Drop-off' },
        { id: 5, address: 'Krijgslaan, 20, Gent', weight: '5kg appels', vehicle: 'Fridge', type: 'Pick-up' }
    ];

    const [CourierOrders, setCourierOrders] = useState([])

    const [infoOwnOpen, setOwnInfoOpen] = useState(false);
    const [addOrdersSelected, setAddordersSelected] = useState(false)

    const [addressMarkers, setAddressMarkers] = useState([]);

    const geocodeAddress = (address) => {
        const geocoder = new window.google.maps.Geocoder();
    
        return new Promise((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    resolve({ lat: location.lat(), lng: location.lng() });
                } else {
                    reject('Geocoding failed: ' + status);
                }
            });
        });
    };

    const currentPosition = {
        lat: 51.04130086801961, 
        lng: 3.7405285813086007
    };

    const center = {
        lat: 51.0543,
        lng: 3.7174
    };

    const containerStyle = {
        width: '100vw',   // full screen width
        height: '100vh'   // full screen height
    };

    return (
        <div className="Dashboard_Container">

            <LoadScript googleMapsApiKey="">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    options={{
                        disableDefaultUI: true,  // <--- disables all controls
                    }}
                >
                    <Marker 
                        position={currentPosition}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // <-- custom icon
                        }}
                        onClick={() => setOwnInfoOpen(true)}
                    />
                    {infoOwnOpen && (
                        <InfoWindow
                            position={currentPosition}
                            onCloseClick={() => setOwnInfoOpen(false)} // 👈 close info window
                        >
                            <div style={{ fontSize: '1rem' }}>
                            <h3>You are here</h3>
                            <p>This is your current location.</p>
                            </div>
                        </InfoWindow>
                    )}
                    {addressMarkers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker.position}
                            title={marker.address}
                            onClick={() => setSelectedMarker({ ...marker, index })}
                        />
                    ))}
                    {selectedMarker && (
                        <InfoWindow
                            position={selectedMarker.position}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div style={{ fontSize: '0.9rem', maxWidth: '200px' }}>
                                <h3>{selectedMarker.address}</h3>
                                <p><strong>Quantity:</strong> {selectedMarker.weight || "Unknown"}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                                    <button 
                                        style={{ marginBottom: '5px', cursor: 'pointer' }} 
                                        onClick={() => {
                                            const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedMarker.address)}`;
                                            window.open(url, '_blank');
                                        }}
                                    >
                                        Navigate
                                    </button>
                                    <button 
                                        style={{ cursor: 'pointer' }} 
                                        onClick={() => {
                                            setAddressMarkers(prev => prev.filter((_, i) => i !== selectedMarker.index));
                                            setCourierOrders(prev => prev.filter(order => order.address !== selectedMarker.address));
                                            setSelectedMarker(null);
                                        }}
                                    >
                                        Mark as Complete
                                    </button>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>

            {!addOrdersSelected ? 
            <>
                <div className='Dashboard_Order_Popup'>
                    {CourierOrders.map(order => (
                        <div className='Dashboard_Order_Popup_Event'>
                            <div style={{height: '100%', display:'flex', alignItems:'center'}}><img height={'90%'} src={Banana} alt="" /></div>
                            <div className='Dashboard_Order_popup_Event_Details'>
                                <div style={{fontSize: "1.1rem"}}>{order.type}</div>
                                <div style={{fontSize: '0.8rem'}}>{order.address}</div>
                                <div style={{opacity: 0.5}}>{order.weight}</div>
                                <div style={{opacity: 0.5}}>{order.vehicle}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div onClick={() => setAddordersSelected(true)} className='Dashboard_Plus_Sign'><div style={{marginBottom: 7.5}}>+</div></div>
            </>
            :
            <div style={{height: '100vh', width:'100vw', backgroundColor: 'white', position:'absolute', top: '0', left: '0'}}>
                <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', marginBottom: '20px', height: '50%'}}>
                    <div style={{textDecoration: 'underline', fontSize: '1.5rem', marginBottom: '20px'}}>Available</div>
                    <div style={{display: 'flex', gap: '10px', flexFlow: 'column nowrap', alignItems: 'center', overflowY: 'scroll'}}>
                        {availableOrders.map(order => (
                            <div className='Dashboard_Order_Popup_Event' onClick={() => handleAddOrder(order.id)}>
                                <div style={{height: '100%', display:'flex', alignItems:'center'}}><img height={'90%'} src={Banana} alt="" /></div>
                                <div className='Dashboard_Order_popup_Event_Details'>
                                    <div style={{fontSize: "1.1rem"}}>{order.type}</div>
                                    <div style={{fontSize: '0.8rem'}}>{order.address}</div>
                                    <div style={{opacity: 0.5}}>{order.weight}</div>
                                    <div style={{opacity: 0.5}}>{order.vehicle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', marginBottom: '20px', height: '50%'}}>
                    <div style={{textDecoration: 'underline', fontSize: '1.5rem', marginBottom: '20px'}}>Unavailable</div>
                    <div style={{display: 'flex', gap: '10px', flexFlow: 'column nowrap', alignItems: 'center', overflowY: 'scroll'}}>
                        {unavailableOrders.map(order => (
                            <div className='Dashboard_Order_Popup_Event'>
                                <div style={{height: '100%', display:'flex', alignItems:'center'}}><img height={'90%'} src={Banana} alt="" /></div>
                                <div className='Dashboard_Order_popup_Event_Details'>
                                    <div style={{fontSize: "1.1rem"}}>{order.type}</div>
                                    <div style={{fontSize: '0.8rem'}}>{order.address}</div>
                                    <div style={{opacity: 0.5}}>{order.weight}</div>
                                    <div style={{opacity: 0.5}}>{order.vehicle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div onClick={() => setAddordersSelected(false)} className='Dashboard_Plus_Sign'><div style={{marginBottom: 7.5}}>x</div></div>
            </div>
            }
        </div>
    )

}

export default DashboardOverview