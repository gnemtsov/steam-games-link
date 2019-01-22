import React from 'react';
import PropTypes from 'prop-types';

import classes from './GameCard.module.scss';

const GameCard = props => (
    <div className={classes.Container}>
        <img
            src={`http://media.steampowered.com/steamcommunity/public/images/apps/${
                props.appId
            }/${props.logo}.jpg`}
            alt=""
        />
        <div className={classes.Name}>{props.name}</div>
    </div>
);

GameCard.propTypes = {
    appId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
};

export default GameCard;
