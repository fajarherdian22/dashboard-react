import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import './style.css';
import "react-datepicker/dist/react-datepicker.css";

function Header() {
const [date, setDate] = useState(new Date())
return (
        <header className="Topheader">
          <h1>This is header</h1>
          <DatePicker selected={date} onChange={(date) => setDate(date)} />
        </header>
    )
};
export default Header;
  