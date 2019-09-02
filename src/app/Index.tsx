
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App';
import "./css/index.css";
import "./globals.tsx";

declare let module: any;

ReactDOM.render(<App />, 
document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}