import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import axios from 'axios';

import * as actionTypes from './store/actionTypes';
import Popup from './hoc/Popup/Popup';

import UsersList from './components/UsersList/UsersList';
import GamesList from './components/GamesList/GamesList';

class App extends Component {
    static propTypes = {
        errorMessage: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.oneOf([null]),
        ]),
        showError: PropTypes.func.isRequired,
        hideError: PropTypes.func.isRequired,
        loadMultiplayerGames: PropTypes.func.isRequired,
    };

    componentDidMount() {
        //Set up axios interceptor to catch all errors
        //In case of error axios promise will resolve with undefined value
        this.resInterceptor = axios.interceptors.response.use(
            res => res,
            error => {
                if (process.env.NODE_ENV === 'production') {
                    this.props.showError('Something went wrong!');
                    //TODO report errors in production
                } else {
                    this.props.showError(
                        'Error in Ajax request, see console for details!'
                    );
                    if (error.response) {
                        console.log(
                            'The request was made and the server responded with a status code that falls out of the range of 2xx'
                        );
                        console.log('Response', error.response);
                    } else if (error.request) {
                        console.log(
                            'The request was made but no response was received'
                        );
                        console.log('Request', error.request);
                    } else {
                        console.log(
                            'Something happened in setting up the request that triggered an Error'
                        );
                        console.log('Error', error.message);
                    }
                    console.log('Config', error.config);
                }
            }
        );

        //Load multiplayer games from the back-end
        this.props.loadMultiplayerGames();
    }

    componentWillUnmount() {
        //eject interceptor when component is unmounted
        axios.interceptors.response.eject(this.resInterceptor);
    }

    render() {
        let popup = null;
        if (this.props.errorMessage !== null) {
            popup = (
                <Popup title="Error" closeHandler={this.props.hideError}>
                    <div className="classes.ErrorContainer">
                        <span className="classes.ErrorMessage">
                            {this.props.errorMessage}
                        </span>
                    </div>
                </Popup>
            );
        }

        return (
            <React.Fragment>
                {popup}
                <UsersList />
                <GamesList />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        errorMessage: state.errorMessage,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showError: errorMessage =>
            dispatch({
                type: actionTypes.R_SHOW_ERROR,
                payload: { errorMessage },
            }),
        hideError: () =>
            dispatch({
                type: actionTypes.R_HIDE_ERROR,
            }),
        loadMultiplayerGames: () =>
            dispatch({
                type: actionTypes.S_LOAD_MULTIPLAYER_GAMES,
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
