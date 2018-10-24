import DelegateApi from '../DelegateApi';

import Http from '../../services/Http';

import { Network, NetworkType } from '../../model/Network';

import { expect } from 'chai';

/* tslint:disable:no-unused-expression */

describe('DelegateApi', () => {
  const network = Network.getDefault(NetworkType.Alphanet);
  const http = new Http(network);
  const api = new DelegateApi(http);
  const address = 'XLkD8W97pijJD9RnYk4zb1exdCQ55GCHoi';

  it('should be instance of DelegateApi', () => {
    expect(api).to.be.instanceOf(DelegateApi);
  });

  it('should have properties', () => {
    expect(api).to.have.property('get');
    expect(api).to.have.property('list');
    expect(api).to.have.property('voters');
    expect(api).to.have.property('forgedData');
  });

  it('should return sucess from get', () => {
    return api.get({username: 'genesis_14'}).forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return sucess from list', () => {
    return api.list().forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return sucess from voters', () => {
    return api.voters({
      publicKey: '021afaa353123b0268b5d62bf156e0aca02b1199d06ec274938d4737dd2736b9d9'
    }).forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return instance of ForgedDetails from forgedData', () => {
    return api.forgedData({
      publicKey: '021afaa353123b0268b5d62bf156e0aca02b1199d06ec274938d4737dd2736b9d9'
    }).forEach((response) => {
      expect(response).to.be.property('success', true);
    });
  });

  it('should return success from search', () => {
    return api.search({
      q: 'dated_pool'
    }).forEach((response) => {
      expect(response).to.be.property('success', true);
    });
  });
});
