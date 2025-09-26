export interface IUser {
  readonly uuid: string;
  readonly username: string;
  readonly hostname: string;
  
  getScenario(): any;
  getUserUUID(username: string): string;
}