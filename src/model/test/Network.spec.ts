import { Network, NetworkType } from '../Network';
import { Peer } from '../Peer';

import { expect } from 'chai';

/* tslint:disable:no-unused-expression */

describe('Network', () => {

  it ('should be a object', () => {
    expect(NetworkType).to.be.a('object');
  });

  it ('should have properties', () => {
    expect(NetworkType).have.property('Alphanet');
    expect(Network).have.property('getDefault');
  });

  it('should create a instance of alphanet network', () => {
    const network = Network.getDefault(NetworkType.Alphanet);
    expect(network.name).to.be.equal('alphanet');
  });

  it('should create a instance of testnet network', () => {
    const network = Network.getDefault(NetworkType.Testnet);
    expect(network.name).to.be.equal('testnet');
  });

  it('should create a manual instance of network', () => {
    const network = new Network;

    network.type = NetworkType.Testnet;
    network.name = 'testnet';
    network.nethash = '9d39602ff3d69780da2c9f5ed5e24451409f6511e226bd540dd84a375508ce5b';

    expect(network).to.be.instanceOf(Network);
  });

  it('should set a active peer', () => {
    const network = new Network;
    const peer = new Peer;
    peer.ip = '136.144.141.118';
    peer.port = 4100;

    network.type = NetworkType.Alphanet;
    network.name = 'alphanet';
    network.nethash = 'd21f07a10a8314d558132de8a3848e6fa9edde754638d1aacd381c6efb8be81d';

    network.setPeer(peer);
    expect(network.activePeer).to.be.instanceOf(Peer);
  });

  it('should return string url from active peer', () => {
    const network = new Network;
    const peer = new Peer;
    peer.ip = '136.144.141.118';
    peer.port = 4100;

    network.type = NetworkType.Alphanet;
    network.name = 'alphanet';
    network.nethash = 'd21f07a10a8314d558132de8a3848e6fa9edde754638d1aacd381c6efb8be81d';

    network.setPeer(peer);
    expect(network.getPeerAPIUrl()).to.be.a('string').and.not.empty;
  });

  it('should return array of two Networks', () => {
    expect(Network.getAll()).to.be.an('array').and.to.have.lengthOf(2);
  });

});
