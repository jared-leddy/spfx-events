// https://spknowledge.com/2021/07/13/spfx-uploading-files-using-react-dropzone/

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "HelloWorldWebPartStrings";
import HelloWorld from "./components/HelloWorld";
import { IHelloWorldProps } from "./components/IHelloWorldProps";

import { sp } from "@pnp/sp";

export interface IHelloWorldWebPartProps {
  description?: string;
  webSerUrl?: any;
  asyncUpload?: any;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  public onInit(): Promise<void> {
    sp.setup(this.context);
    return Promise.resolve();
  }
  public render(): void {
    const element = React.createElement(HelloWorld, {
      webSerUrl: this.context.pageContext.web.serverRelativeUrl,
      asyncUpload: this.properties.asyncUpload,
    });

    ReactDom.render(element, this.domElement);
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
                PropertyPaneToggle("asyncUpload", {
                  label: "Use Async Upload",
                  onText: "Enable",
                  offText: "Disable",
                  key: "useAsyncUploadFieldToggle",
                  checked: this.properties.asyncUpload,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
