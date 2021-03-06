// @flow strict
// Copyright 2018 dialog LLC <info@dlg.im>

import { type RpcError } from './RpcError';

type Unbind = () => void;

export interface TransportReadable {
  onMessage(messageHandler: (message: Uint8Array) => void): Unbind;
  onError(errorHandler: (error: RpcError) => void): Unbind;
}

export interface TransportWritable {
  send(message: Uint8Array): void;
}

export interface Transport extends TransportReadable, TransportWritable {}

export interface StatusfulTransport extends Transport {
  close(): void;
  onOpen(() => void): Unbind;
  onClose(() => void): Unbind;
}
