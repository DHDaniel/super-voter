//# sourceMappingURL=http://localhost:8080/static/scripts/dist/app.js.map




import React from 'react';
import ReactDOM from 'react-dom';

import PollForm from './createPoll.jsx';
import PollDisplay from './pollDisplay.jsx';
import Sidebar from './sidebar.jsx';


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
      display : <PollForm />,
    }
  }

  // function executes once, after component is initialized
  componentDidMount() {
    this.fetchPolls();
  }

  // AJAX call to server to fetch user's polls. Updates the state of poll.
  fetchPolls() {
    reqwest({
      url : "/api/user/polls",
      method : "GET",
      success: (resp) => {
        // response will be JSON string of an array of Poll objects - look at Poll schema for reference
        var updatedPolls = JSON.parse(resp);
        this.setState({polls : updatedPolls});
      },
      error : function (err) {
        console.log(err);
      }
    });
  }

  handlePollClick (pollId) {
    console.log(pollId);
    var pollCopy = this.state.polls.slice();
    var idx = pollCopy.findIndex( function (poll) {
      return poll._id == pollId;
    });
    // setting clicked poll to main display
    this.setState({
      display : <PollDisplay poll={pollCopy[idx]} />
    });
  }


  render () {
    return(
      /* Sidebar with all the polls inside */
      <div className="row">

      <Sidebar polls={this.state.polls} onPollClick={(id) => this.handlePollClick(id)} onCreateClick={() => this.handleCreateClick()}/>

      <MainDisplay display={this.state.display}/>

      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
