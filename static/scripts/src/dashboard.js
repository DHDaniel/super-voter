
import React from 'react';
import ReactDOM from 'react-dom';





class Sidebar extends React.Component {

    render () {
      return (
        <div className="col-xs-3">
          {this.props.polls}
        </div>
      );
    }
}

class MainDisplay extends React.Component {

  render () {
    return(
      <div className="col-xs-9">
        {this.props.display}
      </div>
    )
  }
}

class App extends React.Component {

  constructor () {
    super(); // calling universal super function on React.Component

    this.state = {
      polls : [],
      display : this.setLoadingDisplay(),
    }
  }

  setLoadingDisplay() {
    return "Loading... Please wait";
  }

  render () {
    return(
      /* Sidebar with all the polls inside */
      <div className="row">

      <Sidebar polls={this.state.polls}/>

      <MainDisplay display={this.state.display}/>

      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
