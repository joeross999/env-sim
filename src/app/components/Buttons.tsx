import * as React from 'react';
import './css/Buttons.css'

type Props = {
  style?: Object,
}

export class Button extends React.Component<Props, {}> {
  render() {
    return <span className="button" style={this.props.style}>
      {this.props.children}
    </span>
  }
}

export class RoundedButton extends React.Component<Props, {}> {
  render() {
    return <span className="button rounded-button" style={this.props.style}>
      {this.props.children}
    </span>
  }
}