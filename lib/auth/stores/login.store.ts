import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthEntity } from '../entities/auth.entity';
import { LoginEntity } from '../entities/login.entity';
import { RecaptchaSizeEnum } from '../../captcha/types/recaptcha-size.enum';

type LoginStoreT = Pick<LoginEntity, 'username' | 'password'> & {
  recaptcha: number;
};

export const LoginStore = createSlice({
  name: 'admin-login',
  initialState: {
    username: '',
    password: '',
    recaptcha: RecaptchaSizeEnum.invisible,
  } as LoginStoreT,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload || '';
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload || '';
    },
  },
  extraReducers(builder) {
    builder.addCase(AuthEntity.self.save.thunk.fulfilled, (_, { payload }) => {
      const res: AuthEntity = payload as any;

      if (!res.refresh_token) localStorage.removeItem('refresh_token');
      else localStorage.setItem('refresh_token', res.refresh_token);

      if (!res.access_token) localStorage.removeItem('access_token');
      else localStorage.setItem('access_token', res.access_token);
    });
  },
});
