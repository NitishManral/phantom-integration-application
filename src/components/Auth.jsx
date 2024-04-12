import React, { useEffect,useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import Loader from "react-js-loader";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const phantom_encryption_public_key = urlParams.get('phantom_encryption_public_key');
        const nonce = urlParams.get('nonce');
        const data = urlParams.get('data');

        const phantomPublicKey = bs58.decode(phantom_encryption_public_key);
        const nonceUint8Array = bs58.decode(nonce);

        const secretKeyBase58 = localStorage.getItem('secretKey');
        console.log("hello "+secretKeyBase58);

        const secretKey = bs58.decode(secretKeyBase58);

        const encryptedDataUint8Array = bs58.decode(data);
        const decryptedDataUint8Array = nacl.box.open(encryptedDataUint8Array, nonceUint8Array, phantomPublicKey, secretKey);
       
        const decryptedDataString = new TextDecoder().decode(decryptedDataUint8Array);
        const  decryptedDataObject   = JSON.parse(decryptedDataString);
        const publicKey = decryptedDataObject.public_key;
        localStorage.setItem('solanaKey', publicKey);
        
        navigate('/main');
        
    }, [ ]);
    return (
        <div className='flex flex-col w-full h-full justify-center items-center'>
             <h2>Loading</h2>
        </div>
    );
};

export default Dashboard;