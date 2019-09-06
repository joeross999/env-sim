import * as React from 'react';
import { Icon } from './Icon';
import  { Tile } from '../TilemapClasses';

type selectorProps = {
  onChange: Function,
  tile: Tile,
}

export class TilePropertiesSelector extends React.Component<selectorProps, {}> {
  render() {   return (
    <div className="tilePropertiesSelector" id={"prop-selector-" + this.props.tile.id}>
      <Icon size={this.props.tile.width} source={this.props.tile.image.src}></Icon>
      
    </div>
  )
  }
}