<<<<<<< HEAD
export interface User {
=======
export interface IUser {
>>>>>>> origin/dev/2025-09-14-UTC-1425
  readonly uuid: string;
  readonly username: string;
  readonly hostname: string;
  
  getScenario(): any;
  getUserUUID(username: string): string;
}