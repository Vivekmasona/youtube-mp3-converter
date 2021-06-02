import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import download from '../actions/download';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
        padding: theme.spacing(1)
    },
    cover: {
        // width: 121,
        width: '100%',
        height: '100%'
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
}));

const DownloadComponent = ({meta, token}) => {
    const { title, thumbnail, lengthSeconds } = meta;
    const classes = useStyles();

    if(Object.keys(meta).length === 0) {
        return null;
    }

    const onDownloadClick = async (e) => {
        e.preventDefault();
        const { response, error } = await download(token);
        if(error) {
            console.log(error);
            return;
        }
        const filename =  response.headers['content-disposition'].split('filename=')[1];

        const url = window.URL.createObjectURL(new Blob([response.data]), { type: 'audio/mp3' });
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename.slice(1,-1));
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    return(
        <Card className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <img
                        className={classes.cover}
                        src={thumbnail.thumbnails[0].url}
                        title={title}
                    />
                </Grid>
                <Grid item xs={8}>
                    <div className={classes.details}>
                        <div className={classes.content}>
                            <Typography component="h6" variant="h6" noWrap>
                                {title}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                Length: {lengthSeconds} seconds
                            </Typography>
                        </div>
                        <div className={classes.controls}>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={onDownloadClick}
                                id="download-button"
                                size="small"
                            >
                                Download
                            </Button>
                        </div>
                    </div>
                </Grid>
            </Grid>
            
        </Card>
    );
};

export default DownloadComponent;