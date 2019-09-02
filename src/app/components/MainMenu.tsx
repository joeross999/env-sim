import * as React from 'react';
import { Modal } from './Modal';

type Props = {
  changeToSimulation: Function,
  changeToBuild: Function
}
export class MainMenu extends React.Component<Props, {}> {
  render() {   return (
    <div className="MainMenu">
      <Modal id="MainMenuModal" height={80} width={40} background="orange" foreground="white">
        <button onClick={() => {this.props.changeToSimulation()}}>Go To Simulation</button>
        <button onClick={() => {this.props.changeToBuild()}}>Go to Build</button>
      </Modal>
    </div>
  );
  }
}