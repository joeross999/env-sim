import * as React from 'react';
import "./css/Modal.css";

type modalProps = {
  id: string,
  background: string,
  foreground: string,
  width: number,
  height: number,
}

export class Modal extends React.Component<modalProps, {}> {
  render() {
    let margin = (100 - this.props.height) / 2 + "vh auto";
    console.log(margin);
    const modalBackgroundStyle = {
      backgroundColor: this.props.background,
    }
    const modalContentStyle = {
      backgroundColor: this.props.foreground,
      margin: margin,
      height: this.props.height + "vh",
      width: this.props.width + "vw",
    };
    return (
    <div className="modal-background" style={modalBackgroundStyle}>
      <div className="modal-contents" id={this.props.id} style={modalContentStyle}>
        {this.props.children}
      </div>
    </div>
  );
  }
}