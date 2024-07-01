import PropTypes from 'prop-types'
import React from 'react'
import { Button, Container, Header, Icon } from 'semantic-ui-react'

const HomepageHeading = ({ mobile }) => (
    <Container text >
      <Header
        as='h1'
        content='Ibrahim Salir'
        inverted
        style={{
          fontSize: mobile ? '2em' : '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '1.5em',
        }}
      />
      <Header
        as='h2'
        content='Full Stack Developer'
        inverted
        style={{
          fontSize: mobile ? '1.5em' : '1.7em',
          fontWeight: 'normal',
          marginTop: mobile ? '0.5em' : '1.5em',
        }}
      />
      <Container text size='huge'  >
        <Icon name='warning sign' style={{color:'yellow'}}/>
        <p style={{color:'yellow'}}>
          This site is under construction, please bear in mind that some features may not work as expected.
        </p>
        <p>
          <em>You can use username: user and password: user to log in</em>
        </p>
        <p>
          The frontend of this website is built with React, Node.js, Semantic UI and deployed on Render.
        </p>
        <p>
          The backend is built with Django and deployed on AWS.
        </p>
        <p>
          Last updated: July 1st, 2024
        </p>

      </Container>
    </Container>
  )
  
  HomepageHeading.propTypes = {
    mobile: PropTypes.bool,
  }
  

export default HomepageHeading