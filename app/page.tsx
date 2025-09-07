import Game from './Game';
import Collapsible from './RulesSection';

export default function Page() {
  return (
    <div className="h-full flex flex-col lg:flex-row lg:gap-6 lg:p-6 overflow-hidden">
      <div className="flex-1 lg:min-w-0 min-h-0 flex flex-col overflow-hidden">
        <Game />
      </div>

      <div className="flex-shrink-0 lg:w-96 xl:w-[28rem] min-h-0 max-h-[40vh] sm:max-h-[50vh] flex justify-center lg:max-h-full">
        <div className="w-full max-w-2xl lg:max-w-none h-full p-3 lg:p-6 flex flex-col">
          <div className="flex-1 rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 flex flex-col min-h-0">
            <Collapsible
              trigger={
                <button className="cursor-pointer flex items-center justify-between w-full text-base lg:text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-black transition-colors flex-shrink-0 p-4 lg:p-6">
                  <span>
                    Toon regels{' '}
                    <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                      (let op, deze gelden niet altijd!)
                    </span>
                  </span>
                  <svg
                    className="w-5 h-5 transition-transform duration-200 rotate-180"
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
                </button>
              }
            >
              <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-4 lg:pb-6 min-h-0">
                <div className="grid grid-cols-1 gap-4 lg:gap-6 min-[480px]:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-base lg:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      DE-woorden
                    </h3>
                    <ul className="space-y-2 text-xs lg:text-sm">
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Woorden in het meervoud</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Beroepen</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Personen</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Bergen en rivieren</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Groenten, fruit, bomen en planten</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Letters en cijfers</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>
                          Vrouwelijke woorden die eindigen op -ing, -ie, -ij,
                          -heid, -teit, -a, -nis, -st, -schap, -de
                        </strong>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-base lg:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      HET-woorden
                    </h3>
                    <ul className="space-y-2 text-xs lg:text-sm">
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Verkleinwoorden</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>
                          Woorden van twee of meer lettergrepen die beginnen met
                          be-, ge-, ver-, ont-
                        </strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Namen van talen</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Namen van metalen</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>Windrichtingen</strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>
                          Woorden die eindigen op -isme, -ment, -sel, -um
                        </strong>
                      </li>
                      <li className="rounded-lg border border-neutral-100 p-2 lg:p-3 dark:border-neutral-800">
                        <strong>
                          Zelfstandige naamwoorden afgeleid van werkwoorden
                        </strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
