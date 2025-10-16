/**
 * Model - Base Model Interface
 * Web4 principle: All models have uuid
 */

export interface Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
}

