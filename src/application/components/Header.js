import React from 'react'
import PropTypes from 'prop-types'

import {
    Grid,
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    Stepper,
    Step,
    StepButton,
    AppBar,
    Toolbar,
} from '@material-ui/core'

import {
    withStyles,
    createMuiTheme,
    MuiThemeProvider,
} from '@material-ui/core/styles'

/**
 * Plano orange: #ff8410
 * plano dark: #3c4252
 **/

const styles = theme => ({
    root: {
        width: '90%',
        // flexGrow: 1,
    },
    button: {
        // backgroundColor: '#3c4252',
        marginRight: theme.spacing.unit,
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
})

export default withStyles(styles)((classes, children) => (
    <AppBar position="static" color="primary">
        <Toolbar>
            <img style={{height: '40px'}} src={require('../../assets/img/plano-tw.png')} />
        </Toolbar>
    </AppBar>
))