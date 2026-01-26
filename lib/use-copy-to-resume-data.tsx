import { useEffect, useMemo } from "react";
import { defaultResumeData, ResumeData } from "./resume-types";
import { useInterview } from "./interview-context";

export const useCopyToResumeData = (
  localResumeData: ResumeData = defaultResumeData,
  intervalMs: number = 750
) => {
  const { setResumeData } = useInterview();

  useEffect(() => {
    console.log("Updating resume data from local state...", localResumeData);

    const timer = setTimeout(() => {
      setResumeData(localResumeData);
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [localResumeData]);
};