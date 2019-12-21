import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Roads() {
  let [data, setData] = useState([
    {
      name: 'Thomasan Marg',
      locality: 'IIT Roorkee',
      reports: 4
    },
    {
      name: 'Hydrology Road',
      locality: 'IIT Roorkee',
      reports: 2
    },
    {
      name: 'Jadugar Road',
      locality: 'Civil Lines',
      reports: 1
    },
    {
      name: 'NH344',
      locality: 'Lal Kurti Cantonement',
      reports: 1
    },
    {
      name: 'Azad Road',
      locality: 'IIT Roorkee',
      reports: 1
    }
  ]);

  // Fetch data from an API and set it using hooks
  useEffect(() => {
    (async () => {
      let result = await axios(
        'https://margkgp.westindia.cloudapp.azure.com/api/get_all_reps'
      );

      console.log(result.data);
      result.data = result.data.filter(report => {
        console.log(report.approval);
        return report.approval >= 0;
      });
      // setData(result.data);
    })();
  }, []);

  return (
    <div className='roads'>
      <div className='head'>
        <h1 className='title'>Roads</h1>
        <h2>Roorkee, India</h2>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>
              <abbr title='Serial Number'>Sr. No.</abbr>
            </th>
            <th>Road Name</th>
            <th>Locality</th>
            <th>No. of Reports</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((road, index) => {
              return (
                <tr>
                  <th>{index + 1}</th>
                  <td>{road.name}</td>
                  <td>{road.locality}</td>
                  <td>{road.reports}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
