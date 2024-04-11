import React from 'react';
import './App.css';
import { Outlet } from "react-router-dom";
import {store} from './app/store'
import { Provider } from 'react-redux'
function App() {
  return (
    <Provider store={store}>
      <div className="App h-full w-full ">
          <Outlet/>
      </div>
    </Provider>
  );
}

export default App;