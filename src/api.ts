const API_HOST = "http://localhost:8080/api/v1";

export interface Subject {
  code: string;
  name: string;
}

export const getSubjects = async () => {
  return await fetch(`${API_HOST}/subjects`, {
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
    url = `${API_HOST}/catalog/${year}/${term}`;
  } else {
    url = `${API_HOST}/catalog/${year}/${term}?subject=${subj.toUpperCase()}`;
  }
  return await fetch(url)
    .then((resp) => resp.text())
    .then((text) => JSON.parse(text));
};
