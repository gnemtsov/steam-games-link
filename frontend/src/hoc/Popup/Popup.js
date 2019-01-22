import React from 'react';
import PropTypes from 'prop-types';

import Backdrop from './Backdrop/Backdrop';
import classes from './Popup.module.scss';

const Popup = props => {
    return (
        <React.Fragment>
            <div
                className={classes.Popup}
                role="dialog"
                aria-modal="true"
                onKeyDown={e => e.keyCode === 27 && props.closeHandler(e)}
            >
                <header className={classes.PopupHeader}>
                    <div className={classes.PopupTitle}>{props.title}</div>
                    <button
                        type="button"
                        className={classes.Close}
                        onClick={props.closeHandler}
                    />
                </header>
                <div className={classes.PopupBody}>{props.children}</div>
            </div>
            <Backdrop show clickHandler={props.closeHandler} />
        </React.Fragment>
    );
};

Popup.defaultProps = {
    title: 'Popup',
};

Popup.propTypes = {
    title: PropTypes.string,
    closeHandler: PropTypes.func.isRequired,
};

export default Popup;
