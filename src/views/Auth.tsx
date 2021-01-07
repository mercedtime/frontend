import {
  FormEvent,
  ChangeEvent,
  MutableRefObject,
  RefObject,
  Dispatch,
  SetStateAction,
  useState,
  useRef,
} from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { ThemeProps } from "./Theme";
import { createAccount, login } from "../api";
import { isEmail, TOKEN_KEY } from "../util";
import "./Auth.css";

interface LoginProps {
  setLoggedIn?: Dispatch<SetStateAction<boolean>>;
}

interface AuthModalProps {
  signUp: boolean;
  signIn: boolean;
  setSignUp: (value: React.SetStateAction<boolean>) => void;
  setSignIn: (value: React.SetStateAction<boolean>) => void;
}

function useInput(): [
  MutableRefObject<string>,
  (event: ChangeEvent<HTMLInputElement>) => void
] {
  const ref = useRef("");
  return [
    ref,
    (event: ChangeEvent<HTMLInputElement>) => {
      ref.current = event.target.value;
    },
  ];
}

export function useAuthState(): AuthModalProps {
  const [signUp, setSignUp] = useState(false);
  const [signIn, setSignIn] = useState(false);
  return {
    signIn: signIn,
    signUp: signUp,
    setSignUp: setSignUp,
    setSignIn: setSignIn,
  };
}

export function AuthModal(props: ThemeProps & AuthModalProps & LoginProps) {
  return (
    <>
      <Modal show={props.signUp} onHide={() => props.setSignUp(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome aboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignUp
            close={() => props.setSignUp(false)}
            setLoggedIn={props.setLoggedIn}
          />
        </Modal.Body>
      </Modal>
      <Modal show={props.signIn} onHide={() => props.setSignIn(false)} centered>
        <Modal.Body>
          <Modal.Header closeButton>
            <Modal.Title>Welcome back</Modal.Title>
          </Modal.Header>
          <SignIn
            close={() => props.setSignIn(false)}
            setLoggedIn={props.setLoggedIn}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export function SignUp({
  close,
  setLoggedIn,
}: { close?: () => void } & LoginProps) {
  const [valid, setValid] = useState(false);
  const unameRef = useRef() as RefObject<HTMLInputElement>;
  const emailRef = useRef() as RefObject<HTMLInputElement>;
  const pwRef = useRef() as RefObject<HTMLInputElement>;
  const pw2Ref = useRef() as RefObject<HTMLInputElement>;

  const [pwVarify, setPwVarify] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    setError(null);
    event.preventDefault();
    event.stopPropagation();
    setValid(false);
    setPwVarify(false);

    if (form.checkValidity() === false) {
      return;
    }
    if (
      unameRef.current === null ||
      emailRef.current === null ||
      pwRef.current === null ||
      pw2Ref.current === null
    ) {
      setError("something has gone terribly wrong");
      return;
    }

    let email = emailRef.current.value;
    let pw = pwRef.current.value;
    if (pw !== pw2Ref.current.value) {
      setError("Repeated password incorrect");
      setPwVarify(false);
    } else {
      setPwVarify(true);
    }
    setValidEmail(email !== "" && isEmail(email));

    if (!pwVarify || !validEmail || error !== null) {
      return;
    }

    createAccount({
      name: unameRef.current.value,
      password: pw,
      email: email,
    }).then((resp) => {
      if ("error" in resp) {
        setError(resp.error);
        setValid(false);
        return;
      }
      setValid(true);
      localStorage.setItem(TOKEN_KEY, JSON.stringify(resp));
      if (setLoggedIn !== undefined) {
        setLoggedIn(true);
      }
      if (close !== undefined) {
        close();
      }
    });
  };

  return (
    <div className="auth sign-up" style={{ color: "black" }}>
      <Form noValidate validated={valid} onSubmit={submit}>
        <InputGroup className="mb-2">
          <Form.Control
            ref={unameRef}
            type="text"
            placeholder="Username"
            name="username"
          />
          <Form.Control
            ref={emailRef}
            type="email"
            placeholder="Email"
            name="email"
          />
        </InputGroup>
        <InputGroup className="mb-2">
          <Form.Control
            required
            type="password"
            placeholder="Password"
            minLength={8}
            autoComplete="new-password"
            ref={pwRef}
          />
        </InputGroup>
        <InputGroup className="mb-2">
          <Form.Control
            required
            type="password"
            placeholder="Repeat Password"
            minLength={8}
            autoComplete="new-password"
            ref={pw2Ref}
          />
        </InputGroup>

        {!pwVarify && (
          <Alert variant="danger" dismissible>
            Differing password
          </Alert>
        )}
        {!validEmail && (
          <Alert variant="danger" dismissible>
            Invalid email
          </Alert>
        )}
        {error !== null && (
          <Alert variant="danger" dismissible>
            {error}
          </Alert>
        )}
        <Button type="submit" id="modal-sign-up-submit">
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export function SignIn({
  close,
  setLoggedIn,
}: {
  close?: () => void;
} & LoginProps) {
  const unameRef = useRef() as RefObject<HTMLInputElement>;
  const pwRef = useRef() as RefObject<HTMLInputElement>;

  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      setValid(false);
      event.stopPropagation();
      return;
    }
    if (unameRef.current === null || pwRef.current === null) {
      // TODO display error
      return;
    }
    login(unameRef.current.value, pwRef.current.value).then((resp) => {
      if ("error" in resp) {
        setError(resp.error);
        setValid(false);
        event.stopPropagation();
        return;
      }
      setValid(true);
      localStorage.setItem(TOKEN_KEY, JSON.stringify(resp));
      if (setLoggedIn !== undefined) {
        setLoggedIn(true);
      }
      if (close !== undefined) {
        close();
      }
    });
  };

  return (
    <div className="auth sign-in" style={{ color: "black" }}>
      <Form validated={valid} onSubmit={submit} action="/test">
        <InputGroup className="mb-2">
          <Form.Control
            required
            ref={unameRef}
            type="text"
            placeholder="Username or Email"
            name="username"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid username.
          </Form.Control.Feedback>
        </InputGroup>
        <Form.Group>
          <Form.Control
            required
            ref={pwRef}
            type="password"
            placeholder="Password"
            name="password"
            minLength={8}
            autoComplete="current-password"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Check label="Remember Me" />
        </Form.Group>
        {error !== null && (
          <Alert variant="danger" dismissible>
            {error}
          </Alert>
        )}
        <Button type="submit">Sign In</Button>
      </Form>
    </div>
  );
}
