import { CLI } from './CLI';

export class DefaultCLI implements CLI {
  private callback: (args: string[]) => void;

  constructor(callback: (args: string[]) => void) {
    this.callback = callback;
  }

  start(): void {
    const parser = new (require('../layer2/ParameterParser').ParameterParser)(process.argv.slice(2));
    const params = parser.parse();
    if (params.command === 'create' && params.projectName) {
      this.callback([params.projectName]);
    } else {
      console.log('Usage: GitScrumProject create project <ProjectName>');
    }
  }
}
