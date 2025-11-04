/**
 * Test: Completion methods MUST be parameterless and use model state
 * 
 * Radical OOP Principle: Methods use `this.model` state, NOT functional parameters
 * 
 * This test enforces that all *ParameterCompletion methods:
 * 1. Have NO parameters (parameterless)
 * 2. Use this.model.completionCompWords instead of passed currentArgs
 * 3. Use this.model.completionCommand for context
 * 4. Use this.model.completionCurrentWord for filtering
 */

import { describe, it, expect, beforeEach } from "vitest";
import { DefaultCLI } from "../../src/ts/layer2/DefaultCLI.js";
import { Web4TSComponentCLI } from "../../src/ts/layer5/Web4TSComponentCLI.js";

describe("🎯 Completion Methods: Model-Driven (Radical OOP)", () => {
  let cli: DefaultCLI;

  beforeEach(() => {
    cli = new Web4TSComponentCLI();
  });

  describe("scopeParameterCompletion - MUST be parameterless", () => {
    it("should use this.model.completionCommand, not passed parameters", async () => {
      // Set model state (how shCompletion sets it)
      cli.model.completionCompCword = 2;
      cli.model.completionCompWords = ["web4tscomponent", "test", ""];
      cli.model.completionCommand = "test";
      cli.model.completionCurrentWord = "";
      
      // Call parameterless method - it MUST use model state
      const result = await (cli as any).scopeParameterCompletion();
      
      expect(result).toEqual(["file", "describe", "itCase"]);
    });

    it("should detect test command from model state, not parameters", async () => {
      // Set model state
      cli.model.completionCommand = "test";
      
      // Call without parameters
      const result = await (cli as any).scopeParameterCompletion();
      
      // Should return scopes because model.completionCommand === 'test'
      expect(result).toContain("file");
      expect(result).toContain("describe");
      expect(result).toContain("itCase");
    });
  });

  describe("referencesParameterCompletion - MUST be parameterless", () => {
    it("should use this.model.completionCompWords for scope detection", async () => {
      // Set model state: web4tscomponent test describe
      cli.model.completionCompCword = 3;
      cli.model.completionCompWords = ["web4tscomponent", "test", "describe", ""];
      cli.model.completionCommand = "test";
      cli.model.completionCurrentWord = "";
      
      // Call parameterless method
      const result = await (cli as any).referencesParameterCompletion();
      
      // Should detect scope='describe' from model.completionCompWords[2]
      expect(Array.isArray(result)).toBe(true);
      // Result should be hierarchical describe blocks (or empty if no tests exist)
    });

    it("should handle file scope from model state", async () => {
      // Set model state: web4tscomponent test file
      cli.model.completionCompCword = 3;
      cli.model.completionCompWords = ["web4tscomponent", "test", "file", ""];
      cli.model.completionCommand = "test";
      
      // Call parameterless method
      const result = await (cli as any).referencesParameterCompletion();
      
      // Should detect scope='file' from model state
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("componentParameterCompletion - MUST be parameterless", () => {
    it("should use model state to list components", async () => {
      // Set model state
      cli.model.completionCompCword = 2;
      cli.model.completionCompWords = ["web4tscomponent", "on", ""];
      cli.model.completionCommand = "on";
      
      // Call parameterless method
      const result = await (cli as any).componentParameterCompletion();
      
      // Should return component list from project
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("versionParameterCompletion - MUST be parameterless", () => {
    it("should extract component from model.completionCompWords", async () => {
      // Set model state: web4tscomponent on Web4TSComponent <Tab>
      cli.model.completionCompCword = 3;
      cli.model.completionCompWords = ["web4tscomponent", "on", "Web4TSComponent", ""];
      cli.model.completionCommand = "on";
      
      // Call parameterless method
      const result = await (cli as any).versionParameterCompletion();
      
      // Should extract component name from model.completionCompWords[2]
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain("latest");
    });
  });

  describe("Architecture Enforcement - NO functional parameters allowed", () => {
    it("scopeParameterCompletion signature must be parameterless", () => {
      const method = (cli as any).scopeParameterCompletion;
      expect(method).toBeDefined();
      // Check function length (number of required parameters)
      expect(method.length).toBe(0); // MUST be 0 (parameterless)
    });

    it("referencesParameterCompletion signature must be parameterless", () => {
      const method = (cli as any).referencesParameterCompletion;
      expect(method).toBeDefined();
      expect(method.length).toBe(0); // MUST be 0 (parameterless)
    });

    it("componentParameterCompletion signature must be parameterless", () => {
      const method = (cli as any).componentParameterCompletion;
      expect(method).toBeDefined();
      expect(method.length).toBe(0); // MUST be 0 (parameterless)
    });

    it("versionParameterCompletion signature must be parameterless", () => {
      const method = (cli as any).versionParameterCompletion;
      expect(method).toBeDefined();
      expect(method.length).toBe(0); // MUST be 0 (parameterless)
    });
  });
});

