import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import LoadingComponent from './LoadingComponent'
import convert from '../actions/convert';

const useStyles = makeStyles((theme) => ({
    middle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
}));

const ConvertComponent = ({ link, token, setLink, setToken, loading, setMeta, setLoading }) => {
    const classes = useStyles();

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
        setMeta(data.meta)
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
                        onClick={onConvertClick}
                        id="convert-button"
                        disabled={!!token}
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