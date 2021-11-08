import React from 'react';
import * as MTL from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { convertNumToStr } from '../utils/commonHandle';
const MtlSelectComponent = ({ isObject, value, setValue, options, label, htmlFor }) => {
    const classes = useStyles();
    const handleChange = (e) => {
        const target = convertNumToStr(e.target.value);
        if (isObject) {
            setValue(options.find((option) => convertNumToStr(option?.id) === target));
            return;
        }
        setValue(target);
    };
    return (
        <MTL.FormControl variant="outlined" className={classes.formControl}>
            <MTL.InputLabel htmlFor={htmlFor}>{label}</MTL.InputLabel>
            <MTL.Select
                inputProps={{
                    name: label,
                    id: htmlFor,
                }}
                className={classes.channel}
                native
                label={label}
                value={value?.id || value || options[0]?.id}
                onChange={handleChange}
            >
                <option aria-label="None" value="" disabled>
                    選項
                </option>
                {options.map((data) => {
                    return (
                        <option key={data.id} value={data.id}>
                            {data.value}
                        </option>
                    );
                })}
            </MTL.Select>
        </MTL.FormControl>
    );
};

const useStyles = makeStyles((theme) => {
    return {
        channel: {
            width: `100%`,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: `100%`,
        },
    };
});

export default MtlSelectComponent;
