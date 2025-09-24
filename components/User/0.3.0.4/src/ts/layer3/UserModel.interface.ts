/**
 * UserModel Interface - Clean user model without over-engineering
 * Web4 principle: Simple model interface
 */

export interface UserModel {
  uuid: string;
  username: string;
  hostname: string;
  createdAt: string;
  updatedAt: string;
}