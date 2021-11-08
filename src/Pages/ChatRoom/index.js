import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import Room from './Room';

const ChatRoom = ({ ...props }) => {
    return (
        <Switch>
            <Route path="/room" render={(route) => <Room {...route} {...props} />} exact />
            <Route exact path="/room/:roomId" render={(route) => <ChatMessage {...route} {...props} />} />
            <Redirect to="/room" />
        </Switch>
    );
};

export default ChatRoom;
