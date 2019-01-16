/*
 * Copyright 2018 dialog LLC <info@dlg.im>
 * @flow
 */

import { flatten, pipe, map, mergeAll, toPairs } from 'lodash/fp';
import * as protoLoader from '@grpc/proto-loader';
import glob from 'glob';

type GrpcMethodDefinition = {
  path: string,
  requestStream: boolean,
  responseStream: boolean,
  originalName: string,
};

export const parseProtoFiles: (
  protoFiles: Array<string>,
) => Map<string, { [methodName: string]: GrpcMethodDefinition }> = pipe([
  map(glob.sync),
  flatten,
  map(protoLoader.loadSync),
  mergeAll,
  toPairs,
  entries => new Map(entries),
]);