import Game from './Game';
import RulesSection from './RulesSection';

export default function Page() {
  return (
    <div className="h-full flex flex-col lg:flex-row lg:gap-6 lg:p-6 overflow-hidden">
      {/* Game Section */}
      <div className="flex-1 lg:min-w-0 min-h-0 flex flex-col overflow-hidden">
        <Game />
      </div>

      {/* Rules Section */}
      <RulesSection />
    </div>
  );
}
