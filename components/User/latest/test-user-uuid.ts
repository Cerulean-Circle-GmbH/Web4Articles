import { DefaultUser } from './src/ts/layer2/DefaultUser';

// Test the deterministic UUID generation
const dongesUser = new DefaultUser('donges', 'localhost');
console.log('User "donges" will always have UUID:', dongesUser.uuid);
console.log('\nFull scenario for donges:');
console.log(JSON.stringify(dongesUser.getScenario(), null, 2));

// Show the owner object that other components should use
console.log('\nOwner object for Web4Requirement and other components:');
const ownerObj = DefaultUser.getOwnerObject('donges', 'localhost');
console.log(JSON.stringify(ownerObj, null, 2));
console.log('\nBase64 encoded:', Buffer.from(JSON.stringify(ownerObj)).toString('base64'));