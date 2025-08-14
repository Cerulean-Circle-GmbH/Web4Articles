// Minimal test class for completion validation
/**
 * TestClass is a rich example used by TS Ranger to validate the Docs column.
 *
 * It demonstrates class-level documentation, method documentation, and
 * parameter documentation that `TSCompletion` can extract and display.
 */
export class TestClass {
    /**
     * Says hello in a friendly manner.
     * @returns A greeting string
     */
    hello() { return 'hello'; }
    /**
     * Combines the provided parameters into a descriptive phrase.
     * @param param1 The primary text to include in the phrase
     * @param param2 An optional numeric qualifier appended to the result
     * @returns A composed phrase string
     */
    world(param1, param2) {
        return param2 === undefined ? `${param1}` : `${param1}-${param2}`;
    }
}
