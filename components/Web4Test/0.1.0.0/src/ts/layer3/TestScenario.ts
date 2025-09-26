/**
 * TestScenario - Web4 test scenario model interface
 * Layer 3: Interface contracts for test scenario hibernation/restoration
 */

export interface TestScenario {
  uuid: string;
  name: string;
  description: string;
  requirementIORs: string[];
  componentIORs: string[];
  testDataScenario: any;
  executionContextScenario: any;
  expectedResultScenario: any;
  createdAt: string;
  modifiedAt: string;
}

export interface TestExecutionScenario {
  testScenarioIOR: string;
  executionId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
  actualResultScenario: any;
  evidenceScenarios: EvidenceScenario[];
  errorDetails?: string;
  performanceMetrics?: PerformanceMetrics;
}

export interface EvidenceScenario {
  uuid: string;
  type: 'input' | 'output' | 'step' | 'assertion' | 'error';
  timestamp: string;
  data: any;
  description: string;
}

export interface PerformanceMetrics {
  executionTimeMs: number;
  memoryUsageMB: number;
  cpuUsagePercent?: number;
  networkCallsCount?: number;
}

export interface RequirementScenario {
  uuid: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  testCaseIORs: string[];
  componentIORs: string[];
  traceabilityChain: TraceabilityLink[];
  acceptance_criteria: string[];
  createdAt: string;
  modifiedAt: string;
}

export interface TraceabilityLink {
  sourceIOR: string;
  targetIOR: string;
  relationType: 'implements' | 'tests' | 'requires' | 'validates' | 'uses';
  createdAt: string;
}
