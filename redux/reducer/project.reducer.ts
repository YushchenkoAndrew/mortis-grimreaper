import { createSlice } from '@reduxjs/toolkit';
import { ProjectPageEntity } from '../../entities/project/project-page.entity';
import { ProjectEntity } from '../../entities/project/project.entity';
import { PageType, QueryType } from '../../types/request.type';

type ProjectStoreT = {
  query: PageType & QueryType;

  total: number;
  page: number;
  projects: ProjectEntity[];
};

export const projectStore = createSlice({
  name: 'project',
  initialState: { query: {}, total: 0, page: 0, projects: [] } as ProjectStoreT,
  reducers: {
    // invertMode: (state) => {
    //   state.mode = State2Mode(!state.mode.state);
    // },
  },
  extraReducers(builder) {
    builder.addCase(
      ProjectPageEntity.self.select.fulfilled,
      (state, { payload }) => {
        const res: ProjectPageEntity = payload.res as any;
        state.query = payload.options;

        state.page = res.page;
        state.total = res.total;
        res.result.forEach((e) => state.projects.push(e));
      },
    );
  },
});
