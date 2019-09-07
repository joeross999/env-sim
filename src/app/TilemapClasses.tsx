import { Unique, range } from './Helper';
import { string } from 'prop-types';

export class Position {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return "{" + this.x + "," + this.y + "}";
  }

  equals(pos: Position) {
    if(this.x === pos.x && this.y === pos.y) return true;
    return false
  }

  difference(pos: Position) {
    return new Position(this.x - pos.x, this.y - pos.y);
  }

  distance(pos: Position) {
    let difference = this.difference(pos);
    return Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2));
  }

  static fillSquareBetween(a: Position, b: Position): Array<Position> {
    let list  = new Array<Position>();
    range(Math.min(a.x, b.x), Math.max(a.x, b.x) + 1).forEach((x) => {
      range(Math.min(a.y, b.y), Math.max(a.y, b.y) + 1).forEach((y) => {
        list.push(new Position(x, y));
      });
    });
    return list;
  }
}

export class Tile extends Unique {
  name: string = "";
  width: number = 0;
  height: number = 0;
  image: HTMLImageElement = null;
  type: string;
  props: Map<string, string> = new Map<string, string>();

  constructor(name: string) {
    super();
    if(name) this.name = name;
  }

  setImage(image: HTMLImageElement) {
    this.image = image;
    this.width = 16; //Todo: Change to tilesize
    this.height = 16;
  }
}

export class TilemapTile {
  props: Map<string, string> = new Map<string, string>();
  layers: Map<number, Tile> = new Map<number, Tile>();
  position: Position;

  constructor(position: Position, tile: Tile, layer: number) {
    this.position = position;
    this.addTile(tile, layer);
  }

  addTile(tile: Tile, layer: number) {
    this.layers = new Map<number, Tile>([...this.layers.set(layer, tile)].sort());
    this.props = new Map<string, string>([...this.props, ...tile.props]);
  }

  removeTile(layer: number) {
    if(this.layers.has(layer)) {
      this.layers.delete(layer);
      this.resetProperties();
    }
  }
  
  resetProperties() {
    this.props = new Map<string, string>();
    this.layers.forEach((tile) => {
      this.props = new Map<string, string>([...this.props, ...tile.props]);
    });
  }

  getTile(layer: number) {
    if(this.layers.has(layer)) return this.layers.get(layer);
    return null;
  }
}

export class Tilemap {
  tiles: Map<number, Map<number, TilemapTile>> = new Map();
  width: number;
  height: number;
  test: String = "test";

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height
  }

  setTilemapTile(position: Position, tile: TilemapTile) {
    if(!this.tiles.has(position.x)) 
      this.tiles.set(position.x, new Map<number, TilemapTile>());
    this.tiles.get(position.x).set(position.y, tile);
  }

  addTile(position: Position, tile: Tile, layer: number) {
    let tilemapTile = this.getTilesAtPosition(position);
    if(tilemapTile) tilemapTile.addTile(tile, layer);
    else this.setTilemapTile(position, new TilemapTile(position, tile, layer));
  }

  removeTile(position: Position, layer: number) {
    let tilemapTile = this.getTilesAtPosition(position);
    if(tilemapTile)
      tilemapTile.removeTile(layer);
  }

  addTemporaryTile(position: Position, tile: Tile, layer: number) {
    tile.props = Object.assign(tile.props, {temporary: true});
    this.addTile(position, tile, layer);
  }

  removeTemporaryTiles(): Tilemap {
    this.getTilesAsList().forEach((tilemapTile) => {
      if(tilemapTile.props.hasOwnProperty("temporary")) {
        tilemapTile.layers.forEach((tile, i) => {
          if(tile.props.has('temporary') && tile.props.get('temporary')) {
            tilemapTile.removeTile(i);
          }
        });
      }
    });
    return this;
  }

  saveTemporaryTiles(): Tilemap {
    this.getTilesAsList().forEach((tilemapTile) => {
      if(tilemapTile.props.hasOwnProperty("temporary")) {
        tilemapTile.layers.forEach((tile, i) => {
          if(tile.props.has('temporary') && tile.props.get('temporary')) {
            tile.props.delete('temporary');
          }
        });
        tilemapTile.resetProperties();
      }
    });
    return this;
  }

  getTilesAtPosition(position: Position): TilemapTile {
    if(this.tiles.has(position.x) && 
        this.tiles.get(position.x).has(position.y)) {
      return this.tiles.get(position.x).get(position.y);
    } return null;
  }

  getTile(position: Position, layer: number): Tile {
    let tilemapTile = this.getTilesAtPosition(position);
    if(tilemapTile) return tilemapTile.getTile(layer);
    return null;
  }

  getTilesAsList(): Array<TilemapTile> {
    let list: Array<TilemapTile> = [];
    this.tiles.forEach((column) => {
      if(column) column.forEach((tilemapTile) => {
        list.push(tilemapTile);
      })
    });
    return list;
  }
}