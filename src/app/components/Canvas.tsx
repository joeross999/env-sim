import * as React from 'react';
import './css/Canvas.css'
import { Tilemap, TilemapTile, Position} from '../TilemapClasses';
import * as $ from 'jquery';

type CanvasProps = {
  height: number,
  width: number,
  id: string,
  style?: object,
}

type TilemapCanvasProps = {
  tileSize: number,
  tilemap: Array<TilemapTile>,
  height: number,
  width: number,
  id: string,
  onMouseDown: Function,
  onMouseUp?: Function,
  onMouseMove?: Function,
  selected?: Position,
  gaps?: number,
  style?: object,
}

type TilemapCanvasState = {
  context: CanvasRenderingContext2D,
  mousePos: Position,
}

/** Simple Canvas Component */
export class Canvas extends React.Component<CanvasProps, {}> {
  render() {   
    return <canvas id={this.props.id} width={this.props.width} height={this.props.height} style={this.props.style}></canvas>
  }
}

/**Tilemap Canvas Component */
export class TilemapCanvas extends React.Component<TilemapCanvasProps, TilemapCanvasState> {
  public static defaultProps = {
    gaps: 0
  };

  renderTilemap() {
    this.eraseCanvas();
    this.props.tilemap.forEach((tilemapTile) => {
      this.renderTile(tilemapTile);
    });
  }

  renderTile(tilemapTile: TilemapTile) {
    let coordinates = this.TilePositionToCoordinates(tilemapTile.position);
    tilemapTile.layers.forEach((tile) => {
      this.state.context.drawImage(tile.image, coordinates.x, coordinates.y);
    });
  }

  eraseCanvas() {
    this.state.context.lineWidth = this.props.gaps;
    this.state.context.fillStyle = "white";
    this.state.context.beginPath();
    this.state.context.rect(0, 0, this.props.width, this.props.height);
    this.state.context.fill();
  }

  updateSelected() {
    this.highlightGridPosition(this.props.selected, "red");
  }

  highlightGridPosition(position: Position, color: string) {
    let coordinates = this.TilePositionToCoordinates(position);
    this.drawGrid("white");
    this.state.context.lineWidth = this.props.gaps;
    this.state.context.strokeStyle = color;
    this.state.context.beginPath();
    this.state.context.rect(coordinates.x - this.props.gaps, coordinates.y - this.props.gaps, this.props.tileSize + this.props.gaps, this.props.tileSize + this.props.gaps);
    this.state.context.stroke();
  }
  
  drawGrid(color: string) {
    this.state.context.lineWidth = this.props.gaps;
    this.state.context.strokeStyle = color;
    this.state.context.beginPath();
    for(let x = 0; x <= this.props.width; x += this.props.tileSize + this.props.gaps) {
      this.state.context.moveTo(x, 0);
      this.state.context.lineTo(x, this.props.height);
    }
    for(let y = 0; y <= this.props.height; y += this.props.tileSize + this.props.gaps) {
      this.state.context.moveTo(0, y);
      this.state.context.lineTo(this.props.width, y);
    }
    this.state.context.stroke();
  }

  componentDidUpdate(prevProps: TilemapCanvasProps) {
    if(prevProps.tilemap != this.props.tilemap)
      this.renderTilemap();
    if(prevProps.selected != this.props.selected) 
      this.updateSelected();
    if(prevProps.width != this.props.width ||
      prevProps.height != this.props.height) 
      this.setContext();
  }

  componentDidMount() {
    this.setContext();
    // this.renderTilemap();
  }

  setContext() {
    let canvas: JQuery<HTMLCanvasElement> = $('#' + this.props.id);
    let context: CanvasRenderingContext2D = canvas.get(0).getContext('2d');
    // context.translate(0.5, 0.5);
    this.setState({context: context});
  }

  onMouseDown(mouseEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    let coordinates = new Position(mouseEvent.nativeEvent.offsetX, mouseEvent.nativeEvent.offsetY)
    this.props.onMouseDown(this.coordinatesToTilePosition(coordinates));
  }

  onMouseMove(mouseEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if(this.props.onMouseMove) {
      let coordinates = new Position(mouseEvent.nativeEvent.offsetX, mouseEvent.nativeEvent.offsetY);
      let position = this.coordinatesToTilePosition(coordinates);
      if(!this.state.mousePos || !this.state.mousePos.equals(position))  {
        this.setState({mousePos: position});
        this.props.onMouseMove(position);
      }
    }
  }
  
  onMouseUp(mouseEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if(this.props.onMouseUp) {
      let coordinates = new Position(mouseEvent.nativeEvent.offsetX, mouseEvent.nativeEvent.offsetY)
      this.props.onMouseUp(this.coordinatesToTilePosition(coordinates));
    }
  }

  coordinatesToTilePosition(coordinates: Position) {
    return new Position(
      Math.floor((coordinates.x  - this.props.gaps) / (this.props.tileSize + this.props.gaps)),
      Math.floor((coordinates.y  - this.props.gaps) / (this.props.tileSize + this.props.gaps)),
    );
  }

  TilePositionToCoordinates(position: Position) {
    return new Position (
      (position.x * (this.props.tileSize + this.props.gaps)) + this.props.gaps, 
      (position.y * (this.props.tileSize + this.props.gaps)) + this.props.gaps
    );
  }

  render() { 
    return <canvas 
    id={this.props.id} 
    width={this.props.width} 
    height={this.props.height} 
    style={this.props.style}
    onMouseDown={(e) => {this.onMouseDown(e)}}
    onMouseMove={(e) => {this.onMouseMove(e)}}
    onMouseUp={(e) => {this.onMouseUp(e)}}></canvas>
  }

}