import { Tile, Tilemap } from './TilemapClasses';

interface dataInterface {
  tileset: Map<String, Tile>;
  gameTilemap: Tilemap,
  palatteTilemap: Tilemap,
};

export let Data: dataInterface = {
  tileset: new Map<String, Tile>(),
  gameTilemap: new Tilemap(800/16, 608/16),
  palatteTilemap: new Tilemap(100, 4),
}