# DeleGator e2e

End-to-end integration tests for the Smart Accounts Kit. It uses local chain, bundler and paymaster made available via [Pimlico's local testing docker compose](https://docs.pimlico.io/permissionless/how-to/local-testing).

## Requirements

1. [Docker](https://www.docker.com/) must be installed and configured in order to run the chain, bundler and paymaster.
2. Dependencies must be installed with `yarn install` at the root of the monorepo.
3. Internal packages must be built with `yarn build` at the root of the monorepo.

## Run the tests

1. In order to start the infrastructure, and deploy the DeleGator environment, execute the `yarn setup` command. This will use `docker compose` to start the various services, and execute `scripts/setup-environment.ts` to wait for the services to be available, and deploy the Delegator Framework. The environment JSON is written to disk at `.gator-env.json`.

2. Execute the tests with `yarn test` which will use `vitest` test runner to execute the tests.

3. The infrastructure can be stopped with `yarn teardown` which uses `docker compose` to stop the various services.

When developing end-to-end tests, you can run step 2 repeatedly without having to start and stop the services in between.

### Test Types

The end-to-end test suite runs the complete test suite including all test cases using `yarn test:e2e`.

## Adding tests

Tests can be added simply by creating a file `test/<your-test>.test.ts`.

Some guidelines for creating tests:

- **Important:** tests share a single blockchain instance so should always use generated keys, addresses and salts to avoid conflicts with other tests.
- Each test file should be focussed on a single user story.
- Within a test, any setup required should be executed in `beforeEach` hook at the start of the file.
- Before the tests themselves, a block comment should outline the user story.
- A number of tests can be included to validate various failure modes or alternatives. These should be kept as concise and simple as possible.
- Common assertions should be centralised into `test/utils/assertions.ts` and shared across tests.
- All assertions should have descriptive messages.
- Assertions throughout the test can be made to ensure that state is as expected - this can be helpful when debugging failing tests.

### Test Structure

When creating a test file, follow this structure:

```typescript
import { beforeEach, expect, test } from 'vitest';
import { /* your imports */ } from './utils/helpers';
import { /* your imports */ } from './utils/assertions';

// Test setup variables
let smartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;

beforeEach(async () => {
  ...
});

/*
  User story description:
  - What is being tested
  - Expected behavior
  - Any important context
*/

test('Description of the main functionality', async () => {
  ...
});

test('Description of edge case or alternative scenario', async () => {
  ...
});

test('Description of failure case', async () => {
  ...
});
```

Key points about test structure:

1. **Test Organization**:
   - Use `beforeEach` for common setup
   - Group related assertions together
   - Use descriptive test names that explain the scenario
   - Include a block comment describing the user story

2. **Common Patterns**:
   - Use helper functions from `utils/helpers.ts` for common operations
   - Use assertion functions from `utils/assertions.ts` for consistent validation
   - Generate unique addresses and keys for each test
   - Clean up state in `beforeEach` to ensure test isolation
   - `runTest_expectSuccess` and `runTest_expectFailure` to abstract common functionality out of each test within the file