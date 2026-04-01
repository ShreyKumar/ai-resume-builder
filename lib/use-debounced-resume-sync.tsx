import { useEffect } from "react";
import { defaultResumeData, ResumeData } from "./resume-types";
import { useInterview } from "./interview-context";

/**
 * Debounces syncing a section's local form state up to the global resume context.
 * Sections that hold their own local copy of resumeData call this hook so the
 * live PDF preview updates without re-rendering on every keystroke.
 */
export function useDebouncedResumeSync(
  localResumeData: ResumeData = defaultResumeData,
  delayMs: number = 750
) {
  const { setResumeData } = useInterview();

  useEffect(() => {
    const timer = setTimeout(() => {
      setResumeData(localResumeData);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [localResumeData, setResumeData, delayMs]);
}
