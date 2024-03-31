import { useRef } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import { Config } from '../../config';
import { LoginEntity } from '../../entities/auth/login.entity';
import { loginStore } from '../../redux/reducer/admin/login.reducer';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import ReCAPTCHA from 'react-google-recaptcha';
import { ErrorService } from '../../lib/toast';
import { CaptchaEntity } from '../../entities/auth/captcha.entity';
import { AuthEntity } from '../../entities/auth/auth.entity';
import { RecaptchaSizeEnum } from '../../types/recaptcha-size.enum';

export default function Login() {
  const dispatch = useAppDispatch();
  const reCaptchaRef = useRef<ReCAPTCHA>(null);
  const { username, password, recaptcha } = useAppSelector(
    (state) => state.admin.login,
  );

  return (
    <>
      <Header title="Login" />

      <Container>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            <div className="flex-shrink-0">
              <img
                className="mx-auto h-20 w-auto rounded-full"
                src={Config.self.github.src}
                alt="Admin"
              />
            </div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  autoComplete="username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    dispatch(loginStore.actions.setUsername(e.target.value))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  autoComplete="current-password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    dispatch(loginStore.actions.setPassword(e.target.value))
                  }
                />
              </div>

              {/* <div class="relative">
    <input id="hs-toggle-password" type="password" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="Enter password" value="12345qwerty">
    <button type="button" data-hs-toggle-password='{
        "target": "#hs-toggle-password"
      }' class="absolute top-0 end-0 p-3.5 rounded-e-md dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
      <svg class="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
        <path class="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path class="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"/>
        <path class="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3"/>
      </svg>
    </button>
  </div> */}
            </div>

            <ReCAPTCHA
              ref={reCaptchaRef}
              size={RecaptchaSizeEnum[recaptcha]}
              sitekey={Config.self.captcha.sitekey}
            />

            <div>
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                type="button"
                onClick={() =>
                  ErrorService.envelop(
                    async () => {
                      if (!username || !password) {
                        throw new Error(`username or password can't be blank`);
                      }

                      const captcha =
                        recaptcha == RecaptchaSizeEnum.invisible
                          ? await reCaptchaRef.current?.executeAsync()
                          : reCaptchaRef.current?.getValue();

                      // prettier-ignore
                      if (!captcha) throw new Error('Please verify that you are not a robot');

                      await dispatch(
                        CaptchaEntity.self.save(new CaptchaEntity({ captcha })),
                      ).unwrap();

                      await dispatch(
                        AuthEntity.self.save(new LoginEntity({ username, password })), // prettier-ignore
                      ).unwrap();
                    },
                    async () => reCaptchaRef.current?.reset(),
                  )
                }
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
