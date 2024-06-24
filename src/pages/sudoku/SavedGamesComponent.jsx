import React from 'react';
import { Dropdown, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import IsButton from '../../components/IsButton';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';


const UserSavedGames = () => {
    
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState({});//[0].current_state);
    const navigate = useNavigate();
    var user = localStorage.getItem('userId');
    var token = localStorage.getItem('token');

    const gameOptions = games.map(game => {
        return { key: game.id, text: (game.difficulty + game.created_at.slice(5,10)), value: game.id }
    });

    const handleGameSelect = (gameid) => {
        console.log('Game selected:', gameid);
        setSelectedGame(games.filter(game => game.id === gameid)[0]);
    }

    const onDeleteGame = () => {
        console.log('Delete game:', selectedGame.id);
        axios.delete(`${process.env.REACT_APP_API_URL}/api/sudoku/deleteGame`, {
            data: {
                gameid: selectedGame.id,
                userid: user
            },
            withCredentials: true,
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': document.cookie.split('=')[1]
            }
        }).then((response) => {
            console.log('Game deleted:', response.data);
            setGames(games.filter(game => game.id !== selectedGame.id));
        }).catch((error) => {
            console.error('Failed to delete game:', error);
        });
    }

    const onLoadGame = () => {
        console.log('Load game:', selectedGame.id);
        console.log('Current State:', selectedGame.transformed_state)
        navigate('/apps/sudoku/game', 
        {state: {current_state: selectedGame.transformed_state, 
            solution: selectedGame.transformed_solution,
                gameid: selectedGame.id,
                time: selectedGame.time, 
                difficulty: selectedGame.difficulty, 
                userid: selectedGame.player.id}});
    }



    useEffect(() => {
        console.log('User:', user)
        axios.get(`${process.env.REACT_APP_API_URL}/api/sudoku/savedGames`, {
            withCredentials: true,
            headers: { 
                'Content-Type': 'application/json',
            },
            params: {
                userid: user
            }
        }).then((response) => {
            console.log('Saved Games:', response.data);
            setGames(response.data);
        }).catch((error) => {
            console.error('Failed to get saved games:', error);
        });
    }
    , [user]);
    return (
        <>
        <Header as='h3' content='Select Game' />
        <Dropdown
            placeholder='Select Game'
            selection
            options={gameOptions}
            onChange={(e, data) => handleGameSelect(data.value)}
        />
        <IsButton
            label='Continue Game'
            onClick={(onLoadGame)} 

        ></IsButton>
        <IsButton
            label='Delete Game'
            onClick={onDeleteGame}
            color='red'
        ></IsButton>
        </> 
    );
}

UserSavedGames.propTypes = {
    games: PropTypes.array,
    
};


export default UserSavedGames;