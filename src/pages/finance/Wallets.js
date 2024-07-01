import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Form, Input, Segment, Button, Table, Icon, Modal, Dropdown, Portal, Grid, Divider, Message } from 'semantic-ui-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Wallets = ({ user, watchlist }) => {
    const [wallets, setWallets] = useState([]);
    const [walletName, setWalletName] = useState('');
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [walletDetails, setWalletDetails] = useState({});
    const [open, setOpen] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);
    const [newWalletName, setNewWalletName] = useState('');
    const [activeWallet, setActiveWallet] = useState(null);
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [stock, setStock] = useState({});
    const [stockPortalOpen, setStockPortalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchWallets = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_wallets`, {
                params: { user_id: user }
            });
            setWallets(res.data.wallets);
        } catch (err) {
            console.log(err);
        }
    }, [user]);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    const handleCreateWallet = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/create_wallet`, {
                user_id: user,
                wallet_name: walletName
            }, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });
            const newWallet = res.data;
            newWallet.currentValue = newWallet.balance;
            setWallets([...wallets, newWallet]);
            setWalletName('');
        } catch (err) {
            console.log(err);
        }
    };

    const handleWalletClick = async (walletId) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_wallet_details`, {
                params: { wallet_id: walletId }
            });
            const walletData = res.data.wallet;
            setWalletDetails(walletData);
            processWalletDetails(walletData);
            setSelectedWallet(walletId);
            setOpen(true);
        } catch (err) {
            console.log(err);
        }
    };

    const processWalletDetails = (walletData) => {
        let totalStockValue = 0;
        const updatedStocks = walletData.stocks.map(stock => {
            const currentPrice = parseFloat(stock.current_price);
            if (isNaN(currentPrice)) {
                console.error(`Invalid current price for ${stock.symbol}: ${stock.current_price}`);
                return { ...stock, current_value: NaN, current_price: NaN };
            }
            const currentValue = currentPrice * stock.quantity;
            totalStockValue += currentValue;
            console.log(`Symbol: ${stock.symbol}, Quantity: ${stock.quantity}, Current Price: ${currentPrice}, Current Value: ${currentValue}`);
            return { ...stock, current_value: currentValue, current_price: currentPrice };
        });
        walletData.stocks = updatedStocks;
        walletData.current_value = parseFloat(walletData.balance) + totalStockValue;
        console.log(`Wallet Name: ${walletData.wallet_name}, Balance: ${walletData.balance}, Current Value: ${walletData.current_value}`);
        setWalletDetails(walletData);
    };

    const handleRenameWallet = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/rename_wallet`, {
                wallet_id: selectedWallet,
                new_wallet_name: newWalletName
            }, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });
            setWallets(wallets.map(wallet => 
                wallet.wallet_id === selectedWallet ? { ...wallet, wallet_name: newWalletName } : wallet
            ));
            setRenameOpen(false);
            setNewWalletName('');
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteWallet = async (walletId) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/delete_wallet`, {
                wallet_id: walletId
            }, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });
            setWallets(wallets.filter(wallet => wallet.wallet_id !== walletId));
        } catch (err) {
            console.log(err);
        }
    };

    const handleActivateWallet = (walletId) => {
        setActiveWallet(walletId);
    };

    const handleBuyStock = async () => {
        const total = quantity * price;
        const walletBalance = parseFloat(walletDetails.balance);
        if (total > walletBalance) {
            setErrorMessage('Total price exceeds available balance.');
            return;
        }
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/add_stock_to_wallet`, {
                wallet_id: activeWallet,
                symbol: symbol.toUpperCase(),
                quantity: quantity,
                bought_price: price
            }, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });
            setSymbol('');
            setQuantity('');
            setPrice('');
            setTotalPrice(0);
            setErrorMessage('');
            handleWalletClick(activeWallet);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSellStock = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/sell_stock_from_wallet`, {
                wallet_id: activeWallet,
                symbol: symbol.toUpperCase(),
                quantity: quantity,
                sold_price: price
            }, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });
            setSymbol('');
            setQuantity('');
            setPrice('');
            setTotalPrice(0);
            handleWalletClick(activeWallet);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSymbolChange = (e, { value }) => {
        setSymbol(value);
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setQuantity(value);
        const total = value * price;
        setTotalPrice(total);
        const walletBalance = parseFloat(walletDetails.balance);
        console.log(`Total: ${total}, Wallet Balance: ${walletBalance}`);
        if (total > walletBalance) {
            setErrorMessage('Total price exceeds available balance.');
        } else {
            setErrorMessage('');
        }
    };

    const handleSearchStock = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_stock`, {
                params: { symbol: symbol.toUpperCase(), user }
            });
            const stockData = res.data.symbol;
            setPrice(stockData.currentPrice);
            setTotalPrice(quantity * stockData.currentPrice);
            setStock(stockData);
            setStockPortalOpen(true);
        } catch (err) {
            console.log(err);
        }
    };

    // Create options for the dropdown from the watchlist
    const watchlistOptions = watchlist.map(symbol => ({
        key: symbol,
        text: symbol,
        value: symbol
    }));

    return (
        <Container>
            <Segment>
                <Grid columns={2}>
                    <Grid.Column textAlign='left'>
                <Header as='h2'>My Wallets</Header>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Button as={Link} to='/apps/finance/wallet' style={{marginBottom:'.5rem'}}>Wallets Page</Button>
                    </Grid.Column>
                </Grid>
                <Form onSubmit={handleCreateWallet}>
                    <Form.Field>
                        <Input
                            placeholder='Enter wallet name...'
                            value={walletName}
                            onChange={e => setWalletName(e.target.value)}
                        />
                    </Form.Field>
                    <Button type='submit' primary fluid>Create Wallet</Button>
                </Form>
            </Segment>
            <Segment>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Wallet Name</Table.HeaderCell>
                            <Table.HeaderCell>Balance</Table.HeaderCell>
                            <Table.HeaderCell>Current Value</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {wallets.map(wallet => (
                            <Table.Row key={wallet.wallet_id} active={wallet.wallet_id === activeWallet}>
                                <Table.Cell>{wallet.wallet_name}</Table.Cell>
                                <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(wallet.balance)}</Table.Cell>
                                <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(wallet.current_value)}</Table.Cell>
                                <Table.Cell>
                                    <Button icon onClick={() => handleWalletClick(wallet.wallet_id)}>
                                        <Icon name='eye' />
                                    </Button>
                                    <Button icon onClick={() => { setSelectedWallet(wallet.wallet_id); setRenameOpen(true); }}>
                                        <Icon name='edit' />
                                    </Button>
                                    <Button icon color='red' onClick={() => handleDeleteWallet(wallet.wallet_id)}>
                                        <Icon name='trash' />
                                    </Button>
                                    <Button icon color='blue' onClick={() => handleActivateWallet(wallet.wallet_id)}>
                                        <Icon name='check' />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Segment>
            {activeWallet && (
            <Segment>
                <Header as='h3'>Active Wallet: {wallets.find(wallet => wallet.wallet_id === activeWallet)?.wallet_name}</Header>
                <Form onSubmit={handleBuyStock}>
                    <Form.Field>
                        <Dropdown
                            placeholder='Select Stock Symbol'
                            fluid
                            search
                            selection
                            options={watchlistOptions}
                            value={symbol}
                            onChange={handleSymbolChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            placeholder='Enter Stock Symbol'
                            value={symbol}
                            onChange={e => setSymbol(e.target.value)}
                        />
                        <Button onClick={handleSearchStock} type='button'>Search</Button>
                    </Form.Field>
                    <Form.Field>
                        <Input
                            placeholder='Quantity'
                            type='number'
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            placeholder='Price'
                            type='number'
                            step='0.01'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            disabled
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            placeholder='Total Price'
                            type='number'
                            step='0.01'
                            value={totalPrice}
                            disabled
                        />
                    </Form.Field>
                    {errorMessage && (
                        <Message negative>
                            <Message.Header>Error</Message.Header>
                            <p>{errorMessage}</p>
                        </Message>
                    )}
                    <Button type='submit' primary disabled={totalPrice > parseFloat(walletDetails.balance)}>Buy Stock</Button>
                    <Button type='button' color='red' onClick={handleSellStock}>Sell Stock</Button>
                </Form>
            </Segment>
        )}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Modal.Header>Wallet Details</Modal.Header>
                <Modal.Content>
                    <Header as='h3'>{walletDetails.wallet_name}</Header>
                    <p>Balance: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(parseFloat(walletDetails.balance))}</p>
                    <p>Current Value: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(parseFloat(walletDetails.current_value))}</p>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Stock Symbol</Table.HeaderCell>
                                <Table.HeaderCell>Quantity</Table.HeaderCell>
                                <Table.HeaderCell>Bought Price</Table.HeaderCell>
                                <Table.HeaderCell>Current Value</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {walletDetails.stocks && walletDetails.stocks.map(stock => (
                                <Table.Row key={stock.symbol}>
                                    <Table.Cell>{stock.symbol}</Table.Cell>
                                    <Table.Cell>{stock.quantity}</Table.Cell>
                                    <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(parseFloat(stock.bought_price))}</Table.Cell>
                                    <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(parseFloat(stock.current_value))}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </Modal.Actions>
            </Modal>
            <Modal open={renameOpen} onClose={() => setRenameOpen(false)}>
                <Modal.Header>Rename Wallet</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleRenameWallet}>
                        <Form.Field>
                            <Input
                                placeholder='Enter new wallet name...'
                                value={newWalletName}
                                onChange={e => setNewWalletName(e.target.value)}
                            />
                        </Form.Field>
                        <Button type='submit' primary>Rename Wallet</Button>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setRenameOpen(false)}>Close</Button>
                </Modal.Actions>
            </Modal>
            <Portal open={stockPortalOpen} onClose={() => setStockPortalOpen(false)}>
                <Segment style={{ margin: 'auto', left: '25%', position: 'fixed', top: '10%', zIndex: 1000, width: '50%' }}>
                    <Segment>
                        <Grid columns={2}>
                            <Grid.Column verticalAlign='middle'>
                                <Header as='h2'>{stock.symbol} <em style={{ opacity: '50%', textEmphasisColor: 'gray' }}>-{stock.exchange}</em></Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
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
        </Container>
    );
};

Wallets.propTypes = {
    user: PropTypes.string.isRequired,
    watchlist: PropTypes.array.isRequired,
};

export default Wallets;
