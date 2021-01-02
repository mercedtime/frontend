import { FormEvent, ChangeEvent, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { ThemeProps } from "./Theme";

interface AuthModalProps {
  signUp: boolean;
  signIn: boolean;
  setSignUp: (value: React.SetStateAction<boolean>) => void;
  setSignIn: (value: React.SetStateAction<boolean>) => void;
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

export default function Auth(props: ThemeProps & AuthModalProps) {
  return (
    <>
      <SignUp show={props.signUp} onHide={() => props.setSignUp(false)} />
      <SignIn show={props.signIn} onHide={() => props.setSignIn(false)} />
    </>
  );
}

function SignUp(props: { show: boolean; onHide: () => void }) {
  const [valid, setValid] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValid(true);
    event.preventDefault();
  };

  return (
    <Modal show={props.show} onHide={props.onHide} centered>
      <Modal.Body>
        <div className="auth sign-up" style={{ color: "black" }}>
          <Form noValidate validated={valid} onSubmit={submit} action="/test">
            <Modal.Header closeButton>
              <Modal.Title>Welcome aboard</Modal.Title>
            </Modal.Header>
            <InputGroup className="mb-2">
              <Form.Control
                required
                type="text"
                placeholder="Username"
                name="username"
              />
              <Form.Control type="text" placeholder="Email" name="email" />
            </InputGroup>
            <InputGroup className="mb-2">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                minLength={8}
                autoComplete="new-password"
              />
            </InputGroup>
            <InputGroup className="mb-2">
              <Form.Control
                required
                type="password"
                placeholder="Repeat Password"
                minLength={8}
                autoComplete="new-password"
              />
            </InputGroup>
            <Button type="submit" value="Sign In">
              Sign Up
            </Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function SignIn(props: { show: boolean; onHide: () => void }) {
  const [valid, setValid] = useState(false);
  const unameRef = useRef("");
  const pwRef = useRef("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValid(true);
    event.preventDefault();
    console.log(unameRef.current, pwRef.current);
    props.onHide();
  };

  return (
    <Modal show={props.show} onHide={props.onHide} centered>
      <Modal.Body>
        <div className="auth sign-in" style={{ color: "black" }}>
          <Modal.Header closeButton>
            <Modal.Title>Welcome back</Modal.Title>
          </Modal.Header>
          <Form validated={valid} onSubmit={submit} action="/test">
            <Form.Group>
              <Form.Control
                required
                type="text"
                placeholder="Username or Email"
                name="username"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  unameRef.current = event.target.value;
                }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid username.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                name="password"
                minLength={8}
                autoComplete="current-password"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  pwRef.current = event.target.value;
                }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Check label="Remember Me" />
            </Form.Group>
            <Button type="submit">Sign In</Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function resetForm(form: HTMLFormElement) {
  form.classList.remove("was-validated");
}
