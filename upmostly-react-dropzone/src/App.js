import React, { Component } from "react";
import Dropzone from "react-dropzone";

class App extends Component {
  onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
  };

  render() {
    const maxSize = 1048576;
    return (
      <div className="text-center mt-5">
        <Dropzone
          onDrop={this.onDrop}
          accept="image/png"
          minSize={0}
          maxSize={maxSize}
        >
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {!isDragActive && "Click here or drop a file to upload!"}
              {isDragActive && !isDragReject && "Drop it like it's hot!"}
              {isDragReject && "File type not accepted, sorry!"}
            </div>
          )}
        </Dropzone>
      </div>
    );
  }
}

export default App;
