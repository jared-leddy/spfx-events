import * as React from 'react';
import { Component, Fragment } from 'react';
import { FilePlanItemOptions } from "./interfaces";
import Select from 'react-select';

import { Caching } from "@pnp/queryable";
import { getSP } from "../pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import { Logger, LogLevel } from "@pnp/logging";

interface State {
  readonly isClearable: boolean;
  readonly isSearchable: boolean;
  items: FilePlanItemOptions[];
  errors: string[];
}

export default class Selector extends Component<{}, State> {
  private LOG_SOURCE = "🅿PnPjsExample";
  private LIBRARY_NAME = "RM_FilePlan_Working";
  private _sp: SPFI;

  state: State = {
    isClearable: true,
    isSearchable: true,
    items: [],
    errors: []
  };
  
  public componentDidMount() {
    // read all file sizes from Documents library
    this._sp = getSP();
    this.getFilePlanData();
  }

  toggleClearable = () =>
    this.setState((state) => ({ isClearable: !state.isClearable }));
  toggleSearchable = () =>
    this.setState((state) => ({ isSearchable: !state.isSearchable }));

  render() {
    const {
      toggleClearable,
      toggleSearchable,
    } = this;

    const { isClearable, isSearchable } =
      this.state;

    return (
      <Fragment>
        <div
          style={{
            color: 'hsl(0, 0%, 40%)',
            display: 'block',
            fontSize: 14,
            fontStyle: 'italic',
            marginTop: '10px',
          }}
        >
        <Select
          className="basic-single rmSSICValue rmSelect"
          classNamePrefix="select"
          isClearable={isClearable}
          isSearchable={isSearchable}
          name="SSIC"
          options={this.state.items}
        />

        </div>
      </Fragment>
    );
  }

  private getFilePlanData = async (): Promise<void> => {
    console.log(`_getFilePlanData: begin`);
    try {

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      // SSIC Field was originally called "Title"
      const response: FilePlanItemOptions[] = await spCache.web.lists
        .getByTitle(this.LIBRARY_NAME)
        .items
        .select("Unit", "Title", "SeriesTitle", "Description")
        .expand("File/Length")();

        console.log(`_getFilePlanData: results ${JSON.stringify(response)}`);

      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: FilePlanItemOptions[] = response.map((item: FilePlanItemOptions) => {
        console.log(`_getFilePlanData: item ${JSON.stringify(item)}`);
          return {
            FilePlanKey: `
              <div>
                <p>
                  <span class="rm-key-heading">${item.SSIC}: ${item.SeriesTitle}</span><br>
                  <span class="rm-key-body">${item.SeriesDescription}</span>
                </p>
              </div>
            `
          };
      });
      console.log(`_getFilePlanData: items ${JSON.stringify(items)}`);
      // Add the items to the state
      this.setState({ items });

      console.log(`_getFilePlanData: state ${JSON.stringify(this.state.items)}`);
      Promise.resolve();
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_getFilePlanData) - ${JSON.stringify(err)} - `, LogLevel.Error);
      Promise.reject();
    }
  }

  private _getUnitStaticValues = () => {
    const unitValue = document.querySelector('td.rmUnitValue').textContent;
    return unitValue;
  }
  private _getSSICSelectedValues = () => {
    const ssicValue = document.querySelector('input.rmSSICValue').textContent;
    return ssicValue;
  }
}