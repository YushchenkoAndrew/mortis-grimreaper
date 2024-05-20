import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminLinkEntity } from '../../link/entities/admin-link.entity';
import { LinkLinkableTypeEnum } from '../../link/types/link-linkable-type.enum';
import { AdminTagEntity } from '../../tag/entities/admin-tag.entity';
import { TagEntity } from '../../tag/entities/tag.entity';
import { TagTaggableTypeEnum } from '../../tag/types/tag-taggable-type.enum';
import { AdminProjectEntity } from '../entities/admin-project.entity';
import { ProjectTypeEnum } from '../types/project-type.enum';

type StoreT = AdminProjectEntity & {
  processing: boolean;
  readme: boolean;

  tag: string;
  del_tags: AdminTagEntity[];

  new_links: AdminLinkEntity[];
  del_links: AdminLinkEntity[];
};

export const AdminProjectFormStore = createSlice({
  name: 'admin-project-form',
  initialState: {
    type: ProjectTypeEnum.p5js,
    name: '',
    description: '',
    footer: '',
    readme: false,

    tag: '',
    del_tags: [],

    new_links: [],
    del_links: [],

    processing: false,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<AdminProjectEntity>) => {
      const res: AdminProjectEntity = action.payload as any;

      state.id = res.id;
      state.name = res.name;
      state.type = res.type;
      state.status = res.status;
      state.footer = res.footer;
      state.description = res.description;

      state.tags = res.tags;
      state.links = res.links;
      state.attachments = res.attachments;

      state.tag = '';
      state.del_tags = [];

      state.del_links = [];
      state.new_links = res.links.concat({ name: '', link: '' } as any);
    },
    reset: (state) => {
      state.id = null;
    },
    setType: (state, action: PayloadAction<ProjectTypeEnum>) => {
      state.type = action.payload;
      state.link = '';
      state.readme = false;
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
    setLink: (state, action: PayloadAction<string>) => {
      state.link = action.payload || '';
    },
    setTag: (state, action: PayloadAction<string>) => {
      state.tag = action.payload || '';
    },
    addTag: (state) => {
      if (!state.tag) return;

      state.tags.push(
        new AdminTagEntity({
          name: state.tag,
          taggable_id: state.id,
          taggable_type: TagTaggableTypeEnum.projects,
        }),
      );

      state.tag = '';
    },
    delTag: (state, action: PayloadAction<number>) => {
      const tag = state.tags[action.payload];
      if (!tag) return;

      state.tags.splice(action.payload, 1);
      if (tag.id) state.del_tags.push(tag);
    },
    setLinks: (state, action: PayloadAction<[string, string, number]>) => {
      const [key, value, index] = action.payload;
      if (!state.new_links[index]) return;

      state.new_links[index] = new AdminLinkEntity({
        ...(state.new_links[index] as any),
        name: key,
        link: value,
        linkable_id: state.id,
        linkable_type: LinkLinkableTypeEnum.projects,
      });
    },
    addLink: (state) => {
      if (!state.new_links.at(-1).link) return;

      const index = state.new_links.length - 1;
      state.new_links[index] = new AdminLinkEntity({
        ...state.new_links[index],
        name: state.new_links[index].name || state.new_links[index].link,
      } as any);

      state.new_links.push({ name: '', link: '' } as any);
    },
    delLink: (state, action: PayloadAction<number>) => {
      const link = state.new_links[action.payload];
      if (!link) return;

      state.new_links.splice(action.payload, 1);
      if (link.id) state.del_links.push(link);
    },
    invertREADME: (state) => {
      state.readme = !state.readme;
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(
  //     AdminProjectEntity.self.save.thunk.fulfilled,
  //     (_, { payload }) => {
  //       const res: ProjectEntity = payload as any;
  //       window.location.href = `./${res.id}`;
  //     },
  //   );
  // },
});
