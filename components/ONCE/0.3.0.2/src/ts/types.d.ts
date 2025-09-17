declare module "../../IOR.interface.js" { export interface IOR { uuid: string; component: string; version: string; } export class DefaultIOR { init(data: any): this; uuid: string; component: string; version: string; toJSON(): any; } }
declare module "../../Scenario.js" { export class Scenario { init(data: any): this; model: any; } export class DefaultScenario { init(data: any): this; model: any; } }
declare module "../../DefaultUser.js" { export class DefaultUser { generateOwnerData(data: any): Promise<any>; } }
declare module "../../../Build/0.3.0.3/dist/ts/layer2/DefaultBuild.js" { export class DefaultBuild { deinstall(path?: string): Promise<void>; cleanAllComponents(root?: string): Promise<void>; } }
