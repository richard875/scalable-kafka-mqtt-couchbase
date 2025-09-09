import Header from "@/components/header/Header";
import SideBar from "./components/sidebar/SideBar";
import MainContent from "./components/mainContent/MainContent";

const App = () => {
  return (
    <>
      <Header />
      <div className="relative">
        <div className="max-w-[1632px] m-auto my-4 flex gap-4">
          <div className="w-55">
            <SideBar />
          </div>
          <div className="flex-1">
            <MainContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
