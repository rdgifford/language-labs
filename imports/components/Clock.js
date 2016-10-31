import React from 'react';

class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      seconds: 0,
      minutes: 0,
      printable: '0:00',
      language: 'japanese',
      timerUnused: true,
      partner: false
    };
  }

  startClock() {
    timerInterval = setInterval(this.timerTick.bind(this), 1000);
    this.setState({
      timerUnused: false,
      timerInterval: timerInterval,
      partner: true
    });
  }

  endClock() {
    console.log('ending da timer');
    this.setState({
      partner: false
    });
  }

  timerTick() {
    var secs = this.state.seconds + 1;
    var mins = this.state.minutes;
    if (secs === 60) {
      secs = 0;
      mins ++;
    }

    var print = secs < 10 ? '0' + secs : '' + secs;
    print = mins + ':' + print;

    //toggle between languages every 5 minutes
    var language = mins % 10 < 5 ? 'japanese' : 'arabic';
    
    this.setState({
      seconds: secs,
      minutes: mins,
      printable: print,
      language: language
    });
  }

  render() {
    if (this.props.partner && this.state.timerUnused) {
      this.startClock();
    }
    /*
    Stops timer on button click. This will eventually be changed
    to look at this.props.partner instead, but that needs to be rechanged
    to false on an end call first. Once that happens, we can take out all
    the partner state attributes in this component
    */
    if (!this.state.partner) {
      clearInterval(this.state.timerInterval);
    }

    return (
      <div className='clock'>
        <button onClick={this.endClock.bind(this)}> End timer </button>
        <h1> {this.state.printable} </h1>
        <h3> It's time to speak {this.state.language} </h3>
      </div>
    );
  }
}

export default Clock;
