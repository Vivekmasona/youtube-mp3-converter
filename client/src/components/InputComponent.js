import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {lodash, throttle} from 'lodash'
import { Queue } from "dynamic-queue";

import convert from '../actions/convert';
import download from '../actions/download';


const InputComponent = ({ index, requestQueue }) => {
    const [link, setLink] = useState('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);


    const onConvertClick = async (e) => {
        e.preventDefault();
        console.log(`Started converting Video ${index} at ${getTime()}`)
        setLoading(true);
        const { data, error } = await convert({ link, index });
        setLoading(false);
        
        if(error) {
            console.log(error);
            return;
        }
        setToken(data.token)
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
        link.setAttribute('download', filename.slice(1,-1));
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const delayFunctionByOneSecond = async (fn, e) => {
        requestQueue.push((next) => {
            setTimeout(async () => {
                await fn(e)
                next();
            }, 1000)
        });
    }

    const getTime = () => {
        var currentdate = new Date(); 
        var datetime = currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
        return datetime
    }

    const demoFn = () => {
        const datetime = getTime();
        console.log(index, datetime)
    }
    // const demoFnThrottled = throttle(demoFn, 1000)

    return(
        <div className="input-component">
            <input 
                type="text" 
                id="link"
                placeholder="Youtube link" 
                value={link}
                onChange={ (e) => setLink(e.target.value) }
                required
            />
            <button
                onClick={(e) =>  delayFunctionByOneSecond(onConvertClick, e)}
                id="convert-button"
                disabled={!!token}
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
            <button
                onClick={(e) => delayFunctionByOneSecond(demoFn, e)}
            >
                Demo
            </button>
        </div>
    );
};

export default InputComponent;