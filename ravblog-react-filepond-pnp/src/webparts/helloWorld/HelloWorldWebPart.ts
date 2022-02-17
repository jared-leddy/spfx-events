import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "HelloWorldWebPartStrings";
import HelloWorld from "./components/HelloWorld";
import { IHelloWorldProps } from "./components/IHelloWorldProps";
import { IHelloWorldState } from "./components/IHelloWorldState";
import styles from "./components/HelloWorld.module.scss";
import { PrimaryButton } from "office-ui-fabric-react";
import { autobind } from "office-ui-fabric-react/lib/Utilities";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  constructor(props: IHelloWorldProps, state: IHelloWorldState) {
    super(props);
    sp.setup({
      spfxContext: this.props.context,
    });
    this.state = { files: [] };
    registerPlugin(
      FilePondPluginImageExifOrientation,
      FilePondPluginImagePreview
    );
  }
  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.HelloWorld}>
        <FilePond
          files={this.state.files}
          allowMultiple={true}
          onupdatefiles={(fileItems) => {
            this.setState({
              files: fileItems.map((fileItem) => fileItem.file),
            });
          }}
        />
        <br />
        <PrimaryButton text="Upload" onClick={this._uploadFiles} />
      </div>
    );
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
  @autobind
  private async _uploadFiles() {
    this.state.files.forEach(function (file, i) {
      // you can adjust this number to control what size files are uploaded in chunks
      if (file.size <= 10485760) {
        // small upload
        const newfile = sp.web
          .getFolderByServerRelativeUrl("/sites/TheLanding/Books/")
          .files.add(file.name, file, true);
      } else {
        // large upload
        const newfile = sp.web
          .getFolderByServerRelativeUrl("/sites/TheLanding/Books/")
          .files.addChunked(file.name, file, (data) => {}, true);
      }
    });
    this.setState({ files: [] });
  }
}
