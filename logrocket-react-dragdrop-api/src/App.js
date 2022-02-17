// https://blog.logrocket.com/create-a-drag-and-drop-component-with-react-dropzone/

import React from "react";
import DropZone from "./dropzone/DropZone";
import "./App.css";

function App() {
  return (
    <div>
      <p className="title">React Drag and Drop Image Upload</p>
      <div className="content">
        <DropZone />
      </div>
    </div>
  );
}
export default App;
