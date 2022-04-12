import * as React from 'react';
import styles from './ApolloViewerReact.module.scss';
import {
  ApolloMissionList,
  IApolloViewerReactProps
} from '../';

import { escape } from '@microsoft/sp-lodash-subset';

import { IMission } from '../../../../models';
import { MissionService } from '../../../../services';

const ApolloViewerReact: React.FC<IApolloViewerReactProps> = (props) => {
  // init the state to an empty collection
  const [missions, setMissions] = React.useState<IMission[]>([]);

  // React hook implementation of the OOTB React lifecycle event
  //  `componentDidMount()` that fires after the component has been mounted
  React.useEffect(() => {
    setMissions(MissionService.getMissions());
  }, []);

  /**
   * Removes the specified mission from the state. This triggers an update to rendering.
   *
   * @private
   * @param {IMission} missionToRemove
   */
  const onRemoveMission = (missionToRemove: IMission): void => {
    const newMissions: IMission[] = missions.filter(mission => mission !== missionToRemove);

    setMissions(newMissions);
  };

  return (
    <div className={styles.apolloViewerReact}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.title}>Welcome to the Apollo Mission Viewer (React)!</span>

            <ApolloMissionList missions={missions} onDeleteMission={(mission) => onRemoveMission(mission)} />

          </div>
        </div>
      </div>
    </div>
  );

};

export default ApolloViewerReact;