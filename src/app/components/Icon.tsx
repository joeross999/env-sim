import * as React from 'react';
import './css/Icon.css';

type Props = {
  size: number;
  source: any;
}

export class Icon extends React.Component<Props, {}> {
  render() {
    let style = {
      width: this.props.size + "px",
      height: this.props.size + "px"
    }
    return <img className="icon" src={this.props.source} style={style}></img>
  }
}