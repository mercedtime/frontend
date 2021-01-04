import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Switch,
  Link,
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { AuthModal, SignIn, SignUp, useAuthState } from "./views/Auth";
import { ThemeProps } from "./views/Theme";
import Catalog from "./views/Catalog";
import Schedule, { SubjectView, SubjectViewProps } from "./views/Schedule";
import { getSubjects, Subject } from "./api";
import { NewBeginningsSVG, EmptyUser } from "./Icons";
import "./App.scss";

function Header() {
  return <header></header>;
}

function Footer() {
  return <footer></footer>;
}

const DARKMODE_CLASS = "darkmode";

function isDarkmode(): boolean {
  let raw = localStorage.getItem(DARKMODE_CLASS);
  if (raw == null) {
    localStorage.setItem(DARKMODE_CLASS, "false");
    return false;
  }
  return raw === "true";
}

const App = () => {
  const darkmode = isDarkmode();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dark, setDark] = useState<boolean>(darkmode);
  const toggleDarkmode = () => {
    localStorage.setItem(DARKMODE_CLASS, dark ? "false" : "true");
    document.body.classList.toggle(DARKMODE_CLASS);
    setDark(!dark);
  };

  const subjMap = useRef<{ [code: string]: string }>({});

  // Only runs on component mount
  useEffect(() => {
    if (isDarkmode()) {
      document.body.classList.toggle(DARKMODE_CLASS);
    }
    getSubjects().then((result: Subject[]) => {
      setSubjects(result);
      for (let s of result) {
        subjMap.current[s.code] = s.name;
      }
    });
  }, []);

  const getName = (code: string): string => {
    let key = code.toUpperCase();
    if (key in subjMap.current) {
      return subjMap.current[key];
    }
    return "";
  };

  return (
    <>
      <main className="app">
        <Header />
        <BrowserRouter>
          <Navigation dark={dark} />
          <Switch>
            <Route
              exact
              path="/home"
              component={(props: RouteComponentProps) => (
                <Home dark={dark} {...props} />
              )}
            />
            <Route
              exact
              path="/schedule"
              component={(props: RouteComponentProps) => (
                <Schedule dark={dark} subjects={subjects} {...props} />
              )}
            />
            <Route exact path="/about" component={About} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route
              path="/subject/:id"
              component={(props: SubjectViewProps) => {
                return <SubjectView dark={dark} {...props} getName={getName} />;
              }}
            />
            <Route
              exact
              path="/catalog"
              component={() => <Catalog dark={dark} />}
            />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={NewAccount} />
          </Switch>
        </BrowserRouter>
        <Form className="darkmode-switch form-switch-md">
          <Form.Check
            custom
            type="switch"
            id="custom-switch"
            checked={dark}
            onChange={() => {}} // just to get rid of the warning
            onClick={toggleDarkmode}
          />
        </Form>
        <Footer />
      </main>
    </>
  );
};

export default App;

function Navigation(props: ThemeProps) {
  const theme = props.dark ? "dark" : "light";
  const navbg = props.dark ? "dark" : "transparent";
  const authState = useAuthState();
  return (
    <>
      <Navbar bg={navbg} variant={theme} expand="sm">
        <Navbar.Brand as={Link} to="/home">
          Mootown
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/schedule">
              Schedule
            </Nav.Link>
            <Nav.Link as={Link} to="/catalog">
              Catalog
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="#">
              <Button
                variant={props.dark ? "outline-light" : "outline-dark"}
                onClick={() => authState.setSignUp(true)}
              >
                Sign up
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} to="#">
              <Button
                variant="primary"
                onClick={() => authState.setSignIn(true)}
              >
                Sign in
              </Button>{" "}
            </Nav.Link>
          </Nav>
          <EmptyUser width="45" height="45" />
        </Navbar.Collapse>
      </Navbar>
      <AuthModal {...authState} dark={props.dark} />
    </>
  );
}

function Home(props: ThemeProps & RouteProps) {
  let imgColor = "#0b2c51";
  if (props.dark) {
    imgColor = "lightgrey";
  }
  return (
    <>
      <div className="landing">
        <NewBeginningsSVG height="400px" fill={imgColor} />
        <h1 className="welcome-msg">Welcome to Mercedtime</h1>
      </div>
    </>
  );
}

function About() {
  return (
    <>
      <h1>About</h1>
      <div className="container" style={{ width: "75%" }}>
        <p>
          This is a hobbie project and is not affiliated with the University of
          California. If you would like to contribute to the project, make a
          pull request to our{" "}
          <a href="https://github.com/mercedtime">github repo</a>.
        </p>
      </div>
    </>
  );
}

function Login() {
  return (
    <>
      <h1>Sign In</h1>
      <div className="login-form container">
        <SignIn />
      </div>
    </>
  );
}

function NewAccount() {
  return (
    <>
      <h1>New Account</h1>
      <div className="login-form">
        <SignUp />
      </div>
    </>
  );
}
