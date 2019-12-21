import React from 'react';
import Modal from 'react-modal';
import * as Icon from 'react-feather';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export default class ModalForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div
        className='maps'
        onClick={() => {
          console.log('OOOO');
          if (!this.state.modalIsOpen) {
            this.openModal();
          }
        }}
      >
        <img
          src='https://i.imgur.com/rMsm0L3.jpg'
          className='smallmap'
          alt=''
        />

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel='LargeMap'
        >
          <h2 ref={subtitle => (this.subtitle = subtitle)}></h2>
          <iframe
            src='https://margkgp.westindia.cloudapp.azure.com/map3'
            frameborder='0'
            title='largeMap'
            height={1400}
            width={1000}
          ></iframe>
          <button
            className='close'
            onClick={() => {
              this.closeModal();
            }}
          >
            <Icon.XCircle size='40'></Icon.XCircle>
          </button>
        </Modal>
      </div>
    );
  }
}
