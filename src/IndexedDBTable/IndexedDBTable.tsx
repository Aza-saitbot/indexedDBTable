import {ChangeEvent, useEffect, useState} from "react";
import * as React from "react";
import {Mock, MockType} from "../models/MockType";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db/db";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import {Order} from "../types/types";
import EnhancedTableToolbar from "../components/EnhancedTableToolbar/EnhancedTableToolbar";
import EnhancedTableHead from "../components/EnhancedTableHead/EnhancedTableHead";
import {getComparator, stableSort} from "../utility/utlity";


export const IndexedDBTable = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Mock>('date');
    const [selected, setSelected] = React.useState<number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [offset, setOffset] = useState(0)
    const [count, setCount] = useState(0)

    const [search, setSearch] = useState('')

    console.log('search', search)

    const lists = useLiveQuery(() => db.mock.offset(offset).limit(rowsPerPage).toArray(),
        [rowsPerPage, offset])

    const [rows, setRows] = useState(lists)

    console.log('rows', rows)


    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Mock,
    ) => {

        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows && rows.map((n) => n.id);
            if (newSelecteds) setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: Array<number> = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        if (page < newPage) {
            setOffset(prevState => prevState + rowsPerPage)
        } else {
            setOffset(prevState => prevState - rowsPerPage)
        }
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const activeSetSeacrh = (e: string) => {
        setSearch(e)
        db.mock.where('county').equalsIgnoreCase(e).offset(offset).limit(rowsPerPage).toArray().then(res => {
                if (e.length > 0) {
                    setRows(res)
                } else {
                    setRows(lists)
                }
            }
        )
    }

    const isSelected = (selectId: number) => selected.indexOf(selectId) !== -1;

    const emptyRows = rows &&
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


    useEffect(() => {
        if (lists && search.length === 0) {
            console.log('useEffect', lists)
            setRows(lists)
        }
    }, [lists, search])

    useEffect(() => {
        async function getCount() {
            const count = await db.mock.count()
            setCount(count)
        }

        getCount()

    }, [rows?.length])


    if (rows) {
        return (
            <Box sx={{width: '100%', minHeight: '95vh'}}>
                <Paper sx={{width: '100%', minHeight: "95vh", mb: 2}}>
                    <div style={{margin: 10}}>
                        <TextField
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon/>
                                    </InputAdornment>
                                )
                            }}
                            size="small" value={search}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => activeSetSeacrh(e.target.value)}
                            label="Search" variant="outlined"/>
                    </div>
                    {rows.length === 0
                        ? (
                            <div
                                style={{display: 'grid', alignItems: 'center', justifyItems: 'center', height: '95vh'}}>
                                <h1>Не найдено</h1>
                            </div>
                        )
                        : (
                            <>
                                <EnhancedTableToolbar
                                    numSelected={selected}
                                    setSelected={setSelected}
                                    rows={rows}/>
                                <TableContainer>
                                    <Table
                                        sx={{minWidth: 750}}
                                        aria-labelledby="tableTitle"
                                    >
                                        <EnhancedTableHead
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={rows.length}
                                        />
                                        <TableBody>
                                            {stableSort<MockType>(rows, getComparator(order, orderBy))
                                                .map((row, index) => {
                                                    const isItemSelected = isSelected(row.id);
                                                    const labelId = `enhanced-table-checkbox-${index}`;

                                                    return (
                                                        <TableRow
                                                            hover
                                                            onClick={(event) => handleClick(event, row.id)}
                                                            role="checkbox"
                                                            aria-checked={isItemSelected}
                                                            tabIndex={-1}
                                                            key={row.id}
                                                            selected={isItemSelected}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    color="primary"
                                                                    checked={isItemSelected}
                                                                    inputProps={{
                                                                        'aria-labelledby': labelId,
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                padding="none"
                                                            >
                                                                {row.date}
                                                            </TableCell>
                                                            <TableCell component="th"
                                                                       id={labelId}
                                                                       scope="row"
                                                                       padding="none">{row.county}</TableCell>
                                                            <TableCell component="th"
                                                                       id={labelId}
                                                                       scope="row"
                                                                       padding="none">{row.state}</TableCell>
                                                            <TableCell component="th"
                                                                       id={labelId}
                                                                       scope="row"
                                                                       padding="none">{row.fips}</TableCell>
                                                            <TableCell component="th"
                                                                       id={labelId}
                                                                       scope="row"
                                                                       padding="none">{row.cases}</TableCell>
                                                            <TableCell component="th"
                                                                       id={labelId}
                                                                       scope="row"
                                                                       padding="none">{row.deaths}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            {emptyRows > 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6}/>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 20, 50]}
                                    component="div"
                                    count={count}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </>
                        )
                    }
                </Paper>
            </Box>
        )
    }

    return null


}
