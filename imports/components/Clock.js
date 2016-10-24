import React from 'react';
import { Meteor } from 'meteor/meteor';

class Clock extends React.Component {
  constructor(props) {
    super(props)
    var time = 0;

    this.state = { 
      seconds: 0,
      minutes: 0,
      printable: '0:00',
    };
  }

  startClock() {
    // console.log('this', this);
    console.log('in startClock')
    // setInterval(
    //   this.setState({
    //     time: this.state.time + 1
    //   }).bind(this), 1000)
    setInterval(this.timerTick.bind(this), 1000);
    // console.log(this.state.time);
  }

  timerTick() {
    var secs = this.state.seconds + 1;
    var mins = this.state.minutes;
    if (secs === 60) {
      secs = 0;
      mins ++;
    }

    var print = secs < 10 ? '0' + secs: '' + secs;
    print = mins + ':' + print;
    
    this.setState({
      seconds: secs,
      minutes: mins,
      printable: print
    })
  }

  render() {
    return (
      <div className='clock'>
        <button onClick={this.startClock.bind(this)}> Start timer </button>
        <h1> {this.state.printable} </h1>
      </div>
    )
  }
}

export default Clock;