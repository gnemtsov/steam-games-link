import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import GameCard from './GameCard/GameCard';

import classes from './GamesList.module.scss';

class GamesList extends Component {
    static propTypes = {
        isMPGamesStaled: PropTypes.bool.isRequired,
        games: PropTypes.shape({
            name: PropTypes.string,
            logo: PropTypes.string,
        }).isRequired,
        uniqueKey: PropTypes.string.isRequired,
        userCount: PropTypes.number.isRequired,
        intersection: PropTypes.arrayOf(PropTypes.string).isRequired,
        isCalculating: PropTypes.bool.isRequired,
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !nextProps.isCalculating;
    }

    render() {
        let content = null;

        if (this.props.isMPGamesStaled) {
            content = (
                <div className={classes.Error}>
                    Failed to fetch all multiplayer games list from SteamSpyAPI. Try later.
                </div>
            );
        } else if (this.props.userCount === 0) {
            content = (
                <div className={classes.Placeholder}>
                    Common multiplayer games. Start by adding a user.
                </div>
            );
        } else if (this.props.userCount === 1) {
            content = (
                <div className={classes.Placeholder}>
                    Add another user to see the list of games.
                </div>
            );
        } else if (this.props.intersection.length > 0) {
            content = (
                <div className={classes.List}>
                    {this.props.intersection.map(appId => (
                        <GameCard
                            key={appId}
                            appId={appId}
                            name={this.props.games[appId].name}
                            logo={this.props.games[appId].logo}
                        />
                    ))}
                </div>
            );
        } else {
            content = (
                <div className={classes.Placeholder}>
                    These users don't have any common multiplayer games.
                </div>
            );
        }

        return (
            <main className={classes.Wrapper}>
                <TransitionGroup className={classes.Container}>
                    <CSSTransition
                        key={this.props.uniqueKey}
                        timeout={800}
                        classNames="slide"
                    >
                        <div>{content}</div>
                    </CSSTransition>
                </TransitionGroup>
            </main>
        );
    }
}

const mapStateToProps = state => {
    return {
        isMPGamesStaled: state.isMPGamesStaled,
        games: state.games,
        userCount: state.users.filter(({ steamId }) => steamId !== undefined)
            .length,
        uniqueKey: state.users.map(({ steamId }) => steamId || '').join(''),
        intersection: state.intersection,
        isCalculating: state.isCalculating,
    };
};

export default connect(mapStateToProps)(GamesList);
