import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import ErrorBoundary from '../../hoc/ErrorBoundary/ErrorBoundary';
import * as actionTypes from '../../store/actionTypes';

import UserAdd from './UserAdd/UserAdd';
import UserCard from './UserCard/UserCard';

import classes from './UsersList.module.scss';

const UsersList = props => (
    <header className={classes.Container}>
        <div className={classes.Controls}>
            <h1 className={classes.Title}>{props.title}</h1>
            <ErrorBoundary>
                <UserAdd
                    isLoading={props.isMPGamesStaled || props.isUserLoading}
                    submitHandler={props.userAdd}
                />
            </ErrorBoundary>
        </div>
        <TransitionGroup className={classes.List}>
            {Object.keys(props.users).map((steamId, i) => {
                const user = props.users[steamId];
                const tabIndex = 10 + i;
                return (
                    <CSSTransition
                        key={steamId}
                        timeout={500}
                        classNames="fade"
                    >
                        <ErrorBoundary>
                            <UserCard
                                name={user.name}
                                realName={user.realName}
                                avatar={user.avatar}
                                tabIndex={tabIndex}
                                clickHandler={() => props.userDelete(steamId)}
                            />
                        </ErrorBoundary>
                    </CSSTransition>
                );
            })}
        </TransitionGroup>
    </header>
);

UsersList.defaultProps = {
    title: 'Steam Games Link',
};

UsersList.propTypes = {
    title: PropTypes.string,
    isMPGamesStaled: PropTypes.bool.isRequired,
    isUserLoading: PropTypes.bool.isRequired,
    users: PropTypes.shape({
        steamId: PropTypes.string,
        name: PropTypes.string,
        realName: PropTypes.string,
        avatar: PropTypes.string,
        games: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    userAdd: PropTypes.func.isRequired,
    userDelete: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        isMPGamesStaled: state.isMPGamesStaled,
        isUserLoading: state.isUserLoading,
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
        userDelete: steamId =>
            dispatch({
                type: actionTypes.S_USER_DELETE,
                payload: { steamId },
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersList);
