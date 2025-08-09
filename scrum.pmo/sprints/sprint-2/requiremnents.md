# user requirements

- [ ] run the following test [requirement:uuid:a2f4c3d0-9b8a-4f1e-8c3b-5e7a2f9d6c1b]
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

- [ ] make the help line use the full terminal height also whne the terminal heigt changes. [requirement:uuid:7f6e1b84-3c19-4d7a-9a56-5f4a7c9b2d31]
- [ ] add an empty line between the command line and the help line. [requirement:uuid:7f6e1b84-3c19-4d7a-9a56-5f4a7c9b2d31]
- [ ] keep always an empty line above the command line. [requirement:uuid:7f6e1b84-3c19-4d7a-9a56-5f4a7c9b2d31]
- [ ] let the command line have a prompt before the command.  [requirement:uuid:3c2b5a8e-9d1f-4a2f-8b6e-7c1d5f2a4b93]
- [ ] match the behaviour of the bash prompt and read the bash $PS1 to set it. [requirement:uuid:3c2b5a8e-9d1f-4a2f-8b6e-7c1d5f2a4b93]
- [ ] ste the prompt to ```[hostname] [user]@[pwd]``` [requirement:uuid:3c2b5a8e-9d1f-4a2f-8b6e-7c1d5f2a4b93]