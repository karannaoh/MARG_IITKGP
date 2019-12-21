import React from 'react';
import Modal from 'react-modal';
import ReactSlider from 'react-slider';
import * as Icon from 'react-feather';
import DatePicker from 'react-datepicker';
import axios from 'axios';

import 'react-datepicker/dist/react-datepicker.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export default class ModalForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      report: props.report,
      date: new Date(),
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

  handleChange = date => {
    this.setState({
      date: date
    });
  };

  approveReport = () => {
    let { report } = this.state;
    report.approval = 1;
    this.setState(report);
    axios
      .post('https://margkgp.westindia.cloudapp.azure.com/api/approve_status', {
        id: this.state.report.id,
        status: 1
      })
      .then(resp => {
        console.log(resp);
      });
  };

  rejectReport = () => {
    let { report } = this.state;
    report.approval = -1;
    this.setState(report);
    axios
      .post('https://margkgp.westindia.cloudapp.azure.com/api/approve_status', {
        id: this.state.report.id,
        status: -1
      })
      .then(resp => {
        console.log(resp);
        this.closeModal();
        this.props.refreshData();
      });
  };

  handleSave = () => {
    let slider = document
      .querySelectorAll("div[role='slider']")[0]
      .getAttribute('aria-valuenow');
    axios
      .post(
        'https://margkgp.westindia.cloudapp.azure.com/api/progress_update',
        {
          id: this.state.report.id,
          progress: slider
        }
      )
      .then(resp => {
        console.log(resp);
      });
    this.closeModal();
  };

  // let rep = {
  //   _id: {
  //     $oid: '5dfc999df421c41c8be714ed'
  //   },
  //   id: 1,
  //   user: 'Karan',
  //   imagefile: 'https://i.imgur.com/TWk0WDN.jpg',
  //   text: 'This is the state of the road since a few months now. Dissapointing!',
  //   location: ['29.8543', '77.8880'],
  //   progress: 10,
  //   approval: 1,
  //   approvedBy: 'Parth'
  // };

  render() {
    let { report } = this.state;
    return (
      <div>
        <div className='report' onClick={this.openModal}>
          <img src={report.imagefile} alt='' />
          <div className='info'>
            <h1>{report.user}</h1>
            <p>{report.text}</p>
            {report.approval === 1 ? (
              ''
            ) : (
              <span className='tag is-warning'>Pending</span>
            )}{' '}
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel='Example Modal'
        >
          <h2 ref={subtitle => (this.subtitle = subtitle)}></h2>
          <button className='close' onClick={this.closeModal}>
            <Icon.XCircle></Icon.XCircle>
          </button>
          <div className='rep'>
            <img src={report.imagefile} alt='' />
            <div className='info'>
              <h1>
                {report.user}{' '}
                {report.approval === 1 ? (
                  <span className='tag is-success'>Approved</span>
                ) : (
                  ''
                )}{' '}
              </h1>
              <p>{report.text}</p>

              <p>
                Latitude: <b>{report.location[0]}</b> Longtitude :{' '}
                <b>{report.location[1]}</b>
              </p>
              <h2>
                Assign Date{'   '}
                <DatePicker
                  selected={this.state.date}
                  onChange={this.handleChange}
                />
              </h2>
              <h2>Progress</h2>
              <ReactSlider
                className='horizontal-slider'
                thumbClassName='thumb'
                trackClassName='track'
                defaultValue={report.progress || 0}
                renderThumb={(props, state) => {
                  console.log(state);
                  report.progress = state.valueNow;
                  return <div {...props}>{state.valueNow}</div>;
                }}
              />

              <textarea placeholder='Write Feedback'></textarea>

              <br />

              <button className='save button is-link' onClick={this.handleSave}>
                <Icon.Save className='icon'></Icon.Save>
                Save
              </button>
              <button
                className='save button is-light'
                onClick={this.handleSave}
              >
                <Icon.Send className='icon'></Icon.Send>
                Send Feedback
              </button>

              {report.approval === 0 ? (
                <span>
                  <button
                    className='approve button is-light is-success'
                    onClick={this.approveReport}
                  >
                    <Icon.Check className='icon'></Icon.Check>
                    Approve
                  </button>

                  <button
                    className='reject button is-light is-danger'
                    onClick={this.rejectReport}
                  >
                    <Icon.X className='icon'></Icon.X>
                    Approve
                  </button>
                </span>
              ) : (
                ''
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
