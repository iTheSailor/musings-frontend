import React from 'react';
import { Container, Header, Segment, Card, Grid, Divider } from 'semantic-ui-react';
import IsPortal from '../../components/IsPortal';
import DifficultySelector from './DifficultySelectorComponent';
import UserSavedGames from './SavedGamesComponent';


const SudokuPage = () => {
    return (
        <Container>
            <br />
            <Header as='h1'>Sudoku</Header>
            <Segment style={{ padding: '2em 2em', margin: '2em'}}>
                <Grid columns={2} relaxed='very'>
                    <Grid.Column>
                        <Card>
                            <Card.Content>
                                <Card.Header>Play</Card.Header>
                                <Card.Description>
                                    Play a game of Sudoku
                                </Card.Description>
                                <IsPortal
                                    label='Go!'
                                    content={<p>Play Sudoku</p>}
                                >
                                    <DifficultySelector />
                                </IsPortal>     
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column>
                        <Card>
                            <Card.Content>
                                <Card.Header>Continue</Card.Header>
                                <Card.Description>
                                    Continue one of your saved games
                                </Card.Description>
                                <IsPortal
                                    label='Continue'
                                    >
                                    <UserSavedGames />

                                </IsPortal>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>
                <Divider vertical>Or</Divider>
            </Segment>
        </Container>
    );
};

export default SudokuPage;
