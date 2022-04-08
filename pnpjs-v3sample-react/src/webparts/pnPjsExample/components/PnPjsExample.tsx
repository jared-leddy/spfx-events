import * as React from 'react';
import styles from './PnPjsExample.module.scss';
import { IPnPjsExampleProps } from './IPnPjsExampleProps';
// import interfaces
import { IFile, IResponseItem } from "./interfaces";

import { Caching } from "@pnp/queryable";
import { getSP } from "../pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import { Logger, LogLevel } from "@pnp/logging";
import { IItemUpdateResult } from "@pnp/sp/items";
import { Label, PrimaryButton } from '@microsoft/office-ui-fabric-react-bundle';

import Selector from './Selector'

export interface IAsyncAwaitPnPJsProps {
  description: string;
}

export interface IIPnPjsExampleState {
  items: IFile[];
  errors: string[];
}

export default class PnPjsExample extends React.Component<IPnPjsExampleProps, IIPnPjsExampleState> {
  private LOG_SOURCE = "🅿PnPjsExample";
  private LIBRARY_NAME = "RM_Dropzone_Staging";
  private _sp: SPFI;

  constructor(props: IPnPjsExampleProps) {
    super(props);
    // set initial state
    this.state = {
      items: [],
      errors: []
    };
    this._sp = getSP();
  }

  public componentDidMount(): void {
    // read all file sizes from Documents library
    this._readAllFilesSize();
  }

  public render(): React.ReactElement<IAsyncAwaitPnPJsProps> {
    try {
      // calculate total of file sizes
      const totalDocs: number = this.state.items.length > 0
        ? this.state.items.reduce<number>((acc: number, item: IFile) => {
          return (acc + Number(item.Size));
        }, 0)
        : 0;
      return (
        <div className={styles.pnPjsExample}>
          <h2>RM Tool SSIC Selection</h2>
          <Label>Records Pending SSIC Assignment:</Label>
          <table width="100%">
            <tr>
              <td><strong>File Name</strong></td>
              <td><strong>Unit</strong></td>
              <td><strong>Section</strong></td>
              <td><strong>Approval_Status</strong></td>
              <td><strong>SSIC</strong></td>
              <td><strong>Submit SSIC</strong></td>
            </tr>
            {this.state.items.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{item.Name}</td>
                  <td className='rmUnitValue'>{item.Unit}</td>
                  <td>{item.Section}</td>
                  <td>{item.ApprovalStatus}</td>
                  <td className='rmSelectContainer'>
                      <Selector></Selector>
                  </td>
                  <td>
                  <PrimaryButton onClick={this._updateTitles}>Submit</PrimaryButton>
                  </td>
                </tr>
              );
            })}
          </table>
        </div >
      );
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (render) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
    return null;
  }

  private _readAllFilesSize = async (): Promise<void> => {
    try {

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseItem[] = await spCache.web.lists
        .getByTitle(this.LIBRARY_NAME)
        .items
        .select("ID", "Title", "FileLeafRef", "File/Length", "Unit", "Section", "Approval_Status", "SSIC")
        .expand("File/Length")();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IFile[] = response.map((item: IResponseItem) => {
        return {
          Id: item.Id,
          Name: item.FileLeafRef,
          Size: item.File?.Length || 0,
          Unit: item.Unit,
          Section: item.Section,
          ApprovalStatus: item.Approval_Status,
          SSIC: item.SSIC || 'none'
        };
      });

      // Add the items to the state
      this.setState({ items });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  private _updateTitles = async (): Promise<void> => {
    try {
      //Will create a batch call that will update the title of each item
      //  in the library by adding `-Updated` to the end. 
      const [batchedSP, execute] = this._sp.batched();

      //Clone items from the state
      const items = JSON.parse(JSON.stringify(this.state.items));

      let res: IItemUpdateResult[] = [];

      for (let i = 0; i < items.length; i++) {
        // you need to use .then syntax here as otherwise the application will stop and await the result
        batchedSP.web.lists
          .getByTitle(this.LIBRARY_NAME)
          .items
          .getById(items[i].Id)
          .update({ Title: `${items[i].Name}-Updated` })
          .then(r => res.push(r));
      }
      // Executes the batched calls
      await execute();

      // Results for all batched calls are available
      for (let i = 0; i < res.length; i++) {
        //If the result is successful update the item
        //NOTE: This code is over simplified, you need to make sure the Id's match
        const item = await res[i].item.select("Id, Title")<{ Id: number, Title: string }>();
        items[i].Name = item.Title;
      }

      //Update the state which rerenders the component
      this.setState({ items });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_updateTitles) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }
}
