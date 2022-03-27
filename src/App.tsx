import React, {useEffect} from 'react'
import Download from "./components/Download/Download";
import Loader from "./components/Loader/Loader";
import {IndexedDBTable} from "./IndexedDBTable/IndexedDBTable";
import {dbLoader} from "./db/dbLoader";
import {useLiveQuery} from "dexie-react-hooks";


export const App = () => {
    const loader = useLiveQuery(() => dbLoader.toggle.toArray(), [])

    useEffect(() => {
        if (loader?.length === 0) {
            dbLoader.toggle.add({toggle: false})
        }
    }, [loader])

    return (
        <>
            <Download/>
            {loader?.length && loader[0].toggle && <Loader/>}
            <IndexedDBTable/>
        </>
    )
}
