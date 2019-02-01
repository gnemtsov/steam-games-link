import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import ErrorBoundary from '../../hoc/ErrorBoundary/ErrorBoundary';
import * as actionTypes from '../../store/actionTypes';

import UserAdd from './UserAdd/UserAdd';
import UserCard from './UserCard/UserCard';

import classes from './UsersList.module.scss';

class UsersList extends Component {
    static defaultProps = {
        title: 'Steam Games Link',
    };

    static propTypes = {
        title: PropTypes.string,
        users: PropTypes.arrayOf(
            PropTypes.shape({
                steamId: PropTypes.string,
                vanityurl: PropTypes.string,
                isLoading: PropTypes.bool,
                name: PropTypes.string,
                realName: PropTypes.string,
                avatar: PropTypes.string,
                games: PropTypes.arrayOf(PropTypes.string),
            })
        ).isRequired,
        userAdd: PropTypes.func.isRequired,
        userDelete: PropTypes.func.isRequired,
    };

    state = {
        shakingUsers: [], //users, who were added twice [{vanityurl, timerId}...]
    };

    componentWillUnmount() {
        this.state.shakingUsers.forEach(({ timerId }) => clearTimeout(timerId));
    }

    addShakingUser = vanityurl => {
        this.setState(state => {
            const shakingUsers = state.shakingUsers.filter(
                user => user.vanityurl !== vanityurl
            );

            const timerId = setTimeout(() => {
                this.removeShakingUser(vanityurl);
            }, 1000);

            shakingUsers.push({ vanityurl, timerId });

            return { shakingUsers };
        });
    };

    removeShakingUser = vanityurl => {
        this.setState(state => {
            return {
                shakingUsers: state.shakingUsers.filter(
                    user => user.vanityurl !== vanityurl
                ),
            };
        });
    };

    handleUserAdd = vanityurl => {
        const userExists = this.props.users
            .map(({ vanityurl }) => vanityurl)
            .includes(vanityurl);

        if (userExists) {
            this.addShakingUser(vanityurl);
        } else {
            this.props.userAdd(vanityurl);
        }
    };

    render() {
        return (
            <header className={classes.Container}>
                <div className={classes.Controls}>
                    <h1 className={classes.Title}>{this.props.title}</h1>
                    <ErrorBoundary>
                        <UserAdd submitHandler={this.handleUserAdd} />
                    </ErrorBoundary>
                </div>
                <TransitionGroup className={classes.List}>
                    {this.props.users.map((user, i) => {
                        const shake = this.state.shakingUsers
                            .map(({ vanityurl }) => vanityurl)
                            .includes(user.vanityurl);

                        return (
                            <CSSTransition
                                key={user.vanityurl}
                                timeout={500}
                                enter={false}
                                classNames="fade"
                            >
                                <ErrorBoundary>
                                    <UserCard
                                        {...user}
                                        shake={shake}
                                        clickHandler={() =>
                                            this.props.userDelete(i)
                                        }
                                    />
                                </ErrorBoundary>
                            </CSSTransition>
                        );
                    })}
                </TransitionGroup>
            </header>
        );
    }
}

const mapStateToProps = state => {
    return {
        users: state.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userAdd: vanityurl =>
            dispatch({
                type: actionTypes.S_USER_ADD,
                payload: { vanityurl },
            }),
        userDelete: i =>
            dispatch({
                type: actionTypes.S_USER_DELETE,
                payload: { index: i },
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersList);
