import * as React from 'react';
import styles from '../ApolloViewerReact/ApolloViewerReact.module.scss';
import { IApolloMissionProps } from './';

const ApolloMission: React.FC<IApolloMissionProps> = (props) => {

  /**
   * Handle the click event when user wants to remove a mission.
   *
   * @private
   * @param {React.MouseEvent<HTMLAnchorElement>} event
   */
  const handleOnRemoveClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    // because we're using a link as a button, make sure it doesn't navigate anywhere
    event.preventDefault();

    // raise the event 'onRemoveMission' and pass the mission to remove
    //  let the upstream components handle what happens
    props.onRemoveMission(props.mission);
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className="ms-textAlignRight"><strong>ID:</strong></td>
            <td>{props.mission.id}</td>
          </tr>
          <tr>
            <td className="ms-textAlignRight"><strong>Name:</strong></td>
            <td>{props.mission.name}</td>
          </tr>
          <tr>
            <td className="ms-textAlignRight"><strong>Date:</strong></td>
            <td>{props.mission.launch_date} - {props.mission.end_date}</td>
          </tr>
          <tr>
            <td className="ms-textAlignRight"><strong>Summary:</strong></td>
            <td>{props.mission.summary}</td>
          </tr>
        </tbody>
      </table>
      <a href={props.mission.wiki_href} className={styles.button}>
        <span className={styles.label}>Learn more</span>
      </a>
      <a href="#" className={styles.button} onClick={(event) => handleOnRemoveClick(event)}>
        <span className={styles.label}>Remove Mission</span>
      </a>
    </div>
  );
};

export default ApolloMission;