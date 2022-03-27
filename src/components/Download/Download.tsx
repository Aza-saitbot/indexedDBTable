import React from 'react';
import {Button} from "@mui/material";
// @ts-ignore
import data from "../../mock/data.csv";
import {ParseResult} from "papaparse";
import {MockType} from "../../models/MockType";
import {db} from "../../db/db";
import {usePapaParse} from "react-papaparse";
import {dbLoader} from "../../db/dbLoader";


const Download = () => {
    const {readRemoteFile} = usePapaParse();
    const loaderData = async () => {
        await dbLoader.toggle.update(1, {toggle: true})
        readRemoteFile(data, {
            download: true,
            delimiter: ",",
            header: true,
            dynamicTyping: true,
            complete: (res: ParseResult<MockType>) => {
                db.mock.bulkAdd(res.data).then(()=>dbLoader.toggle.update(1, {toggle: false}))
            }
        })
    }

    const clearData = async () => {
        await dbLoader.toggle.update(1, {toggle: true})
        db.mock.clear().then(() => dbLoader.toggle.update(1, {toggle: false}))
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
            justifyItems: 'center'
        }}
        >
            <Button
                onClick={loaderData}
                variant="outlined">Download
            </Button>
            <Button
                onClick={clearData}
                variant="outlined" color="error">Clear
            </Button>
        </div>
    );
};

export default Download;
