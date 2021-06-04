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
    const dispatch = useDispatch();

    const reduxStates = useSelector((state) => {
        return {
            componentArray: state.inputComponents.componentArray,
        };
    });

    const requestQueue = new Queue((next) => {
        next();
    });

    const addNewInput = (e) => {
        e.preventDefault();
        dispatch({
            type: 'ADD_NEW_INPUT'
        });
    }

    const renderInputList = () => {
        return reduxStates.componentArray.map((input, index) => {
            return(
                <div key={index}>
                    <InputComponent 
                        requestQueue={requestQueue} 
                        index={index}
                        inputObj={input}
                    />
                </div>
            );
        })
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