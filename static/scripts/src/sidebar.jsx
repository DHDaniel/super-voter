
import React from 'react';

class PollTab extends React.Component {

    render () {
      return(
        <li onClick={() => this.props.onPollClick()}>
          <h3>{this.props.poll.title}</h3>
          <p>{new Date(this.props.poll.date_created).toLocaleDateString()}</p>
        </li>
      );
    }
}

class Polls extends React.Component {

    render () {
      return(
        <ul id="sidebar">
          {this.props.polls.map((poll) => {
            return <PollTab key={poll._id} poll={poll} onPollClick={() => this.props.onPollClick(poll._id)}/>;
          })}
          <li onClick={() => this.props.onCreateClick()}>Create New Poll</li>
        </ul>
      );
    }
}

export default class Sidebar extends React.Component {

  render () {

    return(
      <div className="col-xs-3">
          <Polls polls={this.props.polls} onPollClick={(id) => this.props.onPollClick(id)} onCreateClick={() => this.props.onCreateClick()}/>
      </div>
    );
  }
}
