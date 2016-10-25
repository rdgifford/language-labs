import React from 'react';

class Clock extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      seconds: 0,
      minutes: 0,
      printable: '0:00',
      language: 'japanese'
    };
  }

  startClock() {
    setInterval(this.timerTick.bind(this), 1000);
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
    return (
      <div className='clock'>
        <button onClick={this.startClock.bind(this)}> Start timer </button>
        <h1> {this.state.printable} </h1>
        <h3> It's time to speak {this.state.language} </h3>
      </div>
    )
  }
}

export default Clock;
