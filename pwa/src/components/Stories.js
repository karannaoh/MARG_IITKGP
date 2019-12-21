import React, { useState, useCallback } from 'react';
import * as Icon from 'react-feather';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import Lightbox from 'react-image-lightbox';

export default class StoryGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false,
      stories: [
        {
          profile: 'https://i.imgur.com/UltvPpO.jpg',
          name: 'Aditya',
          gif: '/gif/unnamed.gif'
        },
        {
          profile: 'https://i.imgur.com/FiAgFl0.jpg',
          name: 'Karan',
          gif: '/gif/unnamed.gif'
        },
        {
          profile: 'https://i.imgur.com/rOvXM5G.jpg',
          name: 'Anshu',
          gif: '/gif/unnamed.gif'
        }
      ],
      images: ['/gif/unnamed.gif', '/gif/unnamed.gif', '/gif/unnamed.gif']
    };
  }

  render() {
    const { photoIndex, isOpen, images, stories } = this.state;
    return (
      <div className='stories'>
        <h1 className='story-t'>Spotlight</h1>
        <div className='story-group'>
          {stories.map((story, index) => {
            return (
              <div
                className='story-button'
                onClick={() => {
                  this.setState({ isOpen: true, photoIndex: index });
                }}
              >
                <img src={story.profile} className='profile' alt='' />
                <h1 className='title'>
                  {' '}
                  <span className={`pos pos-${index}`}>
                    {index + 1} <span className='text-name'>{story.name}</span>
                  </span>
                </h1>
              </div>
            );
          })}
          {isOpen && (
            <Lightbox
              enableZoom={false}
              mainSrc={images[photoIndex]}
              nextSrc={images[(photoIndex + 1) % images.length]}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]}
              onCloseRequest={() => this.setState({ isOpen: false })}
              onMovePrevRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + images.length - 1) % images.length
                })
              }
              onMoveNextRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + 1) % images.length
                })
              }
            />
          )}
        </div>
      </div>
    );
  }
}
