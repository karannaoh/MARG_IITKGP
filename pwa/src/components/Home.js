import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './Map';
import StoryGroup from './Stories';
import { nFormatter } from '../helpers';

export default function Home() {
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

  return (
    <div className='home'>
      <div className='stats'>
        <StoryGroup></StoryGroup>
        <h1 className='thanks'>
          {stats ? (
            <span>
              I contributed{' '}
              <span className='statistics'>
                {nFormatter(stats.total_by_user)}
              </span>{' '}
              reports and helped repair{' '}
              <span className='statistics'>
                {nFormatter(stats.fixed_by_user)}
              </span>{' '}
              roads!
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </h1>

        <div className='details'>
          <div className='total'>
            {stats ? <h1>{nFormatter(stats.total)}</h1> : <h1>⏳</h1>}
            <h2>TOTAL REPORTS</h2>
          </div>
          <div className='solved'>
            {stats ? <h1>{nFormatter(stats.fixed)}</h1> : <h1>⏳</h1>}
            <h2>REPORTS SOLVED</h2>
          </div>
        </div>

        <div className='team'>
          <div className='info'>
            <h2>MARGteam</h2>
            <h1>Street Warriors</h1>
          </div>
          <div className='objectives'>
            <h2>Objectives Completed</h2>
            <h1>3</h1>
          </div>
        </div>
      </div>
      <div className='map'>
        <Map></Map>
      </div>
    </div>
  );
}
