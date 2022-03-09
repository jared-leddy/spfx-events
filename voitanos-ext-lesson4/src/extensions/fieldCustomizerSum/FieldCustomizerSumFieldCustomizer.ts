import { Log } from "@microsoft/sp-core-library";
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters,
} from "@microsoft/sp-listview-extensibility";

import * as strings from "FieldCustomizerSumFieldCustomizerStrings";
import styles from "./FieldCustomizerSumFieldCustomizer.module.scss";

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFieldCustomizerSumFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = "FieldCustomizerSumFieldCustomizer";

export default class FieldCustomizerSumFieldCustomizer extends BaseFieldCustomizer<IFieldCustomizerSumFieldCustomizerProperties> {
  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(
      LOG_SOURCE,
      "Activated FieldCustomizerSumFieldCustomizer with properties:"
    );
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(
      LOG_SOURCE,
      `The following string should be equal: "FieldCustomizerSumFieldCustomizer" and "${strings.Title}"`
    );
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    const listItem = event.listItem;
    const variableA: number = parseInt(listItem.getValueByName("A")); // column name created as "A"
    const variableB: number = parseInt(listItem.getValueByName("B")); // column name crated as "B"
    console.log(`VariableA: ${variableA}`);
    console.log(`VariableB: ${variableB}`);

    const mathResult: number = variableA + variableB;

    event.domElement.innerHTML = `${variableA} + ${variableB} = <strong>${mathResult}</strong>`;
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    super.onDisposeCell(event);
  }
}
