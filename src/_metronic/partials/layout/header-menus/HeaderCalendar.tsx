import { useEffect, useState } from "react";
import { DateRange } from 'react-date-range'

import { addDays,endOfMonth } from 'date-fns'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

interface HeaderCalendarProps {
  onToggle: () => void; // Define the type for onToggle as a function that takes no arguments and returns void
  onUpdateRange: (range: unknown) => void; // Define the type for onUpdateRange similarly
}

const HeaderCalendar = ({onToggle, onUpdateRange}:HeaderCalendarProps) => {
    const [range, setRange] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: 'selection'
        }
      ])
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
      const handleSelect = (item) => {
        setRange([item.selection]);
    
        if (typeof onUpdateRange === 'function') {
          onUpdateRange(item.selection);
        }
    
      };

      useEffect(() => {
        const closeCalendar = () => {
          onToggle();
        };
    
        window.addEventListener('click', closeCalendar);
    
        return () => {
          window.removeEventListener('click', closeCalendar);
        };
      }, [onToggle]);   

      // const currentYear = new Date().getFullYear();
      const maxDate = new Date(); // Get current date
      maxDate.setMonth(new Date().getMonth()); // Set month to current month
      maxDate.setDate(endOfMonth(new Date()).getDate());

      const minDate = new Date(`01/01/2022`);

    

  return (
    <div
      className=" menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg  menu-state-primary w-350px"
      data-kt-menu="true"
      style={{
        background: "#F3F3F3",
        width: "350px",
        gap: "10px",
        padding: "8px 10px 8px 10px",
        boxShadow: "0px 2px 16.600000381469727px 0px #00000026",
        fontWeight: "300",
    }}
    onClick={(e) => e.stopPropagation()}
    >   
        <DateRange
              onChange={handleSelect}
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        ranges={range}
        months={1}
        direction="horizontal"
        className="calendarElement"
        minDate={minDate}
        maxDate={maxDate}
        
          />        
    </div>
  );
};

export default HeaderCalendar;
