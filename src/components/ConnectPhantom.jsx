
import React, { useEffect, useState } from 'react';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPublicKey, setPrivateKey } from '../slice/KeyPairSlice';
import { useSelector } from 'react-redux';
import {isMobile} from 'react-device-detect';

// PhantomConnectButton component
function ConnectPhantom() {
  localStorage.removeItem('solanaKey');
  localStorage.removeItem('privateKey111');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [solanaKey, setSolanaKey] = useState(localStorage.getItem('solanaKey') || '');
  const [isRedirect, setIsRedirect] = useState(false);
  const [error, setError] = useState("");


const connectToPhantomMobile = async () => {
  const keyPair = nacl.box.keyPair();
  dispatch(setPublicKey(bs58.encode(keyPair.publicKey)));
  dispatch(setPrivateKey(bs58.encode(keyPair.secretKey)));
  localStorage.setItem('secretKey', bs58.encode(keyPair.secretKey));
  try {
    const appUrl = encodeURIComponent('https://master--phantom-integration-application.netlify.app/');
    const dappEncryptionPublicKey = encodeURIComponent(bs58.encode(keyPair.publicKey));
    const redirectLink = encodeURIComponent('https://master--phantom-integration-application.netlify.app/auth');
    const phantomConnectUrl = `https://phantom.app/ul/v1/connect?app_url=${appUrl}&dapp_encryption_public_key=${dappEncryptionPublicKey}&redirect_link=${redirectLink}`;

    setIsRedirect(true);
    window.open(phantomConnectUrl, '_blank');
    } catch (error) {
      setError(error+"");
    }
  };

  // Function to get Solana provider
  const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
  
      if (provider?.isPhantom) {
        return provider;
      }
    }
    window.open('https://phantom.app/', '_blank');
  };
  
  const connectToPhantomPC = async () => {
    const provider = getProvider(); 
    try {
        const resp = await provider.connect();
        console.log(resp.publicKey.toString());
        localStorage.setItem('solanaKey', resp.publicKey.toString());
        navigate('/main');
    } catch (err) {
      console.error(err);
    }
  }

  const detectDevices = () =>{
    if(isMobile){
      console.log('Mobile');
      connectToPhantomMobile();
    }else{
      console.log('PC');
      connectToPhantomPC();
    }
  }

  return (
    <div className='w-full h-full bg-slate-500 flex flex-col items-center justify-center p-6'>
      <div>
        <img className='w-full h-[100px]' src='./Phantom-Logo-Purple.png' alt="logo"/>
        <h1 className='text-3xl font-mono font-bold'>+</h1>
        <p className='font-semibold pt-4 text-[#9886E5]'> Your Own Wallet</p>
      </div>
      <div className='mt-auto mb-auto flex flex-col '>
        {!isRedirect ? 
          <button className='bg-[#9886E5] h-[50px] rounded-lg p-4 flex justify-center items-center' onClick={detectDevices} >
           Connect <img className='pl-3 h-[40px] w-[40px]' src='./image.svg' alt='logo'/>
          </button> : 
          <div className='flex flex-col w-full h-full justify-center items-center'>
            <h1 className='text-[#272626] text-xl font-bold'>You have been redirected to the Phantom Wallet for autherization</h1>
            
            <p className='text-[#272626] text-sm font-bold'>If you are not redirected, click the button below</p>
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className='text-blue-700 text-sm'>
              Refresh Page
            </a>
          </div>

        }
        <div className={isRedirect ? 'hidden' : ''}>
          <h1 className='text-[#272626] text-lg font-bold'>Or</h1>
          <p className='text-[#272626] text-lg font-bold'>Don't have Phantom Wallet?</p>
          <a href='https://phantom.app/' className='text-blue-700'>Download Phantom Wallet</a>
        </div>
      </div>
    </div>

  );
}

export default ConnectPhantom;