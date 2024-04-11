import React, { useCallback, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import AccountDetails from './AccountDetails';

 // Function to fetch accounts
 const fetchAccounts = async (connection, publicKey) => {
  let accounts;
  for(let attempts=0;attempts<5&& !accounts;attempts++){
    try {
      accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), 
      });
    } catch (error) {
      console.error(`Attempt ${attempts} failed. Retrying in ${attempts * 2} seconds.`);
      const retryAfter = error.headers.get('Retry-After');
      await new Promise((resolve) => {
        const currentAttempts = attempts;
        setTimeout(() => resolve(), retryAfter ? retryAfter * 1000 : currentAttempts * 2000);
      });
    }
  }

  if (!accounts) {
    console.error('Failed to fetch accounts after 5 attempts.');
  }

  return accounts;
};
const Main = () => {
  const solanaKey = localStorage.getItem('solanaKey');
  const [nftData, setNftData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cluster, setCluster] = useState('devnet');

 
  // Function to filter NFTs
  const filterNfts = (accounts) => {
    const nfts = accounts.value.filter(account => account.account.data.parsed.info.supply === '1');
    if(nfts.length === 0) {
      console.error('No NFTs found.');
    }
    return nfts;
  };

  // Function to fetch balance and NFTs
  const fetchBalanceAndNfts = useCallback(
    async () => {
      const connection = new Connection(`https://api.${cluster}.solana.com`);
      const publicKey = new PublicKey(solanaKey); 
  
      const accounts = await fetchAccounts(connection, publicKey);
      const nfts = filterNfts(accounts);
  
      return nfts;
    },[cluster,solanaKey]  );

  useEffect(() => {
    setLoading(true); 
    setNftData([]);
    console.log("loading data for "+cluster)
    fetchBalanceAndNfts()
      .then(nfts => setNftData(nfts))
      .catch(error => console.error('Error fetching balance and NFTs:', error))
      .finally(() => setLoading(false));
  }, [cluster,fetchBalanceAndNfts]);


  return (
    <div className='Main flex flex-col w-full h-full bg-slate-400'>
      <div className='flex flex-row justify-start items-center w-full h-10 bg-[#9886E5]'>
        <img className='w-10 h-10' src='./image.svg' alt="logo" />
        <h1 className='text-white font-bold w-full'> Account Details</h1>
        <select className='w-[150px]  bg-[#000000] m-3 text-white' onChange={(e) => setCluster(e.target.value)}>
          <option value='devnet'>Devnet</option>
          <option value='testnet'>Testnet</option>
          <option value='mainnet-beta' disabled>Mainnet-Beta</option>
        </select>
      </div>
      <AccountDetails cluster={cluster} />
      <div className='flex flex-row flex-wrap w-auto  m-3 items-center h-3/4 justify-center border-black  shadow-lg'>
        {loading ? (
          <p>Loading NFTs...</p>
        ) : nftData.length === 0 ? (
          <p>No NFTs found.</p>
        ) : (
          nftData.map((nft, index) => (
            <div key={index}>
              <h3>NFT {index + 1}</h3>
              <p>Account: {nft.pubkey}</p>
              <p>Mint: {nft.account.data.parsed.info.mint}</p>
              <p>Owner: {nft.account.data.parsed.info.owner}</p>
              <p>Amount: {nft.account.data.parsed.info.amount}</p>
              <p>Delegate: {nft.account.data.parsed.info.delegate ? nft.account.data.parsed.info.delegate : 'None'}</p>
              <p>State: {nft.account.data.parsed.info.state}</p>
              <p>Is Native: {nft.account.data.parsed.info.isNative ? 'Yes' : 'No'}</p>
              <p>Rent Exempt Reserve: {nft.account.data.parsed.info.rentExemptReserve}</p>
              <p>Close Authority: {nft.account.data.parsed.info.closeAuthority ? nft.account.data.parsed.info.closeAuthority : 'None'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Main;