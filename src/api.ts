import React from "react";
import { TOKEN_KEY } from "./util";

let API_HOST = "localhost:8080";

if (
  process.env.REACT_APP_PUB_API_HOST !== undefined &&
  process.env.REACT_APP_PUB_API_PORT !== undefined
) {
  let host = process.env.REACT_APP_PUB_API_HOST;
  let port = process.env.REACT_APP_PUB_API_PORT;
  if (document.location.hostname !== "localhost") {
    API_HOST = `${host}:${port}`;
  } else {
    API_HOST = `localhost:${port}`;
  }
}
const API_BASE = `http://${API_HOST}/api/v1`;

export interface ApiError {
  error: string;
  code: number;
}

export interface Subject {
  code: string;
  name: string;
}

export type CourseType =
  | "LECT"
  | "LAB"
  | "DISC"
  | "SEM"
  | "STDO"
  | "FLDW"
  | "INI"
  | "PRA"
  | "";

interface BaseCourse {
  id: number;
  crn: number;
  days: string[];
  type: CourseType;
  enrolled: number;
}

export interface Course extends BaseCourse {
  subject: string;
  course_num: number;
  title: string;
  units: number;
  description: string;
  capacity: number;
  remaining: number;
  updated_at: Date;
  subcourses: SubCourse[];
}

export interface SubCourse extends BaseCourse {
  course_crn: number;
  section: string;
  start_time: Date;
  end_time: Date;
  building_room: string;
}

export const getSubjects = async () => {
  return await fetch(`${API_BASE}/subjects`, {
    method: "GET",
  }).then((resp) => resp.json());
};

export type Term = "spring" | "fall" | "summer";

export const getCatalog = async (
  year: number,
  term: string,
  subj?: string
): Promise<Course[]> => {
  let url: string;
  if (subj === undefined) {
    url = `${API_BASE}/catalog/${year}/${term}?order=updated_at`;
  } else {
    url = `${API_BASE}/catalog/${year}/${term}?subject=${subj.toUpperCase()}`;
  }
  return await fetch(url)
    .then((resp) => resp.text())
    .then((text) =>
      JSON.parse(text, (key: any, value: any): any => {
        if (key === "updated_at" && typeof value === "string") {
          return new Date(value);
        }
        return value;
      })
    );
};

export interface JWT {
  code: number;
  expire: Date;
  token: string;
}

export const parseJWT = (s: string): JWT => {
  return JSON.parse(s, function (this: any, key: any, value: any): any {
    if (key === "expire" && typeof value === "string") {
      return new Date(value);
    }
    return value;
  });
};

// TODO implement refresh tokens
export const cleanOutExpiredToken = (
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  let rawtoken = localStorage.getItem(TOKEN_KEY);
  if (rawtoken === null) {
    return;
  }
  let token = parseJWT(rawtoken);
  if (token === undefined || token.expire === undefined) {
    return;
  }
  let now = new Date();
  if (token.expire.getTime() < now.getTime()) {
    refresh(token).then((tok) => {
      if (tok === null) {
        setLoggedIn(false);
      } else {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tok));
      }
    });
  }
};

export async function login(
  username: string,
  password: string
): Promise<JWT | ApiError> {
  return await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, password: password }),
  }).then((resp) => resp.json());
}

export const logout = async () => {
  let rawjwt = localStorage.getItem(TOKEN_KEY);
  if (rawjwt === null) {
    // TODO error
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  let token = parseJWT(rawjwt as string);
  await fetch(`${API_BASE}/auth/logout`, {
    headers: { Authorization: `Bearer ${token.token}` },
  }).then((resp) => resp.status);
};

export const refresh = async (token: JWT) => {
  return await fetch(`${API_BASE}/auth/refresh`, {
    headers: { Authorization: `Bearer ${token.token}` },
  })
    .then((resp) => {
      if (resp.status !== 200) {
        return null;
      }
      return resp.text();
    })
    .then((txt) => (txt === null ? null : parseJWT(txt)));
};

export interface NewUser {
  name: string;
  password: string;
  email: string;
}

export async function createAccount(user: NewUser): Promise<ApiError> {
  return await fetch(`http://${API_HOST}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((resp) => resp.json())
    .catch((err) => {
      console.log(err);
    });
}
