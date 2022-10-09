
import './App.scss';
import { SectionContent } from "./components/SectionContent";
import { Sections } from "./components/Sections";

function App() {
  return (
    <div className="sencha-app">
      <header className="sections">
        <Sections/>
      </header>

      <SectionContent />
    </div>
  );
}

export default App;
