import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import { Home } from "./App";
import App from "./App";
import { isEmail } from "./util";

test("Render the main app", () => {
  render(<App />);
  const signup = screen.getByText(/Sign Up/gi);
  expect(signup).toBeInTheDocument();
  signup.click();

  type Val = { value?: string };
  const form = document.querySelector("form");
  console.log(form);
  const username: HTMLElement & Val = screen.getByPlaceholderText(/username/gi);
  const email: HTMLElement & Val = screen.getByPlaceholderText(/email/gi);
  const password: HTMLElement & Val = screen.getByPlaceholderText(/password/gi);
  const pwCheck: HTMLElement & Val = screen.getByPlaceholderText(
    /repeat password/gi
  );
  const submit = document.getElementById("modal-sign-up-submit");
  expect(username).toBeInTheDocument();
  expect(email).toBeInTheDocument();
  expect(password).toBeInTheDocument();
  expect(password).toBeRequired();
  expect(pwCheck).toBeInTheDocument();
  expect(submit).toBeInTheDocument();
  username.value = "some username";
  email.value = "not a valid email";
  password.value = "12345678";
  pwCheck.value = "12345678";
  expect(password).toBeValid();
  expect(pwCheck).toBeValid();
});

test("Home", () => {
  render(<Home />);
  const header = screen.getByText(/mercedtime/gi);
  expect(header).toBeInTheDocument();
  expect(header).toBeVisible();
});

test("isEmail utility", () => {
  expect(isEmail("abc@site.com")).toBe(true);
  expect(isEmail("harry-potter@hogwarts.edu")).toBe(true);
  expect(isEmail("not an email")).toBe(false);
});

test("Login form", () => {});
