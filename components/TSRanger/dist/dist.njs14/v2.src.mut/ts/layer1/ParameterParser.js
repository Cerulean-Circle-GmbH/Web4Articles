export class ParameterParser {
    constructor(args) {
        this.args = args;
    }
    parse() {
        // Example: GitScrumProject create project Web4Scrum
        const [className, command, type, projectName, ...rest] = this.args;
        return { className, command, type, projectName, restArgs: rest };
    }
}
