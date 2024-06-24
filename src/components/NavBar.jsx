import React from 'react';
import { Menu, Segment, Button, Container, Icon, Sidebar } from 'semantic-ui-react';
import { createMedia } from '@artsy/fresnel';
import PropTypes from 'prop-types';
import { InView } from 'react-intersection-observer';
import { Navigate, useLocation } from 'react-router-dom'; // Import useLocation hook from react-router-dom
import HomepageHeading from '../components/HomepageHeading.jsx'; // Make sure this path is correct
import NavDropdown from './NavLinks.jsx'; // Make sure this path is correct
import IsPortal from './IsPortal.jsx'; // Make sure this path is correct
import LoginForm from './LoginForm.jsx';
import SignupForm from './SignupForm.jsx';
import LogOut from './LogOut.jsx';
import { useAuth } from '../utils/AuthContext';

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const onLoginSuccess = (data) => {
  localStorage.setItem('token', data.token);
};

const onSignupSuccess = (data) => {
  localStorage.setItem('token', data.token);
};


const onLogOut = () => {
  localStorage.removeItem('token');
  window.location.reload();
};





// Convert DesktopContainer to a functional component to use hooks
const DesktopContainer = ({ children }) => {
  const [fixed, setFixed] = React.useState(false);
  const location = useLocation(); // Use useLocation hook to get the current location
  const isHomepage = location.pathname === '/';
  const toggleFixedMenu = (inView) => setFixed(!inView);
  const { loggedIn, logOut } = useAuth() || {}; // Use the authentication state and logOut function

  return (
    <Media greaterThan='mobile' className='AppNavbar'>
      <InView onChange={toggleFixedMenu}>
        <Segment
          inverted
          textAlign='center'
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : null}
            inverted={!fixed}
            pointing={!fixed}
            secondary={!fixed}
            size='large'
          >
            <Container>
              <NavDropdown />
              {!loggedIn ? ( // Check if user is not logged in
                <>
                  <Menu.Item position='right'>
                    <IsPortal header="Login" label="Login" >
                      <LoginForm onLoginSuccess={onLoginSuccess}/>
                    </IsPortal>
                  </Menu.Item>
                  <Menu.Item>
                    <IsPortal header="Signup" label="Signup" >
                      <SignupForm onSignupSuccess={onSignupSuccess} />
                    </IsPortal>
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item position='right'>
                  <LogOut/>
                </Menu.Item>
              )}
            </Container>
          </Menu>
          {isHomepage && <HomepageHeading />}
        </Segment>
        {children}
      </InView>
    </Media>
  );
};
DesktopContainer.propTypes = {
  children: PropTypes.node,
};

// Convert MobileContainer to a functional component to use hooks
const MobileContainer = ({ children }) => {
  const [sidebarOpened, setSidebarOpened] = React.useState(false);
  const location = useLocation(); // Use useLocation hook to get the current location
  const isHomepage = location.pathname === '/'; // Check if the pathname is '/'

  const handleSidebarHide = () => setSidebarOpened(false);
  const handleToggle = () => setSidebarOpened(true);
  const { loggedIn } = useAuth() || {}; // Use the loggedIn state from the AuthContext


  return (
    <Media as={Sidebar.Pushable} at='mobile'>
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation='overlay'
          inverted
          onHide={handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item as='a' active>
            Home
          </Menu.Item>
          <Menu.Item as='a'>Work</Menu.Item>
          <Menu.Item as='a'>Company</Menu.Item>
          <Menu.Item as='a'>Careers</Menu.Item>
          <Menu.Item as='a'>Log in</Menu.Item>
          <Menu.Item as='a'>Sign Up</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em' }}
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
                {!loggedIn && (
                <Menu.Item position='right'>
                  <Button as='a' inverted>
                    Log in
                  </Button>
                  <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
                    Sign Up
                  </Button>
                </Menu.Item>
              )}
              {loggedIn && (
                <Menu.Item position='right'>
                  <LogOut/>
                </Menu.Item>
              )}
              </Menu>
            </Container>
            {isHomepage && <HomepageHeading mobile />}
          </Segment>
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Media>
  );
};

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveNavbar = ({ children }) => (
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
);

ResponsiveNavbar.propTypes = {
  children: PropTypes.node,
};

export default ResponsiveNavbar;
