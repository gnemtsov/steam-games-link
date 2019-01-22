import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actionTypes';

import classes from './ErrorBoundary.module.scss';

/*
ErrorBoundary is used to catch errors in sync code. 
In development errors are reported in the browser by React itself.
In production we show a popup to the user and send information about errors to developers.

Errors in async code are catched by individual try/catch blocks.
Ajax errors are catched (globaly) by axios interseptor, which is set up in the App component.
*/

class ErrorBoundary extends Component {
    static propTypes = {
        showError: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = { caught: false };
    }

    componentDidCatch(error, info) {
        this.setState({ caught: true });

        if (process.env.NODE_ENV === 'production') {
            this.props.showError('Something went wrong!');
            //TODO report errors to developers
        }
    }

    render() {
        if (this.state.caught) {
            return <div className={classes.BrokenComponent}>Broken :(</div>;
        }

        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showError: errorMessage =>
            dispatch({
                type: actionTypes.R_SHOW_ERROR,
                payload: { errorMessage },
            }),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(ErrorBoundary);
