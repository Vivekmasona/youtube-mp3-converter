import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {lodash, throttle} from 'lodash'
import { Queue } from "dynamic-queue";

import Container from '@material-ui/core/Container';

import DownloadComponent from './DownloadComponent';
import ConvertComponent from './ConvertComponent';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: theme.spacing(60),
        marginBottom: theme.spacing(1)
    }
}));


const InputComponent = ({ index, requestQueue }) => {
    const [link, setLink] = useState('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({});

    const classes = useStyles();

    const onConvertClick = async (e) => {
        e.preventDefault();
        console.log(`Started converting Video ${index} at ${getTime()}`)
        setLoading(true);
        convert({ link, index })
            .then(({ data, error }) => {
                setLoading(false);
                if(error) {
                    console.log(error);
                    return;
                }
                setToken(data.token)
            })
            .catch((err) => {
                console.log(err)
            });
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
            }, 2000)
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
        <Container className={classes.root}>
            {
                !token ? 
                <ConvertComponent 
                    loading={loading}
                    token={token}
                    link={link}
                    setToken={setToken}
                    setLink={setLink}
                    setLoading={setLoading}
                    setMeta={setMeta}
                /> :
                <DownloadComponent 
                    meta={meta}
                    token={token}
                />
            }
            
        </Container>
    );
};

export default InputComponent;