import React from 'react'
import ReactDOM from 'react-dom'
import Installer from './installation'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'

import {
    MuiThemeProvider,
    createMuiTheme
} from '@material-ui/core/styles'

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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Installer />
            </MuiPickersUtilsProvider>
        </MuiThemeProvider>
    );
}


ReactDOM.render(<App />, document.getElementById('app'))