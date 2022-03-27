import Dexie, { Table } from 'dexie';
import {MockType} from "../models/MockType";



export class ClassedDexie extends Dexie {

    mock!: Table<MockType>;

    constructor() {
        super('mock');
        this.version(1).stores({
            mock: '++id,date,county,state,fips,cases,deaths'
        });
    }
}


export const db = new ClassedDexie();
