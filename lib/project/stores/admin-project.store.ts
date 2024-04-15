import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { AdminProjectEntity } from '../entities/admin-project.entity';
import { ProjectTypeEnum } from '../types/project-type.enum';

type StoreT = AdminProjectEntity & {
  readme: string;
};

export const AdminProjectStore = createSlice({
  name: 'admin-project',
  initialState: {
    name: '',
    attachments: [],

    readme: '',
  } as StoreT,
  reducers: {
    setType: (state, action: PayloadAction<ProjectTypeEnum>) => {
      state.type = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload || '';
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload || '';
    },
    setFooter: (state, action: PayloadAction<string>) => {
      state.footer = action.payload || '';
    },
    setREADME: (state, action: PayloadAction<string>) => {
      state.readme = action.payload || '';
    },
  },
  extraReducers(builder) {
    builder.addCase(
      AdminProjectEntity.self.load.thunk.fulfilled,
      (state, { payload }) => {
        const res: AdminProjectEntity = payload as any;
        // window.location.href = `./${res.id}`;

        state.id = res.id;
        state.name = res.name;
        state.type = res.type;
        state.description = res.description;
        state.footer = res.footer;

        state.attachments = res.attachments
          .concat(
            res.attachments.map(
              (k) => new AdminAttachmentEntity({ ...k, path: '/test/' }),
            ),
          )
          .concat(
            res.attachments.map(
              (k) => new AdminAttachmentEntity({ ...k, path: '/test2/' }),
            ),
          );

        console.log(state.attachments);
        // TODO:
      },
    );
  },
});
