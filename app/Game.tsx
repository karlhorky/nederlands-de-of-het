'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Article } from '../database/words';
import { words } from '../database/words';
import {
  type Answer,
  type GameState,
  loadGameState,
  saveGameState,
  createFreshGameState,
  createGameStateFromIndices,
} from '../util/persistence';

export default function Game() {
  // Keep for possible future filtering/exclusions
  const dataset = useMemo(() => words, []);

  const [state, setState] = useState<GameState | null>(null);
  const btnDeRef = useRef<HTMLButtonElement>(null);
  const btnHetRef = useRef<HTMLButtonElement>(null);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);

  // initialize / restore
  useEffect(() => {
    const existingState = loadGameState();
    if (existingState) {
      setState(existingState);
      return;
    }
    const fresh = createFreshGameState(dataset.length);
    setState(fresh);
    saveGameState(fresh);
  }, [dataset.length]);

  // helper to persist state
  const save = useCallback((next: GameState) => {
    setState(next);
    saveGameState(next);
  }, []);

  const answer = useCallback(
    (chosen: Article) => {
      if (!state || state.done) return;
      const index = state.order[state.pointer]!;
      const item = dataset[index]!;
      const expected = item.article;
      const correct = chosen === expected;
      setFlash(correct ? 'correct' : 'wrong');
      const entry: Answer = { index, chosen, expected, correct };
      const nextPointer = state.pointer + 1;
      const done = nextPointer >= state.order.length;

      const next: GameState = {
        order: state.order,
        pointer: done ? state.pointer : nextPointer,
        answers: [...state.answers, entry],
        done,
      };
      save(next);

      // visual feedback flash
      setTimeout(() => setFlash(null), 250);
    },
    [dataset, save, state],
  );

  // keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!state || state.done) return;
      if (
        ['1', 'Digit1', 'Numpad1', 'ArrowLeft', 'KeyD'].includes(e.code) ||
        e.key === '1' ||
        e.key.toLowerCase() === 'd'
      ) {
        e.preventDefault();
        answer('de');
      }
      if (
        ['2', 'Digit2', 'Numpad2', 'ArrowRight', 'KeyH'].includes(e.code) ||
        e.key === '2' ||
        e.key.toLowerCase() === 'h'
      ) {
        e.preventDefault();
        answer('het');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answer, state]);

  // show lightweight shell while initializing
  if (!state) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <section className="rounded-xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
          <h1 className="text-2xl font-semibold">Lidwoord-spel</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Bezig met laden…
          </p>
        </section>
      </main>
    );
  }

  const total = dataset.length;
  const at = state.order[state.pointer]!;
  const current = dataset[at]!;

  const correctCount = state.answers.filter((a) => a.correct).length;
  const progress = state.answers.length / total;

  if (state.done) {
    const wrong = state.answers.filter((a) => !a.correct);
    return (
      <main className="mx-auto max-w-2xl p-6">
        <section className="rounded-xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
          <h1 className="mb-2 text-2xl font-semibold">Klaar!</h1>
          <p className="mb-6 text-neutral-700 dark:text-neutral-300">
            Je had <strong>{correctCount}</strong> van de{' '}
            <strong>{total}</strong> goed.
          </p>

          {wrong.length > 0 ? (
            <>
              <h2 className="mb-3 text-lg font-semibold">
                Herhalen — fout gemaakte woorden
              </h2>
              <ul className="mb-6 space-y-2">
                {wrong.map((a) => {
                  const w = dataset[a.index]!;
                  return (
                    <li
                      key={`wrong-${a.index}`}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                    >
                      <span>
                        <span className="mr-2 rounded bg-neutral-100 px-2 py-0.5 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                          {a.chosen}
                        </span>
                        <span className="font-medium">{w.word}</span>
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        juist: <strong>{w.article}</strong>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const fresh = createGameStateFromIndices(wrong.map((w) => w.index));
                    save(fresh);
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  Oefen opnieuw (alleen fouten)
                </button>
                <button
                  onClick={() => {
                    const fresh = createFreshGameState(dataset.length);
                    save(fresh);
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  Oefen opnieuw (alles)
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-green-50 p-4 text-green-900 dark:bg-green-900/40 dark:text-green-100">
              Top! Alles goed 🎉
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Lidwoord-spel</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Gebruik het toetsenbord:{' '}
            <kbd className="rounded border px-1">1</kbd> = <b>de</b>,{' '}
            <kbd className="rounded border px-1">2</kbd> = <b>het</b>, pijlen{' '}
            <kbd className="rounded border px-1">←</kbd>/
            <kbd className="rounded border px-1">→</kbd>, of{' '}
            <kbd className="rounded border px-1">D</kbd>/
            <kbd className="rounded border px-1">H</kbd>.
          </p>
          <div className="mt-4 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-2 rounded-full bg-black transition-all dark:bg-white"
              style={{ width: `${Math.max(1, Math.floor(progress * 100))}%` }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Vraag <strong>{state.answers.length + 1}</strong> van{' '}
            <strong>{total}</strong>
          </p>
        </header>

        <div className="mb-6">
          <div
            className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-4xl font-semibold tracking-wide dark:border-neutral-800 dark:bg-neutral-800"
            aria-live="polite"
          >
            {current.word}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              ref={btnDeRef}
              onClick={() => answer('de')}
              aria-keyshortcuts="1 D ArrowLeft"
              className={`inline-flex items-center justify-center rounded-lg border border-neutral-200 px-5 py-4 text-lg font-medium text-current hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-neutral-700 dark:hover:bg-neutral-800 ${
                flash === 'correct' && current.article === 'de'
                  ? 'ring-2 ring-green-600'
                  : flash === 'wrong' && current.article !== 'de'
                    ? 'ring-2 ring-red-600'
                    : ''
              }`}
            >
              1. de
            </button>
            <button
              ref={btnHetRef}
              onClick={() => answer('het')}
              aria-keyshortcuts="2 H ArrowRight"
              className={`inline-flex items-center justify-center rounded-lg border border-neutral-200 px-5 py-4 text-lg font-medium text-current hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-neutral-700 dark:hover:bg-neutral-800 ${
                flash === 'correct' && current.article === 'het'
                  ? 'ring-2 ring-green-600'
                  : flash === 'wrong' && current.article !== 'het'
                    ? 'ring-2 ring-red-600'
                    : ''
              }`}
            >
              2. het
            </button>
          </div>
        </div>

        <footer className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>Voortgang: {Math.round(progress * 100)}%</span>
          <button
            className="underline hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            onClick={() => {
              const confirmReset = window.confirm(
                'Alles resetten en opnieuw beginnen?',
              );
              if (!confirmReset) return;
              const fresh = createFreshGameState(dataset.length);
              saveGameState(fresh);
              setState(fresh);
            }}
          >
            Reset
          </button>
        </footer>
      </section>
    </main>
  );
}
