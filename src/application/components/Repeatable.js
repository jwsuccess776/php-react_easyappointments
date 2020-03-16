import React, { Component } from 'react'
import _ from 'lodash'

import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'

export default class extends Component {

    addItem = () => this.setState(state => {
        let lastIndex = _.last(state.counter)
        let nextIndex = lastIndex === undefined ? 0 : lastIndex + 1

        return ({
            counter: _.concat(state.counter, nextIndex),
        })
    })

    removeItem = (index) => {
        this.setState(state => ({
            counter: _.pull(state.counter, index)
        }))
    }

    initialSeed(seed = []) {
        // console.log('initialSeed', seed)
        let { counter } = this.state

        // console.log('counter', counter)
        // console.log('seed', seed)

        if ( _.isEmpty(counter) && ! _.isEmpty(seed) ) {
            this.setState({
                counter: _.times(seed.length, (index) => index)
            })
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            counter: [],
        }
    }

    componentDidMount() {
        this.initialSeed(this.props.seed)
    }

    render() {
        let { template = _.noop, seed = [], model = {}, max = 100 } = this.props
        let { counter } = this.state

        // console.log('template, seed, model', template, seed, model)
        // console.log('counter', counter)
        // console.log('max >= counter.length', max >= counter.length)

        return (
            <div style={this.props.style}>
                {_.map(counter, (index) => (
                    <div key={`repeatable-item-${index}`} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap'
                    }}>
                        <div style={{width: '100%'}}>
                            { ! _.isEmpty(seed[index]) && template(seed[index], index)}
                            { _.isEmpty(seed[index]) && template(model, index)}
                        </div>
                        <div style={{
                            alignSelf: 'center',
                            boxSizing: 'border-box',
                            //paddingLeft: '25px',
                            //display: index < this.props.requiredCopies ? 'none' : ''
                        }}>
                            <IconButton onClick={() => this.removeItem(index)}><Delete /></IconButton>
                        </div>
                    </div>
                ))}
                <div style={{textAlign: 'right'}}>
                    <IconButton disabled={max <= counter.length} onClick={this.addItem}><Add /></IconButton>
                </div>
            </div>
        )
    }
}