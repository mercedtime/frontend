import {
  FormEvent,
  ChangeEvent,
  MutableRefObject,
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
import "./Auth.scss";

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

export function AuthModal(props: ThemeProps & AuthModalProps) {
  return (
    <>
      <Modal show={props.signUp} onHide={() => props.setSignUp(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome aboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignUp close={() => props.setSignUp(false)} />
        </Modal.Body>
      </Modal>
      <Modal show={props.signIn} onHide={() => props.setSignIn(false)} centered>
        <Modal.Body>
          <Modal.Header closeButton>
            <Modal.Title>Welcome back</Modal.Title>
          </Modal.Header>
          <SignIn close={() => props.setSignIn(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export function SignUp({ close }: { close?: () => void }) {
  const [valid, setValid] = useState(false);
  const [unameRef, unameHandler] = useInput();
  const [pwRef, pwHandler] = useInput();
  const [pw2Ref, pw2Handler] = useInput();
  const [emailRef, emailHandler] = useInput();
  const reset = () => {
    unameRef.current = "";
    emailRef.current = "";
    pwRef.current = "";
    pw2Ref.current = "";
  };

  const [pwVarify, setPwVarify] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    setError(null);
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValid(false);
      return;
    }
    if (pwRef.current !== pw2Ref.current) {
      setPwVarify(false);
      setValid(false);
      return;
    }
    event.preventDefault();

    let u = {
      name: unameRef.current,
      password: pwRef.current,
      email: emailRef.current,
    };
    createAccount(u).then((resp) => {
      console.log(resp);
      if ("error" in resp) {
        setError(resp.error);
        setValid(false);
        return;
      }
      setValid(true);
      reset();
      if (close !== undefined) {
        close();
      }
    });
  };

  return (
    <div className="auth sign-up" style={{ color: "black" }}>
      <Form noValidate validated={valid} onSubmit={submit} action="/test">
        <InputGroup className="mb-2">
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            onChange={unameHandler}
          />
          <Form.Control
            type="text"
            placeholder="Email"
            name="email"
            onChange={emailHandler}
          />
        </InputGroup>
        <InputGroup className="mb-2">
          <Form.Control
            required
            type="password"
            placeholder="Password"
            minLength={8}
            autoComplete="new-password"
            onChange={pwHandler}
          />
        </InputGroup>
        <InputGroup className="mb-2">
          <Form.Control
            required
            type="password"
            placeholder="Repeat Password"
            minLength={8}
            autoComplete="new-password"
            onChange={pw2Handler}
          />
        </InputGroup>

        {pwVarify ? (
          <></>
        ) : (
          <Alert variant="danger" dismissible>
            Differing password
          </Alert>
        )}
        {error !== null ? (
          <Alert variant="danger" dismissible>
            {error}
          </Alert>
        ) : (
          ""
        )}
        <Button type="submit" value="Sign In">
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export function SignIn({ close }: { close?: () => void }) {
  const [unameRef, unameHandler] = useInput();
  const [pwRef, pwHandler] = useInput();

  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValid(false);
      return;
    }
    login(unameRef.current, pwRef.current).then((resp) => {
      // TODO handle JWT response
      console.log(resp);
      if ("error" in resp) {
        setError(resp.error);
        setValid(false);
        return;
      }
      setValid(true);
      unameRef.current = "";
      pwRef.current = "";
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
            type="text"
            placeholder="Username or Email"
            name="username"
            onChange={unameHandler}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid username.
          </Form.Control.Feedback>
        </InputGroup>
        <Form.Group>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            name="password"
            minLength={8}
            autoComplete="current-password"
            onChange={pwHandler}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Check label="Remember Me" />
        </Form.Group>
        {error !== null ? <Alert variant="danger">{error}</Alert> : ""}
        <Button type="submit">Sign In</Button>
      </Form>
    </div>
  );
}
