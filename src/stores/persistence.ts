import { Preferences } from '@capacitor/preferences'
import type { Card, Player } from './deck'

/* Bump when the shape below changes incompatibly. A stored blob whose version does not
 * match is discarded rather than coerced — a half-understood save would surface as
 * cards that do not exist or players with no name. */
const VERSION = 1
const KEY = 'odd-one-out:state:v1'

export type PersistedState = {
  version: number
  amountOfPlayers: number
  players: Player[]
  deck: Card[]
  playerTurn: number
  results: string[]
  firstDraw: boolean
}

const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades', 'Joker']

function isCard(v: unknown): v is Card {
  if (!v || typeof v !== 'object') return false
  const c = v as Record<string, unknown>
  return typeof c.suit === 'string' && typeof c.value === 'string' && SUITS.includes(c.suit)
}

function isPlayer(v: unknown): v is Player {
  if (!v || typeof v !== 'object') return false
  const p = v as Record<string, unknown>
  if (typeof p.name !== 'string') return false
  return p.card == null || isCard(p.card)
}

/**
 * Reads saved state, or returns null when there is nothing usable.
 *
 * Every branch that cannot fully validate returns null instead of a partial object:
 * merging a half-valid save into a live store is how you end up with a players array
 * whose length disagrees with amountOfPlayers, which silently breaks the draw loop.
 */
export async function loadState(): Promise<PersistedState | null> {
  try {
    const { value } = await Preferences.get({ key: KEY })
    if (!value) return null

    const raw = JSON.parse(value) as Record<string, unknown>
    if (raw.version !== VERSION) return null

    const players = raw.players
    if (!Array.isArray(players) || !players.every(isPlayer)) return null

    const deck = raw.deck
    if (!Array.isArray(deck) || !deck.every(isCard)) return null

    const amountOfPlayers = raw.amountOfPlayers
    if (typeof amountOfPlayers !== 'number' || amountOfPlayers < 3 || amountOfPlayers > 8) {
      return null
    }
    // The draw loop indexes players by playerTurn, so an out-of-range turn read back
    // from a save written by an older build would throw on the next draw.
    const playerTurn = raw.playerTurn
    if (typeof playerTurn !== 'number' || playerTurn < 0 || playerTurn >= players.length) {
      return null
    }

    const results = raw.results
    if (!Array.isArray(results) || !results.every((r) => typeof r === 'string')) return null

    return {
      version: VERSION,
      amountOfPlayers,
      players,
      deck,
      playerTurn,
      results,
      firstDraw: raw.firstDraw !== false,
    }
  } catch {
    // Corrupt JSON or unavailable storage: start fresh rather than block launch.
    return null
  }
}

export async function saveState(state: Omit<PersistedState, 'version'>): Promise<void> {
  try {
    await Preferences.set({ key: KEY, value: JSON.stringify({ version: VERSION, ...state }) })
  } catch {
    // Persistence is a convenience here; a failed write must not interrupt the game.
  }
}

export async function clearState(): Promise<void> {
  try {
    await Preferences.remove({ key: KEY })
  } catch {
    // Same reasoning as saveState.
  }
}
