import { Unique } from './Helper';

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
}

export class Tile extends Unique {
  name: String = "";
  width: number = 0;
  height: number = 0;
  image: HTMLImageElement = null;
  type: String;
  props = {};
  constructor(name: String) {
    super();
    if(name) this.name = name;
  }

  setImage(image: HTMLImageElement) {
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
}

export class TilemapTile {
  props: Object = {};
  layers: Array<Tile> = [];
  position: Position;

  constructor(position: Position, tile: Tile, layer: number) {
    this.position = position;
    this.addTile(tile, layer);
  }

  addTile(tile: Tile, layer: number) {
    this.layers[layer] = tile;
    this.props = Object.assign(this.props, tile.props);
  }

  removeTile(layer: number) {
    if(this.layers[layer]) {
      this.layers[layer].props
      this.layers[layer] = null;
      for(let i = this.layers.length; i > 0; i--) {
        if(this.layers[i]) break;
        this.layers.pop();
      };

      // reset properties
      this.props = {};
      for(let i = 0; i < this.layers.length; i++) {
        this.props = Object.assign(this.props, this.layers[i].props);
      }
    }
  }
  
  getTile(layer: number) {
    if(this.layers[layer]) return this.layers[layer];
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