import { useRef } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import { Config } from '../../config';
import { LoginEntity } from '../../lib/auth/entities/login.entity';
import { LoginStore } from '../../lib/auth/stores/login.store';
import { useAppDispatch, useAppSelector } from '../../lib/common/store';
import ReCAPTCHA from 'react-google-recaptcha';
import { ErrorService } from '../../lib/common/error.service';
import { CaptchaEntity } from '../../lib/captcha/entities/captcha.entity';
import { AuthEntity } from '../../lib/auth/entities/auth.entity';
import InputFormElement from '../../components/Form/Elements/InputFormElement';
import { RecaptchaSizeEnum } from '../../lib/captcha/types/recaptcha-size.enum';

export default function () {
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
            <InputFormElement
              name="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => dispatch(LoginStore.actions.setUsername(e))}
              required
            />
            <InputFormElement
              name="Password"
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(e) => dispatch(LoginStore.actions.setPassword(e))}
              required
            />

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
                        CaptchaEntity.self.save.thunk(
                          new CaptchaEntity({ captcha }),
                        ),
                      ).unwrap();

                      await dispatch(
                        AuthEntity.self.save.thunk(
                          new LoginEntity({ username, password }),
                        ),
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
