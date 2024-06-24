import React from 'react';
import {
    FormInput,
    FormField,
    Form,
    Segment,
    Button
} from 'semantic-ui-react';
import { useState } from 'react';
import PropTypes from 'prop-types';


const SignupForm = ({onSignupSuccess}) => {
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!username) {
            setUsernameError('Username is required');
        }
        if (!email) {
            setEmailError('Email is required');
        }
        if (!password) {
            setPasswordError('Password is required');
        }
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (data.code === 200) {  
                onSignupSuccess(data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user_id);
                window.location.reload();
            } else {
                console.error('Signup failed:', data.message);
                setUsernameError('Username or email is already taken');
                setEmailError('Username or email is already taken');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    }


    return (
        <Segment className='authFormSegment' style={{width:'100%'}}>
            <Form className='signupForm' onSubmit={handleSubmit}  style={{width:'100%', display:'flex', flexDirection:'column'}}>
                <FormField>
                    <FormInput
                        label='Username'
                        placeholder='Username'
                        onChange={handleUsernameChange}
                        error= {usernameError? {content: usernameError, pointing:'below'} : false}
                    />
                </FormField>
                <FormField>
                    <FormInput
                        label='Email'
                        placeholder='Email'
                        onChange={handleEmailChange}
                        error= {emailError? {content: emailError, pointing:'below'} : false}
                    />
                </FormField>
                <FormField>
                    <FormInput
                        label='Password'
                        placeholder='Password'
                        type='password'
                        onChange={handlePasswordChange}
                        error= {passwordError? {content:'Password is required', pointing:'below'} : false}
                    />
                </FormField>
                <Button type='submit' style={{margin:'auto'}}>Submit</Button>
            </Form>
        </Segment>
    );
}


SignupForm.propTypes = {
    onSignupSuccess: PropTypes.func.isRequired,
};



export default SignupForm;