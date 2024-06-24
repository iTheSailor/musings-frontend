import React from 'react';
import Cookies from 'js-cookie';

const CSRFToken = () => {
    const csrftoken = Cookies.get('csrftoken');

    if (!csrftoken) {
        console.error('CSRF token not found');
        return null;
    }

    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
    );
};

export default CSRFToken;
