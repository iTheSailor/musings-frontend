import React from 'react';
import { Segment, Grid, Header, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StockProfile = ({ stock }) => (
    <Segment>
        <Grid columns={2}>
            <Grid.Column width={8}>
                <Header as='h2'>Company Information</Header>
                <Grid columns={2}>
                    <Grid.Column width={8}>
                        <p><strong>Symbol:</strong></p>
                        <Divider />
                        <p><strong>Short Name:</strong></p>
                        <Divider />
                        <p><strong>Location:</strong></p>
                        <Divider />
                        <p><strong>Industry:</strong></p>
                        <Divider />
                        <p><strong>Sector:</strong></p>
                        <Divider />
                        <p><strong>Employees:</strong></p>
                        <Divider />
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <p>{stock.symbol}</p>
                        <Divider />
                        <p>{stock.shortName}</p>
                        <Divider />
                        <p>{stock.city}, {stock.state}, {stock.country}</p>
                        <Divider />
                        <p>{stock.industry}</p>
                        <Divider />
                        <p>{stock.sector}</p>
                        <Divider />
                        <p>{stock.fullTimeEmployees}</p>
                        <Divider />
                    </Grid.Column>
                </Grid>
            </Grid.Column>
            <Divider vertical />
            <Grid.Column width={8}>
                <Header as='h2'>Company Description</Header>
                <p>{stock.longBusinessSummary}</p>
            </Grid.Column>
        </Grid>
    </Segment>
);

StockProfile.propTypes = {
    stock: PropTypes.object.isRequired,
};
export default StockProfile;
