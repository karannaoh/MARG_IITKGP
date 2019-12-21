import React, { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import axios from 'axios';
import * as Icon from 'react-feather';

import { dataURItoFile } from '../helpers';

import 'react-html5-camera-photo/build/css/index.css';

export default function Upload(props) {
  let [photo, setPhoto] = useState({
    url: undefined
  });

  let [submit, setSubmit] = useState(false);
  let [error, setError] = useState(false);
  let [loading, setLoading] = useState(false);

  function handleTakePhoto(dataUri) {
    setLoading(true);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Client-ID b58fd899ad1c218'
    };
    const d = new FormData();
    let photograph;

    d.append('image', dataURItoFile(dataUri));
    // d.append('type', 'base64');
    axios
      // First post the image to imgur
      .post('https://api.imgur.com/3/image/', d, { headers: headers })
      // Then send the data to the server to be changed
      .then(resp => {
        photograph = resp['data']['data']['link'];
        console.log('URL: ', photograph);
        axios
          .post('https://margkgp.westindia.cloudapp.azure.com/api/verify_img', {
            image: photograph
          })
          .then(resp => {
            if (resp === 'True') {
              setLoading(false);
              setPhoto({
                url: photograph
              });
            } else {
              setError(
                'Oops we could not find the road in your image! Please try again.'
              );
            }
          });
      });
  }
  function handleSubmit() {
    let labels = Array.from(document.getElementsByTagName('label'));
    let labelText = '\n';
    if (labels) {
      labels.forEach(label => {
        if (label.childNodes[1].checked) {
          labelText += ' ☑ ' + label.innerText;
        }
      });
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        axios
          .post('https://margkgp.westindia.cloudapp.azure.com/api/add_rep', {
            image: photo.url,
            name: 'Aditya',
            text: document.getElementById('text').value + labelText,
            location: [position.coords.latitude, position.coords.longitude]
          })
          .then(resp => {
            if (resp.data === 'True') {
              setSubmit(true);
            } else {
              setError('Oops, something bad happened, we are fixing it!');
            }
          });
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }

  return (
    <div className='upload'>
      {!error ? (
        <div className='wrap'>
          {!loading ? (
            <div className='div'>
              {!photo.url ? (
                <div className='camera'>
                  <Camera
                    idealFacingMode='environment'
                    isImageMirror={false}
                    onTakePhoto={dataUri => {
                      handleTakePhoto(dataUri);
                    }}
                    imageType='png'
                  />
                </div>
              ) : (
                <div className='wrapper'>
                  {!submit ? (
                    <div className='form'>
                      <textarea
                        id='text'
                        placeholder='Add some text'
                        type='text'
                      />
                      <label class='container'>
                        Emergency
                        <input type='checkbox' />
                        <span class='checkmark emergency'></span>
                      </label>
                      <label class='container'>
                        Insufficient drainage
                        <input type='checkbox' />
                        <span class='checkmark'></span>
                      </label>
                      <label class='container'>
                        Cracked pavement
                        <input type='checkbox' />
                        <span class='checkmark'></span>
                      </label>
                      <label class='container'>
                        Severe potholes
                        <input type='checkbox' />
                        <span class='checkmark'></span>
                      </label>
                      <label class='container'>
                        Water Bleeding
                        <input type='checkbox' />
                        <span class='checkmark'></span>
                      </label>
                      <label class='container'>
                        Ravelling
                        <input type='checkbox' />
                        <span class='checkmark'></span>
                      </label>
                      <label class='container'>
                        Rutting
                        <input type='checkbox' />
                        <span class='checkmark'></span>
                      </label>
                      <button onClick={handleSubmit}>
                        Submit <Icon.ArrowRight></Icon.ArrowRight>{' '}
                      </button>
                    </div>
                  ) : (
                    <div className='wrapper'>
                      <div className='success notify'>
                        <img src='/illus/success.svg' alt='' />
                        <h1>Report submitted successfully!</h1>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className='loading'>
              <img src='/loading.svg' alt='' />
            </div>
          )}
        </div>
      ) : (
        <div className='wrapper'>
          <div className='error notify'>
            <img src='/illus/error.svg' alt='' />
            <h1>
              Oops we could not find the road in your image! Please try again.
            </h1>
          </div>
        </div>
      )}
      <div className='header'>
        <h1>Make a Report</h1>
      </div>
    </div>
  );
}
