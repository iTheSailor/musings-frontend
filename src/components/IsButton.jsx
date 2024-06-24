import React from 'react'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types';

const IsButton = ({ label, onClick, color, style }) => {
    return (
      <Button onClick={onClick} color={color} style={style}>
        {label} {/* The button label is set based on the passed 'label' prop */}
      </Button>
    );
  };

IsButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    color: PropTypes.string,
    style: PropTypes.object,
    };

export default IsButton
