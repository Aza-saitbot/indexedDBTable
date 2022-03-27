import React, {FC} from 'react';
import {db} from "../../db/db";
import Toolbar from "@mui/material/Toolbar";
import {alpha} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import {EnhancedTableToolbarProps} from "../../types/types";



const EnhancedTableToolbar:FC<EnhancedTableToolbarProps> = ({numSelected, setSelected, rows}) => {

    const removeRow = async () => {
        await db.mock.bulkDelete(numSelected)
        setSelected([])
    }

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected.length > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected.length > 0 ? (
                <Typography
                    sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected.map(i => {

                            const nameCounty = rows.find(m => m.id === i)
                            return (
                                <Typography sx={{display: "grid", alignItems: "center"}}>
                                    {nameCounty && nameCounty?.county}
                                </Typography>
                            )
                        }
                    )}
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    IndexDB-Table
                </Typography>
            )}
            {numSelected.length > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={removeRow}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

export default EnhancedTableToolbar;
