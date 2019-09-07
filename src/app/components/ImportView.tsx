import * as React from 'react';
import { Button } from './FormElements';
import { Clickable } from './Clickable';
import { Import } from '../Import';
import { Tile } from '../TilemapClasses';
import { TilePropertiesSelector } from './TilePropertiesSelector';
import * as $ from "jquery";
enum importStates {'type', 'chooseTileset', 'setProps'};

type importViewProps = {
  onSubmit: (a: Map<string, Tile>) => void,
}

type importViewState = {
  state: importStates,
  import: Import,
  tileset: Map<string, Tile>
}

let importTilesInput: JQuery<HTMLInputElement>;

export class ImportView extends React.Component<importViewProps, importViewState> {
  constructor(props: importViewProps) {
    super(props);
    this.state = {
      state: importStates.type,
      import: null,
      tileset: new Map<string, Tile>(),
    }
  }

  changeState(state: importStates) {
    this.setState({
      state: state,
    })
  }

  componentDidMount() {
    importTilesInput = $("#uploadFiles");
    importTilesInput.on('change', () => {
      let fileList = importTilesInput.get(0).files;
      this.setState({import: new Import(fileList.length, () => {this.importReadyCallBack()})});
      this.state.import.upload(fileList);
    });
  }

  /**
   * Called when Import has been completed.
   */
  importReadyCallBack() {
    this.setState({tileset: new Map([...this.state.import.tiles, ...this.state.tileset])});
    this.state.import.completed();
    this.changeState(importStates.setProps);
    console.log(this.state.tileset);
  }

  updateTile(key: string, tileType: string, options: Map<string, string>) {
    console.log("updateTile: "  + key + ", " + tileType + ", " + JSON.parse(JSON.stringify(options.entries())));
    this.setState((state) => {
      let newTileset = new Map<string, Tile>([...state.tileset]);
      let tile = newTileset.get(key);
      tile.type = tileType;
      tile.props = new Map<string, string>([...options]);
      return {
        tileset: newTileset
      }
    });
  }

  render() {   
    switch(this.state.state) {
      case importStates.type: 
        return (
          <div id="import">
            <input type="file" id="uploadFiles" hidden multiple/>
            <Clickable onClick={() => {this.changeState(importStates.chooseTileset)}}><Button>Choose Tileset</Button></Clickable>
            <Clickable onClick={() => {importTilesInput.click()}}><Button>Import Files</Button></Clickable>
          </div>
        );
      case importStates.chooseTileset:
        return (
          <div id="import">
            Not yet implemented
          </div>
        );
      case importStates.setProps:
        let tiles = new Array<JSX.Element>();
        let a = ['a', 'b', 'c'];
        return (
          <div id="import">
            Set the properties of your imports (this can be completed later...)
            {[...this.state.tileset.keys()].map((key) => {
              return <TilePropertiesSelector key={this.state.tileset.get(key).id} tile={this.state.tileset.get(key)} onChange={(tileType: string, options: Map<string, string>) => {this.updateTile(key, tileType, options)}}></TilePropertiesSelector>
            })}
            <Clickable onClick={() => {this.props.onSubmit(this.state.tileset)}}><Button>Import!</Button></Clickable>
          </div>
        )
    }
  }
}