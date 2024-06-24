import React from 'react';
import { Button } from 'semantic-ui-react';
import { useAuth } from '../utils/AuthContext';
import PropTypes from 'prop-types';
import { useEffect } from 'react';


const LogOut = () => {

    const { logOut } = useAuth();
    const onLogoutSuccess = () => {
        logOut();
        localStorage.clear();
        window.location.replace('/');
    }

    return (
        <Button onClick={onLogoutSuccess}>Log Out</Button>
    );
}

LogOut.propTypes = {
    onLogoutSuccess: PropTypes.func,
};
export default LogOut;