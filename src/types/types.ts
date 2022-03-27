import {Mock, MockType} from "../models/MockType";
import * as React from "react";

export interface HeadCell {
    disablePadding: boolean;
    id: keyof Mock;
    label: string;
    numeric: boolean;
}

export type Order = 'asc' | 'desc';
export interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Mock) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}
export interface EnhancedTableToolbarProps {
    numSelected: Array<number>;
    setSelected: React.Dispatch<React.SetStateAction<number[]>>
    rows: Array<MockType>

}
