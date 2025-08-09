# user requirements

- [x] run the following test [requirement:uuid:a2f4c3d0-9b8a-4f1e-8c3b-5e7a2f9d6c1b] ([task-2.3](./task-2.3-developer-fix-selected-row-indentation.md))
        ```src/sh/tsranger test "[down][down][down][down][down]" ```

        the formating is strange:
```
[Classes]      [Methods]      [Params]       [Preview]           
Logger             start                                 GitScrumProject start   
OOSH               create                                                                     
ParameterParser    createProject                                                              
TSsh               createTemplateRepo                                                         
DefaultCLI         linkSource                                                                 
GitScrumProjectoverlayRun                                                                 
RangerModel        releasePlan                                                                
TestClass                                                                                              
GitScrumProject start
←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit  %                                                    
```

        it should be
```
[Classes]      [Methods]      [Params]       [Preview]           
Logger             start                                 GitScrumProject start   
OOSH               create                                                                     
ParameterParser    createProject                                                              
TSsh               createTemplateRepo                                                         
DefaultCLI         linkSource                                                                 
GitScrumProject    overlayRun                                                                 
RangerModel        releasePlan                                                                
TestClass                                                                                              
GitScrumProject start
←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit  %                                                    
```

        the identation is wrong in the line where the current selectet element is.
        this is wrong for all columns.
        test ```src/sh/tsranger test "[down][down][down][down][down][right][down][down][down]"``` to see what i mean.
        fix it and check the bot on this requirement after you fixed it.

- [x] make the help line use the full terminal height also whne the terminal heigt changes. [requirement:uuid:7f6e1b84-3c19-4d7a-9a56-5f4a7c9b2d31] ([task-2](./task-2.1-developer-footer-height-and-spacing.md))
- [x] add an empty line between the command line and the help line. [requirement:uuid:7f6e1b84-3c19-4d7a-9a56-5f4a7c9b2d31] ([task-2](./task-2.1-developer-footer-height-and-spacing.md))
- [x] keep always an empty line above the command line. [requirement:uuid:7f6e1b84-3c19-4d7a-9a56-5f4a7c9b2d31] ([task-2](./task-2.1-developer-footer-height-and-spacing.md))
- [x] let the command line have a prompt before the command.  [requirement:uuid:3c2b5a8e-9d1f-4a2f-8b6e-7c1d5f2a4b93] ([task-3](./task-3.1-developer-command-prompt-ps1.md))
- [x] match the behaviour of the bash prompt and read the bash $PS1 to set it. [requirement:uuid:3c2b5a8e-9d1f-4a2f-8b6e-7c1d5f2a4b93] ([task-3](./task-3.1-developer-command-prompt-ps1.md))
- [x] set the prompt to ```[hostname] [user]@[pwd]``` [requirement:uuid:3c2b5a8e-9d1f-4a2f-8b6e-7c1d5f2a4b93] ([task-3](./task-3.1-developer-command-prompt-ps1.md))
- [x] the prompt shall be always only one empty line above the command line. [requirement:uuid:2f7d9a21-3b5a-4e8e-9c1d-5a7b2c3d4e5f] ([task-3.2](./task-3.2-developer-prompt-spacing.md))
        this is wrong and how it looks like:
```
[Classes]                                 [Methods]                                 [Params]                                  [Preview]                                 
Logger                                    log                                       msg                                       Logger log                                
OOSH                                                                                level                                                                               
ParameterParser                                                                                                                                                         
TSsh                                                                                                                                                                    
DefaultCLI                                                                                                                                                              
GitScrumProject                                                                                                                                                         
RangerModel                                                                                                                                                             
TestClass                                                                                                                                                               

[McDonges-3.fritz.box] donges@/Users/Shared/Workspaces/2cuGitHub/Web4Articles tssh Logger log























←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit                                                    
```


        this is how it should look like.
```
[Classes]                                 [Methods]                                 [Params]                                  [Preview]                                 
Logger                                    log                                       msg                                       Logger log                                
OOSH                                                                                level                                                                               
ParameterParser                                                                                                                                                         
TSsh                                                                                                                                                                    
DefaultCLI                                                                                                                                                              
GitScrumProject                                                                                                                                                         
RangerModel                                                                                                                                                             
TestClass                                                                                                                                                               






















[McDonges-3.fritz.box] donges@/Users/Shared/Workspaces/2cuGitHub/Web4Articles tssh Logger log

←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit                                                    ```
```

- [x] i want color in the prompt. the user name is cyan. if the user is root, the username is red. the current patth is yellow. [requirement:uuid:8a6f3d92-1c47-4fa0-9d28-3e7c5b1a8d44] ([task-3.3](./task-3.3-developer-prompt-colors.md))
- [ ] refactor the ranger navigaiton. remove the preview column. 
  
   