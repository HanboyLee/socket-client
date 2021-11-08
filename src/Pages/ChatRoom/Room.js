import React from 'react';
import * as MTL from '@material-ui/core';
import * as ICON from '@material-ui/icons';
import * as fp from 'lodash/fp';
import { makeStyles, withStyles } from '@material-ui/core';
import { fakeRoomInit } from '../../fakeDate';
//router
import { NavLink, useHistory } from 'react-router-dom';
//utils
import { isStringEmpty, isTrim, isString } from '../../utils/commonHandle';

//components
import { MtlSelectComponent, MtlInputfieldText } from '../../components';
const Room = ({ match: { path, ...routerRest }, ws, ...props }) => {
    const [name, setName] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [joinPopup, setjoinPopup] = React.useState(false);

    const classes = useStyles();
    const history = useHistory();

    const onPopupRoom = () => {
        setjoinPopup(true);
    };
    const onJoinRoom = async () => {
        if (room !== '' && name !== '') {
            const verify = fp.compose(isString, isStringEmpty, isTrim);
            const verifyName = verify(name);
            console.log(room, 'room');

            await ws.emit('joinRoom', { roomname: room.value, username: verifyName });
            history.push({ pathname: `${path}/${room.value}`, state: { username: verifyName, roomname: room.value } });
        }
    };

    const onClearData = () => {
        setName('');
    };
    const onClose = () => {
        setjoinPopup(false);
        onClearData();
    };
    React.useEffect(() => {
        if (fakeRoomInit.roomOptions[0].id) setRoom(fakeRoomInit.roomOptions[0]);
    }, []);
    return (
        <>
            <MTL.Box className={classes.root} component={'div'}>
                <MTL.Grid container justifyContent="center" alignItems="center" xl={12}>
                    <Item>
                        <MTL.Box component="div" py="3">
                            <StyledTypography text={'聊天室'} />
                        </MTL.Box>
                    </Item>
                    <Item>
                        <MTL.Box component="div" p={3}>
                            <MtlSelectComponent
                                options={fakeRoomInit.roomOptions}
                                value={room}
                                setValue={setRoom}
                                htmlFor={"'outlined-room'"}
                                label={'房間'}
                                isObject
                            />
                        </MTL.Box>
                        <MTL.Box component="div" p={3}>
                            <MtlInputfieldText
                                label={'名稱'}
                                value={name}
                                setValue={setName}
                                onKeyPress={(e) => {
                                    e.key === 'Enter' && onPopupRoom();
                                }}
                            />
                        </MTL.Box>
                    </Item>
                    <Item>
                        <MTL.Box component="div" p={3} sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            <MTL.Button onClick={onPopupRoom} color="primary" variant="outlined">
                                加入房間
                            </MTL.Button>

                            <MTL.Button color="secondary" variant="outlined" onClick={onClearData}>
                                重新填寫
                            </MTL.Button>
                        </MTL.Box>
                    </Item>
                </MTL.Grid>
            </MTL.Box>
            <MTL.Dialog open={joinPopup} onClose={onClose}>
                <MTL.DialogTitle>{'通知'}</MTL.DialogTitle>
                <MTL.DialogContent>
                    <MTL.DialogContentText>{`您確定叫加入${room?.value}房間`}</MTL.DialogContentText>
                </MTL.DialogContent>
                <MTL.DialogActions>
                    <MTL.Button onClick={onJoinRoom} color="primary">
                        確定加入房間
                    </MTL.Button>
                    <MTL.Button onClick={onClose} color="primary" autoFocus>
                        取消進入
                    </MTL.Button>
                </MTL.DialogActions>
            </MTL.Dialog>
        </>
    );
};

const Item = ({ styles, children }) => {
    return (
        <MTL.Grid item xs={12} style={styles}>
            {children}
        </MTL.Grid>
    );
};
const StyledTypography = withStyles((theme) => {
    // console.log(theme, 'theme');
    return {
        root: {
            background: theme.palette.primary.light,
            color: 'white',
            height: `5rem`,
            textAlign: 'center',
            ...theme.typography.h5,
            lineHeight: 3,
        },
    };
})(({ text, classes, ...props }) => {
    // console.log(props, 'props');
    return (
        <MTL.Typography component="div" className={classes.root}>
            {text}
        </MTL.Typography>
    );
});

const useStyles = makeStyles((theme) => {
    return {
        root: () => ({
            width: '50vw',
            minWidth: '576px',
            margin: '2rem auto',
            maxHeight: `60vh`,
            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden',
            boxShadow: theme.shadows[5],
        }),
        nameField: {
            margin: theme.spacing(1),
            minWidth: `100%`,
        },
    };
});

export default Room;
