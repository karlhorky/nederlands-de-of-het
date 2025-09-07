import Game from './Game';

export default function Page() {
  return (
    <>
      <Game />
      <div className="mx-auto max-w-2xl p-6 pt-0">
        <details className="rounded-xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
          <summary className="cursor-pointer list-none flex items-center justify-between w-full px-4 py-3 text-lg font-medium bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-black transition-colors [&::-webkit-details-marker]:hidden">
            <span>
              Toon regels{' '}
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                (let op, deze gelden niet altijd!)
              </span>
            </span>
            <svg
              className="w-5 h-5 transition-transform duration-200 [details[open]_&]:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div className="mt-4 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                DE-woorden
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Woorden in het meervoud</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Beroepen</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Personen</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Bergen en rivieren</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Groenten, fruit, bomen en planten</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Letters en cijfers</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>
                    Vrouwelijke woorden die eindigen op -ing, -ie, -ij, -heid,
                    -teit, -a, -nis, -st, -schap, -de
                  </strong>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                HET-woorden
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Verkleinwoorden</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>
                    Woorden van twee of meer lettergrepen die beginnen met be-,
                    ge-, ver-, ont-
                  </strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Namen van talen</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Namen van metalen</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>Windrichtingen</strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>
                    Woorden die eindigen op -isme, -ment, -sel, -um
                  </strong>
                </li>
                <li className="rounded-lg border border-neutral-100 p-3 dark:border-neutral-800">
                  <strong>
                    Zelfstandige naamwoorden afgeleid van werkwoorden
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </>
  );
}
