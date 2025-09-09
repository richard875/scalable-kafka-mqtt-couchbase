import Header from "@/components/header/Header";
import Footer from "./components/footer/Footer";
import SideBar from "./components/sidebar/SideBar";
import MainContent from "./components/mainContent/MainContent";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="relative flex-auto main-wrapper">
        <div className="max-w-[1664px] m-auto my-4 px-4 flex gap-4">
          <div className="w-55">
            <SideBar />
          </div>
          <div className="flex-1">
            <MainContent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
