import React from 'react';
import './Table.css';
import numeral from 'numeral';

const Table = (props) => {
  return (
    <div className="table">
      <table>
        <thead></thead>
        <tbody>
          {props.countries.map(({ country, cases }) => (
            <tr key={country}>
              <td>{country}</td>
              <td>
                <strong>{numeral(cases).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  )
}

export default Table
