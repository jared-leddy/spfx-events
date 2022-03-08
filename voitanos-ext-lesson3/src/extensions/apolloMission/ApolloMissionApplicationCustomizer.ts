import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ApolloMissionApplicationCustomizerStrings';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ApolloMissionApplicationCustomizer.module.scss';
import { IMission } from '../../models';
import { MissionService } from '../../services';

const LOG_SOURCE: string = 'ApolloMissionApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IApolloMissionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ApolloMissionApplicationCustomizer
  extends BaseApplicationCustomizer<IApolloMissionApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this._renderPlaceholders();

    return Promise.resolve();
  }

  private _onDispose(): void { } // _onDispose()

  /**
   *
   *
   * @private
   * @returns {void}
   * @memberof ApolloMissionApplicationCustomizersApplicationCustomizer
   */
  private _renderPlaceholders(): void {
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Top) was not found.');
        return;
      }

      // if it is available, and access to domElement, update contents
      if (this._topPlaceholder.domElement) {
        this._topPlaceholder.domElement.innerHTML =
          this._getPlaceholderHtml(MissionService.getMission('AS-506'), 'Moon Landing');
      }
    } // top placeholder

    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error('The expected placeholder (Bottom) was not found.');
        return;
      }

      // if it is available, and access to domElement, update contents
      if (this._bottomPlaceholder.domElement) {
        this._bottomPlaceholder.domElement.innerHTML =
          this._getPlaceholderHtml(MissionService.getMission('AS-512'), 'Last Moon Visit');
      }
    } // top placeholder
  }

  /**
   * Create HTML for insertion into a placeholder on the page.
   *
   * @private
   * @param {IMission}        mission       Apollo mission.
   * @param {string}          prefixMessage String to add before body.
   * @returns {string}                      Html string for insertion into placeholder.
   * @memberof SpaceXMissionNewsApplicationCustomizer
   */
  private _getPlaceholderHtml(mission: IMission, prefixMessage: string): string {
    const missionTime: string = `${this._getLocalizedTimeString(new Date(mission.launch_date))}`;

    const placeholderBody: string = `
            <div class="${styles.app}">
              <div class="ms-bgColor-themeDark ms-fontColor-white ${styles.footer}">
                ${escape(prefixMessage)}:  ${escape(mission.name)} on ${escape(missionTime)}
              </div>
            </div>`;

    return placeholderBody;
  }

  /**
   * Creates localized time string of the provided date/time.
   *
   * @private
   * @param {Date} dateTimestamp  Timestamp to convert to localized time.
   * @returns {string}            Localized time string in human readable format.
   * @memberof SpaceXMissionNewsApplicationCustomizer
   */
  private _getLocalizedTimeString(dateTimestamp: Date): string {
    return `${this._getMonthName(dateTimestamp.getMonth())} ${dateTimestamp.getDate()}, ${dateTimestamp.getFullYear()}`;
  }

  /**
   * Returns a month name based on the provided index.
   *
   * @private
   * @param {number} monthIndex   Month number (0-index).
   * @returns {string}            Month name.
   * @memberof SpaceXMissionNewsApplicationCustomizer
   */
  private _getMonthName(monthIndex: number): string {
    const monthNames: string[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return monthNames[monthIndex];
  }

}
