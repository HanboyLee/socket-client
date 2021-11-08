import React from 'react';
import * as MTL from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import * as ICON from '@material-ui/icons';

const MtlInputfieldText = ({ onKeyPress, value, setValue, label, Icon }) => {
    const classes = useStyles();

    const onChange = (e) => {
        setValue(e.target.value);
    };
    return (
        <MTL.TextField
            variant="outlined"
            className={classes.nameField}
            id="input-with-icon-textfield"
            label={label}
            InputProps={{
                startAdornment: (
                    <MTL.InputAdornment position="start">{Icon ? <Icon /> : <ICON.AccountCircle />}</MTL.InputAdornment>
                ),
                inputProps: {
                    style: {
                        fontSize: `1.8rem`,
                    },
                },
            }}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
        />
    );
};
const useStyles = makeStyles((theme) => {
    return {
        nameField: {
            margin: theme.spacing(1),
            minWidth: `100%`,
        },
    };
});

export default MtlInputfieldText;
