import * as React from 'react';
import { Icon } from './Icon';
import { Select } from './FormElements'
import  { Tile } from '../TilemapClasses';
import { string } from 'prop-types';

type selectorProps = {
  onChange: (tileType: string, options: Map<string, string>) => void,
  tile: Tile,
}

type selectorState = {
  tileType: string,
  options:  Map<string, string>,
}

let tileTypeSelectorOptions = new Map([['select', 'Tile Type'], ['terrain', 'Terrain'], ['decoration', 'Decoration'], ['variable', 'Variable']])

export class TilePropertiesSelector extends React.Component<selectorProps, selectorState> {
  constructor(props: selectorProps) {
    super(props);
    this.state = {
      tileType: this.props.tile.type ? this.props.tile.type : 'select',
      options: new Map<string, string>(),
    }
  }

  tileChange() {
    this.props.onChange(this.state.tileType, this.state.options);
  }

  changeType(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({tileType: e.target.value}, () => {
      this.tileChange();
    });
  }

  setOption(key: string, value: string) {
    this.setState((state) => {
      return {
        options: new Map<string, string>([...state.options, ...new Map<string, string>([[key, value]])])
      }
    }, () => {
      this.tileChange();
    });
  }

  render() {   
    let options: JSX.Element = null;
    let obstruction: JSX.Element = <div><span>Not Walkable: </span><input type="checkbox" onChange={(e) => {this.setOption('obstruction', String(e.target.checked))}} id={"tile-" + this.props.tile.id + "-obstruction"}/></div>;
    let animationGroup: JSX.Element = <div><span>Animation Group</span><input type="text" onChange={(e) => {this.setOption('animationGroup', e.target.value)}} id={"tile-" + this.props.tile.id + "-animation-group"}/></div>
    let animationOrder: JSX.Element = <div><span>Animation Order</span><input type="number" onChange={(e) => {this.setOption('animationOrder', e.target.value)}} id={"tile-" + this.props.tile.id + "-animation-order"}/></div>
    switch(this.state.tileType) {
      case 'select': 
         options = <span>Select a tile type for more options</span>;
         break;
      case 'terrain': 
        options = 
          <div>
            {obstruction}
          </div>;
        break;
      case 'decoration':
        options = 
          <div>
            {obstruction}
          </div>
        break;
      case 'variable':
        options = 
        <div>
          {animationGroup}
          {animationOrder}
          {obstruction}
        </div>
    }
    return (
    <div className="tilePropertiesSelector" id={"prop-selector-" + this.props.tile.id}>
      <Icon size={this.props.tile.width} source={this.props.tile.image.src}></Icon>
      <Select class="tileTypeSelector" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {this.changeType(e)}} options={tileTypeSelectorOptions} selected={this.state.tileType}></Select>
      {options}
    </div>
  )
  }
}