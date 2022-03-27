import Dexie, {Table} from 'dexie';


export class ClassedLoader extends Dexie {

    toggle!: Table<{ toggle: boolean }>;

    constructor() {
        super('toggle');
        this.version(1).stores({
            toggle: '++id,toggle'
        });
    }
}


export const dbLoader = new ClassedLoader();
