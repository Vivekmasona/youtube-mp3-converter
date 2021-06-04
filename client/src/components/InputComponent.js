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


const InputComponent = ({ requestQueue, removeInput, index }) => {
    const [link, setLink] = useState('');
    const [token, setToken] = useState(null);
    const [meta, setMeta] = useState({});

    const classes = useStyles();

    const removeComponent = () => {
        removeInput(index);
    }

    return(
        <Container className={classes.root}>
            {
                !token ? 
                <ConvertComponent 
                    token={token}
                    link={link}
                    setToken={setToken}
                    setLink={setLink}
                    setMeta={setMeta}
                    requestQueue={requestQueue}
                /> :
                <DownloadComponent 
                    meta={meta}
                    token={token}
                    removeComponent={removeComponent}
                />
            } 
        </Container>
    );
};

export default InputComponent;