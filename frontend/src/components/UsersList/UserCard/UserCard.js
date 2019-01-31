import React from 'react';
import PropTypes from 'prop-types';

import Spinner from './Spinner/Spinner';
import classes from './UserCard.module.scss';

const UserCard = props => {
    const removeRef = React.createRef();

    const onKeyDownHandler = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.currentTarget.click();
        }
    };

    const onTouchEndHandler = event => {
        if (
            !document.hasFocus() ||
            document.activeElement !== removeRef.current
        ) {
            event.preventDefault();
            removeRef.current.focus();
        }
    };

    let cardClasses = [classes.Container];
    let vanityurlClasses = [classes.Vanityurl];
    let avatar = (
        <img className={classes.Avatar} src={props.avatar} alt={props.name} />
    );
    if (props.isLoading) {
        cardClasses.push(classes.Loading);
        vanityurlClasses.push(classes.Name);
        avatar = <Spinner />;
    } else if (props.shake) {
        cardClasses.push(classes.Shake);
    }

    return (
        <div className={cardClasses.join(' ')} onTouchEnd={onTouchEndHandler}>
            <div key="avatar-container" className={classes.AvatarContainer}>
                {avatar}
            </div>
            <div key="names-container" className={classes.NamesContainer}>
                <div className={classes.Name}>{props.name}</div>
                <div className={vanityurlClasses.join(' ')}>
                    {props.vanityurl}
                </div>
            </div>
            <button
                key="remove"
                className={classes.Remove}
                tabIndex={props.tabIndex}
                ref={removeRef}
                onClick={props.clickHandler}
                onKeyDown={onKeyDownHandler}
            />
        </div>
    );
};

UserCard.propTypes = {
    steamId: PropTypes.string,
    vanityurl: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    name: PropTypes.string,
    avatar: PropTypes.string,
    tabIndex: PropTypes.number,
    clickHandler: PropTypes.func.isRequired,
};

export default React.memo(UserCard);
