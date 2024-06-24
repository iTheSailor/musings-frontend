import React, { useState, useEffect } from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';

import PropTypes from 'prop-types';

const Timer = ({ initialTime = 0, pauseReset, isActive, toggle, onTimeChange, onStop}) => {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        let timerId;
        if (isActive) {
            timerId = setInterval(() => {
                setTime(time => time + 1);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [isActive]);

    useEffect(() => {
        if (onTimeChange) {
            onTimeChange(time);
        }
    }
    , [time, onTimeChange]);

    useEffect(() => {
        if (onStop) {
            isActive = false;
        }
    }
    , [time, onStop, isActive]);



    const reset = () => {
        setTime(0); // Reset to 0 or initialTime based on your logic
        if (toggle && isActive) {
            toggle();
        }
    };

    return (
        <>
            <Label size='large'>
                <Icon name='clock' /> {time} seconds
            </Label>
            {pauseReset &&
                <Button.Group>
                    <Button toggle active={isActive} onClick={toggle}>
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button onClick={reset}>
                        Reset
                    </Button>
                </Button.Group>
            }
        </>
    );
};

Timer.propTypes = {
    initialTime: PropTypes.number,
    pauseReset: PropTypes.bool,
    isActive: PropTypes.bool,
    toggle: PropTypes.func,
    onTimeChange: PropTypes.func,
    onStop: PropTypes.bool
};

export default Timer;
