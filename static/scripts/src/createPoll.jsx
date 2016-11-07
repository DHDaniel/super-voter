
import React from 'react';
import shortid from 'shortid';

// class takes prop of "ID", "name", and optional props "deletable" and "onclick"
class Option extends React.Component {

  render () {

    var option;
    if (this.props.deletable) {
      var id = this.props.option.id;
      option = (
        <div>
          <label htmlFor={id}>Option</label>
          <input id={id} type="text" name="options" />
          <button type="button" onClick={() => this.props.onClick()}>X</button>
        </div>
      );
    } else {
      option = (
        <div>
          <label htmlFor={id}>Option</label>
          <input id={id} type="text" name="options" />
        </div>
      )
    }
    return option;
  }
}

class OptionList extends React.Component {

  render () {
    if (this.props.deletable) {
      // these list items will be deletable via the delete button
      var list = (
        <div>
        {this.props.options.map(option => {
          return <Option option={option} key={option.id} deletable onClick={() => this.props.onClick(option.id)}/>
        })}
        </div>
      );
    } else {
      // these list items will not be deletable
      var list = (
        <div>
        {this.props.options.map(function (option) {
          return <Option option={option} key={option.id}/>
        })}
        </div>
      )
    }
    return list;
  }
}

export default class FormCreatePoll extends React.Component {

  constructor () {
    super();
    this.state = {
      // options have no name, only ID to set them apart in React. Their value
      // will give them the name for display
      options : [
        {
          id : shortid.generate(),
        },
        {
          id : shortid.generate(),
        }
      ]
    };
  }

  addOption() {
    var newOptions = this.state.options.slice(); // creating copy
    newOptions.push(
      {
        id : shortid.generate(), // unique ID
      }
    );

    this.setState({ options : newOptions })
  }

  removeOption(id) {
    var newOptions = this.state.options.slice();
    var idx = newOptions.findIndex(function (element) {
      return element.id == id; // if IDs match
    });
    newOptions.splice(idx, 1);

    this.setState({ options : newOptions });
  }

  render () {

    var deletable = false;
    if (this.state.options.length > 2) {
      deletable = true;
    }

    return(

      <form action='/api/user/createpoll' method='post'>
        <label htmlFor="title">Title:</label>
        <input type="text" name="title" />

        <OptionList options={this.state.options} deletable={deletable} onClick={(id) => this.removeOption(id)} />

        <button type="button" id='addOption' onClick={() => this.addOption()}>+</button>
        <input type="submit" value="submit" />
      </form>
    );
  }
}
