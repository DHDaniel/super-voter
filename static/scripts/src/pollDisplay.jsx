
import React from 'react';

export default class PollDisplay extends React.Component {

  render () {
    return(
      <div>
        <h1>{this.props.poll.title}</h1>
        <ul>

        {this.props.poll.options.map(function (option) {
          return <li>Option name: {option.name}, votes: {option.votes}</li>
        })}

        </ul>
        <p>
          Date created: {new Date(this.props.poll.date_created).toLocaleDateString()}
        </p>
      </div>
    )
  }
}
