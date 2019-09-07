import * as React from 'react';
import './css/Buttons.css'

type ButtonProps = {
  style?: Object,
}

export class Button extends React.Component<ButtonProps, {}> {
  render() {
    return <span className="button" style={this.props.style}>
      {this.props.children}
    </span>
  }
}

export class RoundedButton extends React.Component<ButtonProps, {}> {
  render() {
    return <span className="button rounded-button" style={this.props.style}>
      {this.props.children}
    </span>
  }
}

type SelectProps = {
  class: string,
  options: Map<string, string>,
  onChange: Function,
  selected: string
}

export class Select extends React.Component<SelectProps, {}> {
  render() {
    let optionList: Array<JSX.Element> = new Array<JSX.Element>();
    this.props.options.forEach((label, key) => {
      optionList.push(<option value={key} key={key}>{label}</option>);
    });
    return (<select value={this.props.selected} className={this.props.class} onChange={(e) => this.props.onChange(e)}>
      {optionList}
    </select>)
  }
}