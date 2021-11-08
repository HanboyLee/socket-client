import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router } from 'react-router-dom';
import ChatRoom from './Pages/ChatRoom';
// import { ThemeProvider } from '@material-ui/styles';
// import { createTheme } from '@material-ui/core/styles';

const App = () => {
    // const theme = createTheme();
    // const socket = io('http://localhost:5500', { reconnection: true });
    const [ws, setWs] = React.useState(io('http://localhost:5500', { reconnection: true }));

    React.useEffect(() => {
        if (ws) {
            ws.emit('disconnection', 'Disconnection');
            ws.emit('connection', 'connection');
            console.log(1111);
        }
    }, [ws]);
    if (!ws) {
        return <div>Loading...</div>;
    }
    return (
        // <ThemeProvider theme={theme}>
        <Router>
            <ChatRoom ws={ws} />
        </Router>
        // </ThemeProvider>
    );
};

export default App;
