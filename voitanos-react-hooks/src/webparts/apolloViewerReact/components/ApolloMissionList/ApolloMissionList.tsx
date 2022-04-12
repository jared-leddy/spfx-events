import * as React from 'react';
import styles from '../ApolloViewerReact/ApolloViewerReact.module.scss';

import { IMission } from '../../../../models';

import { ApolloMission } from '../ApolloMission';
import { IApolloMissionListProps } from './';

const ApolloMissionList: React.FC<IApolloMissionListProps> = (props) => {

  /**
   * Generate a unique ID for the element to help React uniquely identify each element.
   *
   * @private
   * @param {IMission} mission    The mission to generate the unique ID for.
   * @returns {string}            Unique ID for the mission.
   */
  const getMissionUniqueId = (mission: IMission): string => {
    return (`${mission.id}|${mission.name.replace(' ', '_')}`).toLowerCase();
  };

  return (
    <div>
      {
        /*
         *  for each mission passed into this component,
         *    bind it to the ApolloMission component
         */
        props.missions?.map(mission => (
          <ApolloMission key={getMissionUniqueId(mission)}
            mission={mission}
            onRemoveMission={props.onDeleteMission} />
        ))
      }
    </div>
  );

};

export default ApolloMissionList;