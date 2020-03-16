import React, { Component } from 'react'

import {
    Stepper,
    Step,
    StepButton,
} from '@material-ui/core'

import { map, isFunction } from 'lodash'

export default class extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeStep: 0,
            completed: props.completed
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.activeStep !== this.props.activeStep) {
            this.setState({ activeStep: nextProps.activeStep })
        }
    }
    totalSteps = () => {
        return this.props.steps.length
    }
    onStepChange = activeStep => () => {
        this.setState({ activeStep })

        if ( this.props.onStepChange && isFunction(this.props.onStepChange)) {
            this.props.onStepChange(activeStep)
        }
    }
    handleNext = () => {
        let activeStep

        if (this.isLastStep() && !this.allStepsCompleted()) {
            // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            const steps = this.props.steps
            activeStep = steps.findIndex((step, i) => !(i in this.state.completed))
        } else {
            activeStep = this.state.activeStep + 1
        }
        this.setState({activeStep})
    }
    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }))
    }
    handleComplete = () => {
        const { completed } = this.props
        completed[this.state.activeStep] = true
        this.setState({completed})
        this.handleNext()
    }
    handleReset = () => {
        this.setState({
            activeStep: 0,
            completed: {},
        })
    }
    completedSteps() {
        return Object.keys(this.state.completed).length
    }
    isLastStep() {
        return this.state.activeStep === this.totalSteps() - 1
    }
    allStepsCompleted() {
        return this.completedSteps() === this.totalSteps()
    }

    render() {
        const { steps, activeStep, completed = {} } = this.props

        return (
            <Stepper nonLinear activeStep={activeStep}>
                {map(steps, (label, index) => (
                    <Step key={label}>
                        <StepButton
                            onClick={this.onStepChange(index)}
                            completed={completed[index]}
                        >{label}</StepButton>
                    </Step>
                ))}
            </Stepper>
        )
    }
}