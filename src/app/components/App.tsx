import * as React from 'react';
import { MainMenu } from "./MainMenu";
import { SimulationView } from "./SimulationView";
import { BuildView } from "./BuildView";

enum states {menu, build, sim};

type State = {
  gameState: states
}

export class App extends React.Component<{}, State> {
  constructor(props: Object) {
    super(props);
    this.state = {gameState: states.menu};
  }
  changeToSimultion() {
    console.log("// this.setState({gameState: states.sim});");
    this.setState({gameState: states.sim});
  }
  changeToBuild() {
    console.log("// this.setState({gameState: states.build});");
    this.setState({gameState: states.build});
  }
  changeToMenu() {
    console.log("// this.setState({gameSt3ate: states.menu});");
    this.setState({gameState: states.menu});
  }
  changeState(state: states) {
    this.setState({gameState: state});
  }
  render() {  
    switch(this.state.gameState) {
      case states.menu: console.log("Showing Menu"); return <MainMenu changeToSimulation= {() => {this.changeState(states.sim)}} changeToBuild={() => {this.changeState(states.build)}}/>;
      case states.sim: console.log("Showing Simululation"); return <SimulationView />;
      case states.build: console.log("Showing Build"); return <BuildView />;
    }
  }
}