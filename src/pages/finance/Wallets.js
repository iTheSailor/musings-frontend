import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Form, Input, Segment, Button, Table, Icon, Modal } from 'semantic-ui-react';
import axios from 'axios';
import Cookies from 'js-cookie';

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

    const fetchWallets = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_wallets`, {
                params: { user_id: user }
            });
            const walletsData = res.data.wallets.map(wallet => {
                const currentValue = wallet.balance + (wallet.stocks ? wallet.stocks.reduce((sum, stock) => sum + stock.current_value, 0) : 0);
                return { ...wallet, currentValue };
            });
            setWallets(walletsData);
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
            setWalletDetails(res.data.wallet);
            setSelectedWallet(walletId);
            setOpen(true);
        } catch (err) {
            console.log(err);
        }
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

    const handleSymbolChange = (e) => {
        const value = e.target.value.toUpperCase();
        setSymbol(value);
        if (value.length > 0) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_stock`, {
                params: { symbol: value }
            })
            .then(res => {
                setPrice(res.data.symbol.currentPrice);
                setTotalPrice(quantity * res.data.symbol.currentPrice);
            })
            .catch(err => console.log(err));
        } else {
            setPrice('');
            setTotalPrice(0);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setQuantity(value);
        setTotalPrice(value * price);
    };

    return (
        <Container>
            <Segment>
                <Header as='h2'>My Wallets</Header>
                <Form onSubmit={handleCreateWallet}>
                    <Form.Field>
                        <Input
                            placeholder='Enter wallet name...'
                            value={walletName}
                            onChange={e => setWalletName(e.target.value)}
                        />
                    </Form.Field>
                    <Button type='submit' primary>Create Wallet</Button>
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
                                <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(wallet.currentValue)}</Table.Cell>
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
                            <Input
                                placeholder='Stock Symbol'
                                value={symbol}
                                onChange={handleSymbolChange}
                            />
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
                        <Button type='submit' primary>Buy Stock</Button>
                        <Button type='button' color='red' onClick={handleSellStock}>Sell Stock</Button>
                    </Form>
                </Segment>
            )}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Modal.Header>Wallet Details</Modal.Header>
                <Modal.Content>
                    <Header as='h3'>{walletDetails.wallet_name}</Header>
                    <p>Balance: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(walletDetails.balance)}</p>
                    <p>Current Value: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(walletDetails.balance + (walletDetails.stocks ? walletDetails.stocks.reduce((sum, stock) => sum + stock.current_value, 0) : 0))}</p>
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
                                    <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.bought_price)}</Table.Cell>
                                    <Table.Cell>{Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.current_value)}</Table.Cell>
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
        </Container>
    );
};

Wallets.propTypes = {
    user: PropTypes.string.isRequired,
    watchlist: PropTypes.array.isRequired,
};

export default Wallets;
