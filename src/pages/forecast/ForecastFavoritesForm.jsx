import React from 'react';
import {
    FormInput,
    FormGroup,
    Form,
    Segment,
    Button
} from 'semantic-ui-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const FavoritesForm = ({onSubmit, handleClose}) => {

    FavoritesForm.propTypes = {
        onSubmit: PropTypes.func.isRequired,
        address: PropTypes.string.isRequired,
        lat: PropTypes.string.isRequired,
        lon: PropTypes.string.isRequired,
        timezone: PropTypes.string.isRequired,
        country_code: PropTypes.string.isRequired,
        handleClose: PropTypes.func.isRequired,
    };
    const [nickname, setNickname] = useState('');
    const user = JSON.parse(localStorage.getItem('userId')) || '';
    const address = JSON.parse(localStorage.getItem('address')) || '';
    const lat = JSON.parse(localStorage.getItem('lat')) || '';
    const lon = JSON.parse(localStorage.getItem('lon')) || '';
    const timezone = JSON.parse(localStorage.getItem('timezone')) || '';
    const country_code = JSON.parse(localStorage.getItem('country_code')) || '';
    console.log('user:', user, 'address:', address);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(
            `${process.env.REACT_APP_API_URL}/api/weather/`,
            {address, nickname, user, lat, lon, timezone, country_code},
        ).then((response) => {
            onSubmit(response.data);
            handleClose();
        }).catch((error) => {
            console.error('Failed to add favorite:', error);
        }
        );
        
    };

    return (
        <Segment>
            <Form onSubmit={(handleSubmit)}>
                <FormGroup>
                    <FormInput
                        label="Nickname"
                        placeholder={address}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </FormGroup>
                <input type="hidden" value={user} />
                <input type="hidden" value={address} />
                <input type="hidden" value={lat} />
                <input type="hidden" value={lon} />

                <Button type="submit">Add Favorite</Button>
            </Form>
        </Segment>
    );
}

export default FavoritesForm;