export interface TestChainComponent {
  init(scenario: any): this;
  toScenario(): Promise<any>;
  process(): this;
}