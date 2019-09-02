import { Tile } from './TilemapClasses';

enum importStates {"loading", "ready", "complete"};

let tiles: Map<String, Tile> = new Map<String, Tile>();

export class Import {
  state: importStates = importStates.loading;
  importSize: number = 0;
  saved: number = 0;
  tiles: Map<String, Tile> = new Map<String, Tile>();
  readyCallback: Function;

  constructor(size: number, callback: Function) {
    this.importSize = size;
    this.readyCallback = callback;
  }

  /**
   * Imports a set of tiles
   * @param {FileList} fileList A list of files to import as tiles
   */
  upload(fileList: FileList) {
    let context = this;
    Array.prototype.forEach.call(fileList, function(file: File) {
      context.setupTile(file);
    });
  }

  /**
   * Setups a tile object from a file.
   * @param {File} file file recieved from file input
   */
  setupTile(file: File) {
    let reader = new FileReader();
    let tile = new Tile(file.name);
    let context = this;
    reader.onload = function(event) {
      tile.setImage(new Image().setSrc(String(event.target.result)));
      context.saveTile(tile);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Saves a Tile object to the tiles array and checks if import is complete
   * @param {Tile} tile Tile to be saved
   */
  saveTile(tile: Tile) {
    this.tiles.set(tile.id, tile);
    this.step();
    if(this.ready()) {
      this.readyCallback()
    }
  }

  step() {
    this.saved++;
    if(this.saved >= this.importSize) 
      this.state = importStates.ready;
  }

  ready() {
    return this.state == importStates.ready;
  }

  completed() {
    this.state = importStates.complete;
  }
}