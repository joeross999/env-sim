import * as React from 'react';
import './css/SectionBox.css'

type Props = {
  style?: Object,
}

export class SectionBox extends React.Component<Props, {}> {
  render() {   return (
    <div style={this.props.style} className="sectionBox">
        {this.props.children}
    </div>
  );
  }
}