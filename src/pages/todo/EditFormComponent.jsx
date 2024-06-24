import React from 'react';
import { FormInput, FormField, Form, Checkbox } from 'semantic-ui-react';
import IsButton from '../../components/IsButton';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import IsPortal from '../../components/IsPortal';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';



const ToDoFormComponent = (todo) => {
    var token = Cookies.get("csrftoken");
    var user = localStorage.getItem('userId');
    const [newTodo, setNewTodo] = useState(todo.todo.title);
    const [newTodoDescription, setNewTodoDescription] = useState(todo.todo.description)
    const [completed, setCompleted] = useState(todo.todo.completed)
    const [close, setClose] = useState(false);
    const todo_id = todo.todo.id;
    const handleNewTodoChange = (e) => {
        setNewTodo(e.target.value);
    }
    const handleNewDescriptionChange = (e) =>{
        setNewTodoDescription(e.target.value);
    }

       


    const handleNewTodoSubmit = () => {
        axios.patch(`${process.env.REACT_APP_API_URL}/api/todo/`,
        {
            user: user,
            todo_id: todo_id,
            title: newTodo,
            completed: completed,
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
        label={"Edit"}
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

                <Checkbox
                    label='Completed'
                    value={todo.todo.completed}
                    checked={completed}
                    onChange={(e, data) => setCompleted(data.checked)}

                />
                
            </FormField>
            <IsButton
                type='submit'
                color='green'
                label='Confirm Edits'
            />
        </Form>
        </IsPortal>
    );

    
}

ToDoFormComponent.propTypes = {
    todo: PropTypes.object,
};



export default ToDoFormComponent;