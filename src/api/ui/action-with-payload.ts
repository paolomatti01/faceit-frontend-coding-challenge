import { Action } from 'redux';

/**
 * Used to type an action which has a payload.
 */
export type ActionWithPayload<T extends string, P> = Action<T> & {
  payload: P;
};
