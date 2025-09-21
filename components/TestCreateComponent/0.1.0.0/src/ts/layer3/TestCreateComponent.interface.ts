export interface TestCreateComponent {
  init(scenario: any): this;
  toScenario(): Promise<any>;
  process(): this;
}