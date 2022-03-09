import { Log } from "@microsoft/sp-core-library";
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters,
} from "@microsoft/sp-listview-extensibility";
import { Dialog } from "@microsoft/sp-dialog";

import * as strings from "SampleCommandButtonsCommandSetStrings";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISampleCommandButtonsCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = "SampleCommandButtonsCommandSet";

export default class SampleCommandButtonsCommandSet extends BaseListViewCommandSet<ISampleCommandButtonsCommandSetProperties> {
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, "Initialized SampleCommandButtonsCommandSet");
    return Promise.resolve();
  }

  public onListViewUpdated(
    event: IListViewCommandSetListViewUpdatedParameters
  ): void {
    // hide button when 1 item is not selected
    const one_item_selected: Command = this.tryGetCommand("ONE_ITEM_SELECTED");
    if (one_item_selected) {
      one_item_selected.visible = event.selectedRows.length === 1;
    }
    // hide button when 2 item is not selected
    const two_item_selected: Command = this.tryGetCommand("TWO_ITEM_SELECTED");
    if (two_item_selected) {
      two_item_selected.visible = event.selectedRows.length === 2;
    }
    // show always visible items
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case "ONE_ITEM_SELECTED":
        Dialog.alert(
          `ONE_ITEM_SELECTED command checked; Title = ${event.selectedRows[0].getValueByName(
            "Title"
          )}`
        );
        break;
      case "TWO_ITEM_SELECTED":
        Dialog.alert(
          `TWO_ITEM_SELECTED command checked; Title = ${event.selectedRows[0].getValueByName(
            "Title"
          )}`
        );
        break;
      case "ALWAYS_ON":
        Dialog.alert(`ALWAYS_ON command checked`);
        break;
      default:
        throw new Error("Unknown command");
    }
  }
}
