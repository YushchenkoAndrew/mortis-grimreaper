import React, { useRef } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import { Config } from '../../config';
import { LoginEntity } from '../../entities/auth/login.entity';
import { loginStore } from '../../redux/reducer/admin/login.reducer';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';

export default function Login() {
  const dispatch = useAppDispatch();
  const entity = useAppSelector((state) => state.admin.login);
  const reCaptchaRef = useRef<ReCAPTCHA>(null);

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
                  value={entity.username}
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
                  value={entity.password}
                  onChange={(e) => {
                    const captcha = reCaptchaRef.current?.getValue();
                    if (!captcha) {
                      reCaptchaRef.current?.reset();
                      return toast('Please verify that you are not a bot', {
                        type: 'error',
                      });
                    }

                    // TODO: Send request to validate captcha

                    dispatch(loginStore.actions.setPassword(e.target.value));
                  }}
                />
              </div>
            </div>

            <ReCAPTCHA
              ref={reCaptchaRef}
              size="normal"
              sitekey={Config.self.captcha.sitekey}
            />

            <div>
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => dispatch(LoginEntity.self.save(entity))}
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
