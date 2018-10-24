import PeerApi from '../PeerApi';

import Http from '../../services/Http';

import { Network, NetworkType } from '../../model/Network';
import { Peer } from '../../model/Peer';

import { expect } from 'chai';

/* tslint:disable:no-unused-expression */

describe('PeerApi', () => {
  const network = Network.getDefault(NetworkType.Alphanet);
  const http = new Http(network);
  const api = new PeerApi(http);
  const address = 'XLkD8W97pijJD9RnYk4zb1exdCQ55GCHoi';

  it('should be instance of PeerApi', () => {
    expect(api).to.be.instanceOf(PeerApi);
  });

  it('should have properties', () => {
    expect(api).to.have.property('get');
    expect(api).to.have.property('list');
    expect(api).to.have.property('findGoodPeer');
  });

  it('should return success from get', () => {
    return api.get('136.144.141.118', 4100).forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return success from list', () => {
    return api.list().forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return instance of Peer from findGoodPeer', (done) => {
    return api.findGoodPeer().subscribe((peer) => {
      expect(peer).to.be.instanceOf(Peer);
      done();
    });
  });

  it('should return instance of Peer from static findGoodPeer', (done) => {
    return PeerApi.findGoodPeer(network).subscribe((peer) => {
      expect(peer).to.be.instanceOf(Peer);
      done();
    });
  });

  it('should return sucess from version', () => {
    return api.version().forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

});
