export interface TestUpgradeComponent {
  init(scenario: any): this;
  toScenario(): Promise<any>;
  process(): this;
}