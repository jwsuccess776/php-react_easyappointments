import React from 'react'
import ReactDOM from 'react-dom'
import {
    MuiThemeProvider,
    createMuiTheme
} from '@material-ui/core/styles'

import HeaderNavLinks from '../../components/HeaderNavLinks'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#3c4252',
        },
    },
    typography: {
        useNextVariants: true,
    },
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <HeaderNavLinks />
        </MuiThemeProvider>
    );
}


ReactDOM.render(<App />, document.getElementById('header-v2'))