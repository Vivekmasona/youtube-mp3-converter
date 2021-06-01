import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Queue } from "dynamic-queue";

import InputComponent from './InputComponent';

const App = () => {
    
    const [inputList, setInputList] = useState([0]);

    const requestQueue = new Queue((next) => {
        next();
    });

    const renderInputList = () => {
        return inputList.map((input, index) => {
            return(
                <div>
                    <InputComponent key={index} index={index} requestQueue={requestQueue}/>
                </div>
            );
        })
    }

    const addNewInput = (e) => {
        e.preventDefault();
        setInputList([...inputList, 0]);
    }

    return(
        <div className="main">
            <h1>Add Links</h1>
            {renderInputList()}
            <div 
                className="add-new-input"
                onClick={addNewInput}
            >
                Add New Link
            </div>
        </div>
    );
};

export default App;