import { createContext, useContext, useMemo } from 'react';
import { Step } from 'react-joyride';
import { useSetState } from 'react-use';

interface TourState {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  tourActive: boolean;
}

interface ProjectTourState extends TourState {
  textEditorOpen: boolean;
}

const homeTourState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
};

const projectTourState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
  textEditorOpen: false,
};

export const TourContext = createContext({
  homeTour: homeTourState,
  setHomeTour: () => undefined,
  projectTour: projectTourState,
  setProjectTour: () => undefined,
  editorTour: projectTourState,
  setEditorTour: () => undefined,
});
TourContext.displayName = 'Tour';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TourProvider(props: any) {
  const [homeTour, setHomeTour] = useSetState(homeTourState);
  const [projectTour, setProjectTour] = useSetState(projectTourState);
  const [editorTour, setEditorTour] = useSetState(projectTourState);

  const value = useMemo(
    () => ({
      homeTour,
      setHomeTour,
      projectTour,
      setProjectTour,
      editorTour,
      setEditorTour,
    }),
    [
      homeTour,
      setHomeTour,
      projectTour,
      setProjectTour,
      editorTour,
      setEditorTour,
    ]
  );

  return <TourContext.Provider value={value} {...props} />;
}

export function useTour(): {
  setHomeTour: (
    patch:
      | Partial<TourState>
      | ((previousState: TourState) => Partial<TourState>)
  ) => void;
  homeTour: TourState;
  setProjectTour: (
    patch:
      | Partial<ProjectTourState>
      | ((previousState: ProjectTourState) => Partial<ProjectTourState>)
  ) => void;
  projectTour: ProjectTourState;
  setEditorTour: (
    patch:
      | Partial<ProjectTourState>
      | ((previousState: ProjectTourState) => Partial<ProjectTourState>)
  ) => void;
  editorTour: ProjectTourState;
} {
  const context = useContext(TourContext);

  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }

  return context;
}
