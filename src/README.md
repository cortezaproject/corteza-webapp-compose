# Guidelines

There are a few guidelines to follow here:

1. Don't use bootstrap components like `b-modal`, write plain HTML code for components using bootstrap class naming conventions,
2. Don't tightly couple logic (ajax calls) with store, store actions should only contain logic for modifying the store based on input objects,
3. If there is limited use in sharing functionality, evaluate if a mixin should be used before resorting to vuex,
4. Generally don't use vuex unless you share data globally (authentication is a great example where vuex should be used)
5. Don't import less/css in components - *only use scoped styles when appropriate*. Global styling should go into `src/assets` (ie, how buttons should look)
6. Using `.table` classes from bootstrap isn't a bad thing. Tables get a bad reputation, but it's going to be better for most cases. Use bootstrap styling.
7. Use `.row` and `.col-N` for splitting contents into columns (bootstrap grid utilities).
8. The view is the controlling element - it implements logic (ajax calls), and interacts with the store as needed (actions). 80%+ views don't use vuex.
9. The components should be effectively read-only elements. Data should be passed to them, but they shouldn't contain any logic.

There may be other rules to follow, and there may be an exception to any of the above rules.