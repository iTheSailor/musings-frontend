import React from "react";
import {
  Grid,
  Segment,
  Button,
  Header,
  Card,
  Divider,
} from "semantic-ui-react";
import { useState, useEffect } from "react";
import IsButton from "../../components/IsButton";
import IsPortal from "../../components/IsPortal";
import PropTypes from "prop-types";
import ToDoFormComponent from "./ToDoFormComponent";
import EditFormComponent from "./EditFormComponent";
import Cookies from "js-cookie";
import axios from "axios";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const user = localStorage.getItem("userId");
  const token = Cookies.get("csrftoken");

  const fetchTodos = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/todo`,
        {params: {
            user: user,
          }
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setTodos(response.data['todos']);
        setCompletedTodos(response.data['completed']);
      })
      .catch((error) => {
        console.error("An error occurred", error);
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  var handleComplete = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/todo/`,
        {
          todo_id: id,
          user: user,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Todo completed:", response.data);
        fetchTodos();
      })
      .catch((error) => {
        console.error("An error occurred", error);
      });
  };



  const handleTodoDelete = (id) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/api/todo/`,
        {
          data: {
            todo_id: id,
            user: user,
          },
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Todo deleted:", response.data);
        fetchTodos();
      })
      .catch((error) => {
        console.error("An error occurred", error);
      });
  };

  return (
    <>
      <Segment style={{ padding: "4em 0em" }} vertical>
        <Grid columns={2} container>
          <Grid.Column>
            <Header>Todo List</Header>
          </Grid.Column>
          <Grid.Column align="right">

              <ToDoFormComponent/>
            
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment style={{ padding: "4em 0em" }} vertical secondary>
        <Grid
          columns={4}
          style={{ width: "90%", margin: "auto" }}
          textAlign="center"
          stretched
        >
          <Grid.Column>
            <Header>Title</Header>
          </Grid.Column>
          <Grid.Column>
            <Header>Description</Header>
          </Grid.Column>
          <Grid.Column>
            <Header>Status</Header>
          </Grid.Column>
          <Grid.Column>
            <Header>Actions</Header>
          </Grid.Column>
        </Grid>
        {todos.map((todo) => (
          <Grid key={todo.id} verticalAlign="middle" centered>
            <Card
              raised
              style={{ width: "90%", margin: ".4rem", padding: "1rem" }}
            >
              <Grid columns={4}>
                <Grid.Column
                style={{textAlign:"center"}}>
                  <Header>{todo.title}</Header>
                </Grid.Column>
                <Grid.Column>{todo.description}</Grid.Column>
                <Grid.Column>
                  {todo.completed ? (
                    "Completed"
                  ) : (
                    <Button color="green" onClick={handleComplete.bind(this, todo.id)}>
                      Mark Complete
                    </Button>
                  )}
                </Grid.Column>
                <Grid.Column>
                  <Grid columns={2} vertical>
                    <Grid.Column>
                        <EditFormComponent todo={todo}/>
                    </Grid.Column>
                    <Grid.Column>
                      <IsButton
                        label="Delete"
                        onClick={() => handleTodoDelete(todo.id)}
                        color="red"
                      />
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid>
            </Card>
          </Grid>
        ))}
        <Grid></Grid>
      </Segment>
      <Segment style={{ padding: "4em 0em" }} vertical>
        <Grid>
          <Grid.Column>
            <Header>Completed Todos</Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment style={{ padding: "4em 0em" }} vertical secondary>
        <Grid
          columns={4}
          style={{ width: "90%", margin: "auto" }}
          textAlign="center"
          stretched
        >
          <Grid.Column>
            <Header>Title</Header>
          </Grid.Column>
          <Grid.Column>
            <Header>Description</Header>
          </Grid.Column>
          <Grid.Column>
            <Header>Status</Header>
          </Grid.Column>
          <Grid.Column>
            <Header>Actions</Header>
          </Grid.Column>
        </Grid>
        {completedTodos.map((todo) => (
          <Grid key={todo.id} verticalAlign="middle" centered>
            <Card
              raised
              style={{ width: "90%", margin: ".4rem", padding: "1rem" }}
            >
              <Grid columns={4}>
                <Grid.Column>
                  <Header>{todo.title}</Header>
                </Grid.Column>
                <Grid.Column>{todo.description}</Grid.Column>
                <Grid.Column>
                  {todo.completed ? "Completed" : "Not Completed"}
                </Grid.Column>
                <Grid.Column>
                  <Grid columns={2} vertical>
                    <Grid.Column>
                      <EditFormComponent todo={todo}/>
                    </Grid.Column>
                    <Grid.Column>
                      <IsButton
                        label="Delete"
                        onClick={() => handleTodoDelete(todo.id)}
                        color="red"
                      />
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid>
            </Card>
          </Grid>
        ))}
        <Grid></Grid>
      </Segment>

    </>
  );
};

export default TodoPage;
