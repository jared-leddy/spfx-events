import * as React from "react";
import styles from "./SpFxCrud.module.scss";
import { ISpFxCrudProps } from "./ISpFxCrudProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export default class SpFxCrud extends React.Component<ISpFxCrudProps, {}> {
  public render(): React.ReactElement<ISpFxCrudProps> {
    return (
      <div className={styles.SpFxCrud}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <p className={styles.description}>
                {escape(this.props.description)}
              </p>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Item ID:</div>
                <input type="text" id="itemId"></input>
              </div>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Full Name</div>
                <input type="text" id="fullName"></input>
              </div>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Age</div>
                <input type="text" id="age"></input>
              </div>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>All Items:</div>
                <div id="allItems"></div>
              </div>
              <div className={styles.buttonSection}>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.createItem}>
                    Create
                  </span>
                </div>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.getItemById}>
                    Read
                  </span>
                </div>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.getAllItems}>
                    Read All
                  </span>
                </div>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.updateItem}>
                    Update
                  </span>
                </div>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.deleteItem}>
                    Delete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create Item
  private createItem = (): void => {
    const body: string = JSON.stringify({
      Title: document.getElementById("fullName")["value"],
      Age: document.getElementById("age")["value"],
    });
    this.props.context.spHttpClient
      .post(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDetails')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            "Accept": "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
          },
          body: body,
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(`Item created successfully with ID: ${responseJSON.ID}`);
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Get Item by ID
  private getItemById = (): void => {
    const id: number = document.getElementById("itemId")["value"];
    if (id > 0) {
      this.props.context.spHttpClient
        .get(
          this.props.context.pageContext.web.absoluteUrl +
            `/_api/web/lists/getbytitle('EmployeeDetails')/items(${id})`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "odata-version": "",
            },
          }
        )
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            response.json().then((responseJSON) => {
              console.log(responseJSON);
              document.getElementById("fullName")["value"] = responseJSON.Title;
              document.getElementById("age")["value"] = responseJSON.Age;
            });
          } else {
            response.json().then((responseJSON) => {
              console.log(responseJSON);
              alert(
                `Something went wrong! Check the error in the browser console.`
              );
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert(`Please enter a valid item id.`);
    }
  };

  // Get all items
  private getAllItems = (): void => {
    this.props.context.spHttpClient
      .get(
        this.props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('EmployeeDetails')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            "Accept": "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            var html = `<table><tr><th>ID</th><th>Full Name</th><th>Age</th></tr>`;
            responseJSON.value.map((item, index) => {
              html += `<tr><td>${item.ID}</td><td>${item.Title}</td><td>${item.Age}</td></li>`;
            });
            html += `</table>`;
            document.getElementById("allItems").innerHTML = html;
            console.log(responseJSON);
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Update Item
  private updateItem = (): void => {
    const id: number = document.getElementById("itemId")["value"];
    const body: string = JSON.stringify({
      Title: document.getElementById("fullName")["value"],
      Age: document.getElementById("age")["value"],
    });
    if (id > 0) {
      this.props.context.spHttpClient
        .post(
          `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDetails')/items(${id})`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "Content-type": "application/json;odata=nometadata",
              "odata-version": "",
              "IF-MATCH": "*",
              "X-HTTP-Method": "MERGE",
            },
            body: body,
          }
        )
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            alert(`Item with ID: ${id} updated successfully!`);
          } else {
            response.json().then((responseJSON) => {
              console.log(responseJSON);
              alert(
                `Something went wrong! Check the error in the browser console.`
              );
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert(`Please enter a valid item id.`);
    }
  };

  // Delete Item
  private deleteItem = (): void => {
    const id: number = parseInt(document.getElementById("itemId")["value"]);
    if (id > 0) {
      this.props.context.spHttpClient
        .post(
          `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDetails')/items(${id})`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "Content-type": "application/json;odata=verbose",
              "odata-version": "",
              "IF-MATCH": "*",
              "X-HTTP-Method": "DELETE",
            },
          }
        )
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            alert(`Item ID: ${id} deleted successfully!`);
          } else {
            alert(`Something went wrong!`);
            console.log(response.json());
          }
        });
    } else {
      alert(`Please enter a valid item id.`);
    }
  };
}
