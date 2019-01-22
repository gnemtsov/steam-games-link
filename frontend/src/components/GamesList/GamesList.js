import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import GameCard from './GameCard/GameCard';

import classes from './GamesList.module.scss';

const GamesList = props => {
    let placeholder = null;
    let games = [];

    if (props.isCalculating) {
        placeholder = <div className={classes.Placeholder}>Working...</div>;
    } else if (props.userCount === 0) {
        placeholder = (
            <div className={classes.Placeholder}>Start by adding a user.</div>
        );
    } else if (props.userCount === 1) {
        placeholder = (
            <div className={classes.Placeholder}>
                Add another user to see the list of common multiplayer games.
            </div>
        );
    } else if (props.intersection.length > 0) {
        games = props.intersection.map(appId => (
            <CSSTransition key={appId} timeout={500} classNames="fade">
                <GameCard
                    appId={appId}
                    name={props.games[appId].name}
                    logo={props.games[appId].logo}
                />
            </CSSTransition>
        ));
    } else {
        placeholder = (
            <div className={classes.Placeholder}>
                These users don't have any common multiplayer games.
            </div>
        );
    }

    return (
        <main className={classes.Container}>
            {placeholder}
            <TransitionGroup className={classes.List} exit={false}>
                {games}
            </TransitionGroup>
        </main>
    );
};

GamesList.propTypes = {
    games: PropTypes.shape({
        name: PropTypes.string,
        logo: PropTypes.string,
    }).isRequired,
    userCount: PropTypes.number.isRequired,
    intersection: PropTypes.arrayOf(PropTypes.string).isRequired,
    isCalculating: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
    return {
        games: state.games,
        userCount: Object.keys(state.users).length,
        intersection: state.intersection,
        isCalculating: state.isCalculating,
    };
};

export default connect(mapStateToProps)(GamesList);
