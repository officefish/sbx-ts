import TransactionApi from '../TransactionApi';
import PeerApi from '../PeerApi';

import Http from '../../services/Http';

import { Network, NetworkType } from '../../model/Network';
import { Transaction, TransactionType, VoteType } from '../../model/Transaction';

import { expect } from 'chai';
import { PrivateKey } from '../../index';

/* tslint:disable:no-unused-expression */
const network = Network.getDefault(NetworkType.Alphanet);
const http = new Http(network);

let api: TransactionApi;

describe('TransactionApi', () => {
  const address = 'XLkD8W97pijJD9RnYk4zb1exdCQ55GCHoi';

  before(async () => {
    const peerApi = new PeerApi(http);
    const goodPeer = await peerApi.findGoodPeer().take(1).toPromise();

    network.activePeer = goodPeer;
    api = new TransactionApi(new Http(network));
  });

  it('should be instance of TransactionApi', () => {
    expect(api).to.be.instanceOf(TransactionApi);
  });

  it('should have properties', () => {
    expect(api).to.have.property('createTransaction');
    expect(api).to.have.property('createVote');
    expect(api).to.have.property('createDelegate');
    expect(api).to.have.property('createSignature');
    expect(api).to.have.property('post');
    expect(api).to.have.property('get');
    expect(api).to.have.property('getUnconfirmed');
    expect(api).to.have.property('list');
    expect(api).to.have.property('listUnconfirmed');
  });

  describe('signature check', () => {

    it('should correctly sign a tx with PrivateKey', () => {
      const key = PrivateKey.fromWIF('SCxryiz5hhkfJ4bZ7RGVzkdLqyvU7UfNFaT1ak9Gg9PSeqCAWy3h');

      return api.createTransaction({
        amount: 10,
        passphrase: key,
        recipientId: 'XLkD8W97pijJD9RnYk4zb1exdCQ55GCHoi',
        timestamp: 1,
      }).forEach((transaction) => {
        // tslint:disable
        expect(transaction.signature).to.be.deep.eq('30450221008b3ea145f47ed4ead17f5d3eda6a55c64a4fbf7a302e5a25678868e21b473eca022044dffd156a77097ef3d3873f4aa10265cc700a8356256c6aaa49b9c1278cde4e');
        expect(transaction.id).to.be.deep.eq('9e76115ec088ee82640cee6556dbfafcf52ef4ede7684a09bb6b1204ce851fee');
        // tslint:enable
      });
    });

    it('should correctly sign a send tx', () => {
      return api.createTransaction({
        amount: 10,
        passphrase: 'mysecret',
        recipientId: 'XLkD8W97pijJD9RnYk4zb1exdCQ55GCHoi',
        timestamp: 1,
      }).forEach((transaction) => {
        // tslint:disable
        expect(transaction.signature).to.be.deep.eq('30450221008b3ea145f47ed4ead17f5d3eda6a55c64a4fbf7a302e5a25678868e21b473eca022044dffd156a77097ef3d3873f4aa10265cc700a8356256c6aaa49b9c1278cde4e');
        expect(transaction.id).to.be.deep.eq('9e76115ec088ee82640cee6556dbfafcf52ef4ede7684a09bb6b1204ce851fee');
        // tslint:enable
      });
    });

    it('should correctly sign a tx with vendorField', () => {
      return api.createTransaction({
        amount: 10,
        passphrase: 'mysecret',
        recipientId: 'XLkD8W97pijJD9RnYk4zb1exdCQ55GCHoi',
        timestamp: 1,
        vendorField: 'hi from vekexasia',
      }).forEach((transaction) => {
        // tslint:disable
        expect(transaction.signature).to.be.deep.eq('3045022100f0140fbf24eb77f427e67f6f208430286470f809c21acb8fe766be1dc6feb4bd022076961437f61d13f8d7b4dde1894a40442e91ae3d238fe57e76a2b4781b4e62e5');
        expect(transaction.id).to.be.deep.eq('e3dd01ee36d3a5da778047b51e0b64bc57c9fdc3ec4342b4dc81198dd56de836');
        // tslint:enable
      });
    });

  });

  it('should create a instance of Transaction from createTransaction', () => {
    return api.createTransaction({
      amount: 100000000,
      passphrase: 'my secret',
      recipientId: address,
      vendorField: 'Send transaction by sbx-ts',
    }).forEach((transaction) => {
      expect(transaction).to.be.instanceOf(Transaction);
    });
  });

  it('should create an instance of transaction with given parameters', () => {
    return api.createTransaction({
      amount: 100000000,
      passphrase: 'my secret',
      recipientId: address,
      vendorField: 'Send transaction by sbx-ts',
    }).forEach((transaction) => {
      expect(transaction).to.be.instanceOf(Transaction);
      expect(transaction.amount).to.be.eq(100000000);
      expect(transaction.recipientId).to.be.eq(address);
      expect(transaction.vendorField).to.be.eq('Send transaction by sbx-ts');
      expect(transaction.type).to.be.eq(0);

    });
  });

  it('should create a instance of Transaction from createVote', () => {
    let delegatePublicKey = '021e6d971e5885a3147ddf1e45bf5c8d0887ad9fc659e24bdf95c2c9607e7e3fe8';
    return api.createVote({
      delegatePublicKey: delegatePublicKey,
      passphrase: 'my secret',
      type: VoteType.Add,
      vendorField: 'Send vote transaction by sbx-ts',
    }).forEach((transaction) => {
      console.log(transaction);
      expect(transaction).to.be.instanceOf(Transaction);
      expect(transaction.type).to.be.eq(TransactionType.Vote);
      expect(transaction.asset.votes[0]).to.be.eq('+' + delegatePublicKey);
      expect(transaction.vendorField).to.be.eq('Send vote transaction by sbx-ts');
    });
  });

  it('should create a instance of Transaction from createDelegate', () => {
    let publicKey = '03dcd9356b9f4e13a70fed664753e86ddbaf3d362ea8b35b6a9f4325ceda52ca7e';
    let username = 'lorenzo';
    return api.createDelegate({
      passphrase: 'my secret',
      publicKey: publicKey,
      username: username,
      vendorField: 'Send delegate transaction by sbx-ts',
    }).forEach((transaction) => {
      expect(transaction).to.be.instanceOf(Transaction);
      expect(transaction.type).to.be.eq(TransactionType.CreateDelegate);
      expect(transaction.asset.delegate.publicKey).to.be.eq(publicKey);
      expect(transaction.asset.delegate.username).to.be.eq(username);
      expect(transaction.vendorField).to.be.eq('Send delegate transaction by sbx-ts');
    });
  });

  it('should create a instance of Transaction from createSignature', () => {
    return api.createSignature('my secret', 'my second secret passphrase', 'Send signature transaction by sbx-ts').forEach((transaction) => {
      expect(transaction).to.be.instanceOf(Transaction);
      expect(transaction.type).to.be.eq(TransactionType.SecondSignature);
      expect(transaction.vendorField).to.be.eq('Send signature transaction by sbx-ts');
    });
  });

  it('should create a instance of Transaction from createSignature with PrivateKey', () => {
    return api.createSignature(PrivateKey.fromSeed('my secret'), 'my second secret passphrase')
      .forEach((transaction) => {
        expect(transaction).to.be.instanceOf(Transaction);
      });
  });

  it('should return success from get', () => {
    return api.get('879ee60077d8f6ce65b6ab5c7dfba1ff9e692a775a68d1bb34c8d0a9f418fd37').forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return false on success field from getUnconfirmed', () => {
    return api.getUnconfirmed(
      '879ee60077d8f6ce65b6ab5c7dfba1ff9e692a775a68d1bb34c8d0a9f418fd37',
    ).forEach((response) => {
      expect(response).to.have.property('success', false);
    });
  });

  it('should return success from list', () => {
    return api.list({orderBy: 'timestamp:desc', limit: 10}).forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return success from listUnconfirmed', () => {
    return api.listUnconfirmed().forEach((response) => {
      expect(response).to.have.property('success', true);
    });
  });

  it('should return false on success field from post send transaction', () => {
    //tslint:disable
    const transaction = {
      amount: 100000000,
      fee: 10000000,
      id: '5b9be5f9b1280d542e856e84758312780fe0061366592e579cbed8639511cac0',
      recipientId: 'XLkD8W97pijJD9RnYk4zb1exdCQ55GCHoi',
      senderPublicKey: '026c75159ccf36ffc639fdfcba7c6e798f90b2767b54b8a99f2eeec534c92a32e9',
      signature: '304402203d971b4e50e27e7fec8fb6d42523b82a70a82af9b9488d8f4aa16cb7936162ea022077e072b21e78cf24b7a9b8b653042dcb218b226f1b18e9a7a8462bc49e48255b',
      timestamp: 9870360,
      type: 0,
      vendorField: 'Send transaction by sbx-ts'
    };

    return api.post(transaction).forEach((response) => {
      if (network.isV2) {
        expect(response).to.have.property('transactionIds');
        expect(response.transactionIds).to.be.an('array').that.does.not.include(transaction.id);
      } else {
        expect(response).to.have.property('success', false);
      }
    });
  });

});
