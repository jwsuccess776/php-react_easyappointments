import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import jQuery from 'jquery'

import {
    Grid,
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    Step,
    StepButton,
    AppBar,
    Toolbar,
    NativeSelect,
    TextField,
    FormControl,
    Input,
    InputLabel,
    FormHelperText,
} from '@material-ui/core'

import {
    withStyles,
    createMuiTheme,
    MuiThemeProvider,
} from '@material-ui/core/styles'

import Stepper from './Stepper'
import Repeatable from '../../../vendor/Repeatable'
import { default as RepeatableV2 } from './Repeatable'

import {
    Formik,
    connect,
    getIn,
    ErrorMessage,
    FieldArray,
} from 'formik'

import Debug from './FormikDebug'

import * as yup from 'yup'
import {
    size,
    merge,
    map,
    isFunction,
    times,
    stubObject,
    fill,
} from 'lodash'

// const ErrorMsg = (msg, name) => connect(props => {
//     console.log('props', props)
//     return (<div className="errors" style={{color: '#ff0000'}}>{msg}</div>)
// })

const ErrorMsg = (msg) => (<div className="errors" style={{color: '#ff0000'}}>{msg}</div>)

let ErrMsg = connect(({children, formik}) => {
    // All FormikProps available on props.formik!
    return (<div className="errors" style={{color: '#ff0000'}}>{children}</div>);
});

/**
 * Plano orange: #ff8410
 * plano dark: #3c4252
 **/

const styles = theme => ({
    root: {
        // width: '90%',
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

export default withStyles(styles)(class extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeStep: 0,
            steps: [
                'Setup Practice',
                'Invite Staff',
                'Office Hours',
                'Services Offered',
                'Billing Codes',
            ],
            step0Values: [],
            step1Values: [],
            step2Values: [],
            step3Values: [],
            step4Values: [],
            validateAllSteps: {},
            validateStep: {},
            validationFields: [
                {
                    first_name: yup.string().required(),
                    last_name: yup.string().required(),
                    email: yup.string().required(),
                    password: yup.string().required(),
                    confirm_password: yup.string().required(),
                    practice_name: yup.string().required(),
                    practice_phone: yup.string().required(),
                    practice_address_1: yup.string().required(),
                    practice_city: yup.string().required(),
                    practice_state: yup.string().required(),
                    practice_zip: yup.string().required()
                },
                {
                    invites: yup.array().of(
                        yup.object().shape({
                            first_name: yup.string(),
                            last_name: yup.string(),
                            email: yup.string().required(),
                            npi: yup.string(),
                            role: yup.string().required(),
                        })
                    )
                },
                {
                    hours: yup.array().of(
                        yup.object().shape({
                            day: yup.string(),
                            office_start_time: yup.string(),
                            office_end_time: yup.string(),
                            lunch_start_time: yup.string(),
                            lunch_end_time: yup.string(),
                        })
                    ),
                },
                {
                    services: yup.array().of(
                        yup.object().shape({
                            name: yup.string().required(),
                            time: yup.string().required(),
                            price: yup.string(),
                        })
                    ),
                },
                {
                    billing: yup.array().of(
                        yup.object().shape({
                            cpt: yup.string().required(),
                            price: yup.string(),
                        })
                    ),
                }
            ]
        }

        let allFields = {}
        let validateStep = {}

        map(this.state.validationFields, (fields, key) => {
            // prepare validation for all steps
            merge(allFields, fields)

            // prepare validation for each step
            validateStep[key] = yup.object().shape(fields)
        })

        this.state.validateAllSteps = yup.object().shape(allFields)
        this.state.validateStep = validateStep
    }

    clearErrors = ({}) => {
        // map(this.state.validationFields[activeStep], (schema, fieldName) => setFieldTouched(fieldName, true))
    }

    completeStep = ({activeStep, values, handleSubmit, validateForm, setFieldTouched, setFieldValue}) => {
        // Validate activeStep
        // map(this.state.validationFields[activeStep], (schema, fieldName) => console.log('fieldName', fieldName))
        map(this.state.validationFields[activeStep], (schema, fieldName) => setFieldTouched(fieldName, true))

        console.log('values', values)

        this.state.validateStep[activeStep]
            .isValid(values)
            .then(valid => {
                if (valid && (this.state.steps.length - 1) != activeStep) {
                    // console.log('values', values)
                    // this.nextStep()
                } else if ( valid ) {
                    return handleSubmit()
                }

                console.log('values', values)
                // this.nextStep()
            })
    }
    
    nextStep = () => this.setState(state => {
        // reset back to the first step.
        let nextStep = 0
    
        // if we're not on the last step, +1
        if (state.steps.length - 1 !== state.activeStep) {
            nextStep = state.activeStep + 1;
        }
        
        return ({activeStep: nextStep})
    })

    onStepChange = ({values, activeStep}) => {
        console.log('values', values, activeStep)
        // this.setState({activeStep})
    }

    renderForm = ({classes, activeStep, steps}) => (
        <Formik
            //initialValues={}
            validationSchema={this.state.validateAllSteps}
            onSubmit={(values, { setSubmitting, setFieldValue }) => {
                console.log('onSubmit', values)
                setSubmitting(false)
            }}>
            {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                validateForm,
                setFieldTouched,
                setFieldError,
                /* and other goodies */
            }) => (
                <form onSubmit={handleSubmit}>
                    <Stepper
                        activeStep={activeStep}
                        onStepChange={activeStep => this.onStepChange({values, activeStep})}
                        steps={steps} />
                    <Card style={{paddingBottom: 30}}>
                        {this.getStepFields({values, activeStep, handleChange, setFieldValue, errors})}
                    </Card>
                    <div style={{marginTop: 20}}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={this.prevStep}
                            className={classes.button}>{'Back'}</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.completeStep({activeStep, values, handleSubmit, validateForm, setFieldTouched, setFieldValue})}
                            disabled={isSubmitting}
                            className={classes.button}>
                            {(activeStep == steps.length - 1) ? 'Create Practice' : 'Next Step'}
                        </Button>
                    </div>

                    <Debug />
                </form>
            )}
        </Formik>
    )

    prevStep = () => this.setState(state => ({activeStep: state.activeStep - 1}))

    getStepFields({values, activeStep, handleChange, errors}) {
        switch (activeStep) {
            case 0:
                return (
                    <Grid container justify="space-evenly">
                        <Grid item xs={5}>
                            <div>
                                <TextField
                                    name="email"
                                    fullWidth
                                    label="Company Email"
                                    autoComplete="username"
                                    onChange={handleChange}
                                />
                                <ErrorMessage component={ErrMsg} name="email" />
                            </div>
                            <div>
                                <TextField
                                    name="password"
                                    type="password"
                                    fullWidth
                                    autoComplete="new-password"
                                    label="Password"
                                    onChange={handleChange}
                                />
                                <ErrorMessage component={ErrMsg} name="password" />
                            </div>
                            <div>
                                <TextField
                                    name="confirm_password"
                                    type="password"
                                    fullWidth
                                    autoComplete="new-password"
                                    label="Confirm Password"
                                    onChange={handleChange}
                                />
                                <ErrorMessage component={ErrMsg} name="confirm_password" />
                            </div>
                            <div>
                                <TextField
                                    name="first_name"
                                    fullWidth
                                    label="First Name"
                                    onChange={handleChange}
                                />
                                <ErrorMessage component={ErrMsg} name="first_name" />
                            </div>
                            <div>
                                <TextField
                                    name="last_name"
                                    fullWidth
                                    label="Last Name"
                                    onChange={handleChange}
                                />
                                <ErrorMessage component={ErrMsg} name="last_name" />
                            </div>
                        </Grid>
                        <Grid item xs={5}>
                            <div>
                                <TextField
                                    name="practice_name"
                                    fullWidth
                                    label="Practice Name"
                                    onChange={handleChange}
                                />
                                <ErrorMessage component={ErrMsg} name="practice_name" />
                            </div>
                            <div>
                                <TextField
                                    name="practice_phone"
                                    fullWidth
                                    label="Phone"
                                    onChange={handleChange}
                                />
                                <ErrorMessage component={ErrMsg} name="practice_phone" />
                            </div>
                            <div>
                                <TextField
                                    name="practice_address_1"
                                    fullWidth
                                    label="Address"
                                    onChange={handleChange}
                                />
                                <ErrorMessage component={ErrMsg} name="practice_address_1" />
                            </div>
                            <div>
                                <TextField
                                    name="practice_city"
                                    label="City"
                                    onChange={handleChange}
                                    style={{width: '50%'}}
                                />
                                <ErrorMessage component={ErrMsg} name="practice_city" />
                                <FormControl style={{width: '50%'}}>
                                    <InputLabel shrink htmlFor="state">State</InputLabel>
                                    <NativeSelect onChange={handleChange} name="practice_state" input={<Input name="state" id="state" />} style={{marginTop: 16}}>
                                        <option value=""></option>
                                        <option value="AL">Alabama</option>
                                        <option value="AK">Alaska</option>
                                        <option value="AZ">Arizona</option>
                                        <option value="AR">Arkansas</option>
                                        <option value="CA">California</option>
                                        <option value="CO">Colorado</option>
                                        <option value="CT">Connecticut</option>
                                        <option value="DE">Delaware</option>
                                        <option value="DC">District Of Columbia</option>
                                        <option value="FL">Florida</option>
                                        <option value="GA">Georgia</option>
                                        <option value="HI">Hawaii</option>
                                        <option value="ID">Idaho</option>
                                        <option value="IL">Illinois</option>
                                        <option value="IN">Indiana</option>
                                        <option value="IA">Iowa</option>
                                        <option value="KS">Kansas</option>
                                        <option value="KY">Kentucky</option>
                                        <option value="LA">Louisiana</option>
                                        <option value="ME">Maine</option>
                                        <option value="MD">Maryland</option>
                                        <option value="MA">Massachusetts</option>
                                        <option value="MI">Michigan</option>
                                        <option value="MN">Minnesota</option>
                                        <option value="MS">Mississippi</option>
                                        <option value="MO">Missouri</option>
                                        <option value="MT">Montana</option>
                                        <option value="NE">Nebraska</option>
                                        <option value="NV">Nevada</option>
                                        <option value="NH">New Hampshire</option>
                                        <option value="NJ">New Jersey</option>
                                        <option value="NM">New Mexico</option>
                                        <option value="NY">New York</option>
                                        <option value="NC">North Carolina</option>
                                        <option value="ND">North Dakota</option>
                                        <option value="OH">Ohio</option>
                                        <option value="OK">Oklahoma</option>
                                        <option value="OR">Oregon</option>
                                        <option value="PA">Pennsylvania</option>
                                        <option value="RI">Rhode Island</option>
                                        <option value="SC">South Carolina</option>
                                        <option value="SD">South Dakota</option>
                                        <option value="TN">Tennessee</option>
                                        <option value="TX">Texas</option>
                                        <option value="UT">Utah</option>
                                        <option value="VT">Vermont</option>
                                        <option value="VA">Virginia</option>
                                        <option value="WA">Washington</option>
                                        <option value="WV">West Virginia</option>
                                        <option value="WI">Wisconsin</option>
                                        <option value="WY">Wyoming</option>
                                    </NativeSelect>
                                </FormControl>
                                <ErrorMessage component={ErrMsg} name="practice_state" />
                            </div>
                            <div>
                                <TextField
                                    name="practice_zip"
                                    label="Zip"
                                    onChange={handleChange}
                                    style={{width: '50%'}}
                                />
                                <ErrorMessage component={ErrMsg} name="practice_zip" />
                            </div>
                        </Grid>
                    </Grid>
                )
            case 1:
                return (
                    <Grid container justify="space-evenly" style={{padding: 20}}>
                        <RepeatableV2
                            key="invite"
                            seed={values.invites || times(5)}
                            model={{
                                first_name: '',
                                last_name: '',
                                email: '',
                                npi: '',
                                role: 'doctor',
                            }}
                            template={(item, index) => <FieldArray
                                name="invite"
                                render={({ move, swap, push, insert, unshift, pop, form }) => (
                                    <Grid key={`invite-${index}`} container spacing={8}>
                                        <Grid item xs={12}><ErrorMessage component={ErrMsg} name="invites" /></Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label="First Name"
                                                name={`invites[${index}].first_name`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label="Last Name"
                                                name={`invites[${index}].last_name`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label="Company Email"
                                                name={`invites[${index}].email`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <TextField
                                                label="NPI"
                                                name={`invites[${index}].npi`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <FormControl>
                                                <NativeSelect
                                                    onChange={handleChange}
                                                    name={`invites[${index}].role`}
                                                    style={{marginTop: 16}}>
                                                    <option value="doctor">Doctor</option>
                                                    <option value="staff">Staff</option>
                                                </NativeSelect>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )}
                            />}
                        />
                    </Grid>
                )
            case 2:
                return (
                    <Grid container justify="space-evenly">
                        <RepeatableV2
                            key="hours"
                            seed={values.hours || [
                                {
                                    day: 'Monday',
                                    office_start_time: '09:00',
                                    office_end_time: '18:00',
                                    lunch_start_time: '11:20',
                                    lunch_end_time: '11:30',
                                },
                                {
                                    day: 'Tuesday',
                                    office_start_time: '09:00',
                                    office_end_time: '18:00',
                                    lunch_start_time: '11:20',
                                    lunch_end_time: '11:30',
                                },
                                {
                                    day: 'Wednesday',
                                    office_start_time: '09:00',
                                    office_end_time: '18:00',
                                    lunch_start_time: '11:20',
                                    lunch_end_time: '11:30',
                                },
                                {
                                    day: 'Thursday',
                                    office_start_time: '09:00',
                                    office_end_time: '18:00',
                                    lunch_start_time: '11:20',
                                    lunch_end_time: '11:30',
                                },
                                {
                                    day: 'Friday',
                                    office_start_time: '09:00',
                                    office_end_time: '18:00',
                                    lunch_start_time: '11:20',
                                    lunch_end_time: '11:30',
                                },
                                {
                                    day: 'Saturday',
                                    office_start_time: '09:00',
                                    office_end_time: '18:00',
                                    lunch_start_time: '11:20',
                                    lunch_end_time: '11:30',
                                },
                                {
                                    day: 'Sunday',
                                    office_start_time: '09:00',
                                    office_end_time: '18:00',
                                    lunch_start_time: '11:20',
                                    lunch_end_time: '11:30',
                                }
                            ]}
                            max={7}
                            template={(item, index) => <FieldArray
                                name="hours"
                                render={({ move, swap, push, insert, unshift, pop, form }) => (
                                    <Grid key={`hours-${index}`} container justify="space-evenly" spacing={16}>
                                        {console.log('item', item)}
                                        <Grid item xs={3}>
                                            <TextField
                                                defaultValue={item.day}
                                                label="Day"
                                                name={`hours[${index}].day`}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                defaultValue={item.office_start_time}
                                                label="Office Start"
                                                name={`hours[${index}].office_start_time`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                defaultValue={item.office_end_time}
                                                label="Office End"
                                                name={`hours[${index}].office_end_time`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                defaultValue={item.lunch_start_time}
                                                label="Lunch Start"
                                                name={`hours[${index}].lunch_start_time`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                defaultValue={item.lunch_end_time}
                                                label="Lunch End"
                                                name={`hours[${index}].lunch_end_time`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            />}
                        />
                    </Grid>
                )
            case 3:
                return (
                    <Grid container justify="space-evenly" style={{padding: 20}} spacing={16}>
                        <RepeatableV2
                            key="services"
                            seed={values.services || [
                                {
                                    name: 'Eye Glasses Exam',
                                    time: 15,
                                    price: '85.00',
                                },
                                {
                                    name: 'Contact Lens + Eye Glasses Exam',
                                    time: 15,
                                    price: '150.00',
                                },
                                {
                                    name: 'Follow-up Exam',
                                    time: 5,
                                    price: '0.00',
                                },
                                {
                                    name: 'Eye Problem Exam',
                                    time: 15,
                                    price: '175.00',
                                },
                            ]}
                            model={{
                                name: '',
                                time: 5,
                                price: '',
                            }}
                            template={(item, index) => <FieldArray
                                name="services"
                                render={({ move, swap, push, insert, unshift, pop, form }) => (
                                    <Grid key={`services-${index}`} container>
                                        {console.log('item', item)}
                                        <Grid item xs={5}>
                                            <TextField
                                                defaultValue={item.name}
                                                label="Name"
                                                name={`services[${index}].name`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl>
                                                <InputLabel shrink htmlFor={`services[${index}].time`}>Duration</InputLabel>
                                                <NativeSelect
                                                    value={item.time}
                                                    onChange={handleChange}
                                                    name={`services[${index}].time`}
                                                    style={{marginTop: 16}}>
                                                    <option value=""></option>
                                                    {times(100, (num) => {
                                                        if (num % item.time == 0) {
                                                            return (<option key={`services-${num}`} value={num}>{`${num} mins`}</option>)
                                                        }
                                                    })}
                                                </NativeSelect>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                defaultValue={item.price}
                                                label="Price"
                                                name={`services[${index}].price`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            />}
                        />
                    </Grid>
                )
            case 4:
                return (
                    <Grid container justify="space-evenly" style={{padding: 20}}>
                        <RepeatableV2
                            key="billing"
                            seed={values.billing || [
                                {
                                    cpt: 92004,
                                    price: '70.00',
                                },
                                {
                                    cpt: 92015,
                                    price: '15.00',
                                },
                                {
                                    cpt: 99204,
                                    price: '175.00',
                                },
                                {
                                    cpt: 92014,
                                    price: '70.00',
                                },
                                {
                                    cpt: 99214,
                                    price: '75.00',
                                },
                                {
                                    cpt: 92310,
                                    price: '70.00',
                                }
                            ]}
                            model={{
                                cpt: '',
                                price: '',
                            }}
                            template={(item, index) => <FieldArray
                                name="billing"
                                render={({ move, swap, push, insert, unshift, pop, form }) => (
                                    <Grid key={`billing-${index}`} container spacing={16}>
                                        <Grid item>
                                            <TextField
                                                defaultValue={item.cpt}
                                                label="CPT"
                                                name={`billing[${index}].cpt`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                defaultValue={item.price}
                                                label="Price"
                                                name={`billing[${index}].price`}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            />}
                        />
                    </Grid>
                )
        }
    }

    render() {
        const { classes } = this.props
        const { steps, activeStep } = this.state

        return (
            <div className={classes.root}>
                {this.renderForm({classes, steps, activeStep})}
            </div>
        )
    }
})