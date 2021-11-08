import React from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import { preventUrl } from '../../utils/commonHandle';
import * as MTL from '@material-ui/core';
import * as MTLLAB from '@material-ui/lab';
import { makeStyles, withStyles } from '@material-ui/core';
import * as ICON from '@material-ui/icons';
//utils
import { compose } from 'lodash/fp';
import { isTrim } from '../../utils/commonHandle';
import { set } from 'lodash';
const ChatMessage = ({
    ws,
    match: {
        params: { roomId },
        url,
        ...matchrest
    },
    location: {
        state: { username, roomname },
    },
    ...props
}) => {
    const history = useHistory();
    const prevUrl = preventUrl(url, roomId);
    const classes = useStyles();
    const [message, setMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([]);
    const [systemMessage, setSystemMessage] = React.useState({});
    const [alertShow, setAlertShow] = React.useState(false);
    const [numberOfUser, setNumberOfUser] = React.useState(0);
    // console.log(matchrest);
    // React.useEffect(() => {
    //     ws.on('adminMessage', (message) => {
    //         console.log(message, 111);
    //     });
    // }, []);

    const onInputChange = (e) => {
        const value = e.target.value;
        const verifiedHandle = compose(isTrim);
        setMessage(verifiedHandle(value));
    };
    //系統資訊
    React.useEffect(() => {
        ws.on('systemMessage', (message) => {
            console.log(message, 'systemMessage');
            setSystemMessage(message);
            setAlertShow(true);
        });
    }, [ws]);
    //多少用戶
    React.useEffect(() => {
        ws.on('numberOfUser', (data) => {
            setNumberOfUser(data);
        });
    }, [ws]);
    //用戶離開聊天室
    React.useEffect(() => {
        history.block((targetLocation) => {
            // console.log(targetLocation, 'targetLocation');
            // take your action here
            if (prevUrl === targetLocation.pathname) {
                ws.emit('leaveRoom', { username, roomname });
                console.log(prevUrl, 111);
            }
            return true;
        });
    }, []);

    //接收其他的的訊息
    React.useEffect(() => {
        ws.on('receiveMessage', (data) => {
            setMessageList((prev) => [...prev, data]);
        });
    }, [ws]);

    //接收自己所發送的訊息
    React.useEffect(() => {
        ws.on('getMessage', (data) => {
            setMessageList((prev) => [...prev, data]);
        });
    }, [ws]);

    const onSendMessage = async () => {
        if ((message !== '' && username !== '') || username === undefined) {
            let messageData = {
                username,
                message,
                roomname,
            };
            await ws.emit('sendMessage', messageData);
            setMessage('');
        }
    };

    return (
        <MTL.Box className={classes.root}>
            <MTL.Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={alertShow}
                message={`${systemMessage?.message}，時間：${systemMessage.time}`}
                onClose={() => setAlertShow(false)}
                autoHideDuration={2000}
            />
            <MTL.Grid container>
                <UserTitle>
                    <MTL.Box
                        component="div"
                        sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <MTL.InputAdornment style={{ color: `#fff` }} position="start">
                            <ICON.AccountCircle />
                        </MTL.InputAdornment>
                        <MTL.Box>
                            <MTL.Typography style={{ color: `#fff` }}>{username}</MTL.Typography>
                        </MTL.Box>
                        <MTL.Box ml={2}>
                            <MTL.Typography style={{ color: `#fff` }}>目前用戶數：{numberOfUser}</MTL.Typography>
                        </MTL.Box>
                    </MTL.Box>
                </UserTitle>
                <MTL.Grid className={classes.messageBox} xs={12} item>
                    {messageList.map((message, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Receiver isSender={message.id === ws.id} data={message} />
                            </React.Fragment>
                        );
                    })}
                </MTL.Grid>
                <MTL.Grid xs={12} item>
                    <MTL.Box className={classes.inputGroup}>
                        <MTL.OutlinedInput
                            value={message}
                            className={classes.textInput}
                            onChange={onInputChange}
                            variant="outlined"
                            onKeyPress={(e) => {
                                e.key === 'Enter' && onSendMessage();
                            }}
                        />
                        <MTL.Button
                            color="primary"
                            variant="contained"
                            className={classes.submit}
                            onClick={onSendMessage}
                        >
                            送出
                        </MTL.Button>
                    </MTL.Box>
                </MTL.Grid>
            </MTL.Grid>
        </MTL.Box>
    );
};

const UserTitle = withStyles((theme) => {
    return {
        userTitle: {
            background: theme.palette.primary.dark,
        },
    };
})(({ children, classes }) => {
    return (
        <MTL.Grid className={classes.userTitle} xs={12} item>
            {children}
        </MTL.Grid>
    );
});

const Receiver = withStyles((theme) => {
    return {
        receiverMessage: {
            background: 'white',
            padding: '0.3rem',
            borderRadius: 10,
            display: 'inline-block',
            margin: '5px 0',
        },
        sender: {
            display: 'inline-block',
            borderRadius: 10,
            background: '#ADFF2F',
            padding: '0.3rem',
            margin: '5px 0',
        },
        receiverName: {
            display: 'inline-block',
        },
        message: {
            padding: '0.3rem',
            display: 'inline-block',
            margin: '5px',
        },
        box: {
            display: 'flex',
        },
        meta: {
            fontSize: `10px`,
            textAlign: 'center',
        },
    };
})(({ classes, data, isSender }) => {
    return (
        <MTL.Box className={classes.box} sx={{ justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
            {!isSender ? (
                <React.Fragment>
                    <div>
                        <span className={classes.message}> {data.username}:</span>
                        <MTL.Typography component="div" className={classes.receiverMessage}>
                            {data.message}
                        </MTL.Typography>
                        <div className={classes.meta}>
                            <span>{data.time}</span>
                        </div>
                    </div>
                </React.Fragment>
            ) : (
                <MTL.Typography component="div">
                    <div className={classes.message} style={{ background: '#ADFF2F' }}>
                        {data.message}
                    </div>
                    <div className={classes.meta}>
                        <span>{data.time}</span>
                    </div>
                </MTL.Typography>
            )}
        </MTL.Box>
    );
});

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: '40vw',
            minWidth: '576px',
            margin: '2rem auto',
            // maxHeight: `50vh`,
            minHeight: 500,
            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden',
            boxShadow: theme.shadows[5],
        },
        messageBox: {
            background: `#eee`,
            height: '400px',
            overflowY: 'auto',
        },

        submit: {
            height: '100%',
            borderLeft: 'none',
            borderRadius: '0 0 5px 0',
        },
        textInput: {
            flexBasis: '90%',
            borderRadius: '0px 0px 0px 5px',
        },
        inputGroup: {
            height: '100%',
            display: 'flex',
        },
    };
});

export default ChatMessage;
