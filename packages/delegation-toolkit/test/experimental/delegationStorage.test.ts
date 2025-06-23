import { expect } from 'chai';
import { stub } from 'sinon';

import {
  createDelegationStoreAPIFetchResponse,
  DELEGATOR_ACCOUNT,
  MOCK_SIGNED_DELEGATION,
  RequestType,
  UNSIGNED_DELEGATION,
} from './delegationStorageTestData';
import { getDelegationHashOffchain } from '../../src/delegation';
import {
  DelegationStorageClient,
  DelegationStorageEnvironment,
  DelegationStoreFilter,
} from '../../src/experimental/delegationStorage';

const mockAPIKey = 'mock-api-key-mock-api-key';
const mockAPIKeyId = 'mock-api-key-id-mock-api-key-id';
const mockApiUrl = 'http://localhost:3000';

const mockConfig = {
  apiKey: mockAPIKey,
  apiKeyId: mockAPIKeyId,
  environment: {
    apiUrl: mockApiUrl,
  },
};

describe('DelegationStorageClient', () => {
  const mockFetch = stub();

  beforeEach(() => {
    mockFetch.reset();
  });

  describe('constructor', () => {
    it('should create an instance of DelegationStorageClient', () => {
      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      expect(delegationStore).to.be.instanceOf(DelegationStorageClient);
    });

    it('should create an instance with a predefined environment', () => {
      const environment = DelegationStorageEnvironment.dev;

      const delegationStore = new DelegationStorageClient({
        apiKey: mockAPIKey,
        apiKeyId: mockAPIKeyId,
        environment,
        fetcher: mockFetch,
      });

      expect(delegationStore).to.be.instanceOf(DelegationStorageClient);
    });
  });

  describe('getDelegationChain', () => {
    it('should call the service correctly', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.DelegationChange),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      const leafDelegationHash = getDelegationHashOffchain(
        MOCK_SIGNED_DELEGATION,
      );

      await delegationStore.getDelegationChain(leafDelegationHash);

      expect(mockFetch.getCall(0).args).to.deep.equal([
        `${mockApiUrl}/api/v0/delegation/chain/${leafDelegationHash}`,
        {
          headers: {
            Authorization: `Bearer ${mockAPIKey}`,
            'x-api-key-id': mockAPIKeyId,
          },
          method: 'GET',
        },
      ]);
    });

    it('should return the delegation chain given a leafDelegationHash', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.DelegationChange),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      const leafDelegationHash = getDelegationHashOffchain(
        MOCK_SIGNED_DELEGATION,
      );

      const delegations =
        await delegationStore.getDelegationChain(leafDelegationHash);

      expect(delegations).to.deep.equal([MOCK_SIGNED_DELEGATION]);
      expect(mockFetch.getCall(0).args).to.deep.equal([
        `${mockApiUrl}/api/v0/delegation/chain/${leafDelegationHash}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAPIKey}`,
            'x-api-key-id': mockAPIKeyId,
          },
        },
      ]);
    });

    it('should return the delegation chain given a delegation', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.DelegationChange),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      const leafDelegationHash = getDelegationHashOffchain(
        MOCK_SIGNED_DELEGATION,
      );

      const delegations = await delegationStore.getDelegationChain(
        MOCK_SIGNED_DELEGATION,
      );

      expect(delegations).to.to.deep.equal([MOCK_SIGNED_DELEGATION]);
      expect(mockFetch.getCall(0).args).to.deep.equal([
        `${mockApiUrl}/api/v0/delegation/chain/${leafDelegationHash}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAPIKey}`,
            'x-api-key-id': mockAPIKeyId,
          },
        },
      ]);
    });

    it('should throw error when delegation store API returns error response', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.FAILED_REQUEST),
      );
      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      await expect(
        delegationStore.getDelegationChain('0x-leafDelegationHash'),
      ).to.be.rejectedWith('Some API error');
    });
  });

  describe('fetchDelegations', () => {
    it('should call the service with the default request type', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.DELEGATIONS),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      const deleGatorAddress = DELEGATOR_ACCOUNT;

      await delegationStore.fetchDelegations(deleGatorAddress);

      expect(mockFetch.getCall(0).args).to.deep.equal([
        `${mockApiUrl}/api/v0/delegation/accounts/${deleGatorAddress}?filter=${DelegationStoreFilter.Received}`,
        {
          headers: {
            Authorization: `Bearer ${mockAPIKey}`,
            'x-api-key-id': mockAPIKeyId,
          },
          method: 'GET',
        },
      ]);
    });

    it('should call the service with the specified request type', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.DELEGATIONS),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      const deleGatorAddress = DELEGATOR_ACCOUNT;

      await delegationStore.fetchDelegations(
        deleGatorAddress,
        DelegationStoreFilter.Given,
      );

      expect(mockFetch.getCall(-1).args).to.deep.equal([
        `${mockApiUrl}/api/v0/delegation/accounts/${deleGatorAddress}?filter=${DelegationStoreFilter.Given}`,
        {
          headers: {
            Authorization: `Bearer ${mockAPIKey}`,
            'x-api-key-id': mockAPIKeyId,
          },
          method: 'GET',
        },
      ]);
    });

    it('should return all the delegations received given a deleGatorAddress', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.DELEGATIONS),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      const deleGatorAddress = DELEGATOR_ACCOUNT;

      const delegations =
        await delegationStore.fetchDelegations(deleGatorAddress);

      expect(delegations).to.deep.equal([MOCK_SIGNED_DELEGATION]);
      expect(mockFetch.getCall(-1).args).to.deep.equal([
        `${mockApiUrl}/api/v0/delegation/accounts/${deleGatorAddress}?filter=${DelegationStoreFilter.Received}`,
        {
          headers: {
            Authorization: `Bearer ${mockAPIKey}`,
            'x-api-key-id': mockAPIKeyId,
          },
          method: 'GET',
        },
      ]);
    });

    it('should throw error when delegation Store API returns error response', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.FAILED_REQUEST),
      );
      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      await expect(
        delegationStore.fetchDelegations('0x-deleGatorAddress'),
      ).to.be.rejectedWith('Some API error');
    });
  });

  describe('storeDelegation()', () => {
    it('should resolve to delegationHash when delegation storage middleware successfully stores a signed delegation', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(
          RequestType.PERSIST_SIGNED_DELEGATION,
          MOCK_SIGNED_DELEGATION,
        ),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      const delegationHash = await delegationStore.storeDelegation(
        MOCK_SIGNED_DELEGATION,
      );
      expect(delegationHash).to.equal(
        getDelegationHashOffchain(MOCK_SIGNED_DELEGATION),
      );
    });

    it('should throw error when delegation store API returns delegation hash response that does not match the signed delegation', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(
          RequestType.PERSIST_SIGNED_DELEGATION_FAILED_REQUEST,
        ),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      await expect(
        delegationStore.storeDelegation(MOCK_SIGNED_DELEGATION),
      ).to.be.rejectedWith(
        'Failed to store the Delegation, the hash returned from the MM delegation storage API does not match the hash of the delegation',
      );
    });

    it('should throw error when delegation signature is missing', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.FAILED_REQUEST),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      await expect(
        delegationStore.storeDelegation(UNSIGNED_DELEGATION),
      ).to.be.rejectedWith('Delegation must be signed to be stored');
    });

    it('should throw error when delegation store API returns error response', async () => {
      mockFetch.resolves(
        createDelegationStoreAPIFetchResponse(RequestType.FAILED_REQUEST),
      );

      const delegationStore = new DelegationStorageClient({
        ...mockConfig,
        fetcher: mockFetch,
      });

      await expect(
        delegationStore.storeDelegation(MOCK_SIGNED_DELEGATION),
      ).to.be.rejectedWith('Some API error');
    });
  });
});
