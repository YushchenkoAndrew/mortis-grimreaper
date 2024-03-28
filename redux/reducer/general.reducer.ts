import { createSlice } from '@reduxjs/toolkit';

// import { SettingEntity } from '../../entities/setting/setting.entity';

// function State2Mode(state: boolean) {
//   return state
//     ? { state: true, name: 'Dark Mode', icon: 'moon' }
//     : { state: false, name: 'Light Mode', icon: 'sun' };
// }

// type GeneralStoreT = {
//   loaded: boolean;

//   mode: ReturnType<typeof State2Mode>;
//   res: SettingEntity;
// };

// export const generalStore = createSlice({
//   name: 'general',
//   initialState: {
//     loaded: false,
//     mode: { state: true, name: 'Dark Mode', icon: 'moon' },

//     res: null,
//   } as GeneralStoreT,
//   reducers: {
//     invertMode: (state) => {
//       state.mode = State2Mode(!state.mode.state);
//     },
//   },
//   extraReducers(builder) {
//     builder.addCase(
//       SettingEntity.self.findOne.fulfilled,
//       (state, { payload }) => {
//         const res: SettingEntity = payload as any;
//         state.loaded = true;

//         state.res = res;
//         state.mode = State2Mode(res.mode);
//       },
//     );

//     builder.addCase(SettingEntity.self.save.fulfilled, (state, { payload }) => {
//       state.res = payload as any;
//     });
//   },
// });
