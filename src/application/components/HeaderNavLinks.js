import React, { Component } from 'react'
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
    IconButton,
    Icon,
    Switch,
    FormGroup,
    MenuItem,
    Menu,
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'

import {
    CalendarTodayRounded,
    Settings,
    Assignment,
    SupervisedUserCircle,
    SupervisedUserCircleRounded,
    Group,
    People,
} from '@material-ui/icons';

import {
    withStyles,
    createMuiTheme,
    MuiThemeProvider,
} from '@material-ui/core/styles'

import { forOwn } from 'lodash'

/**
 * Plano orange: #ff8410
 * plano dark: #3c4252
 **/

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
})

export default withStyles(styles)(class extends Component {
    state = {
        auth: true,
        anchorEl: null,
        whitelabel: EANavLinks.whitelabel,
        links: {
            'calendar': <CalendarTodayRounded />,
            'customers': <Group />,
            'services': <Assignment />,
            'users': <SupervisedUserCircleRounded />,
            'settings': <Settings />,
        },
    }

    handleChange = event => {
        this.setState({ auth: event.target.checked });
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    render() {
        const { classes } = this.props;
        const { whitelabel, links } = this.state;

        return (
            <div className={classes.root} style={{marginBottom: 20}}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                                <a href={EANavLinks.links['calendar'].href} style={{color: '#fff', marginTop: 8}}>
                                    <img style={{
                                        display: 'inline-block',
                                        marginTop: '-15px',
                                        height: '40px'}} src={require('../../assets/img/plano-tw.png')} />
                                    <h4 style={{
                                        display: 'inline-block',
                                        marginTop: '20px',
                                        paddingLeft: 10,
                                        marginLeft: 10,
                                        borderLeft: '2px solid #ccc',
                                        color: '#ccc',
                                    }}>
                                        {whitelabel}
                                    </h4>
                                </a>
                            </Grid>
                            <Grid item xs={12} sm={6} style={{textAlign: 'right'}}>
                                {Object.keys(links).map((key) => {
                                    if ( ! EANavLinks.links[key].hidden ) {
                                        return (
                                            <IconButton
                                                color="inherit"
                                                key={key}
                                            >
                                                <a href={EANavLinks.links[key].href} style={{color: '#fff', marginTop: 8}}>
                                                    {links[key]}
                                                </a>
                                            </IconButton>
                                        )
                                    }
                                })}
                                <IconButton color="inherit">
                                    <a href={EANavLinks.links['log_out'].href} style={{color: "#fff"}}>Logout</a>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
})