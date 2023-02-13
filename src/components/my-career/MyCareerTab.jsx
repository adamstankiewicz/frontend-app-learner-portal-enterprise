import React, { useContext } from 'react';

import { AppContext, ErrorPage } from '@edx/frontend-platform/react';
import { useLearnerSkillQuiz } from './data/hooks';
import { LoadingSpinner } from '../loading-spinner';
import AddJobRole from './AddJobRole';
import VisualizeCareer from './VisualizeCareer';
import { getSkillQuiz } from './data/utils';

const MyCareerTab = () => {
  const { authenticatedUser } = useContext(AppContext);
  const { username } = authenticatedUser;

  const [learnerSkillQuiz, learnerSkillQuizFetchError] = useLearnerSkillQuiz(
    username,
  );

  if (learnerSkillQuizFetchError) {
    return <ErrorPage status={learnerSkillQuizFetchError.status} />;
  }

  if (!learnerSkillQuiz) {
    return (
      <div className="py-5">
        <LoadingSpinner screenReaderText="loading my career data" />
      </div>
    );
  }

  const skillQuiz = getSkillQuiz(learnerSkillQuiz);

  return (!skillQuiz) ? (
    <AddJobRole />
  ) : (
    <VisualizeCareer jobId={skillQuiz.currentJob} />
  );
};

export default MyCareerTab;
