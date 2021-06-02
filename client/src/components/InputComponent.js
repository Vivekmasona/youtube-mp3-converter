import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

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

const InputComponent = () => {
    const [link, setLink] = useState('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({});

    const classes = useStyles();

    return(
        <Container className={classes.root}>
            {
                !token ? 
                <ConvertComponent 
                    loading={loading}
                    token={token}
                    link={link}
                    setToken={setToken}
                    setLink={setLink}
                    setLoading={setLoading}
                    setMeta={setMeta}
                /> :
                <DownloadComponent 
                    meta={meta}
                    token={token}
                />
            }
            
        </Container>
    );
};

export default InputComponent;