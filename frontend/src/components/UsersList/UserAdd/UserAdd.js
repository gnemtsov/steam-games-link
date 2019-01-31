import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './UserAdd.module.scss';

class UserAdd extends Component {
    static propTypes = {
        submitHandler: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: '', //value of input
            submitValue: '', //value to send to the back-end
            tip: false, //show tip under the input field?
            tipHighlightUrl: false, //is value parsed as an url?
        };

        this.inputRef = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.inputRef.current.focus();
    }

    handleChange(event) {
        const { value } = event.target;
        const regExp = /steamcommunity\.com\/id\/([^/]+)$/i;
        const match = regExp.exec(value);

        this.setState({
            value,
            submitValue: match === null ? value : match[1],
            tip: value !== '',
            tipHighlightUrl: match !== null,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { submitValue } = this.state;

        this.props.submitHandler(submitValue);

        this.inputRef.current.focus();

        this.setState({
            value: '',
            submitValue: '',
            tip: false,
            tipHighlightUrl: false,
        });
    }

    render() {
        let tipClasses = [classes.Tip];
        if (this.state.tip) {
            tipClasses.push(classes.Show);
        }

        return (
            <form className={classes.Container} onSubmit={this.handleSubmit}>
                <div className={classes.InputContainer}>
                    <input
                        type="text"
                        className={classes.Input}
                        ref={this.inputRef}
                        tabIndex="1"
                        value={this.state.value}
                        placeholder="Username or Steam community url"
                        onChange={this.handleChange}
                    />
                    <div className={tipClasses.join(' ')}>
                        <span
                            className={
                                !this.state.tipHighlightUrl
                                    ? classes.Highlight
                                    : ''
                            }
                        >
                            [username]
                        </span>
                        {' or '}
                        <span
                            className={
                                this.state.tipHighlightUrl
                                    ? classes.Highlight
                                    : ''
                            }
                        >
                            steamcommunity.com/id/[username]
                        </span>
                    </div>
                </div>
                <button
                    type="submit"
                    className={classes.Button}
                    tabIndex="2"
                    disabled={this.state.value === ''}
                >
                    ADD
                </button>
            </form>
        );
    }
}

export default UserAdd;
