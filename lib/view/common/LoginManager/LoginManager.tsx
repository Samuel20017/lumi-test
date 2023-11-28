import { FormEvent, useState } from "react";
import styles from "./LoginManager.module.css";
import { loginWithEmailAndPassword } from "../Api/LoginApi";
import useAppState from "../AppState/useAppState";

export interface ILoginManagerProps {
  onToMannyAttempts: () => void;
  onLoginFail: () => void;
  onError: () => void;
}

const LoginManager = (props: ILoginManagerProps) => {
  const { storeSessionState } = useAppState();
  const [loading, setLoading] = useState(false);
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const callLoginApi = async (email: string, password: string) => {
    setLoading(true);
    const response = await loginWithEmailAndPassword({
      email,
      password,
    });
    setLoading(false);

    if (response.status === 429) {
      props.onToMannyAttempts && props.onToMannyAttempts();
    } else if (response.status === 401) {
      props.onLoginFail && props.onLoginFail();
    } else if (!response.isSuccess) {
      props.onError && props.onError();
    } else {
      storeSessionState({ isLogin: true, ...response.body });
    }
  };

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!validateForm()) return;
    callLoginApi(inputEmail!, inputPassword!);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (isEmpty(inputEmail)) {
      errors["email"] = "El correo electrónico es requerido";
    } else if (!isValidEmail(inputEmail)) {
      errors["email"] = "El correo electrónico no es válido";
    }

    if (isEmpty(inputPassword)) {
      errors["password"] = "La contraseña es requerida";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const isEmpty = (value: string) => {
    return value.trim() === "";
  };

  const isValidEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  return (
    <section className={styles.root}>
      <h1>Inicia sesión</h1>
      <h4>Inicia Sesión con tu usuario y contraseña</h4>
      <form className={styles.formContainer} onSubmit={onSubmit}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="email">
            Correo electrónico:
          </label>
          <input
            disabled={loading}
            className={styles.input}
            id="email"
            type="email"
            value={inputEmail}
            onChange={(evt) => setInputEmail(evt.target.value)}
          />
          {errors["email"] && (
            <span className={styles.error}>{errors["email"]}</span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="password">
            Contraseña
          </label>
          <input
            disabled={loading}
            className={styles.input}
            id="password"
            type="password"
            value={inputPassword}
            onChange={(evt) => setInputPassword(evt.target.value)}
          />
          {errors["password"] && (
            <span className={styles.error}>{errors["password"]}</span>
          )}
        </div>
        <div className={styles.buttonContainer}>
          {loading && <div className={styles.loading} />}
          {!loading && (
            <button className={styles.button} type="submit">
              Login
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default LoginManager;
