import { Course, SubCourse, CourseType } from "../api";

class CatalogEntry implements Course {
  id: number = 0;
  crn: number = 0;
  days: string[] = [];
  type: CourseType = "";
  enrolled: number = 0;
  subject: string = "";
  course_num: number = 0;
  title: string = "";
  units: number = 0;
  description: string = "";
  capacity: number = 0;
  remaining: number = 0;
  updated_at: Date = new Date(0);
  subcourses: SubCourse[] = [];

  rank?: number;

  constructor(course: Course) {
    Object.assign(this, course);
  }

  enrollPercent() {
    return ((this.enrolled / this.capacity) * 100).toFixed(2);
  }

  document() {
    return this.title + " " + this.description;
  }

  setRank(r: number) {
    this.rank = r;
  }

  getRank() {
    return this.rank || 0;
  }
}

export default CatalogEntry;
