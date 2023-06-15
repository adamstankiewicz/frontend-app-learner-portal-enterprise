import React, {
  useContext, useMemo, useState, useEffect,
} from 'react';

import { AppContext, ErrorPage } from '@edx/frontend-platform/react';
import { SearchData } from '@edx/frontend-enterprise-catalog-search';
import { useLearnerProfileData } from './data/hooks';
import { LoadingSpinner } from '../loading-spinner';
import AddJobRole from './AddJobRole';
import VisualizeCareer from './VisualizeCareer';
import { extractCurrentJobID } from './data/utils';

const MyCareerTab = () => {
  const { authenticatedUser } = useContext(AppContext);
  const { username } = authenticatedUser;

  const [learnerProfileData, learnerProfileDataFetchError] = useLearnerProfileData(
    username,
  );
  const [learnerProfileState, setLearnerProfileState] = useState();

  useEffect(() => {
    if (learnerProfileData) {
      setLearnerProfileState(learnerProfileData);
    }
  }, [learnerProfileData]);

  const isLoading = useMemo(
    () => {
      if (learnerProfileState || learnerProfileDataFetchError) {
        return false;
      }
      return true;
    },
    [
      learnerProfileState,
      learnerProfileDataFetchError,
    ],
  );

  if (learnerProfileDataFetchError) {
    return <ErrorPage status={learnerProfileDataFetchError.status} />;
  }

  if (isLoading) {
    return (
      <div className="py-5">
        <LoadingSpinner screenReaderText="loading my career data" />
      </div>
    );
  }

  const learnerCurrentJobID = extractCurrentJobID(learnerProfileState);

  return (
    <div>
      <SearchData>
        { !learnerCurrentJobID ? (
          <AddJobRole submitClickHandler={setLearnerProfileState} />
        ) : (
          <VisualizeCareer jobId={learnerCurrentJobID} submitClickHandler={setLearnerProfileState} />
        )}
      </SearchData>
    </div>
  );
};

export default MyCareerTab;
