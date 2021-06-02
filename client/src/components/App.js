import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import InputComponent from './InputComponent';

const useStyles = makeStyles((theme) => ({
    middle: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
}));


const App = () => {
    
    const [inputList, setInputList] = useState([0]);
    const classes = useStyles();

    const renderInputList = () => {
        return inputList.map((input, index) => {
            return(
                <div>
                    <InputComponent key={index}/>
                </div>
            );
        })
    }

    const addNewInput = (e) => {
        e.preventDefault();
        setInputList([...inputList, 0]);
        console.log(inputList)
    }

    return(
        <React.Fragment>
        <CssBaseline />
        <Container component="main" maxWidth="sm">
            <div className={classes.middle}>
                <h1>Add Links</h1>
                {renderInputList()}
                <div 
                    className="add-new-input"
                    onClick={addNewInput}
                >
                    Add New Link
                </div>
            </div>
        </Container>
      </React.Fragment>
        
    );
};

export default App;