// @flow strict

// Copyright 2018 dialog LLC <info@dlg.im>

import Nanoevents from 'nanoevents';

import type {
  RpcCall,
  UnaryRequest,
  StreamRequest,
  ClientStreamCall as IClientStreamCall,
} from './types';
import { type Transport } from './transport';
import { createSequence, type Sequence } from './utils/sequence';
import { RpcError } from './RpcError';
import { IRpcClient } from './IRpcClient';

import UnaryCall from './UnaryCall';
import ServerStreamCall from './ServerStreamCall';
import BidiStreamCall from './BidiStreamCall';
import ClientStreamCall from './ClientStreamCall';

class RpcClient implements IRpcClient<RpcCall, IClientStreamCall> {
  transport: Transport;
  calls: Map<string, RpcCall>;
  seq: Sequence;
  emitter: Nanoevents<{ error: RpcError, ... }>;

  constructor(transport: Transport) {
    this.calls = new Map();
    this.seq = createSequence();
    this.emitter = new Nanoevents();
    this.setTransport(transport);
  }

  setTransport(transport: Transport) {
    this.transport = transport;
    this.transport.onError(error => {
      this.emitter.emit('error', error);
    });
  }

  cancelRequest(id: string) {
    const call = this.calls.get(id);

    if (call) call.cancel();
  }

  makeUnaryRequest(request: UnaryRequest) {
    const id = this.seq.next();

    const call = new UnaryCall(id, this.transport);
    this.calls.set(call.id, call);

    call.onEnd(() => {
      this.calls.delete(call.id);
      this.seq.deleteId(call.id);
    });

    setImmediate(() => {
      call.start(request);
    });

    return call;
  }

  makeServerStreamRequest(request: UnaryRequest) {
    const id = this.seq.next();

    const call = new ServerStreamCall(id, this.transport);
    this.calls.set(call.id, call);

    call.onEnd(() => {
      this.calls.delete(call.id);
      this.seq.deleteId(call.id);
    });

    setImmediate(() => {
      call.start(request);
    });

    return call;
  }

  makeClientStreamRequest(request: StreamRequest) {
    const id = this.seq.next();

    const call = new ClientStreamCall(id, this.transport);
    this.calls.set(call.id, call);

    call.onEnd(() => {
      this.calls.delete(call.id);
      this.seq.deleteId(call.id);
    });

    setImmediate(() => {
      call.start(request);
    });

    return call;
  }

  makeBidiStreamRequest(request: StreamRequest) {
    const id = this.seq.next();

    const call = new BidiStreamCall(id, this.transport);
    this.calls.set(call.id, call);

    call.onEnd(() => {
      this.calls.delete(call.id);
      this.seq.deleteId(call.id);
    });

    setImmediate(() => {
      call.start(request);
    });

    return call;
  }

  onError(errorHandler: RpcError => void) {
    return this.emitter.on('error', errorHandler);
  }
}

export default RpcClient;
