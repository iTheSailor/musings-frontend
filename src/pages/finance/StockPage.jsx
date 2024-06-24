import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Segment, Header, Grid, Button, Icon, Tab, Form, Input, Divider } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import StockProfile from './StockProfileComponent';
import StockBoard from './StockBoardComponent';
import StockNews from './StockNewsComponent';
import StockAnalysis from './StockAnalysisComponent';

const StockPage = () => {
    const [user, setUser] = useState(localStorage.getItem('userId') || null);
    const { symbol } = useParams();
    const [ssymbol, setSsymbol] = useState('');
    const [stock, setStock] = useState(null);
    const [priceHistory, setPriceHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState([]);
    const [news, setNews] = useState([]);
    const [range, setRange] = useState('1y');
    const [interval, setInterval] = useState('1d');
    const [watchlist, setWatchlist] = useState([]);
    const [stockWatched, setStockWatched] = useState(false);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_watchlist`, {
                    params: { user }
                });
                if (res.data.success) {
                    console.log(res.data.symbols);
                    console.log(res.data);
                    setWatchlist(res.data.symbols);
                } else {
                    console.log(res.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchWatchlist();
    }, [user]);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_full_stock`, {
                    params: { symbol, range, interval }
                });
                setStock(res.data.info);
                setPriceHistory(res.data.history);  // Assuming 'history' is part of the response
                setOfficers(res.data.info.companyOfficers);
                setNews(res.data.news);
                setLoading(false);
                setSsymbol(res.data.info.symbol);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchStockData();
    }, [symbol, range, interval]);

    useEffect(() => {
        if (stock && Array.isArray(watchlist)) {
            setStockWatched(watchlist.includes(stock.symbol.toUpperCase()));
            console.log(watchlist, stock.symbol.toUpperCase(), watchlist.includes(stock.symbol.toUpperCase()));
        }
    }, [stock, watchlist]);

    const handleSearch = () => {
        window.location = (`/apps/finance/stock/${ssymbol}`);
    };

    const addToWatchlist = async (ssymbol) => {
        try {
            const formData = new FormData();
            formData.append('symbol', ssymbol);
            formData.append('user', user);

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/add_watchlist`, formData, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });

            if (res.data.success) {
                setWatchlist((prevWatchlist) => [...(prevWatchlist || []), ssymbol.toUpperCase()]);
                setStockWatched(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const removeFromWatchlist = async (ssymbol) => {
        try {
            const formData = new FormData();
            formData.append('symbol', ssymbol);
            formData.append('user', user);
            console.log(ssymbol, user);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/remove_watchlist`, formData, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });

            if (res.data.success) {
                setWatchlist((prevWatchlist) => (prevWatchlist || []).filter((item) => item !== ssymbol.toUpperCase()));
                setStockWatched(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return <Segment>Loading...</Segment>;
    }

    if (!stock) {
        return <Segment>No stock data available.</Segment>;
    }

    const panes = [
        { menuItem: 'Profile', render: () => <Tab.Pane><StockProfile stock={stock} /></Tab.Pane> },
        { menuItem: 'Board', render: () => <Tab.Pane><StockBoard stock={stock} board={officers}/></Tab.Pane> },
        { menuItem: 'News', render: () => <Tab.Pane><StockNews news={news} /></Tab.Pane> },
        { menuItem: 'Analysis', render: () => <Tab.Pane><StockAnalysis priceHistory={priceHistory} range={range} interval={interval} setRange={setRange} setInterval={setInterval} /></Tab.Pane> },
    ];

    return (
        <Container>
            <Segment>
                <Grid.Column textAlign='left' className='d-flex '>
                    <Button icon href='/apps/finance'>
                        <Icon name='arrow left' />  
                    </Button>
                    <Form onSubmit={handleSearch} className='w-100'>
                        <Form.Field>
                            <Input
                                icon='search'
                                placeholder='Enter stock symbol...'
                                value={ssymbol}
                                onChange={e => setSsymbol(e.target.value)}
                            />
                        </Form.Field>
                    </Form>
                </Grid.Column>
            </Segment>
            <Segment>
                <Grid columns={2}>
                    <Grid.Column textAlign='left' className='d-flex align-items-center' width={10} >
                        
                        <Header as='h2' className='m-0'> {stock.symbol} - {stock.shortName}</Header>
                        {stockWatched ? (
                            <>
                                <Button size='mini' icon inverted onClick={() => removeFromWatchlist(ssymbol)}>
                                    <Icon name='minus' color='red' />
                                </Button>
                                <span id='addWatchSpan'><em>remove from watchlist</em></span>
                            </>
                        ) : (
                            <>
                                <Button size='mini' icon inverted onClick={() => addToWatchlist(ssymbol)}>
                                    <Icon name='add' color='green' />
                                </Button>
                                <span><em>add to watchlist</em></span>
                            </>
                        )}
                    </Grid.Column>

                    <Grid.Column textAlign='right' verticalAlign='middle' width={'6'}>
                        <p><em>{stock.address1 || null} {stock.address2 || null} {stock.city} {stock.state || null} {stock.zip || null} {stock.country || null} </em></p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment>
                <Tab panes={panes} />
            </Segment>
        </Container>
    );
};

export default StockPage;
