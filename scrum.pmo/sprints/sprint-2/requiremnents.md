# user requirements

- [ ] run the following test
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

- [ ] make the help line use the full terminal height also whne the terminal heigt changes.
- [ ] add an empty line between the command line and the help line.
- [ ] keep always an empty line above the command line.
- [ ] let the command line have a prompt before the command. 
- [ ] match the behaviour of the bash prompt and read the bash $PS1 to set it.
- [ ] ste the prompt to ```[hostname] [user]@[pwd]```