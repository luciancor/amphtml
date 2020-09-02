/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {contextProp} from './prop';

/** @type {!ContextProp<boolean>} */
// eslint-disable-next-line local/no-export-side-effect
export const CanRender = contextProp('CanRender', {
  defaultValue: true,
  recursive: (inputs) => inputs.reduce(andReducer),
  compute: (contextNode, inputs, parentValue) =>
    (parentValue && inputs.reduce(andReducer, true)) || false,
});

/** @type {!ContextProp<boolean>} */
// eslint-disable-next-line local/no-export-side-effect
export const CanPlay = contextProp('CanPlay', {
  defaultValue: true,
  recursive: (inputs) => inputs.reduce(andReducer),
  deps: [CanRender],
  compute: (contextNode, inputs, parentValue, canRender) =>
    (canRender && parentValue && inputs.reduce(andReducer, true)) || false,
});

// QQQ: move to loader.
/** @enum {number} */
// eslint-disable-next-line local/no-export-side-effect
export const LoadingStrategy = {
  AUTO: 0,
  EAGER: 1,
  LAZY: 2,
  PAUSE: 3,
  UNLOAD: 4,
};

/** @type {!ContextProp<LoadingStrategy>} */
// eslint-disable-next-line local/no-export-side-effect
export const LoadingStrategyProp = contextProp('LoadingStrategy', {
  defaultValue: LoadingStrategy.AUTO,
  recursive: (inputs) => inputs.reduce(maxReducer),
  deps: [CanRender],
  compute: (contextNode, inputs, parentValue, canRender) =>
    maxReducer(
      canRender ? LoadingStrategy.AUTO : LoadingStrategy.PAUSE,
      maxReducer(
        parentValue || LoadingStrategy.AUTO,
        inputs.reduce(maxReducer, LoadingStrategy.AUTO)
      )
    ),
});

// QQQ: consider a 3-state: `true`, `false`, `none`.
/** @type {!ContextProp<boolean>} */
// eslint-disable-next-line local/no-export-side-effect
export const LoadPendingState = contextProp('LoadPending');

/** @type {!ContextProp<boolean>} */
// eslint-disable-next-line local/no-export-side-effect
export const LoadedState = contextProp('LoadedState', {defaultValue: false});

const andReducer = (acc, value) => acc && value;
const maxReducer = (acc, value) => Math.max(acc, value);
