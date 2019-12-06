import React from 'react';
import './Widget.css';

export const ListWidgets = props => {
  return (
    <div>
      <table align='center'>
        <thead>
          <tr>
            <th>location</th>
            <th>Clouds</th>
            <th>Humidity</th>
            <th>Wind </th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {props.weatherInfo.map(widget => (
            <tr>
              <td>{widget.location}</td>
              <td>{widget.clouds}</td>
              <td>{widget.humidity} %</td>
              <td>{widget.windSpeed} Km/h</td>
              <td><button onClick={() => props.removeWidget(widget.location)}>-</button> </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  );
};
