import React from 'react';
import { Segment, Header, Grid, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StockBoard = ({ board, stock }) => (
    <Segment>
        <Header as='h3' className='m-0'>
            <Header.Content>Officers</Header.Content>
        </Header>
        <Divider />
        <Grid columns={2} stackable>
            {board.map((officer, index) => (
                <Grid.Column key={index}>
                    <Header as='h4'>
                        <Header.Content>{officer.name}</Header.Content>
                    </Header>
                    <p>{officer.title}</p>
                </Grid.Column>
            ))}
        </Grid>
    </Segment>
);

StockBoard.propTypes = {
    board: PropTypes.array.isRequired,
    stock: PropTypes.object.isRequired
};

export default StockBoard;
