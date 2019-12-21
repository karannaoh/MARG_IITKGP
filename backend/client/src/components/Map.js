import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

export default function Map() {
  let [data, setData] = useState({});

  // Fetch data from an API and set it using hooks
  useEffect(() => {
    (async () => {
      const result = await axios('http://localhost:5000/map/dash');
      let mapjs = JSON.parse(result.data.graphJSON);

      console.log(mapjs);
      setData(mapjs[0]);
    })();
  }, []);
  return (
    <div className='map'>
      {data ? (
        <div className='Map'>
          <Plot data={data.data} layout={data.layout} />
        </div>
      ) : (
        'LOADING...'
      )}
    </div>
  );
}
