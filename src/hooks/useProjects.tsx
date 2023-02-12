import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { db } from '@/lib/firebaseClient';
import useAuth from '@/hooks/useAuth';

import { Project } from '@/types';

interface IProjects {
  projectLoading: boolean | null;
  projects: Project[] | null;
}

const ProjectContext = createContext<IProjects>({
  projectLoading: false,
  projects: null,
});

interface ProjectProviderProps {
  children: React.ReactNode;
}
export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const { user } = useAuth();
  const [projectLoading, setProjectLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[] | null>(null);
  useEffect(() => {
    if (!user) {
      setProjects(null);
      return;
    }
    setProjectLoading(true);
    const q = query(
      collection(db, 'projects'),
      where('uid', '==', user?.uid),
      orderBy('lastOpened', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const arr: Project[] = [];
      snapshot.docs.map((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        arr.push(obj as Project);
      });
      setProjects(arr);
      setProjectLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, user]);

  const memoedValue = useMemo(
    () => ({
      projectLoading,
      projects,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectLoading, projects]
  );
  return (
    <ProjectContext.Provider value={memoedValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export default function useProjects() {
  return useContext(ProjectContext);
}
