import * as React from 'react';
import { TilemapCanvas } from './Canvas';
import { SectionBox } from './SectionBox';
import { Clickable } from './Clickable';
import { Icon } from './Icon';
import { RoundedButton } from './Buttons';
import { Import } from '../Import';
// import { Data } from '../Data';
import './css/BuildView.css';
import * as eraserIcon from '../../resources/eraser.png';
import * as paintBrushIcon from '../../resources/paint-brush.png';
import * as $ from "jquery";
import { Tile, Tilemap, Position, TilemapTile } from '../TilemapClasses';

enum states {draw, erase};
let iconSize = 32;

type State = {
  BuildState: states,
  paletteWidth: number,
  tileset: Map<String, Tile>,
  gameTilemapList: Array<TilemapTile>,
  paletteTilemapList: Array<TilemapTile>,
  currentImport: Import,
  currentTile: Tile,
  selectedTilePosition: Position,
}



let importTilesInput: JQuery<HTMLInputElement>;
let gameCtx: CanvasRenderingContext2D;
let paletteCtx: CanvasRenderingContext2D;

export class BuildView extends React.Component<{}, State> {
  gameTilemap: Tilemap;
  paletteTilemap: Tilemap;
  
  constructor(props: any) {
    super(props);
    this.gameTilemap = new Tilemap(800/16, 608/16),
    this.paletteTilemap = new Tilemap(100, 4),
    this.state = {
      BuildState: states.draw,
      paletteWidth: 171,
      gameTilemapList: new Array<TilemapTile>(),
      paletteTilemapList: new Array<TilemapTile>(),
      tileset: new Map<String, Tile>(),
      currentImport: null,
      currentTile: null,
      selectedTilePosition: null,
    };
  }

  changeState(state: states) {
    this.setState({BuildState: state});
  }
  importTiles() {
    console.log('importTiles');
    console.log(importTilesInput);
    importTilesInput.trigger('click');
  }

  componentDidMount() {
    importTilesInput = $('#importTiles');
    importTilesInput.on('change', () => {
      let fileList = importTilesInput.get(0).files;
      this.setState({currentImport: new Import(fileList.length, () => {this.importReadyCallBack()})});
      this.state.currentImport.upload(fileList);
    });

    let game: JQuery<HTMLCanvasElement> = $('#game');
    gameCtx = game.get(0).getContext('2d');
    game.on('click', (event) => {

    });

    let palette: JQuery<HTMLCanvasElement> = $('#palette');
    paletteCtx = game.get(0).getContext('2d');

    let width = $('#settingsWrapper').width();
    this.setState({paletteWidth: width});
  }

  importReadyCallBack() {
    if(confirm("import tiles?")) {
      this.setState({tileset: new Map([...this.state.currentImport.tiles, ...this.state.tileset])});
      this.state.currentImport.completed();
      this.updatePalette(this.state.tileset);
    }
    console.log(this.state.tileset);
  }

  updatePalette(tileset: Map<String, Tile>) {
    let newPaletteTilemap = new Tilemap(100, 4);
    let counter = 0;
    tileset.forEach((tile) => {
      newPaletteTilemap.addTile(new Position(counter, 0), tile, 0);
      counter++;
    });
    this.paletteTilemap =  newPaletteTilemap;
    this.setState({
      paletteTilemapList: newPaletteTilemap.getTilesAsList(),
    });
  }

  clickGame(position: Position) {
    console.log("Game clicked at position: " + position.toString());
    if(this.state.currentTile) {
      this.setState((state:State): Readonly<{}> => {
        this.gameTilemap.addTile(position, state.currentTile, 0);
        return {
          gameTilemapList: this.gameTilemap.getTilesAsList(),
        }
      });
    }
  }

  selectTileFromPalette(position: Position) {
    console.log("Palette clicked at position: " + position.toString());
    console.log(this.paletteTilemap.getTile(position, 0));
    let selectedTile = this.paletteTilemap.getTile(position, 0);
    if(selectedTile) {
      this.setState({
        currentTile: selectedTile,
        selectedTilePosition: position,
      });
    }
  }

  render() {   
    return (
      <div id="buildView">
        <div id="gameWrapper">
          <h1 className="center">World</h1>
          <TilemapCanvas id="game" 
              width={800}
              height={608} 
              tileSize={16} 
              tilemap={this.state.gameTilemapList} 
              onClick={(e: Position) => {this.clickGame(e)}}>
          </TilemapCanvas>
        </div>
        <div id="settingsWrapper">
          <h1 className="center">Settings</h1>
          <SectionBox style={{marginBottom: "20px"}}>
            <Clickable onClick={() => {this.changeState(states.draw)}}>
              <Icon size={iconSize} source={eraserIcon}></Icon>
            </Clickable>
            <Clickable onClick={() => {this.changeState(states.erase)}}>
              <Icon size={iconSize} source={paintBrushIcon}></Icon>
            </Clickable>
          </SectionBox>
          <TilemapCanvas gaps={2} selected={this.state.selectedTilePosition}
              tilemap={this.state.paletteTilemapList} 
              id="palette" 
              tileSize={16} 
              style={{marginBottom: "20px"}} 
              height={171} 
              width={this.state.paletteWidth}
              onClick={(e: Position) => {this.selectTileFromPalette(e)}}>
          </TilemapCanvas>
          <Clickable onClick={() => {this.importTiles()}}>
            <RoundedButton>Import Tiles</RoundedButton>
          </Clickable>
          <input type="file" hidden multiple id="importTiles" />
        </div>
      </div>
    )
  }
}