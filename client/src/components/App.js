import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Queue } from "dynamic-queue";

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';


import InputComponent from './InputComponent';

const useStyles = makeStyles((theme) => ({
    middle: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
}));


const App = () => {
    
    const [inputList, setInputList] = useState([0]);
    const classes = useStyles();

    const requestQueue = new Queue((next) => {
        next();
    });

    const renderInputList = () => {
        return inputList.map((input, index) => {
            return(
                <div key={index}>
                    <InputComponent requestQueue={requestQueue}/>
                </div>
            );
        })
    }

    const addNewInput = (e) => {
        e.preventDefault();
        setInputList([...inputList, 0]);
    }

    return(
        <React.Fragment>
        <CssBaseline />
        <Container component="main" maxWidth="sm">
            <div className={classes.middle}>
                <h1>Add Links</h1>
                {renderInputList()}
                <Button 
                    onClick={addNewInput}
                    variant="contained" 
                    color="secondary"
                >
                    Add New Link
                </Button>
            </div>
        </Container>
      </React.Fragment>
        
    );
};

export default App;