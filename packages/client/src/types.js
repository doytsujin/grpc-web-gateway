// @flow strict
// Copyright 2018 dialog LLC <info@dlg.im>

import { RpcError } from './RpcError';

export interface WriteRpcTransport {
  send(message: Uint8Array): void;
}

export type RpcCallStatus = 'initial' | 'open' | 'closed' | 'cancelled';

export interface RpcCall {
  status: RpcCallStatus;
  cancel(reason?: string): void;
  onMessage(handler: (Uint8Array) => void): () => void;
  onError(handler: (RpcError) => void): () => void;
  onEnd(handler: () => void): () => void;
}

export type Metadata = { [key: string]: string, ... };

export type UnaryRequest = {
  service: string,
  method: string,
  payload: Uint8Array,
  metadata?: Metadata,
  ...
};

export type PushRequest = {
  payload: Uint8Array,
  metadata?: Metadata,
  ...
};

export type StreamRequest = {
  service: string,
  method: string,
  metadata?: Metadata,
  ...
};

export interface ClientStreamCall extends RpcCall {
  send(PushRequest): void;
  end(): void;
}
