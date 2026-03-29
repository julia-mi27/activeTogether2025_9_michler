import { Course } from './Course';

// Vom Backend (DTO)
export interface RegistrationDto {
  id: string | number;
  name: string;
  birthdate: string;
  course?: Course;
  courseId: string;
  newsletter?: boolean;
}

export interface RegistrationModel {
  name: string;
  birthdate: string;
  courseId: string;
  newsletter: boolean;
}
