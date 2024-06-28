import React from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  List,
  Image,
  Segment,
} from "semantic-ui-react";
import { useState, useEffect } from "react";
import axios from "axios";
import me1 from "../images/me1.jpeg";

const MainPage = () => {
  return(
  <>
    <Container style={{ height: "26rem" }}></Container>

    <Segment style={{ padding: "8em 0em" }} vertical>
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={8} textAlign="center">
            <Header
              as="h3"
              style={{ fontSize: "2em" }}
              content="Skillset"
              textAlign="center"
            />
            <List horizontal
                style={{ fontSize: "1.33em" }}
                celled
            >
                <List.Item >Python</List.Item>
                <List.Item >Postgres</List.Item>
                <List.Item >JavaScript</List.Item>
                <List.Item >Node.js</List.Item>
                <List.Item >React</List.Item>
                <List.Item >Django</List.Item>
                <List.Item >Linux Systems</List.Item>
                </List>
            <List horizontal
                celled
            >
                <List.Item >Git</List.Item>
                <List.Item >HTML/CSS</List.Item>
                <List.Item >AWS</List.Item>
                <List.Item >Docker</List.Item>
                <List.Item >Vim</List.Item>
            </List>
            <Header
              as="h3"
              style={{ fontSize: "2em" }}
              content="Professional Interests"
              textAlign="center"
            />
            <List horizontal
                style={{ fontSize: "1.33em" }}
                celled
            >
                <List.Item >Full Stack Development</List.Item>
                <List.Item >Data Science</List.Item>
                <List.Item >Machine Learning</List.Item>
                <List.Item >Artificial Intelligence</List.Item>
            </List>
            <List horizontal
                  celled>
                <List.Item >Cloud Computing</List.Item>
                <List.Item >Cybersecurity</List.Item>
                <List.Item >Automation</List.Item>
                <List.Item >Software as a Service</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column floated="right" width={6}>
            <Image
              bordered
              rounded
              size="huge"
              src={me1}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: "0em" }} vertical>
      <Grid celled="internally" columns="equal" stackable>
        <Grid.Row textAlign="center">
          <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Analytical Thinker
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              I am a highly analytical thinker and a problem solver. I enjoy
              breaking down complex problems into smaller, more manageable
              components.
            </p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Expert Communicator
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              I am an expert communicator with a strong background in public
              speaking, writing, and interpersonal communication. I am able to
              convey complex ideas in a clear and concise manner.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: "8em 0em" }} vertical>
      <Container text textAlign="center">
        <Header as="h3" style={{ fontSize: "2em" }}>
          What Am I Currently Working On?
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          I am currently working on a number of projects, including a full stack
          web application, a data science project, and a machine learning
          project. I am always looking for new and exciting projects to work on,
          so if you have an idea, feel free to reach out! You can see samples of
          my work on and what I am currently working on on my portfolio page. 
        </p>
        <Button as="a" size="large">
          Portfolio Page
        </Button>

        <Divider
          as="h4"
          className="header"
          horizontal
          style={{ margin: "3em 0em", textTransform: "uppercase" }}
        ></Divider>

        <Header as="h3" style={{ fontSize: "2em" }} textAlign="center">
          Want To See My Resume?
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          If you would like to see my resume, you can download a copy by clicking
          the button below. My resume includes information about my education,
          work experience, and skills. If you have any questions about my resume,
          feel free to reach out!
        </p>
        <Button as="a" size="large">
          Download Resume
        </Button>
      </Container>
    </Segment>
  </>
);
};

export default MainPage;
