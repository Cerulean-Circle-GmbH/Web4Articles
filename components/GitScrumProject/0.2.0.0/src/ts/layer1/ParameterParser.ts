export class ParameterParser {
  private args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  public parse(): { className: string; command: string; type: string; projectName?: string; restArgs: string[] } {
    // Example: GitScrumProject createTemplateRepo org newRepo sourceRepoUrl submodulePath
    const [className, command, type, projectName, ...rest] = this.args;
    return { className, command, type, projectName, restArgs: rest };
  }
}