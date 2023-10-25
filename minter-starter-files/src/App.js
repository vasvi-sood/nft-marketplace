import "./App.css";
import Minter from "./Minter";
import ViewNFT from "./ViewNFT";
import ViewNFTCollection from "./viewNFTCollection";
function App() {
  return (
    <div className="App">
      <Minter></Minter>
      <ViewNFT></ViewNFT>
      <ViewNFTCollection></ViewNFTCollection>
    </div>
  );
}

export default App;
