import * as Y from 'yjs';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate, removeAwarenessStates } from 'y-protocols/awareness';
import { supabase } from './supabase';

const toB64 = (u8) => {
  let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromB64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

/**
 * Minimal Yjs provider over a private Supabase Realtime channel.
 * Access is enforced by realtime.messages RLS (owner or invited members only).
 */
export class SupabaseProvider {
  constructor(sessionId, doc, user, initialContent, onStatus) {
    this.doc = doc;
    this.awareness = new Awareness(doc);
    this.onStatus = onStatus;
    this.ytext = doc.getText('code');
    this.origin = Symbol('remote');
    this.channel = supabase.channel(`collab:${sessionId}`, {
      config: { private: true, broadcast: { self: false }, presence: { key: user.id } },
    });

    this.onDocUpdate = (update, origin) => {
      if (origin === this.origin) return;
      this.send('update', { u: toB64(update) });
    };
    this.onAwareness = ({ added, updated, removed }, origin) => {
      if (origin === this.origin) return;
      const ids = [...added, ...updated, ...removed];
      this.send('awareness', { u: toB64(encodeAwarenessUpdate(this.awareness, ids)) });
    };
    doc.on('update', this.onDocUpdate);
    this.awareness.on('update', this.onAwareness);

    this.channel
      .on('broadcast', { event: 'update' }, ({ payload }) => Y.applyUpdate(doc, fromB64(payload.u), this.origin))
      .on('broadcast', { event: 'awareness' }, ({ payload }) =>
        applyAwarenessUpdate(this.awareness, fromB64(payload.u), this.origin),
      )
      .on('broadcast', { event: 'sync-request' }, () => {
        this.send('update', { u: toB64(Y.encodeStateAsUpdate(doc)) });
        this.send('awareness', {
          u: toB64(encodeAwarenessUpdate(this.awareness, [doc.clientID])),
        });
      })
      .on('presence', { event: 'sync' }, () => {
        this.onStatus?.({ peers: Object.keys(this.channel.presenceState()).length });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({ id: user.id, email: user.email });
          this.send('sync-request', {});
          // If nobody else is here after a moment, seed from the saved snapshot.
          setTimeout(() => {
            const alone = Object.keys(this.channel.presenceState()).length <= 1;
            if (alone && this.ytext.length === 0 && initialContent) this.ytext.insert(0, initialContent);
            this.onStatus?.({ ready: true });
          }, 900);
        }
        this.onStatus?.({ status });
      });
  }

  send(event, payload) {
    this.channel.send({ type: 'broadcast', event, payload });
  }

  destroy() {
    this.doc.off('update', this.onDocUpdate);
    this.awareness.off('update', this.onAwareness);
    removeAwarenessStates(this.awareness, [this.doc.clientID], 'destroy');
    supabase.removeChannel(this.channel);
  }
}
