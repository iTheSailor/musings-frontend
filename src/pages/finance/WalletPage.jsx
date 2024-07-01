import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Segment, Dropdown, Table, Grid, Loader, Dimmer, Form, Input, Button, Message } from 'semantic-ui-react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const WalletPage = () => {
    const [wallets, setWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [walletHistory, setWalletHistory] = useState([]);
    const [walletDetails, setWalletDetails] = useState({});
    const [walletChange, setWalletChange] = useState('');
    const [loading, setLoading] = useState(false);
    const [buySymbol, setBuySymbol] = useState('');
    const [buyQuantity, setBuyQuantity] = useState('');
    const [sellSymbol, setSellSymbol] = useState('');
    const [sellQuantity, setSellQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const user = localStorage.getItem('userId');
    

    useEffect(() => {
        fetchWallets();
    }, [user]);

    const fetchWallets = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_wallets`, {
                params: { user_id: user }
            });
            setWallets(res.data.wallets);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleWalletChange = async (e, { value }) => {
        setSelectedWallet(value);
        setLoading(true);
        await fetchWalletDetails(value);
        await fetchWalletHistory(value);
        setLoading(false);
    };

    const fetchWalletDetails = async (walletId) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_wallet_details`, {
                params: { wallet_id: walletId }
            });
            setWalletDetails(res.data.wallet);
            calculateWalletChange(res.data.wallet);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchWalletHistory = async (walletId) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_wallet_history`, {
                params: { wallet_id: walletId }
            });
            setWalletHistory(res.data.history);
        } catch (err) {
            console.log(err);
        }
    };

    const calculateWalletChange = (wallet) => {
        if (wallet.history && wallet.history.length > 0) {
            const initial = wallet.history[wallet.history.length - 1].balance;
            const latest = wallet.history[0].balance;
            const change = ((latest - initial) / initial) * 100;
            setWalletChange(change.toFixed(2));
        }
    };

    const handleBuyStock = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/add_stock_to_wallet`, {
                wallet_id: selectedWallet,
                symbol: buySymbol,
                quantity: buyQuantity,
                bought_price: await getCurrentPrice(buySymbol)
            });
            setBuySymbol('');
            setBuyQuantity('');
            fetchWalletDetails(selectedWallet);
            fetchWalletHistory(selectedWallet);
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleSellStock = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/sell_stock_from_wallet`, {
                wallet_id: selectedWallet,
                symbol: sellSymbol,
                quantity: sellQuantity,
                sold_price: await getCurrentPrice(sellSymbol)
            });
            setSellSymbol('');
            setSellQuantity('');
            fetchWalletDetails(selectedWallet);
            fetchWalletHistory(selectedWallet);
        } catch (err) {
            console.log(err);
        }
    };
    
    const getCurrentPrice = async (symbol) => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_stock`, {
            params: { symbol }
        });
        return res.data.symbol.currentPrice;
    };

    const walletOptions = wallets.map(wallet => ({
        key: wallet.wallet_id,
        text: wallet.wallet_name,
        value: wallet.wallet_id
    }));

    const walletData = {
        labels: walletHistory.map(entry => new Date(entry.created_at).toLocaleDateString()),
        datasets: [
            {
                label: 'Wallet Balance',
                data: walletHistory.map(entry => entry.balance),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Total Value (Cash + Stocks)',
                data: walletHistory.map(entry => entry.balance + entry.stocks_value),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            }
        ],
    };

    const totalStockValue = walletDetails.stocks ? walletDetails.stocks.reduce((sum, stock) => sum + parseFloat(stock.current_value), 0) : 0;
    const totalWalletValue = parseFloat(walletDetails.balance) + totalStockValue;

    return (
        <Container>
            <Segment>
                <Header as='h2'>Select Wallet</Header>
                <Dropdown
                    placeholder='Select Wallet'
                    fluid
                    selection
                    options={walletOptions}
                    onChange={handleWalletChange}
                    value={selectedWallet}
                />
            </Segment>
            {loading && (
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            )}
            {!loading && selectedWallet && (
                <>
                    <Segment>
                        <Header as='h3'>Wallet Details</Header>
                        <Grid columns={2} divided>
                            <Grid.Row>
                                <Grid.Column textAlign='left' verticalAlign='middle'>
                                    <p>Cash in Hand: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(parseFloat(walletDetails.balance))}</p>
                                    <p>Total Stock Value: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(totalStockValue)}</p>
                                    <p>Total Wallet Value: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(totalWalletValue)}</p>
                                    
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as='h4'>Stocks Held</Header>
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
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Segment>
                        <Header as='h3'>Wallet History</Header>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Balance</Table.HeaderCell>
                                    <Table.HeaderCell>Stocks Value</Table.HeaderCell>
                                    <Table.HeaderCell>Total Value</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {walletHistory.map((entry, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{new Date(entry.created_at).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(entry.balance)}</Table.Cell>
                                        <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(entry.stocks_value)}</Table.Cell>
                                        <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(entry.balance + entry.stocks_value)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>

                        </Table>
                    </Segment>
                    <Segment>
                        <Header as='h3'>Buy Stocks</Header>
                        <Form onSubmit={handleBuyStock}>
                            <Form.Field>
                                <Input
                                    placeholder='Stock Symbol'
                                    value={buySymbol}
                                    onChange={e => setBuySymbol(e.target.value)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    placeholder='Quantity'
                                    type='number'
                                    value={buyQuantity}
                                    onChange={e => setBuyQuantity(e.target.value)}
                                />
                            </Form.Field>
                            <Button type='submit' primary fluid>Buy</Button>
                        </Form>
                    </Segment>
                    <Segment>
                        <Header as='h3'>Sell Stocks</Header>
                        <Form onSubmit={handleSellStock}>
                            <Form.Field>
                                <Dropdown
                                    placeholder='Select Stock'
                                    fluid
                                    selection
                                    options={walletDetails.stocks ? walletDetails.stocks.map(stock => ({
                                        key: stock.symbol,
                                        text: stock.symbol,
                                        value: stock.symbol
                                    })) : []}
                                    onChange={(e, { value }) => setSellSymbol(value)}
                                    value={sellSymbol}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    placeholder='Quantity'
                                    type='number'
                                    value={sellQuantity}
                                    onChange={e => setSellQuantity(e.target.value)}
                                />
                            </Form.Field>
                            <Button type='submit' secondary fluid>Sell</Button>
                        </Form>
                    </Segment>


                    <Segment>
                        <Header as='h3'>Wallet Value Over Time</Header>
                        <Line data={walletData} />
                    </Segment>
                </>
            )}
        </Container>
    );
};

WalletPage.propTypes = {
    user: PropTypes.string.isRequired,
};

export default WalletPage;
