import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
    //add class names
    const dayClass = classNames("day-list__item", {
        "day-list__item--selected": props.selected,
        "day-list__item--full": props.spots === 0,
    });

    return (
        <li className={dayClass} onClick={() => props.setDay(props.name)}>
            <h2 className='text--regular'>{props.name}</h2>
            <h3 className='text--light'>{props.spots}</h3>
        </li>
    );
}