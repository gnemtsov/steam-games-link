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

    let cardClasses = [classes.Container];
    let vanityurlClasses = [classes.Vanityurl];
    let avatar = (
        <img className={classes.Avatar} src={props.avatar} alt={props.name} />
    );

    if (props.isLoading) {
        cardClasses.push(classes.Loading);
        vanityurlClasses.push(classes.Name);
        avatar = <Spinner />;
    }

    if (props.errorMessage) {
        cardClasses.push(classes.Failed);
        avatar = <Spinner freeze />;
    }

    if (props.shake) {
        cardClasses.push(classes.Shake);
    }

    return (
        <div
            className={cardClasses.join(' ')}
            tabIndex="0"
            onFocus={() => removeRef.current.focus()}
        >
            <div key="avatar-container" className={classes.AvatarContainer}>
                {avatar}
            </div>
            <div key="names-container" className={classes.NamesContainer}>
                <div className={classes.Name} title={props.name}>
                    {props.name}
                </div>
                <div
                    className={classes.ErrorMessage}
                    title={props.errorMessage}
                >
                    {props.errorMessage}
                </div>
                <div
                    className={vanityurlClasses.join(' ')}
                    title={props.vanityurl}
                >
                    {props.vanityurl}
                </div>
            </div>
            <button
                key="remove"
                className={classes.Remove}
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
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    name: PropTypes.string,
    avatar: PropTypes.string,
    clickHandler: PropTypes.func.isRequired,
};

export default React.memo(UserCard);
