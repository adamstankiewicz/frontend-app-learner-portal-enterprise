import { useEffect, useState } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform/utils';
import Plotly from 'plotly.js-dist';

import { getLearnerSkillLevels, getLearnerProfileInfo } from './service';
import { getSpiderChartData, prepareSpiderChartData } from './utils';

export function useLearnerProfileData(username) {
  const [profileData, setLearnerProfileData] = useState();
  const [fetchError, setFetchError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const data = await getLearnerProfileInfo(username);
          setLearnerProfileData(data);
        } catch (error) {
          logError(error);
          setFetchError(error);
        }
      }
    };
    fetchData();
  }, [username]);
  return [profileData, fetchError];
}

export function useLearnerSkillLevels(jobId) {
  const [learnerSkillLevels, setLearnerSkillLevels] = useState();
  const [fetchError, setFetchError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (jobId) {
        try {
          const response = await getLearnerSkillLevels(jobId);
          setLearnerSkillLevels(response.data);
        } catch (error) {
          logError(error);
          setFetchError(error);
        }
      }
      return undefined;
    };
    fetchData();
  }, [jobId]);
  return [camelCaseObject(learnerSkillLevels), fetchError];
}

export function usePlotlySpiderChart(categories) {
  useEffect(() => { // eslint-disable-line consistent-return
    if (!categories) {
      return [];
    }

    const [
      jobName,
      topCategories,
      averageScores,
      learnerScores,
    ] = prepareSpiderChartData(categories);

    const [data, layout, config] = getSpiderChartData(
      jobName,
      topCategories,
      averageScores,
      learnerScores,
    );

    Plotly.newPlot('skill-levels-spider', data, layout, config);
  }, [categories]);
}
