import * as React from 'react';
import { TilemapCanvas } from './Canvas';
import { SectionBox } from './SectionBox';
import { Clickable } from './Clickable';
import { Icon } from './Icon';
import { RoundedButton, Select } from './FormElements';
import { Import } from '../Import';
// import { Data } from '../Data';
import './css/BuildView.css';
import * as eraserIcon from '../../resources/eraser.png';
import * as paintBrushIcon from '../../resources/paint-brush.png';
import * as boxIcon from '../../resources/selection.png';
import * as $ from "jquery";
import { Tile, Tilemap, Position, TilemapTile } from '../TilemapClasses';
import { string } from 'prop-types';

enum states {draw, box, erase};
let iconSize = 32;

type State = {
  BuildState: states,
  paletteWidth: number,
  tileset: Map<String, Tile>,
  gameTilemap: Tilemap,
  gameTilemapList: Array<TilemapTile>,
  paletteTilemap: Tilemap,
  paletteTilemapList: Array<TilemapTile>,
  currentImport: Import,
  currentTile: Tile,
  selectedTilePosition: Position,
  mouseDown: Position,
  currentLayer: number,
}



let importTilesInput: JQuery<HTMLInputElement>;
let gameCtx: CanvasRenderingContext2D;
let paletteCtx: CanvasRenderingContext2D;

const Layers = new Map<string, string>([["0", "Layer 0"], ["1", "Layer 1"], ["2", "Layer 2"]]);

export class BuildView extends React.Component<{}, State> {
  // gameTilemap: Tilemap;
  // paletteTilemap: Tilemap;
  
  constructor(props: any) {
    super(props);
    // this.gameTilemap = new Tilemap(800/16, 608/16),
    // this.paletteTilemap = new Tilemap(100, 4),
    this.state = {
      BuildState: states.draw,
      paletteWidth: 171,
      gameTilemap: new Tilemap(800/16, 608/16),
      gameTilemapList: new Array<TilemapTile>(),
      paletteTilemap: new Tilemap(100, 4),
      paletteTilemapList: new Array<TilemapTile>(),
      tileset: new Map<String, Tile>(),
      currentImport: null,
      currentTile: null,
      selectedTilePosition: null,
      mouseDown: null,
      currentLayer: 0,
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
    // this.paletteTilemap =  newPaletteTilemap;
    this.setState({
      paletteTilemap: newPaletteTilemap,
      paletteTilemapList: newPaletteTilemap.getTilesAsList(),
    });
  }

  gameMouseDown(position: Position) {
    console.log("Game clicked at position: " + position.toString());
    if(this.state.currentTile) {
      if(this.state.BuildState === states.draw) {
        this.state.gameTilemap.addTile(position, this.state.currentTile, this.state.currentLayer);
        this.setState((state:State): Readonly<{}> => {
          return {
            gameTilemapList: state.gameTilemap.getTilesAsList(),
          }
        });
      }
      this.setState({mouseDown: position});
    }
  }

  gameMouseUp(position: Position) {
    console.log("gameMouseUp: " + position.toString())
    if(this.state.BuildState === states.box) {
      this.setState((state:State): Readonly<{}> => {
        return {
          gameTilemapList: state.gameTilemap.saveTemporaryTiles().getTilesAsList(),
        }
      });
    }
    this.setState({mouseDown: null});
  }

  gameMouseMove(position: Position) {
    console.log("gameMouseMove: " + position.toString());
    if(this.state.mouseDown) {
      if(this.state.BuildState === states.draw) {
        this.state.gameTilemap.addTile(position, this.state.currentTile, this.state.currentLayer);
      } else if(this.state.BuildState === states.box) {
        this.state.gameTilemap.removeTemporaryTiles();
        this.setState( {
          gameTilemap: this.drawTempBox(this.state.mouseDown, position, this.state.gameTilemap)
        });
      }
      this.setState({
        gameTilemapList: this.state.gameTilemap.getTilesAsList()
      })
    }
  }

  drawTempBox(a: Position, b: Position, tilemap: Tilemap): Tilemap {
    let list: Array<Position> = Position.fillSquareBetween(a, b);
    console.log("Position.fillSquareBetween(" + a + ", "+ b+")")
    console.log(Position.fillSquareBetween(a, b))
    list.forEach((position) => {
      tilemap.addTemporaryTile(position, this.state.currentTile, this.state.currentLayer);
    });
    return tilemap;
  }

  selectTileFromPalette(position: Position) {
    console.log("Palette clicked at position: " + position.toString());
    console.log(this.state.paletteTilemap.getTile(position, 0));
    let selectedTile = this.state.paletteTilemap.getTile(position, 0);
    if(selectedTile) {
      this.setState({
        currentTile: selectedTile,
        selectedTilePosition: position,
      });
    }
  }

  layerSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({currentLayer: Number(event.currentTarget.value)});
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
              onMouseDown={(e: Position) => {this.gameMouseDown(e)}}
              onMouseMove={(e: Position) => {this.gameMouseMove(e)}}
              onMouseUp={(e: Position) => {this.gameMouseUp(e)}}>
          </TilemapCanvas>
        </div>
        <div id="settingsWrapper">
          <h1 className="center">Settings</h1>
          <SectionBox style={{marginBottom: "20px"}}>
            <Clickable onClick={() => {this.changeState(states.draw)}}>
              <Icon size={iconSize} source={paintBrushIcon}></Icon>
            </Clickable>
            <Clickable onClick={() => (this.changeState(states.box))}>
              <Icon size={iconSize} source={boxIcon}></Icon>
            </Clickable>
            <Clickable onClick={() => {this.changeState(states.erase)}}>
              <Icon size={iconSize} source={eraserIcon}></Icon>
            </Clickable>
          </SectionBox>
          <TilemapCanvas 
              gaps={2} 
              selected={this.state.selectedTilePosition}
              tilemap={this.state.paletteTilemapList} 
              id="palette" 
              tileSize={16} 
              style={{marginBottom: "20px"}} 
              height={171} 
              width={this.state.paletteWidth}
              onMouseDown={(e: Position) => {this.selectTileFromPalette(e)}}>
          </TilemapCanvas>
          <Clickable onClick={() => {this.importTiles()}}>
            <RoundedButton>Import Tiles</RoundedButton>
          </Clickable>
          <Select id="layerSelect" options={Layers} selected={String(this.state.currentLayer)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {this.layerSelectChange(e)}}></Select>
          <input type="file" hidden multiple id="importTiles" />
        </div>
      </div>
    )
  }
}