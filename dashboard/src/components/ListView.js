import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalForm from './ModalForm';

export default function ListView() {
  let [data, setData] = useState(undefined);
  let [em, setEm] = useState(undefined);

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
      setData(result.data);
      // let em = result.data;
      setEm([result.data[0], result.data[1]]);
    })();
  }, []);

  let refreshData = () => {
    (async () => {
      let result = await axios(
        'https://margkgp.westindia.cloudapp.azure.com/api/get_all_reps'
      );

      console.log(result.data);
      result.data = result.data.filter(report => {
        console.log(report.approval);
        return report.approval >= 0;
      });
      setData(result.data);
    })();
  };

  return (
    <div className='list-view'>
      <div className='head'>
        <h1 className='title'>All Reports</h1>
        <h2>Roorkee, India</h2>
      </div>

      <h1 className='header'>Emergency</h1>

      <div className='reports emergency'>
        {em &&
          em.map(report => {
            return (
              <ModalForm report={report} refreshData={refreshData}></ModalForm>
            );
          })}
      </div>

      <h1 className='header'>Reports</h1>
      <div className='reports'>
        {data &&
          data.map(report => {
            return (
              <ModalForm report={report} refreshData={refreshData}></ModalForm>
            );
          })}
      </div>
    </div>
  );
}
