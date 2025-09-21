export interface TestComponent {
  init(scenario: any): this;
  toScenario(): Promise<any>;
  process(): this;
}