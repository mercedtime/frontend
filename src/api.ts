import { TOKEN_KEY } from "./util";

const API_HOST = "localhost:8080";
const API_BASE = `http://${API_HOST}/api/v1`;

export interface ApiError {
  error: string;
  code: number;
}

export interface Subject {
  code: string;
  name: string;
}

export const getSubjects = async () => {
  return await fetch(`${API_BASE}/subjects`, {
    method: "GET",
  }).then((resp) => resp.json());
};

type CourseType =
  | "LECT"
  | "LAB"
  | "DISC"
  | "SEM"
  | "STDO"
  | "FLDW"
  | "INI"
  | "PRA";

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

export const getCourses = async (year: number, term: string, subj?: string) => {
  let url: string;
  if (subj === undefined) {
    url = `${API_BASE}/catalog/${year}/${term}`;
  } else {
    url = `${API_BASE}/catalog/${year}/${term}?subject=${subj.toUpperCase()}`;
  }
  return await fetch(url)
    .then((resp) => resp.text())
    .then((text) => JSON.parse(text));
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
export const cleanOutExpiredToken = () => {
  let rawtoken = localStorage.getItem(TOKEN_KEY);
  if (rawtoken === null) {
    return;
  }
  let token = parseJWT(rawtoken);
  refresh(token).then((tok) => {
    token = tok;
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tok));
  });
  let now = new Date();
  if (token.expire.getTime() < now.getTime()) {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export async function login(
  username: string,
  password: string
): Promise<JWT | ApiError> {
  return await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password }),
  }).then((resp) => resp.json());
}

export const logout = async () => {
  let rawjwt = localStorage.getItem(TOKEN_KEY);
  if (rawjwt === null) {
    // TODO error
  }
  let token = parseJWT(rawjwt as string);
  await fetch(`${API_BASE}/auth/logout`, {
    headers: { Authorization: `Bearer ${token.token}` },
  }).then((resp) => resp.status);
  localStorage.removeItem(TOKEN_KEY);
};

export const refresh = async (token: JWT) => {
  return await fetch(`${API_BASE}/auth/refresh`, {
    headers: { Authorization: `Bearer ${token.token}` },
  })
    .then((resp) => {
      if (!resp.ok) {
      }
      return resp.text();
    })
    .then((txt) => parseJWT(txt));
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
