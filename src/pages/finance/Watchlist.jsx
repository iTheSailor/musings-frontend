import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Icon, Button, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Watchlist = ({ user, watchlist, removeFromWatchlist }) => {

    Watchlist.propTypes = {
        user: PropTypes.string.isRequired,
        watchlist: PropTypes.array.isRequired,
        removeFromWatchlist: PropTypes.func.isRequired,
    };

    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockDetails = async () => {
            try {
                const stockDetails = await Promise.all(watchlist.map(symbol =>
                    axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_stock`, {
                        params: { symbol }
                    }).then(res => res.data.symbol)
                ));
                setStocks(stockDetails);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };

        if (watchlist.length > 0) {
            fetchStockDetails();
        } else {
            setStocks([]);
            setLoading(false);
        }
    }, [watchlist]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <span className='d-flex align-items-center'>
        <Icon name='chart line'  circular />
        <Header as='h2' className='m-0' >
            <Header.Content>Watchlist</Header.Content>
        </Header>
        </span>

        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell width={'1'}></Table.HeaderCell>
                    <Table.HeaderCell width={'2'}>Symbol</Table.HeaderCell>
                    <Table.HeaderCell width={'3'}>Name</Table.HeaderCell>
                    <Table.HeaderCell width={'2'}>Current Price</Table.HeaderCell>
                    <Table.HeaderCell width={'2'}>Daily Open</Table.HeaderCell>
                    <Table.HeaderCell width={'2'}>Daily High</Table.HeaderCell>
                    <Table.HeaderCell width={'2'}>Daily Low</Table.HeaderCell>
                    <Table.HeaderCell width={'1'}>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {stocks.map(stock => (
                    <Table.Row key={stock.symbol} verticalAlign='middle'>
                        <Table.Cell>
                        <Button icon size='small' href={`/apps/finance/stock/${stock.symbol}`}>
                                    <Icon name='angle double right' color="black" />
                                </Button>
                        </Table.Cell>
                        <Table.Cell>{stock.symbol}</Table.Cell>
                        <Table.Cell>{stock.shortName}</Table.Cell>
                        <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.currentPrice)}</Table.Cell>
                        <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketOpen)}</Table.Cell>
                        <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketDayHigh)}</Table.Cell>
                        <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketDayLow)}</Table.Cell>
                        <Table.Cell>
                            <Button icon color='red' size='small' onClick={() => removeFromWatchlist(stock.symbol)}>
                                <Icon name='minus' />
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                ))}
                {stocks.length === 0 && (
                    <Table.Row>
                        <Table.Cell colSpan="7" textAlign="center">No stocks in watchlist</Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
        </>
    );
};

export default Watchlist;
