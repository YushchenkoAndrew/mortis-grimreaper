import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import InputTemplate from "./Inputs/InputTemplate";
import InputText from "./Inputs/InputText";
import InputValue from "./Inputs/InputValue";
import { Event } from "../pages/admin/projects/operation";
import { basePath } from "../config";
import styles from "./ContactMe.module.css";
import { DefaultRes } from "../types/request";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastDefault } from "../config/alert";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export interface ContactMeProps {}

type ContactMeType = {
  email: string;
  text: string;
};

export default function ContactMe(props: ContactMeProps) {
  const [contactMe, updateFields] = useState({} as ContactMeType);
  // const [errMessage, onErrHappen] = useState("");
  const reCaptchaRef = useRef<ReCAPTCHA>(null);

  function changeContactMe(event: Event) {
    updateFields({ ...contactMe, [event.target.name]: event.target.value });
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const toastId = toast.loading("Please wait...");
    if (!localStorage.getItem("id")) {
      return toast.update(toastId, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        ...ToastDefault,
      });
    }

    reCaptchaRef.current
      ?.executeAsync()
      .then((captcha) => {
        if (!captcha) {
          reCaptchaRef.current?.reset();
          return toast.update(toastId, {
            render: "It appears that you are a bot",
            type: "error",
            isLoading: false,
            ...ToastDefault,
          });
        }

        fetch(`${basePath}/api/email?id=${localStorage.getItem("id")}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...contactMe, captcha }),
        })
          .then((res) => res.json())
          .then((body: DefaultRes) => {
            reCaptchaRef.current?.reset();

            if (body.status !== "OK") {
              return toast.update(toastId, {
                render: body.message,
                type: "error",
                isLoading: false,
                ...ToastDefault,
              });
            }

            updateFields({ email: "", text: "" });
            toast.update(toastId, {
              render: body.message,
              type: "success",
              isLoading: false,
              ...ToastDefault,
            });
          })
          .catch((err) => {
            reCaptchaRef.current?.reset();
            return toast.update(toastId, {
              render: "Something went wrong",
              type: "error",
              isLoading: false,
              ...ToastDefault,
            });
          });
      })
      .catch((err) => {
        reCaptchaRef.current?.reset();
        return toast.update(toastId, {
          render: "Something went wrong",
          type: "error",
          isLoading: false,
          ...ToastDefault,
        });
      });
  }

  return (
    <div className="bg-dark container-fluid d-flex justify-content-center py-5">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Bounce}
        closeOnClick
        theme="colored"
        rtl={false}
        draggable
      />

      <div
        className="col-12 col-sm-11 col-md-10 col-lg-6"
        style={{ maxHeight: "800px" }}
      >
        <p
          className={`text-center text-light font-weight-bold mb-5 ${styles["text"]}`}
          style={{ fontSize: "3.5rem", letterSpacing: ".2rem" }}
        >
          CONTACT ME
        </p>

        <form className="pt-3" onSubmit={onSubmit}>
          <InputTemplate label="Email" labelClassName="text-light">
            <div className="input-group">
              <InputValue
                name="email"
                type="email"
                required
                value={contactMe.email}
                className="rounded"
                placeholder="your@email.com"
                onChange={changeContactMe}
              />
            </div>
          </InputTemplate>

          <InputTemplate label="Message" labelClassName="text-light">
            <InputText
              name="text"
              required
              rows={5}
              value={contactMe.text}
              placeholder="Your message..."
              onChange={changeContactMe}
            />
          </InputTemplate>

          <ReCAPTCHA
            ref={reCaptchaRef}
            size="invisible"
            sitekey={publicRuntimeConfig.RECAPTCHA_SITE_KEY}
          />

          <div className="d-flex my-4">
            <button type="submit" className="btn btn-lg btn-outline-light">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
