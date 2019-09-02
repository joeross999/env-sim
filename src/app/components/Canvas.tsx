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
  onClick: Function,
  selected?: Position,
  gaps?: number,
  style?: object,
}

type TilemapCanvasState = {
  context: CanvasRenderingContext2D,
}

export class Canvas extends React.Component<CanvasProps, {}> {
  render() {   
    return <canvas id={this.props.id} width={this.props.width} height={this.props.height} style={this.props.style}></canvas>
  }
}

export class TilemapCanvas extends React.Component<TilemapCanvasProps, TilemapCanvasState> {
  public static defaultProps = {
    gaps: 0
  };

  renderTilemap() {
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
    this.renderTilemap();
  }

  setContext() {
    let canvas: JQuery<HTMLCanvasElement> = $('#' + this.props.id);
    let context: CanvasRenderingContext2D = canvas.get(0).getContext('2d');
    // context.translate(0.5, 0.5);
    this.setState({context: context});
  }

  onClick(mouseEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    let coordinates = new Position(mouseEvent.nativeEvent.offsetX, mouseEvent.nativeEvent.offsetY)
    this.props.onClick(this.coordinatesToTilePosition(coordinates));
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
    onClick={(e) => {this.onClick(e)}}></canvas>
  }

}