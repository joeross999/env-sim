import * as React from 'react';
import { TilemapCanvas } from './Canvas';
import { SectionBox } from './SectionBox';
import { Clickable } from './Clickable';
import { Icon } from './Icon';
import { RoundedButton, Select } from './FormElements';
import { Modal } from './Modal';
import { ImportView } from './ImportView';
import './css/BuildView.css';
import * as eraserIcon from '../../resources/eraser.png';
import * as paintBrushIcon from '../../resources/paint-brush.png';
import * as boxIcon from '../../resources/selection.png';
import * as $ from "jquery";
import { Tile, Tilemap, Position, TilemapTile } from '../TilemapClasses';
import { TilePropertiesSelector } from './TilePropertiesSelector';

enum states {draw, box, erase, import};
let iconSize = 32;

type State = {
  BuildState: states,
  paletteWidth: number,
  tileset: Map<string, Tile>,
  gameTilemap: Tilemap,
  gameTilemapList: Array<TilemapTile>,
  paletteTilemap: Tilemap,
  paletteTilemapList: Array<TilemapTile>,
  currentTile: Tile,
  selectedTilePosition: Position,
  mouseDown: Position,
  currentLayer: number,
}

let gameCtx: CanvasRenderingContext2D;
let paletteCtx: CanvasRenderingContext2D;

const Layers = new Map<string, string>([["0", "Layer 0"], ["1", "Layer 1"], ["2", "Layer 2"]]);

export class BuildView extends React.Component<{}, State> {
  
  constructor(props: any) {
    super(props);
    this.state = {
      BuildState: states.draw,
      paletteWidth: 171,
      gameTilemap: new Tilemap(800/16, 608/16),
      gameTilemapList: new Array<TilemapTile>(),
      paletteTilemap: new Tilemap(100, 4),
      paletteTilemapList: new Array<TilemapTile>(),
      tileset: new Map<string, Tile>(),
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
    this.setState({BuildState: states.import})
  }

  componentDidMount() {
    let game: JQuery<HTMLCanvasElement> = $('#game');
    gameCtx = game.get(0).getContext('2d');

    let palette: JQuery<HTMLCanvasElement> = $('#palette');
    paletteCtx = palette.get(0).getContext('2d');

    let width = $('#settingsWrapper').width();
    this.setState({paletteWidth: width});
  }

  importReadyCallBack(tileset: Map<string, Tile>) {
      this.setState({
        tileset: new Map([...tileset, ...this.state.tileset]),
        BuildState: states.draw,
      });
      this.updatePalette(new Map([...tileset, ...this.state.tileset]));
  }

  updatePalette(tileset: Map<string, Tile>) {
    let newPaletteTilemap = new Tilemap(100, 4);
    let counter = 0;
    tileset.forEach((tile) => {
      newPaletteTilemap.addTile(new Position(counter, 0), tile, 0);
      counter++;
    });
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
        this.setState((state: State): Readonly<{}> => {
          return {
            gameTilemapList: state.gameTilemap.getTilesAsList(),
          }
        });
      } else if(this.state.BuildState === states.erase) {
        this.state.gameTilemap.removeTile(position, this.state.currentLayer);
        this.setState((state: State): Readonly<{}> => {
          return {
            gameTilemapList: state.gameTilemap.getTilesAsList(),
          }
        });
      }
      this.setState({mouseDown: position});
    }
  }

  gameMouseUp(position: Position) {
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
    if(this.state.mouseDown) {
      if(this.state.BuildState === states.draw) {
        this.state.gameTilemap.addTile(position, this.state.currentTile, this.state.currentLayer);
      } else if(this.state.BuildState === states.erase) {
        this.state.gameTilemap.removeTile(position, this.state.currentLayer);
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
    list.forEach((position) => {
      tilemap.addTemporaryTile(position, this.state.currentTile, this.state.currentLayer);
    });
    return tilemap;
  }

  selectTileFromPalette(position: Position) {
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

  updateTile(tileId: string, tileType: string, options: Map<string, string>) {
    console.log("updateTile: "  + tileId + ", " + tileType + ", " + JSON.parse(JSON.stringify(options.entries())));
    this.setState((state) => {
      let newTileset = new Map<string, Tile>([...state.tileset]);
      let tile = newTileset.get(tileId);
      tile.type = tileType;
      tile.props = new Map<string, string>([...options]);
      return {
        tileset: newTileset
      }
    });
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
          { this.state.currentTile && 
            <SectionBox>
              <TilePropertiesSelector 
                tile={this.state.tileset.get(this.state.currentTile.id)} 
                onChange={
                  (tileType: string, options: Map<string, string>) => {
                    this.updateTile(this.state.currentTile.id, tileType, options)
                  }
                }>
              </TilePropertiesSelector>
            </SectionBox>
          }
          <SectionBox>
          <Clickable onClick={() => {this.importTiles()}}>
            <RoundedButton>Import Tiles</RoundedButton>
          </Clickable>
          <Select class="layerSelect" options={Layers} selected={String(this.state.currentLayer)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {this.layerSelectChange(e)}}></Select>
          <input type="file" hidden multiple id="importTiles" />
          </SectionBox>
        </div>
        {this.state.BuildState === states.import &&
          <Modal id="import-modal" background="rgba(0, 0, 0, .5)" foreground="white" width={30} height={80}>
            <ImportView onSubmit={(tileset: Map<string, Tile>) => {this.importReadyCallBack(tileset)}}></ImportView>
          </Modal>
        }
      </div>
    )
  }
}