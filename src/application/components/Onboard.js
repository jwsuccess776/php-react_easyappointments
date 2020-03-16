import React, { Component } from 'react'
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
import Repeatable from './Repeatable'

import {
    Formik,
    Field,
    connect,
    getIn,
    ErrorMessage,
    FieldArray,
    FormikConsumer,
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

import { zonedTimeToUtc, toDate, format } from 'date-fns-tz'
import { TimePicker } from 'material-ui-pickers'

const styles = theme => ({
    root: {},
})

const ErrMsg = (msg) => (<div className="errors" style={{color: '#ff0000'}}>{msg}</div>)

class Wizard extends Component {
    static Step = ({ children }) => children

    constructor(props) {
        super(props)

        this.state = {
            steps: [],
            step: 0,
            completed: {},
            values: props.initialValues,
        }
    }

    componentDidMount() {
        let { completed } = this.state
        map(this.props.steps, (item, index) => {
            completed[index] = false
            return completed[index]
        })

        this.setState({
            completed,
        })
    }

    next = values => this.setState(state => ({
        step: Math.min(state.step + 1, this.props.children.length - 1),
        values,
    }))

    previous = () => this.setState(state => ({
        step: Math.max(state.step - 1, 0),
    }))

    handleSubmit = (values, form) => {
        const { children, onSubmit, steps } = this.props
        const { step } = this.state
        const isLastStep = step === steps.length - 1
        const activeStep = React.Children.toArray(children)[step]

        let allStepsComplete = true

        // console.log('handleSubmit', step, 'children[step].props', children[step].props, 'validation', children[step].props.validation)
        activeStep.props.validation
            .isValid(values)
            .then(isValid => {

                if (isValid) {
                    this.setState(state => {
                        let completed = state.completed
                        completed[step] = true
                        allStepsComplete = Object.keys(completed).every((k) => completed[k])
                        return ({completed})
                    })
                }

                if ( isLastStep && allStepsComplete ) {
                    return onSubmit(values, form)
                } else if ( ! isLastStep ) {
                    this.next(values)
                }

                form.setTouched({})
                form.setSubmitting(false)
            })
    }

    onStepChange = ({values, activeStep}) => {
        this.setState(state => ({
            step: activeStep,
            values,
        }))
    }

    render() {
        const { children, steps, initialValues } = this.props
        const { step, values, completed } = this.state
        const activeStep = React.Children.toArray(children)[step]
        const isLastStep = step === steps.length - 1

        return (
            <Formik
                initialValues={values}
                enableReinitialize={false}
                onSubmit={this.handleSubmit}
                render={({ values, handleSubmit, isSubmitting, status }) => (
                    <form onSubmit={handleSubmit}>
                        <Stepper
                            completed={completed}
                            activeStep={step}
                            onStepChange={activeStep => this.onStepChange({values, activeStep})}
                            steps={steps} />
                        {status && ! status.ok && <div style={{
                            padding: '5px',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontFamily: 'sans-serif'}}>{status.msg}</div>}

                        {status && status.ok && <div style={{
                            padding: '15px',
                            textAlign: 'center',
                            fontFamily: 'sans-serif'}} dangerouslySetInnerHTML={status} />}

                        { !status && (
                            <>
                                <Card style={{padding: '20px 0'}}>
                                    {activeStep}
                                </Card>
                                <div style={{marginTop: 20}} className="navigation">
                                    <Button disabled={step === 0} onClick={this.previous}>
                                        {'Back'}
                                    </Button>
                                    {!isLastStep && (
                                        <Button variant="contained" color="primary" type="submit">
                                            {'Next Step'}
                                        </Button>
                                    )}
                                    {isLastStep && (
                                        <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                                            {'Create Practice'}
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </form>
                )}
            />
        );
    }
}

const CustomInput = ({
    field,
    form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    children,
    ...props
}) => {
    // console.log('CI:', {...form})
    return (
        <div>
            <TextField {...field} {...props} />
            {/*<ErrorMessage render={ErrMsg} />*/}
        </div>
    )
}

const CustomTime = ({
    field: { value, name },
    form: { setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    children,
    ...props
}) => {
    // console.log('CI:', {...field})
    return (
        <div>
            <TimePicker value={value} onChange={(e) => setFieldValue(name, e)} />
            {/*<ErrorMessage render={ErrMsg} />*/}
        </div>
    )
}

const CustomSelect = ({
    field, // { name, value, onChange, onBlur }
    form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    children,
    ...props
}) => {
    // console.log('CS:', field, form)
    return (
        <FormControl style={{...props}.style}>
            <InputLabel htmlFor={field.name}>{{...props}.label}</InputLabel>
            <NativeSelect {...field} {...props} style={{marginTop: 16}}>
                {children}
            </NativeSelect>
            <ErrorMessage render={ErrMsg} name={field.name} />
        </FormControl>

    )
}

let office_hours = [
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
];

const current_date = new Date()

let office_start_time = new Date()
office_start_time.setHours(9)
office_start_time.setMinutes(0)

let office_end_time = new Date()
office_end_time.setHours(18)
office_end_time.setMinutes(0)

let lunch_start_time = new Date()
lunch_start_time.setHours(11)
lunch_start_time.setMinutes(0)

let lunch_end_time = new Date()
lunch_end_time.setHours(12)
lunch_end_time.setMinutes(0)

office_hours.map((item) => {
    item.office_start_time = office_start_time
    item.office_end_time = office_end_time
    item.lunch_start_time = lunch_start_time
    item.lunch_end_time = lunch_end_time
    return item
})

export default withStyles(styles)(() => (
    <Wizard
        initialValues={{
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            last_name: '',
            practice_name: '',
            practice_phone: '',
            practice_address_1: '',
            practice_city: '',
            practice_state: '',
            practice_zip: '',
            invite_seed: times(5),
            hours: office_hours,
            services: [
                {
                    name: 'Eye Glasses Exam',
                    duration: 15,
                    price: '85.00',
                },
                {
                    name: 'Contact Lens + Eye Glasses Exam',
                    duration: 15,
                    price: '150.00',
                },
                {
                    name: 'Follow-up Exam',
                    duration: 5,
                    price: '0.00',
                },
                {
                    name: 'Eye Problem Exam',
                    duration: 15,
                    price: '175.00',
                },
            ],
            codes: [
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
            ],
        }}
        onSubmit={(values, form) => {
            var url = GlobalVariables.baseUrl + '/index.php/installation/ajax_install'
            //console.log('onSubmit', GlobalVariables, values)
            //console.log('GlobalVariables', GlobalVariables)
            //console.log('POST!!!', values, url)

            jQuery.ajax({
                url: url,
                type: 'POST',
                data: {
                    csrfToken: GlobalVariables.csrfToken,
                    payload: values,
                },
                dataType: 'json'
            })
            .then(res => {
                form.setSubmitting(false)
                form.setStatus({
                    ok: true,
                    __html: `Success! Visit your practice online at <a href="${res}">${res}</a>!`,
                })
            })
            .catch(res => {
                console.log('this is error:', res);
                form.setSubmitting(false)
                form.setStatus({
                    ok: false,
                    msg: 'There was an error processing your request. Please refresh and try again another time.',
                })
            })
        }}
        steps={[
            'Setup Practice',
            'Invite Staff',
            'Office Hours',
            'Services Offered',
            'Billing Codes',
        ]}>
        <Wizard.Step validation={yup.object().shape({
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
        })}>
            <Grid container justify="space-evenly">
                <Grid item xs={5}>
                    <Field name="email" label="Email" fullWidth autoComplete="username" component={CustomInput} />
                    <Field name="password" label="Password" type="password" fullWidth autoComplete="new-password" component={CustomInput} />
                    <Field name="confirm_password" label="Confirm Password" type="password" fullWidth autoComplete="new-password" component={CustomInput} />
                    <Field name="first_name" label="First Name" fullWidth component={CustomInput} />
                    <Field name="last_name" label="Last Name" fullWidth component={CustomInput} />
                </Grid>
                <Grid item xs={5}>
                    <Field name="practice_name" label="Practice Name" fullWidth component={CustomInput} />
                    <Field name="practice_phone" label="Practice Phone" fullWidth component={CustomInput} />
                    <Field name="practice_address_1" label="Practice Address" fullWidth component={CustomInput} />
                    <Field name="practice_city" label="Practice City" style={{width: '50%', float: 'left'}} component={CustomInput} />
                    <Field
                        name="practice_state"
                        label="Practice State"
                        style={{width: '50%'}}
                        input={<Input name="practice_state" id="practice_state" />}
                        component={CustomSelect}>
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
                    </Field>
                    <Field name="practice_zip" label="Practice Zip" style={{width: '50%'}} component={CustomInput} />
                </Grid>
            </Grid>
        </Wizard.Step>
        <Wizard.Step validation={yup.object().shape({
            invites: yup.array().of(
                yup.object().shape({
                    first_name: yup.string(),
                    last_name: yup.string(),
                    email: yup.string().required(),
                    npi: yup.string(),
                    role: yup.string().required(),
                })
            )
        })}>
            <FormikConsumer>
                {({values}) => (
                    <Repeatable
                        key="invites"
                        seed={values.invite_seed}
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
                               <Grid key={`invite-${index}`} container spacing={8} justify="space-evenly" style={{marginLeft: 20}}>
                                   <Grid item xs={3}>
                                       <Field name={`invites[${index}].first_name`} label="First Name" fullWidth component={CustomInput} />
                                   </Grid>
                                   <Grid item xs={3}>
                                       <Field name={`invites[${index}].last_name`} label="Last Name" fullWidth component={CustomInput} />
                                   </Grid>
                                   <Grid item xs={3}>
                                       <Field name={`invites[${index}].email`} label="Email" fullWidth component={CustomInput} />
                                   </Grid>
                                   <Grid item xs={1}>
                                       <Field name={`invites[${index}].npi`} label="NPI" fullWidth component={CustomInput} />
                                   </Grid>
                                   <Grid item xs={2}>
                                       <Field
                                           name={`invites[${index}].role`}
                                           label="Role"
                                           fullWidth
                                           input={<Input name={`invites[${index}].role`}
                                                         id={`invites[${index}].role`} />}
                                           component={CustomSelect}>
                                           <option value=""></option>
                                           <option value="doctor">Doctor</option>
                                           <option value="staff">Staff</option>
                                       </Field>
                                   </Grid>
                               </Grid>
                            )}
                        />}
                    />
                )}
            </FormikConsumer>
        </Wizard.Step>
        <Wizard.Step validation={yup.object().shape({
            hours: yup.array().of(
                yup.object().shape({
                    day: yup.string(),
                    office_start_time: yup.string(),
                    office_end_time: yup.string(),
                    lunch_start_time: yup.string(),
                    lunch_end_time: yup.string(),
                })
            ),
        })}>
            <FormikConsumer>
                {({values}) => (
                    <Repeatable
                        key="hours"
                        seed={values.hours}
                        max={7}
                        template={(item, index) => <FieldArray
                            name="hours"
                            render={({ move, swap, push, insert, unshift, pop, form }) => (
                                <Grid key={`hours-${index}`} container justify="space-evenly" spacing={16}>
                                    <Grid item xs={3}>
                                        <Field name={`hours[${index}].day`} disabled fullWidth component={CustomInput} />
                                    </Grid>
                                    <Grid item xs={2}>
                                       <Field name={`hours[${index}].office_start_time`} label="Office Start" fullWidth component={CustomTime} />
                                    </Grid>
                                    <Grid item xs={2}>
                                       <Field name={`hours[${index}].office_end_time`} label="Office End" fullWidth component={CustomTime} />
                                    </Grid>
                                    <Grid item xs={2}>
                                       <Field name={`hours[${index}].lunch_start_time`} label="Lunch Start" fullWidth component={CustomTime} />
                                    </Grid>
                                    <Grid item xs={2}>
                                       <Field name={`hours[${index}].lunch_end_time`} label="Lunch End" fullWidth component={CustomTime} />
                                    </Grid>
                                </Grid>
                            )}
                        />}
                    />
                )}
            </FormikConsumer>
        </Wizard.Step>
        <Wizard.Step validation={yup.object().shape({
            services: yup.array().of(
                yup.object().shape({
                    name: yup.string().required(),
                    duration: yup.string().required(),
                    price: yup.string(),
                })
            ),
        })}>
            <FormikConsumer>
                {({values}) => (
                    <Repeatable
                        key="services"
                        seed={values.services}
                        model={{
                            name: '',
                            duration: 5,
                            price: '',
                        }}
                        template={(item, index) => <FieldArray
                            name="services"
                            render={({ move, swap, push, insert, unshift, pop, form }) => (
                                <Grid key={`services-${index}`} container justify="space-evenly" style={{marginLeft: 20}} spacing={24}>
                                    <Grid item xs={5}>
                                        <Field name={`services[${index}].name`} label="Name" fullWidth component={CustomInput} />
                                    </Grid>
                                    <Grid item xs={3}>
                                    <Field
                                        name={`services[${index}].duration`}
                                        label="Duration"
                                        fullWidth
                                        input={<Input name={`services[${index}].duration`}
                                        id={`services[${index}].duration`} />}
                                        component={CustomSelect}>
                                           <option value=""></option>
                                           {times(100, (num) => {
                                               if (num % item.duration == 0) {
                                                   return (<option key={`services-${num}`} value={num}>{`${num} mins`}</option>)
                                               }
                                           })}
                                       </Field>
                                   </Grid>
                                   <Grid item xs={4}>
                                    <Field name={`services[${index}].price`} label="Price" fullWidth component={CustomInput} />
                                    </Grid>
                                </Grid>
                           )}
                        />}
                    />
                )}
            </FormikConsumer>
        </Wizard.Step>
        <Wizard.Step validation={yup.object().shape({
            codes: yup.array().of(
                yup.object().shape({
                    cpt: yup.string().required(),
                    price: yup.string(),
                })
            ),
        })}>
            <FormikConsumer>
                {({values}) => (
                    <Repeatable
                        key="codes"
                        seed={values.codes}
                        model={{
                            cpt: '',
                            price: '',
                        }}
                        template={(item, index) => <FieldArray
                            name="codes"
                            render={({ move, swap, push, insert, unshift, pop, form }) => (
                                <Grid key={`codes-${index}`} container spacing={16} justify="space-evenly">
                                    <Grid item>
                                        <Field name={`codes[${index}].cpt`} label="CPT" fullWidth component={CustomInput} />
                                    </Grid>
                                    <Grid item>
                                        <Field name={`codes[${index}].price`} label="Price" fullWidth component={CustomInput} />
                                    </Grid>
                                </Grid>
                            )}
                        />}
                    />
                )}
            </FormikConsumer>
        </Wizard.Step>
        {/*<Wizard.Step>*/}
            {/*<FormikConsumer>*/}
                {/*{({values}) => (*/}
                    {/*<>*/}
                        {/*<h1>You made it</h1>*/}
                        {/*{console.log('values', values)}*/}
                    {/*</>*/}
                {/*)}*/}
            {/*</FormikConsumer>*/}
        {/*</Wizard.Step>*/}
    </Wizard>
))