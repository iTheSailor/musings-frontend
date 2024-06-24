import React, { useState, useEffect } from 'react';
import { Container, Header, Icon, Form, Input, Segment, Portal, Divider, Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Watchlist from './Watchlist';
import IsButton from '../../components/IsButton';

const FinancePage = () => {
    const [symbol, setSymbol] = useState('');
    const [open, setOpen] = useState(false);
    const [stock, setStock] = useState({});
    const [watchlist, setWatchlist] = useState([]);
    const [user, setUser] = useState(localStorage.getItem('userId'));
    const [stockWatched, setStockWatched] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_watchlist`, {
            params: { user }
        })
            .then(res => setWatchlist(res.data.symbols))
            .catch(err => console.log(err));
    }, [user]);

    useEffect(() => {
        if (!open) {
            setStock({});
            console.log(stock);
        }
    }, []);


    const handleSearch = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_stock`, {
            params: { symbol: symbol.toUpperCase(), user }
        })
            .then(res => {
                setStock(res.data.symbol);
                console.log(res.data.symbol);
                setOpen(true);
                setStockWatched(watchlist.includes(symbol.toUpperCase()));
            })
            .catch(err => console.log(err));
    };

    const addToWatchlist = (symbol) => {
        const formData = new FormData();
        formData.append('symbol', symbol);
        formData.append('user', user);

        axios.post(`${process.env.REACT_APP_API_URL}/api/finance/add_watchlist`, formData, {
            withCredentials: true,
            headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
        })
            .then(res => {
                setWatchlist(prevWatchlist => [...prevWatchlist, symbol.toUpperCase()]);
                setStockWatched(true);
            })
            .catch(err => console.log(err));
    };

    const removeFromWatchlist = (symbol) => {
        const formData = new FormData();
        formData.append('symbol', symbol);
        formData.append('user', user);

        axios.post(`${process.env.REACT_APP_API_URL}/api/finance/remove_watchlist`, formData, {
            withCredentials: true,
            headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
        })
            .then(res => {
                setWatchlist(prevWatchlist => prevWatchlist.filter(item => item !== symbol));
                setStockWatched(false);
            })
            .catch(err => console.log(err));
    };

    

    return (
        <Container>
            <Portal open={open} onClose={() => setOpen(false)}>
                <Segment style={{ margin: 'auto', left: '25%', position: 'fixed', top: '10%', zIndex: 1000, width: '50%' }}>
                    <Segment>
                        <Grid columns={2}>
                            <Grid.Column verticalAlign='middle'>
                                <Header as='h2'>{stock.symbol} <em style={{ opacity: '50%', textEmphasisColor: 'gray' }}>-{stock.exchange}</em></Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                                {stockWatched ?
                                    <Button color='red' onClick={() => removeFromWatchlist(stock.symbol)}>
                                        <Icon name='minus' color='black' />
                                        Remove</Button>
                                    :
                                    <Button onClick={() => addToWatchlist(stock.symbol)} color='green'>
                                        <Icon name='add' color='black' />
                                        Add to Watchlist
                                    </Button>
                                }
                                <Button
                                    icon
                                    as={Link}
                                    to={`/apps/finance/stock/${stock.symbol}`}
                                >
                                    <Icon name='angle double right' color="black" />
                                    See More
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment>
                        <Grid columns={3}>
                            <Grid.Column width={6}>
                                <Header as='h3'>Stock Information</Header>
                                <p>Current Price: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.currentPrice)}</p>
                                <p>High: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketDayHigh)}</p>
                                <p>Low: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketDayLow)}</p>
                                <p>Open: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketOpen)}</p>
                                <p>Close: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketPreviousClose)}</p>
                                <p>Volume: {Intl.NumberFormat().format(stock.regularMarketVolume)}</p>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Divider vertical />
                            </Grid.Column>
                            <Grid.Column width={8} textAlign='right'>
                                <Header as='h3'>{stock.shortName}</Header>
                                <p>Website: <a href={stock.website}>Home</a> / <a href={stock.irWebsite}>Investor Relations</a></p>
                                <p>Industry: {stock.industry} </p>
                                <p>Sector: {stock.sector}</p>
                                <p>Market Cap: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.marketCap)}</p>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Segment>
            </Portal>

            <Segment>
            <span className='d-flex align-items-center'>
                <Icon name='dollar'  circular />
                <Header as='h1' className='m-0' >
                    <Header.Content>Finance</Header.Content>
                </Header>
            </span>
                
                <p>Search for a stock symbol to get the latest information.</p>
                <Form onSubmit={handleSearch}>
                    <Form.Field>
                        <Input
                            icon='search'
                            placeholder='Enter stock symbol...'
                            value={symbol}
                            onChange={e => setSymbol(e.target.value)}
                        />
                    </Form.Field>
                    <IsButton label='Search' value='Submit' />
                </Form>
            </Segment>
            <Segment>
                <Watchlist user={user} watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />
            </Segment>
        </Container>
    );
}

export default FinancePage;
