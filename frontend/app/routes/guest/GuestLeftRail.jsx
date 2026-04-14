import React from 'react';
import { NavLink } from 'react-router';

import { ReactComponent as TrendUpIcon } from "../../assets/svg/popular.svg";
import { ReactComponent as  ExploreIcon } from "../../assets/svg/explore.svg";
import { ReactComponent as  HomeIcon } from "../../assets/svg/home.svg";

const GuestLeftRail = () => {
    return (
        <nav className='left-rail' aria-label='Primary Navigation'>
            <div className='left-rail__section'>
                <NavLink to='/' className={({isActive}) => `left-rail__link ${isActive ? "left-rail__link--active" : ""}`}><HomeIcon className="icon-svg--lg" /> <span className="left-rail__link-label">Home</span> </NavLink>

                <NavLink to='/popular' className={({isActive}) => `left-rail__link ${isActive ? "left-rail__link--active" : ""}`}><TrendUpIcon className="icon-svg--lg" /> <span className='left-rail__link-label'>Popular</span> </NavLink>
                <NavLink to='/explore' className={({isActive}) => `left-rail__link ${isActive ? "left-rail__link--active" : ""}`}><ExploreIcon className="icon-svg--lg"/><span className="left-rail__link-label">Explore</span> </NavLink>
            </div>
        </nav>
    );
}

export default GuestLeftRail;
