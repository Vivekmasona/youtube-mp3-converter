import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import convert from '../actions/convert';
import download from '../actions/download';

const App = () => {

    const [link, setLink] = useState('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const onConvertClick = async (e) => {
        e.preventDefault();

        setLoading(true);
        const { data, error } = await convert(link);
        setLoading(false);
        
        if(error) {
            console.log(error);
            return;
        }
        setToken(data.token)
        console.log(data.meta)
    };

    const onDownloadClick = async (e) => {
        e.preventDefault();
        const { response, error } = await download(token);
        if(error) {
            console.log(error);
            return;
        }
        const filename =  response.headers['content-disposition'].split('filename=')[1];

        const url = window.URL.createObjectURL(new Blob([response.data]), { type: 'audio/mp3' });
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename.slice(1,-1)); //or any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    return(
        <div>
            <input 
                type="text" 
                id="link"
                placeholder="Youtube link" 
                value={link}
                onChange={ (e) => setLink(e.target.value) }
                required
            />
            <button
                onClick={onConvertClick}
                id="convert-button"
            >
                Convert
            </button>
            {
                token ? (
                    <button
                        onClick={onDownloadClick}
                        id="download-button"
                    >
                        Download
                    </button>
                ) : null
            }
            {
                loading ? (
                    <div>
                        Loading...
                    </div>
                ) : null
            }
        </div>
    );
};

export default App;