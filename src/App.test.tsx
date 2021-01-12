import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import { Home } from "./App";
import App from "./App";
import { isEmail } from "./util";
import Catalog from "./views/Catalog";

test("Render the main app", () => {
  render(<App />);
  const signup = screen.getByText(/Sign Up/gi);
  expect(signup).toBeInTheDocument();
  signup.click();

  type Val = { value?: string };
  // const form = document.querySelector("form");
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

const subjects = [
  { code: "ANTH", name: "Anthropology" },
  { code: "BIO", name: "Biological Sciences" },
  { code: "BIOE", name: "Bioengineering" },
  { code: "CCST", name: "Chicano Chicana Studies" },
  { code: "CHEM", name: "Chemistry" },
  { code: "CHN", name: "Chinese" },
  { code: "COGS", name: "Cognitive Science" },
  { code: "CRES", name: "Critical Race and Ethnic Studies" },
  { code: "CRS", name: "Community Research and Service" },
  { code: "CSE", name: "Computer Science and Engineering" },
  { code: "ECON", name: "Economics" },
  { code: "EECS", name: "Electrical Engineering and Computer Science" },
  { code: "ENG", name: "English" },
  { code: "ENGR", name: "Engineering" },
  { code: "ENVE", name: "Environmental Engineering" },
  { code: "ES", name: "Environmental Systems (GR)" },
  { code: "ESS", name: "Environmental Systems Science" },
  { code: "FRE", name: "French" },
  { code: "GASP", name: "Global Arts Studies Program" },
  { code: "HIST", name: "History" },
  { code: "HS", name: "Heritage Studies" },
  { code: "IH", name: "Interdisciplinary Humanities" },
  { code: "JPN", name: "Japanese" },
  { code: "MATH", name: "Mathematics" },
  { code: "MBSE", name: "Materials and BioMat Sci & Engr" },
  { code: "ME", name: "Mechanical Engineering" },
  { code: "MGMT", name: "Management" },
  {
    code: "MIST",
    name: "Management of Innovation, Sustainability and Technology",
  },
  { code: "MSE", name: "Materials Science and Engineering" },
  { code: "NSED", name: "Natural Sciences Education" },
  { code: "PH", name: "Public Health" },
  { code: "PHIL", name: "Philosophy" },
  { code: "PHYS", name: "Physics" },
  { code: "POLI", name: "Political Science" },
  { code: "PSY", name: "Psychology" },
  { code: "QSB", name: "Quantitative and Systems Biology" },
  { code: "SOC", name: "Sociology" },
  { code: "SPAN", name: "Spanish" },
  { code: "SPRK", name: "Spark" },
  { code: "WRI", name: "Writing" },
];

test("Catalog", async () => {
  render(<Catalog subjects={subjects} />);
});

test("isEmail utility", () => {
  expect(isEmail("abc@site.com")).toBe(true);
  expect(isEmail("harry-potter@hogwarts.edu")).toBe(true);
  expect(isEmail("not an email")).toBe(false);
});

test("Login form", () => {});
