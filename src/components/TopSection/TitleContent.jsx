import './style.css';
import React from 'react';
import Data from '../../services/Data';

function GetDate() {
    const date = new Date();
    let currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return <h2 className='TimeSection'>{currentDate}</h2>;
}

function Title() {
    return (
        <div className="TopTitle">
            <h1>This is Title</h1>
            <GetDate />
            <Data  />
        </div>
    );
}

export default Title;
