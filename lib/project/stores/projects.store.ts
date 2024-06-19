import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { NumberService } from '../../common';
import { ObjectLiteral } from '../../common/types';
import { ProjectPageEntity } from '../entities/project-page.entity';

type StoreT = ProjectPageEntity & {
  request_id: string;
  barcode: ObjectLiteral;
};

export const ProjectsStore = createSlice({
  name: 'project',
  initialState: {
    request_id: null,
    page: 0,
    barcode: {},
    result: [],
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<ProjectPageEntity>) => {
      state.page = action.payload.page;
      state.per_page = action.payload.per_page;
      state.total = action.payload.total;

      state.result = action.payload.result;

      const seed = moment().startOf('hour').unix() + '';
      const index = NumberService.random(action.payload.result.length, 0, seed);
      if (action.payload.result[index]) state.barcode[action.payload.result[index].id] = true; // prettier-ignore
    },
    push: (state, action: PayloadAction<ProjectPageEntity>) => {
      state.page = action.payload.page;
      state.per_page = action.payload.per_page;
      state.total = action.payload.total;

      state.result.push(...action.payload.result);

      const seed = moment().startOf('hour').unix() + '';
      const index = NumberService.random(action.payload.result.length, 0, seed);
      if (action.payload.result[index]) state.barcode[action.payload.result[index].id] = true; // prettier-ignore
    },
    setPage: (state, action: PayloadAction<number>) => {
      if (state.result.length >= state.total) return;

      state.page = action.payload;
      state.request_id = uuid();
    },
  },
  extraReducers(builder) {},
});
