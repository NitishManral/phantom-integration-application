import { useMemo, useCallback, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';

const MAX_ATTEMPTS = 5;
const LAMPORTS_PER_SOL = 1_000_000_000;

function AccountDetails({ cluster }) {
  const solanaKeyString = localStorage.getItem('solanaKey');
  const solanaKey = useMemo(() => new PublicKey(solanaKeyString), [solanaKeyString]);
  const [accountInfo, setAccountInfo] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [isKeyCopied, setIsKeyCopied] = useState(false);

  const fetchAccountInfo = useCallback(async () => {
    const connection = new Connection(`https://api.${cluster}.solana.com`);
    let info;
    let attempts = 0;

    const fetchInfo = async () => {
      try {
        attempts++;
        info = await connection.getAccountInfo(solanaKey);
      } catch (error) {
        console.error(`Attempt ${attempts} failed. Retrying in ${attempts * 2} seconds.`);
        if (attempts < MAX_ATTEMPTS) {
          setTimeout(fetchInfo, attempts * 1000);
        } else {
          console.error('Failed to fetch account info after maximum attempts.');
        }
      }

      if (info) {
        setAccountInfo(info);
      }
    };

    fetchInfo();
  }, [cluster,solanaKey]);

  const fetchSolPrice = useCallback(async () => {
    try {
      const response = await axios.get('https://api.coinpaprika.com/v1/tickers/sol-solana');
      setSolPrice(response.data.quotes.USD.price);
    } catch (error) {
      console.error('Error fetching SOL price from Coinpaprika API:', error);
    }
  }, []);

  useEffect(() => {
    fetchAccountInfo();
    fetchSolPrice();
  }, [fetchAccountInfo, fetchSolPrice]);

  if (!accountInfo || solPrice === null) {
    return <p>Loading account details...</p>;
  }

  const handleDoubleClick = () => {
    navigator.clipboard.writeText(solanaKey.toString());
    setIsKeyCopied(true);
    setTimeout(() => setIsKeyCopied(false), 1000);
  };
  return (
    <div className='flex flex-col font-mono w-auto h-1/4 m-3 text-left p-4 border-black shadow-lg'>
      <p onDoubleClick={handleDoubleClick}>
        Account: {`${solanaKey.toString().slice(0, 3)}...${solanaKey.toString().slice(-3)}`}
        {isKeyCopied && <span className='text-xs p-2'>copied!</span>}
      </p>
      <h2 className='text-3xl font-bold'> <span className='text-sm '>SOL:</span> {(accountInfo.lamports / LAMPORTS_PER_SOL).toFixed(4)}</h2>
      <h2 className='text-3xl font-bold'> <span className='text-sm '>USD:</span> {parseFloat(solPrice*((accountInfo.lamports / LAMPORTS_PER_SOL))).toFixed(4)}" $"</h2>     
    </div>
  );
}

export default AccountDetails;