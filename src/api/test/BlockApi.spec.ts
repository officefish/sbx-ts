import BlockApi from '../BlockApi';

import Http from '../../services/Http';

import { Network, NetworkType } from '../../model/Network';

import { expect } from 'chai';

/* tslint:disable:no-unused-expression */

describe('BlockApi', () => {
  const network = Network.getDefault(NetworkType.Alphanet);
  const http = new Http(network);
  const api = new BlockApi(http);
  const address = 'XLkD8W97pijJD9RnYk4zb1exdCQ55GCHoi';

  it('should have static property', () => {
    expect(BlockApi).to.have.property('networkFees');
  });

  it('should return success from networkFees', () => {
    return BlockApi.networkFees(network).forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should be instance of BlockApi', () => {
    expect(api).to.be.instanceOf(BlockApi);
  });

  it('should have properties', () => {
    expect(api).to.have.property('get');
    expect(api).to.have.property('list');
    expect(api).to.have.property('blockchainFee');
    expect(api).to.have.property('blockchainHeight');
  });

  it('should return sucess from get', () => {
    return api.get({id: '16851126048647422538'}).forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return sucess from list', () => {
    return api.list().forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return sucess from blockchainFee', () => {
    return api.blockchainFee().forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return sucess from blockchainHeight', () => {
    return api.blockchainHeight().forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

});
