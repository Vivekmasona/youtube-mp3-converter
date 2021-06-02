import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
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

const ConvertComponent = ({ link, token, setLink, setToken, loading, setMeta, setLoading, requestQueue }) => {
    const classes = useStyles();

    const REQUEST_DELAY = 2;
    
    const onConvertClick = async (e) => {
        e.preventDefault();

        convert({ link })
            .then(({ data, error }) => {
                setLoading(false);
                if(error) {
                    console.log(error);
                    return;
                }
                setToken(data.token)
                setMeta(data.meta)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            });      
    };

    // sends request into the queue and delays it by N seconds
    const delayFunctionByNSeconds = async (fn, e, N=1) => {
        setLoading(true);
        requestQueue.push((next) => {
            setTimeout(async () => {
                await fn(e)
                next();
            }, N * 1000)
        });
    }
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
                        autoComplete="email"
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