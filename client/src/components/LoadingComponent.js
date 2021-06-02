import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const LoadingComponent = () => {
    return(
        <div className="loading-component">
            Loading...
        </div>
    );
};

export default LoadingComponent;