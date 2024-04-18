import { createSlice } from '@reduxjs/toolkit';
import { AdminProjectPageEntity } from '../entities/admin-project-page.entity';

type StoreT = AdminProjectPageEntity;
// & {
//   avatar: string;
//   readme: string;
//   trash: ObjectLiteral<AdminAttachmentEntity>;
// };

export const AdminProjectsStore = createSlice({
  name: 'admin-projects',
  initialState: {
    page: 0,
    result: [],
  } as StoreT,
  reducers: {
    // setType: (state, action: PayloadAction<ProjectTypeEnum>) => {
    //   state.type = action.payload;
    // },
  },
  extraReducers(builder) {
    builder.addCase(
      AdminProjectPageEntity.self.select.thunk.fulfilled,
      (state, { payload }) => {
        const res: AdminProjectPageEntity = payload as any;

        state.page = res.page;
        state.per_page = res.per_page;
        state.total = res.total;

        state.result.push(...res.result);
      },
    );
  },
});
