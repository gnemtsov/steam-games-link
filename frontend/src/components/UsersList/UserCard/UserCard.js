import React from 'react';
import PropTypes from 'prop-types';

import classes from './UserCard.module.scss';

const UserCard = props => {
    const onKeyDownHandler = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.currentTarget.click();
        }
    };

    const onTouchEndHandler = event => {
        if (
            !document.hasFocus() ||
            document.activeElement !== event.currentTarget
        ) {
            event.preventDefault();
            event.currentTarget.focus();
        }
    };

    return (
        <button
            className={classes.Container}
            tabIndex={props.tabIndex}
            onClick={props.clickHandler}
            onKeyDown={onKeyDownHandler}
            onTouchEnd={onTouchEndHandler}
        >
            <img
                className={classes.Avatar}
                src={props.avatar}
                alt={props.name}
            />
            <div className={classes.NamesContainer}>
                <div className={classes.Name}>{props.name}</div>
                <div className={classes.RealName}>{props.realName}</div>
            </div>
            <div className={classes.Remove} />
        </button>
    );
};

UserCard.propTypes = {
    name: PropTypes.string.isRequired,
    realName: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    tabIndex: PropTypes.number,
    clickHandler: PropTypes.func.isRequired,
};

export default UserCard;
