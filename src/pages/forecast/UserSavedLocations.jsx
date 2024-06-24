import React from 'react';
import {useEffect} from 'react';
import {
    Segment,
    Button
} from 'semantic-ui-react';
import { useState } from 'react';
// import PropTypes from 'prop-types';
import axios from 'axios';
import PropTypes from 'prop-types';

const UserSavedLocations = ({onLocationSelect, handleClose}) => {
    UserSavedLocations.propTypes = {
        onLocationSelect: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired,
    };


    const [userLocations, setUserLocations] = useState([]);
    const user = JSON.parse(localStorage.getItem('userId')) || '';

    
    useEffect(()=>{ axios.get(`${process.env.REACT_APP_API_URL}/api/weather/saved`, {
        params: {
            user: user
        }
    }).then((response) => {
        console.log(response.data);
        setUserLocations(response.data);
    }).catch((error) => {
        console.error('Failed to get favorites:', error);
    });
    }, [user]);

    const handleGetForecast = (location) => {
        console.log('Get forecast for:', location);
        onLocationSelect({...location});
        handleClose();
    }

    const handleDeleteLocation = (location) => {
        console.log('Delete location:', location);
        console.log(location.locationId)
        axios.delete(`${process.env.REACT_APP_API_URL}/api/weather/saved`, {
            data: {
                'location_id': location.locationId,
            }
        })
            .then((response) => {
                // Assuming your backend returns an object with a 'data' key containing the locations array
                if(response.data.status === 'success' && Array.isArray(response.data.data)) {
                    setUserLocations(response.data.data); // Update state with the new locations
                } else {
                    throw new Error('Invalid response data'); // Handle unexpected response format
                }
            })
            .catch((error) => {
                console.error('Failed to delete location:', error);
            });
        };


    return (
        <Segment>
            <h2>Your Saved Locations</h2>
            <ul>
                {userLocations.map((location) => (
                    <li key={location.id} style={{display:'flex', justifyContent:'space-between'}}>
                        <h3>
                        {location.nickname}
                        </h3>
                        <div>
                        <Button onClick={() => handleGetForecast(location)}>Get Forecast</Button>
                        <Button onClick={() => handleDeleteLocation(location)}>Delete</Button>
                        </div>
                    </li>

                ))}
                
            </ul>
        </Segment>
    )

}


export default UserSavedLocations;