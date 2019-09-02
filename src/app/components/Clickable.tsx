import * as React from 'react';

type Props ={
  onClick: Function,
  display?: string
}

export class Clickable extends React.Component<Props, {}> {

  static defaultProps = {
    display: "inline-block"
  }

  style = {
    display: this.props.display,
  }

  render() {
    return <div style={this.style} className="clickable" onClick={() => {this.props.onClick()}}>
      {this.props.children}
    </div>
  }
}