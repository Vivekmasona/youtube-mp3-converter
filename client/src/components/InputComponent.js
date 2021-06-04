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


const InputComponent = ({ requestQueue, index, inputObj }) => {

    const { meta, token } = inputObj;

    const classes = useStyles();
    const dispatch = useDispatch();

    const removeComponent = () => {
        dispatch({
            type: 'DELETE_COMPONENT',
            payload: {
                index
            }
        });
    };

    return(
        <Container className={classes.root}>
            {
                inputObj.convert ? 
                <ConvertComponent 
                    token={token}
                    requestQueue={requestQueue}
                    index={index}
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