import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { NumberService } from '../../common';
import { ObjectLiteral } from '../../common/types';
import { ProjectPageEntity } from '../entities/project-page.entity';

type StoreT = ProjectPageEntity & {
  barcode: ObjectLiteral;
};

export const ProjectsStore = createSlice({
  name: 'project',
  initialState: { page: 0, barcode: {}, result: [] } as StoreT,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      ProjectPageEntity.self.select.thunk.fulfilled,
      (state, { payload }) => {
        const res: ProjectPageEntity = payload as any;

        state.page = res.page;
        state.per_page = res.per_page;
        state.total = res.total;

        state.result.push(...res.result);

        const seed = moment().startOf('hour').unix() + '';
        const index = NumberService.random(res.result.length, 0, seed);
        if (res.result[index]) state.barcode[res.result[index].id] = true;
      },
    );
  },
});
