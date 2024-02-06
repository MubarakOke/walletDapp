import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Wallet.css';

const WalletCard = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [loading, setLoading] = useState(false);

    const connectWalletHandler = async () => {
        setLoading(true);
        try {
            if (window.ethereum && window.ethereum.isMetaMask) {
                console.log('MetaMask Here!');

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                accountChangedHandler(accounts[0]);
                setUserBalance(await getAccountBalance(accounts[0]));
                setErrorMessage(null);
            } else {
                console.log('Need to install MetaMask');
                setErrorMessage('Please install MetaMask browser extension to interact');
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
    };

    const getAccountBalance = async (account) => {
        try {
            const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
            return ethers.utils.formatEther(balance, 18);
        } catch (error) {
            setErrorMessage(error.message);
            return null;
        }
    };

    return (
        <div className='walletCard'>
            <h2 className='title'>Connect Metamask</h2>
            <button className='connectButton' onClick={connectWalletHandler} disabled={loading}>{loading ? 'Connecting...' : 'Connect Wallet'}</button>
            {defaultAccount && (
                <div className='accountDisplay'>
                    <h3>Address:</h3>
                    <p>{defaultAccount}</p>
                </div>
            )}
            {userBalance && (
                <div className='balanceDisplay'>
                    <h3>Balance:</h3>
                    <p>{userBalance}</p>
                </div>
            )}
            {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
        </div>
    );
};

export default WalletCard;
