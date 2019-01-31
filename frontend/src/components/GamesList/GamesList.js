import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import GameCard from './GameCard/GameCard';

import classes from './GamesList.module.scss';

class GamesList extends Component {
    static propTypes = {
        games: PropTypes.shape({
            name: PropTypes.string,
            logo: PropTypes.string,
        }).isRequired,
        uniqueKey: PropTypes.string.isRequired,
        userCount: PropTypes.number.isRequired,
        intersection: PropTypes.arrayOf(PropTypes.string).isRequired,
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.userCount + nextProps.userCount <= 3) {
            return nextProps.userCount !== this.props.userCount;
        } else {
            return (
                nextProps.intersection.length !==
                    this.props.intersection.length ||
                !nextProps.intersection.every(
                    (v, i) => v === this.props.intersection[i]
                )
            );
        }
    }

    render() {
        let content = null;

        if (this.props.userCount === 0) {
            content = (
                <div className={classes.Placeholder}>
                    Start by adding a user.
                </div>
            );
        } else if (this.props.userCount === 1) {
            content = (
                <div className={classes.Placeholder}>
                    Add another user to see the list of common multiplayer
                    games.
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
        games: state.games,
        userCount: state.users.filter(user => user.steamId !== undefined)
            .length,
        uniqueKey: state.users.map(user => user.steamId || '').join(''),
        intersection: state.intersection,
    };
};

export default connect(mapStateToProps)(GamesList);
