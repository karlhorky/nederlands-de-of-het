'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Article } from '../database/words';
import { words } from '../database/words';
import {
  type Answer,
  createFreshGameState,
  createGameStateFromIndices,
  type GameState,
  loadGameState,
  saveGameState,
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
      <main className="h-full p-3 lg:p-6 min-h-0 flex items-center justify-center @container">
        <section className="w-full max-w-2xl h-fit rounded-xl border border-neutral-200 bg-white p-4 lg:p-6 @max-h-[350px]:p-3 text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 flex flex-col justify-center">
          <h1 className="text-xl lg:text-2xl @max-h-[350px]:text-lg @max-[360px]:text-base font-semibold">
            Lidwoord-spel
          </h1>
          <p className="mt-2 text-sm @max-h-[350px]:text-xs text-neutral-600 dark:text-neutral-400">
            Bezig met laden…
          </p>
        </section>
      </main>
    );
  }

  const total = state.order.length;
  const at = state.order[state.pointer]!;
  const current = dataset[at]!;

  const correctCount = state.answers.filter((a) => a.correct).length;
  const progress = state.answers.length / total;

  if (state.done) {
    const wrong = state.answers.filter((a) => !a.correct);
    return (
      <main className="h-full p-3 lg:p-6 min-h-0 flex items-center justify-center @container">
        <section className="w-full max-w-2xl h-fit max-h-full rounded-xl border border-neutral-200 bg-white p-4 lg:p-6 @max-h-[350px]:p-3 text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 flex flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <h1 className="mb-2 text-xl lg:text-2xl @max-h-[350px]:text-lg @max-[360px]:text-base font-semibold">
              Klaar!
            </h1>
            <p className="mb-4 lg:mb-6 @max-h-[350px]:mb-3 text-neutral-700 @max-h-[350px]:text-sm dark:text-neutral-300">
              Je had <strong>{correctCount}</strong> van de{' '}
              <strong>{total}</strong> goed.
            </p>
          </div>

          {wrong.length > 0 ? (
            <>
              <div className="flex-1 min-h-0 flex flex-col">
                <h2 className="mb-3 text-base lg:text-lg font-semibold flex-shrink-0">
                  Herhalen — fout gemaakte woorden
                </h2>
                <div className="flex-1 overflow-y-auto min-h-0">
                  <ul className="mb-4 lg:mb-6 space-y-2">
                    {wrong.map((a) => {
                      const w = dataset[a.index]!;
                      return (
                        <li
                          key={`wrong-${a.index}`}
                          className="flex items-center justify-between rounded-lg border border-neutral-200 p-2 lg:p-3 dark:border-neutral-800"
                        >
                          <span>
                            <span className="mr-2 rounded bg-neutral-100 px-2 py-0.5 text-xs lg:text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                              {a.chosen}
                            </span>
                            <span className="font-medium text-sm lg:text-base">
                              {w.word}
                            </span>
                          </span>
                          <span className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400">
                            juist: <strong>{w.article}</strong>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="flex gap-3 @max-h-[350px]:gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    const fresh = createGameStateFromIndices(
                      wrong.map((w) => w.index),
                    );
                    save(fresh);
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 lg:px-4 @max-h-[350px]:px-2 py-2 text-xs lg:text-sm @max-h-[350px]:text-xs font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  Oefen opnieuw (alleen fouten)
                </button>
                <button
                  onClick={() => {
                    const fresh = createFreshGameState(dataset.length);
                    save(fresh);
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-black px-3 lg:px-4 @max-h-[350px]:px-2 py-2 text-xs lg:text-sm @max-h-[350px]:text-xs font-medium text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  Oefen opnieuw (alles)
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-green-50 p-4 text-green-900 dark:bg-green-900/40 dark:text-green-100 flex-shrink-0">
              Top! Alles goed 🎉
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="h-full min-h-0 p-3 lg:p-6 flex items-stretch justify-center @container">
      <section className="w-full max-w-2xl h-full flex flex-col rounded-xl border border-neutral-200 bg-white p-4 lg:p-6 text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 [container-type:size] [container-name:game]">
        <header className="mb-4 lg:mb-6 scale-margin-medium scale-margin-small scale-margin-tiny scale-margin-mini flex-shrink-0">
          <h1 className="text-xl lg:text-2xl scale-on-large scale-on-medium scale-on-small font-semibold">
            Lidwoord-spel
          </h1>
          <p className="mt-1 text-xs lg:text-sm scale-on-tiny text-neutral-600 dark:text-neutral-400 hide-on-large">
            Gebruik het toetsenbord:{' '}
            <kbd className="rounded border px-1">1</kbd> = <b>de</b>,{' '}
            <kbd className="rounded border px-1">2</kbd> = <b>het</b>, pijlen{' '}
            <kbd className="rounded border px-1">←</kbd>/
            <kbd className="rounded border px-1">→</kbd>, of{' '}
            <kbd className="rounded border px-1">D</kbd>/
            <kbd className="rounded border px-1">H</kbd>.
          </p>
          <div className="mt-3 lg:mt-4 h-2 scale-progress-mini w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-2 scale-progress-mini rounded-full bg-black transition-all dark:bg-white"
              style={{ width: `${Math.max(1, Math.floor(progress * 100))}%` }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-xs lg:text-sm scale-on-tiny text-neutral-600 dark:text-neutral-400 hide-on-short">
            Vraag <strong>{state.answers.length + 1}</strong> van{' '}
            <strong>{total}</strong>
          </p>
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="mb-4 lg:mb-6 scale-margin-medium scale-margin-small scale-margin-tiny scale-margin-mini flex-shrink-0">
            <div
              className="mb-4 lg:mb-6 scale-margin-medium scale-margin-small scale-margin-tiny scale-margin-mini rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 lg:py-8 scale-word-large scale-word-medium scale-word-small scale-word-tiny scale-word-mini text-center text-2xl lg:text-4xl font-semibold tracking-wide dark:border-neutral-800 dark:bg-neutral-800"
              aria-live="polite"
            >
              {current.word}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                ref={btnDeRef}
                onClick={() => answer('de')}
                aria-keyshortcuts="1 D ArrowLeft"
                className={`inline-flex items-center justify-center rounded-lg border border-neutral-200 px-3 lg:px-5 py-3 lg:py-4 scale-buttons-medium scale-buttons-small scale-buttons-tiny scale-buttons-mini text-base lg:text-lg font-medium text-current hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-neutral-700 dark:hover:bg-neutral-800 ${
                  flash &&
                  state.answers.length > 0 &&
                  state.answers[state.answers.length - 1]?.chosen === 'de'
                    ? flash === 'correct'
                      ? 'ring-2 ring-green-600'
                      : 'ring-2 ring-red-600'
                    : ''
                }`}
              >
                1. de
              </button>
              <button
                ref={btnHetRef}
                onClick={() => answer('het')}
                aria-keyshortcuts="2 H ArrowRight"
                className={`inline-flex items-center justify-center rounded-lg border border-neutral-200 px-3 lg:px-5 py-3 lg:py-4 scale-buttons-medium scale-buttons-small scale-buttons-tiny scale-buttons-mini text-base lg:text-lg font-medium text-current hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-neutral-700 dark:hover:bg-neutral-800 ${
                  flash &&
                  state.answers.length > 0 &&
                  state.answers[state.answers.length - 1]?.chosen === 'het'
                    ? flash === 'correct'
                      ? 'ring-2 ring-green-600'
                      : 'ring-2 ring-red-600'
                    : ''
                }`}
              >
                2. het
              </button>
            </div>
          </div>

          {/* Recent answers ticker - always shown to prevent height changes */}
          <div className="mb-4 scale-margin-medium scale-margin-small scale-margin-tiny scale-margin-mini overflow-hidden rounded-lg border border-neutral-200 bg-gradient-to-r from-neutral-50 to-neutral-100 p-3 scale-padding-medium scale-padding-small scale-padding-tiny scale-padding-mini dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-700 flex-shrink-0">
            <div className="mb-2 text-xs scale-on-tiny font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Recente antwoorden
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 min-h-[2.5rem]">
              {state.answers.length > 0 ? (
                state.answers
                  .slice(-3)
                  .reverse()
                  .map((recentAnswer) => {
                    const word = dataset[recentAnswer.index]!;
                    const isCorrect = recentAnswer.correct;
                    return (
                      <div
                        key={`recent-${recentAnswer.index}-${state.answers.length}`}
                        className={`flex min-w-0 flex-shrink-0 items-center gap-2 rounded-md px-3 py-2 scale-padding-small scale-padding-tiny scale-padding-mini text-xs scale-on-tiny transition-all ${
                          isCorrect
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        <span className="text-xs scale-on-tiny">
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <span className="text-xs scale-on-tiny opacity-75">
                          {isCorrect ? (
                            <>
                              {recentAnswer.chosen} {word.word}
                            </>
                          ) : (
                            <>
                              <span className="line-through">
                                {recentAnswer.chosen} {word.word}
                              </span>{' '}
                              {recentAnswer.expected} {word.word}
                            </>
                          )}
                        </span>
                      </div>
                    );
                  })
              ) : (
                <div className="text-xs scale-on-tiny text-neutral-400 dark:text-neutral-500">
                  Antwoorden verschijnen hier...
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 flex-shrink-0 footer-text">
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
