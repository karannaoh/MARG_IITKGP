import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { nFormatter } from '../helpers';

export default function Profile(props) {
  let [user, setUser] = useState(undefined);

  // Fetch data from an API and set it using hooks
  useEffect(() => {
    (async () => {
      const result = await axios(
        'https://margkgp.westindia.cloudapp.azure.com/api/get_user'
      );
      setUser(result.data);
      console.log(result.data);
    })();
  }, []);

  let [reports, setReports] = useState(undefined);

  // Fetch data from an API and set it using hooks
  useEffect(() => {
    (async () => {
      const result = await axios(
        'https://margkgp.westindia.cloudapp.azure.com/api/get_rep_user'
      );
      setReports(result.data);
      console.log(result.data);
    })();
  }, []);

  let [stats, setStats] = useState(undefined);

  // Fetch data from an API and set it using hooks
  useEffect(() => {
    (async () => {
      const result = await axios(
        'https://margkgp.westindia.cloudapp.azure.com/api/get_stat'
      );
      setStats(result.data);
      // console.log(result.data);
    })();
  }, []);

  const data = {
    user: {
      username: 'xypnox',
      name: 'Aditya Vikram Singh',
      city: 'Roorkee',
      photo: 'https://i.imgur.com/sOoo4Ny.png',
      stats: [23, 17]
    },
    reports: [
      {
        id: { $numberInt: '1' },
        user: 'Karan',
        imagefile: 'https://i.imgur.com/TWk0WDN.jpg',
        text:
          'This is the state of the road since a few months now. Dissapointing!',
        location: 'Roorkee',
        progress: { $numberInt: '10' },
        approval: { $numberInt: '1' },
        approvedBy: 'Parth'
      },
      {
        id: { $numberInt: '1' },
        user: 'Karan',
        imagefile: 'https://i.imgur.com/TWk0WDN.jpg',
        text:
          'This is the state of the road since a few months now. Dissapointing!',
        location: 'Roorkee',
        progress: { $numberInt: '10' },
        approval: { $numberInt: '1' },
        approvedBy: 'Parth'
      },
      {
        id: { $numberInt: '1' },
        user: 'Karan',
        imagefile: 'https://i.imgur.com/TWk0WDN.jpg',
        text:
          'This is the state of the road since a few months now. Dissapointing!',
        location: 'Roorkee',
        progress: { $numberInt: '10' },
        approval: { $numberInt: '1' },
        approvedBy: 'Parth'
      },
      {
        id: { $numberInt: '1' },
        user: 'Karan',
        imagefile: 'https://i.imgur.com/TWk0WDN.jpg',
        text:
          'This is the state of the road since a few months now. Dissapointing!',
        location: 'Roorkee',
        progress: { $numberInt: '10' },
        approval: { $numberInt: '1' },
        approvedBy: 'Parth'
      },
      {
        id: { $numberInt: '1' },
        user: 'Karan',
        imagefile: 'https://i.imgur.com/TWk0WDN.jpg',
        text:
          'This is the state of the road since a few months now. Dissapointing!',
        location: 'Roorkee',
        progress: { $numberInt: '10' },
        approval: { $numberInt: '1' },
        approvedBy: 'Parth'
      },
      {
        id: { $numberInt: '1' },
        user: 'Karan',
        imagefile: 'https://i.imgur.com/TWk0WDN.jpg',
        text:
          'This is the state of the road since a few months now. Dissapointing!',
        location: 'Roorkee',
        progress: { $numberInt: '10' },
        approval: { $numberInt: '1' },
        approvedBy: 'Parth'
      }
    ]
  };
  return (
    <div className='profile'>
      <div className='user-details'>
        {user ? (
          <div>
            <div className='photo'>
              <img src={data.user.photo} alt='' />
            </div>
            <h1>{user.name}</h1>
            <h2>{user.city}</h2>
          </div>
        ) : (
          <div>
            <h1>Loading</h1>
          </div>
        )}
        <div className='details'>
          <div className='total'>
            {stats ? <h1>{nFormatter(stats.total_by_user)}</h1> : <h1>⏳</h1>}
            <h2>REPORTS FILED</h2>
          </div>
          <div className='solved'>
            {stats ? <h1>{nFormatter(stats.fixed_by_user)}</h1> : <h1>⏳</h1>}
            <h2>REPORTS SOLVED</h2>
          </div>
        </div>
        <h1>Reports</h1>
      </div>

      <div className='reports'>
        {reports &&
          reports.map(report => {
            return (
              <div className='report'>
                <img src={report.imagefile} alt='' />
                <div className='info'>
                  <h1>Roorkee</h1>
                  <p>{report.text}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
