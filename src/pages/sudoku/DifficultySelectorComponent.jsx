import React from 'react';
import { Dropdown, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import IsButton from '../../components/IsButton';
import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

const DifficultySelector = ({handleClose}) => {
    DifficultySelector.propTypes = {
        handleClose: PropTypes.func,
    };

    const [difficulty, setDifficulty] = useState('easy');
    const navigate = useNavigate();

    useEffect (() => {
        console.log('Difficulty:', difficulty);
    }, [difficulty]);

    const startGame = () => {
        console.log('Start game with difficulty:', difficulty);
        console.log('user:', localStorage.getItem('userId'));

        axios.get(`${process.env.REACT_APP_API_URL}/api/sudoku/play`, {
            params: {
                difficulty: difficulty,
                userid: localStorage.getItem('userId')
            }
        }).then((response) => {
            console.log('Game started:', response.data);
            navigate('/apps/sudoku/game', 
            {state: {current_state: response.data.transformed_state, 
                solution: response.data.transformed_solution,
                    gameid: response.data.id,
                    time: response.data.time, 
                    difficulty: response.data.difficulty, 
                    userid: response.data.player.id}});
     
            handleClose();
        }).catch((error) => {
            console.error('Failed to start game:', error);
        });
    }
    const difficultyOptions = [
        { key: 'easy', text: 'Easy', value: 'easy' },
        { key: 'medium', text: 'Medium', value: 'medium' },
        { key: 'hard', text: 'Hard', value: 'hard' },
    ];
    

    return (
        <>
        <Header as='h3' content='Select Difficulty' />
        <div style={{display:'flex', justifyContent:'space-between'}}>
        <Dropdown
            placeholder='Select Difficulty'
            selection
            options={difficultyOptions}
            defaultValue={difficulty}
            onChange={(e, data) => setDifficulty(data.value)}
        />
        <IsButton
            label='Start Game'
            onClick={startGame}
            color='green'
        ></IsButton>
        </div>
        </> 
    );
}

export default DifficultySelector;