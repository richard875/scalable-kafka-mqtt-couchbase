import unibet from "@/assets/logo.svg";

const WEB_URL = "https://www.unibet.com.au";
const SPORTS_URL = "https://www.unibet.com.au/betting/sports/home";
const RACING_URL = "https://www.unibet.com.au/racing";
const PROMOTIONS_URL = "https://www.unibet.com.au/promotions";
const FEATURES_URL = "https://www.unibet.com.au/product-features";

const Bottom = () => {
  const goToLink = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="w-full h-16 bg-[#147B45] flex items-center">
      <div className="w-full max-w-[1600px] m-auto">
        <div className="flex pl-8">
          <a href={WEB_URL} target="_blank" rel="noreferrer">
            <img src={unibet} alt="unibet" className="w-25 mr-16" />
          </a>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span
              className="p-2 cursor-pointer hover:bg-white hover:text-[#111111] rounded-lg"
              onClick={() => goToLink(SPORTS_URL)}
            >
              Sports
            </span>
            <span
              className="p-2 cursor-pointer hover:bg-white hover:text-[#111111] rounded-lg"
              onClick={() => goToLink(RACING_URL)}
            >
              Racing
            </span>
            <span className="p-2 cursor-pointer" onClick={() => goToLink(PROMOTIONS_URL)}>
              Promotions
            </span>
            <span className="p-2 cursor-pointer" onClick={() => goToLink(FEATURES_URL)}>
              Features
            </span>
          </div>
        </div>
        <div className="pr-8"></div>
      </div>
    </div>
  );
};

export default Bottom;
