import React, { Component } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import awesome from 'font-awesome/css/font-awesome.css';
import styles from './Repeatable.css';

import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'

import { pull, map, concat, toNumber, filter, isEmpty, times, stubObject, fill, isFunction } from 'lodash'

export default class extends Component {
    static defaultProps = {
        initialItems: [],
        requiredCopies: 1,
        render: (index) => [],
        onAdd: () => undefined,
        onRemove: (item, index) => undefined,
        model: {},
        style: {}
    }

    constructor(props) {
        super(props)

        this.state = {
            items: map(Object.keys(props.initialItems), toNumber),
        }
    }

    addItem = () => this.setState(state => ({items: concat(state.items, state.items.length)}))

    removeItem = (item, index) => {
        console.log('removeItem', index)
        let items = [...this.state.items]
        items = pull(items, index)
        this.setState({ items })
        // this.props.onRemove(index);
    }

    renderItem = (item, index) => (
        <div key={`repeatable-item-${index}`} style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
        }}>
            <div style={{width: '100%'}}>
                {this.props.render(item, index)}
            </div>
            <div style={{
                alignSelf: 'center',
                boxSizing: 'border-box',
                paddingLeft: '25px',
                //display: index < this.props.requiredCopies ? 'none' : ''
            }}>
                <IconButton onClick={() => this.removeItem(item, index)}><Delete /></IconButton>
            </div>
        </div>
    )

    render() {
        let { items } = this.state
        let { initialItems } = this.props

        console.log('items', items)
        console.log('initialItems', initialItems)

        return (
            <div style={this.props.style}>
                {items.map((item, index) => {
                    if ( undefined == initialItems[index] ) {
                        return this.renderItem(this.props.model, index)
                    } else {
                        return this.renderItem(initialItems[index], index)
                    }
                })}
                <div style={{textAlign: 'right'}}>
                    <IconButton onClick={this.addItem}><Add /></IconButton>
                </div>
            </div>
        )
    }
}