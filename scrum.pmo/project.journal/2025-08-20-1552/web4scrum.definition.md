help the developer to digest that day yesterday where you fixed all th pdcas.
ysetaeday was all ebout testing even if nearly all pdcas are written as a developer. thats because few know what testing is REALLY about.

it is mainly about regression... so not turnnig in circle and not breking things with changes that have been working before. but this requires rigrous tracability of features and the tessts that correpond to it.

the chain is even worse:
1. prosa text
2. [requiremtt:uuid:...] (uuids should always be in UUIDv4 fromat)
3. [test:uuid:...]
4. [freature:uuid:...]
5. [component:uuid:...]
6. [version:uuid:...]
7. [unit:uuid:...] list

the tracability is the resposibility of the PO who in classical PMMI is also the Business to technical requirement manager. he derives the plans from the requirements. in a structured way. structured objects are the inferastructure to support him.

where 
1. prosa is: 
    any human sentence about the topic. it sould be about the WHY. werner git calls it Apobetic.
    why does it exist at all. why was it even spoken into existence. why does it need to exist. WHAT is it and its name. HOW is it uniquly defined in CMM level 3. Prosa is all about Ontology and indexing topics, words, nouns.

2. requirement:
    a structured object with id, back reference to its src url, e.g. a md file
    the exact line and column where the text starts and ends.
    a reference to its test.

3. a test case... from now on everythig is a structured obejct with id
    a test case covers the regrssion of what has to be a stable and how it can be accepted and repeatable prooven. so it does not explain the intent. its just a random picked requirement that has to be stable and always to be fulfilled

    in the case of the tsranger, we do not specify the WHY or HOW in the test. just a blackbox user input sequence and a balck box result output. like g[Tab]c --> GitScrumProject c[r]eate.
    form now on this has to be tested in regressions stabel as correct.

    here comes the catch:  if you write g[Tab]c --> Logger c[l]og it is WRONG
    the code can never fullfill the requirement and you would have to break the code to make the regression work as a false positive. it would kill the hole project. you experienced this yesterday.find the pdca references of that experience when you write the pdca about this.

    a test can have multiple of these test cases each fixing a regression state to be always true to black box the feature a a semantic entity, a systemic black box, called component. the comonent does not reveal HOW it woeks, it just produces the same deterministic regression testable output. inside the component units hold the logic that make the output happen from the input. this is called a system. read all of this with the ontology agent later and find all references to units and component to and therid definitions and WHY, WHAT and HOW.

4. the feature is a semantic set of units that guarantee a certain semantic functionality. it is called the implementation. components hide the implementation inside the black box. if you would implement a tets, it would become a structured object wiht an id adn a list with references to test cases which are also structured objects. each with an id and the regression description, while the test case tries to capture in prosa the intent. the WHY. the test cases capture the black box HOW. test would be come an in terface in typescript. there are many test freameworks like the forbidden jest, vitest and even your own manual sh caommands sometimes. DefautTest wuld be the name of the unit that holds the current default implementation as a typecript radical oop, DRY implementation class. 
    TSranger is here to discover these classes, components and units to make them work together.  but there may be additional implementations of a JestTest and a JestTesCase implementing TestCase and ViTest and so on. also a ShTest adn ShTestCase are psoiible if they comply to the test interfaces, in sh or bash this is a little more complex and brittle.

5. the component then captures the semantic and makes it a blackbox ucp component as a stable versioned system. eg a ViTest component whit units that are classes which act as features like model, view, controller whicha re again interfaces, that have implementations like JSONModle, HTMLTagModel or whatever. like View can be ReactVieww, VueView and so on...
    these units arein diffrent semantic layers. Views are in layer 5. controllers in layer 4, interfaces in layer 3, implementation classes and shell scrips, any code logic is in layer 2. in layer 1 is the infrastructure and the bootstraping to make all of this posiible.

6. versions. as nobody canjust dump the perfect component, we itterate them via CMM level 4 to perfection. regression helps us to not break what was working in the previous version. a version is a git commit that holds all necessary units that are described under [5.](component) in its state. there is always a "latest" version that is under "la-test" hehehe. under testing. so the "latest" component is also the HEAD of the git. a stable version gets tagged as a semantic version number e.g. "2.2.0.1-uuid" to reference which test it already complied to. a realease bundles a set of regression tested set of features into a component
    it can then be later staged through testing and production branches. the "main" branch is production. the test branch is always merged with stable regression features.

7. the units are single files. each with radical seperation of concern. some view implementations, some contoller implementations some just pictures, diagram source cod and whatever. the minimum unit is a file. everything is a file. everything is an object. everything has a uuid. objects are instances of classes. an instance has a stae defined by its arrtibutes in the model. one of the attributes is always its id (uuidv4) and its semantic name. not the class name only but a name for this specific instance. the instance is configured with a dedicated state, the serialiyable modle. it also hold a reference to its class unit, so that it can instanciate a class from an empty constructor and inject the serealiyed model ro regreatre the instance with its id and attributes set.this model may have "references" to other instances. a tree of such instance reference network is called a scenario. by loading a scenario, any instance can be recreated from its hibernated state intoto a running live software instance graph.

    this was the shortest possible definition of Web4 software development. you will continue to learn and digest ist together with the onology agent and all the other agent roles.

    you will help programming these objects as componentns and create a selfsustaining Object Networt Comunication Environment named ONCE.

    write now a pdca about it. thenhand it to over to the PO to plan a sprint 20 with the intent to fully implement all what is described here!
