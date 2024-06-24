import React from 'react';
import { FormInput, FormField, Form } from 'semantic-ui-react';
import IsButton from '../../components/IsButton';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import IsPortal from '../../components/IsPortal';




const ToDoFormComponent = () => {
    var token = Cookies.get("csrftoken");
    var user = localStorage.getItem('userId');
    const [newTodo, setNewTodo] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('')
    const [close, setClose] = useState(false);
    const handleNewTodoChange = (e) => {
        setNewTodo(e.target.value);
    }
    const handleNewDescriptionChange = (e) =>{
        setNewTodoDescription(e.target.value);
    }

       


    const handleNewTodoSubmit = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/todo/`,
        {
            user: user,
            title: newTodo,
            description: newTodoDescription,
        },
        
        {
            withCredentials: true,
            headers:{
                "X-CSRFToken": token,
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response)
            setClose(true);
            window.location.reload();
        }).catch((error) => {
            console.error("error:", error);
        })

    }
    
    
    return (
        <IsPortal
        label={"Add Item"}
        auxHook={close}>
        <Form onSubmit={handleNewTodoSubmit}>
            <FormField>
                <FormInput
                    type='text'
                    placeholder='Enter a new to-do item'
                    value={newTodo}
                    onChange={handleNewTodoChange}
                />
                <FormInput
                    type='text'
                    placeholder='Enter a description'
                    value={newTodoDescription}
                    onChange={handleNewDescriptionChange}
                    />
            </FormField>
            <IsButton
                type='submit'
                color='green'
                label='Add To-Do'
            />
        </Form>
        </IsPortal>
    );

    
}



export default ToDoFormComponent;