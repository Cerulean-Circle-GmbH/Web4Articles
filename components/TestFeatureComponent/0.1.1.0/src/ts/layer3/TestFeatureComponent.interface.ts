export interface TestFeatureComponent {
  init(scenario: any): this;
  toScenario(): Promise<any>;
  process(): this;
}