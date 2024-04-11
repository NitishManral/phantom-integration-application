import React, { useEffect,useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import Loader from "react-js-loader";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    const [log, setLog] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const phantom_encryption_public_key = urlParams.get('phantom_encryption_public_key');
        const nonce = urlParams.get('nonce');
        const data = urlParams.get('data');

        // Decode the keys and nonce from Base58
        const phantomPublicKey = bs58.decode(phantom_encryption_public_key);
        const nonceUint8Array = bs58.decode(nonce);

        // Get the private key from local storage
        const privateKeyBase58 = localStorage.getItem('secretKey');
        const privateKey = bs58.decode(privateKeyBase58);

        // Decrypt the data
        const encryptedDataUint8Array = bs58.decode(data);
        let decryptedDataUint8Array = nacl.box.open(encryptedDataUint8Array, nonceUint8Array, phantomPublicKey, privateKey);
        let decryptedDataString = new TextDecoder().decode(decryptedDataUint8Array);
        let decryptedDataObject;
        try {
             decryptedDataObject = JSON.parse(decryptedDataString);
        } catch (error) {
            setLog(error+"");
        }

        const publicKey = decryptedDataObject.public_key;
        localStorage.setItem('solanaKey', publicKey);
        
            navigate('/main');
        
    }, [ navigate]);
    return (
        <div className='flex flex-col w-full h-full justify-center items-center'>
             <Loader type="box-rotate-x" bgColor='#fffff' color='#d3d3d3' title={"box-rotate-x"} size={100} />
        </div>
    );
};

export default Dashboard;