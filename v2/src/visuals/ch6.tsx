import type { ComponentType } from 'react';
import type { SceneProps } from './kit';
import { Problems, Race, Actors, Venue, Ledger, AckQueue, Refused } from './ch6a';
import { Purchase, UndoWindow, Offline, PinPrepare, PinPickup, Trust, PocketCatalog, Partition, Journey } from './ch6b';

export const SCENES6: Record<string, ComponentType<SceneProps>> = {
  problems: Problems,
  race: Race,
  actors: Actors,
  venue: Venue,
  ledger: Ledger,
  ackqueue: AckQueue,
  refused: Refused,
  purchase: Purchase,
  window: UndoWindow,
  offline: Offline,
  pinprepare: PinPrepare,
  pinpickup: PinPickup,
  trust: Trust,
  pocket: PocketCatalog,
  partition: Partition,
  journey: Journey,
};
