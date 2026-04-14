import React from 'react';
import { NavLink } from 'react-router';
import "../../styles/components/left-rail.css";

const LeftRail = () => {
    return (
        <nav className='left-rail' aria-label='Primary navigation'>
            <div className='left-rail__section'>
                <div className='left-rail__title'>Main</div>
                <NavLink to="/" className="left-rail__link">Home</NavLink>
            </div>

            <div className='left-rail__section'>
                <NavLink to="/business" className="left-rail__link">Business</NavLink>
            </div>
        </nav>
    );
}

export default LeftRail;
