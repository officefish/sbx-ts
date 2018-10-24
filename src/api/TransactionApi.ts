import { Observable } from 'rxjs/Observable';

import {deserialize, serialize} from 'json-typescript-mapper';

import * as model from '../model/Transaction';

import Http from '../services/Http';
import BlockApi from './BlockApi';
import { Peer } from '../model/Peer';

import { PrivateKey, PublicKey } from '../core/Key';
import Tx from '../core/Tx';

/** Transaction related API calls. */
export default class TransactionApi {

  constructor(private http: Http) {}

  /**
   * Transaction used to transfer amounts to specific address.
   */
  public createTransaction(params: model.TransactionSend): Observable<model.Transaction> {
    return Observable.create((observer: any) => {

      if (!PublicKey.validateAddress(params.recipientId, this.http.network)) {
        observer.error('Wrong recipientId');
      }

      BlockApi.networkFees(this.http.network).subscribe((blocks) => {
        const fees = blocks.fees;
        let data = <model.Transaction> {
          amount: params.amount,
          fee: fees.send,
          recipientId: params.recipientId,
          timestamp: params.timestamp,
          type: model.TransactionType.SendSbx,
          vendorField: params.vendorField,
        };

        const tx = new Tx(data, this.http.network, params.passphrase, params.secondPassphrase);
        data = tx.generate();
        const typedTx = deserialize(model.Transaction, data);

        observer.next(typedTx);
        observer.complete();
      }, (e) => observer.error(e));
    });
  }

  /**
   * Transaction used to vote for a chosen Delegate.
   */
  public createVote(params: model.TransactionVote) {
    return Observable.create((observer: any) => {
      BlockApi.networkFees(this.http.network).subscribe((blocks) => {
        const fees = blocks.fees;
        const updown = model.VoteType[params.type] === 'Add' ? '+' : '-';

        let data = <model.Transaction> {
          asset: {
            votes: [updown + params.delegatePublicKey],
          },
          fee: fees.vote,
          type: model.TransactionType.Vote,
          vendorField: params.vendorField,
        };

        const tx = new Tx(data, this.http.network, params.passphrase, params.secondPassphrase);
        tx.setAddress();
        data = tx.generate();

        const typedTx = deserialize(model.Transaction, data);
        typedTx.asset = data.asset;

        observer.next(typedTx);
        observer.complete();
      }, (e) => observer.error(e));
    });
  }

  /**
   * Transaction used to register as a Delegate.
   */
  public createDelegate(params: model.TransactionDelegate) {
    return Observable.create((observer: any) => {
      if (params.username.length > 20) {
        observer.error('Delegate name is too long, 20 characters maximum');
      }

      BlockApi.networkFees(this.http.network).subscribe((blocks) => {
        const fees = blocks.fees;
        let data = <model.Transaction> {
          asset: {
            delegate: {
              publicKey: params.publicKey,
              username: params.username,
            },
          },
          fee: fees.delegate,
          type: model.TransactionType.CreateDelegate,
          vendorField: params.vendorField,
        };

        const tx = new Tx(data, this.http.network, params.passphrase, params.secondPassphrase);
        data = tx.generate();

        const typedTx = deserialize(model.Transaction, data);
        typedTx.asset = data.asset;

        observer.next(typedTx);
        observer.complete();
      }, (e) => observer.error(e));
    });
  }

  /**
   * Transaction used to create second passphrase.
   */
  public createSignature(passphrase: string | PrivateKey, secondPassphrase: string, vendorField?: string) {
    return Observable.create((observer: any) => {
      BlockApi.networkFees(this.http.network).subscribe((blocks) => {
        const fees = blocks.fees;
        let data = <model.Transaction> {
          asset: {},
          fee: fees.secondsignature,
          type: model.TransactionType.SecondSignature,
          vendorField: vendorField,
        };

        const tx = new Tx(data, this.http.network, passphrase, secondPassphrase);
        tx.setAssetSignature();
        data = tx.generate();

        const typedTx = deserialize(model.Transaction, data);
        typedTx.asset = tx.transaction.asset;

        observer.next(typedTx);
        observer.complete();
      }, (e) => observer(e));
    });
  }

  /**
   * Post transaction to broadcast
   */
  public post(transaction: model.Transaction, peer?: Peer) {
    const params = {transactions: [transaction]};

    if (peer) {
      const port = this.http.network.isV2 ? this.http.network.p2pPort : peer.port;
      let url = `http://${peer.ip}:${port}/peer/transactions`;

      return this.http.postNative<model.TransactionPostResponse>(url, params, model.TransactionPostResponse);
    }

    return this.http.post<model.TransactionPostResponse>('/peer/transactions', params, model.TransactionPostResponse);
  }

  /**
   * Transaction matched by id.
   */
  public get(id: string) {
    const params = {id};
    return this.http.get<model.TransactionResponse>('/transactions/get', params, model.TransactionResponse);
  }

  /**
   * Get unconfirmed transaction by id.
   */
  public getUnconfirmed(id: string) {
    const params = {id};
    return this.http.get<model.TransactionResponse>('/transactions/unconfirmed/get', params, model.TransactionResponse);
  }

  /**
   * Transactions list matched by provided parameters.
   */
  public list(params?: model.TransactionQueryParams) {
    return this.http.get<model.TransactionResponse>('/transactions', params, model.TransactionResponse);
  }

  /**
   * Transactions unconfirmed list matched by provided parameters.
   */
  public listUnconfirmed(params?: model.TransactionQueryParams) {
    return this.http.get<model.TransactionResponse>('/transactions/unconfirmed', params, model.TransactionResponse);
  }

}
