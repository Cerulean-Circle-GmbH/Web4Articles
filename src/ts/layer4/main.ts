import { ParameterParser } from '../layer2/ParameterParser';
import { GitScrumProject } from '../layer2/GitScrumProject';
import { Project } from '../layer3/Project';

function main() {
  const parser = new ParameterParser(process.argv.slice(2));
  const { className, command, type, projectName } = parser.parse();

  if (className === 'GitScrumProject' && command === 'create' && type === 'project') {
    const project: Project = new GitScrumProject();
    project.create([projectName]);
  } else {
    console.log('Usage: oosh GitScrumProject create project [projectname:Web4Scrum]');
    process.exit(1);
  }
}

main();
