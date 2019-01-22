import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './UserAdd.module.scss';

class UserAdd extends Component {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        submitHandler: PropTypes.func.isRequired,
    };

    static getDerivedStateFromProps(props, state) {
        if (!props.isLoading && state.wasLoading) {
            //reset and focus input field after user finished loading
            return { shouldFocus: true, wasLoading: false, inputValue: '' };
        }

        return { wasLoading: props.isLoading };
    }

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '', //value of input
            parsedValue: '', //parsed value of input (vanityurl API param)
            errorMessage: '', //input validation error message
            wasLoading: false, //was loading on previous component update?
            shouldFocus: false, //input should be focused after user was added
        };

        this.inputRef = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.inputRef.current.focus();
    }

    componentDidUpdate(prevProps) {
        if (this.state.shouldFocus) {
            this.inputRef.current.focus();
            this.setState({ shouldFocus: false });
        }
    }

    handleChange(event) {
        const { value } = event.target;
        const regExp = /^https:\/\/steamcommunity\.com\/id\/([^/]+)$/i;
        const match = regExp.exec(value);

        if (match === null) {
            this.setState({
                inputValue: value,
                parsedValue: '',
                errorMessage:
                    'URL format - https://steamcommunity.com/id/[username]',
            });
        } else {
            this.setState({
                inputValue: value,
                parsedValue: match[1],
                errorMessage: '',
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.submitHandler(this.state.parsedValue);
        this.setState({ parsedValue: '' });
    }

    render() {
        let inputContainerClasses = [classes.InputContainer];
        if (this.state.errorMessage !== '') {
            inputContainerClasses.push(classes.Invalid);
        }

        let submitButtonClasses = [classes.Button];
        if (this.props.isLoading) {
            submitButtonClasses.push(classes.Loading);
        }

        return (
            <form className={classes.Container} onSubmit={this.handleSubmit}>
                <div
                    className={inputContainerClasses.join(' ')}
                    data-error-message={this.state.errorMessage}
                >
                    <input
                        type="text"
                        className={classes.Input}
                        ref={this.inputRef}
                        tabIndex="1"
                        value={this.state.inputValue}
                        placeholder="Steam vanity URL"
                        disabled={this.props.isLoading}
                        onChange={this.handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className={submitButtonClasses.join(' ')}
                    tabIndex="2"
                    disabled={
                        this.state.inputValue === '' ||
                        this.state.errorMessage !== '' ||
                        this.props.isLoading
                    }
                >
                    ADD
                </button>
            </form>
        );
    }
}

export default UserAdd;
