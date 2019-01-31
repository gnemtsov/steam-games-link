import React from 'react';
import PropTypes from 'prop-types';

import classes from './Spinner.module.css';

const Spinner = props => (
    <div
        className={classes.Loader + (props.freeze ? ' ' + classes.Freeze : '')}
    >
        <div />
        <div />
        <div />
        <div />
    </div>
);

Spinner.propTypes = {
    freeze: PropTypes.bool,
};

export default Spinner;
