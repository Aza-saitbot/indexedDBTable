import React from 'react';
import {CircularProgress} from "@mui/material";

const Loader = () => {
    return (
        <div style={{
            display: 'grid',
            width: '100%',
            height: '95vh',
            alignItems: 'center',
            justifyItems: 'center'
        }}>
            <CircularProgress sx={{width: 100}}/>
        </div>
    );
};

export default Loader;
