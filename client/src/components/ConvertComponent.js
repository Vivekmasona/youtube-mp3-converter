import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { purple } from '@material-ui/core/colors';

import LoadingComponent from './LoadingComponent'
import convert from '../actions/convert';

const useStyles = makeStyles((theme) => ({
    middle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    purple: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        '&:hover': {
          backgroundColor: purple[700],
        },
    }
}));

const ConvertComponent = ({ token, requestQueue, index }) => {
    const [loading, setLoading] = useState(false);
    const [link, setLink] = useState('');

    const classes = useStyles();
    const dispatch = useDispatch();

    const REQUEST_DELAY = 2;

    const onConvertClick = async (e) => {
        e.preventDefault();

        convert({ link })
            .then(({ data, error }) => {
                setLoading(false);
                if(error) {
                    throw new Error(error.error);
                }
                dispatch({
                    type: 'CONVERSION_SUCCESSFUL',
                    payload: {
                        index,
                        token: data.token,
                        meta: data.meta
                    }
                });
            })
            .catch((err) => {
                console.log(err.message);
                setLoading(false);
                dispatch({
                    type: 'CONVERSION_FAILED',
                    payload: {
                        index,
                        err
                    }
                });
            });      
    };

    // sends request into the queue and delays it by N seconds
    const delayFunctionByNSeconds = async (fn, e, N=1) => {
        setLoading(true);
        requestQueue.push((next) => {
            setTimeout(async () => {
                await fn(e)
                next();
            }, N * 1000);
        });
    };

    return(
        <div className={classes.middle}>
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Youtube link"
                        name="link"
                        autoComplete='off'
                        autoFocus
                        value={link}
                        onChange={ (e) => setLink(e.target.value) }
                        size="small"
                    />
                </Grid>
                <Grid item xs={4} className={classes.middle}>
                {
                    loading ? (
                        <LoadingComponent />
                    ) : 
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={(e) => delayFunctionByNSeconds(onConvertClick, e, REQUEST_DELAY)}
                        id="convert-button"
                        disabled={!!token}
                        className={classes.purple}
                    >
                        Convert
                    </Button>
                }
                </Grid>
            </Grid>
            
            
        </div>
    );
};

export default ConvertComponent;