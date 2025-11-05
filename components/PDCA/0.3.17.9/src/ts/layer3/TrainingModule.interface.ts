/**
 * TrainingModule - AI Training System Interface
 * Radical OOP: Model-driven training content delivery
 */

import { Scenario } from './Scenario.interface.js';

export interface TrainingModule {
  model: TrainingModuleModel;
  init(scenario?: Scenario): this;
  listTopics(): this;
  showTopic(topicIdentifier: string): this;
}

export interface TrainingModuleModel {
  topics: TrainingTopic[];
  selectedTopic?: TrainingTopic;
  output: string[];
}

export interface TrainingTopic {
  id: string;
  number: number;
  emoji: string;
  title: string;
  description: string;
  requiredReading: string[];
  keyLessons: string[];
  verificationChecklist: string[];
}

