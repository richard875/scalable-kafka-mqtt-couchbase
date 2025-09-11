const HELP_URL =
  "https://www.unibet.com.au/contextualhelpgateway/redirectToHelpcenter/?brand=unibet&jurisdiction=NT&locale=en_AU&context_id=&url_path=/betting/sports/home&openOnExternalBrowser=true";
const ABOUT_URL = "https://www.unibet.com.au/general-info/info/about-us";
const RESPONSIBLE_GAMBLING_URL = "https://www.unibet.com.au/general-info/whentostop";
const APPS_URL = "https://www.unibet.com.au/apps";
const PHONE_BETTING_URL = "tel:+137868";

const TopBar = () => {
  const goToLink = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="w-full h-8 bg-[#00531D] flex">
      <div className="w-full max-w-[1600px] px-4 m-auto flex items-center justify-end text-xs font-medium">
        <span className="cursor-pointer" onClick={() => goToLink(HELP_URL)}>
          Help
        </span>
        <span className="h-3 w-[1px] mx-2 bg-white" />
        <span className="cursor-pointer" onClick={() => goToLink(ABOUT_URL)}>
          About Us
        </span>
        <span className="h-3 w-[1px] mx-2 bg-white" />
        <span className="cursor-pointer" onClick={() => goToLink(RESPONSIBLE_GAMBLING_URL)}>
          Responsible Gambling
        </span>
        <span className="h-3 w-[1px] mx-2 bg-white" />
        <span className="cursor-pointer" onClick={() => goToLink(APPS_URL)}>
          Apps
        </span>
        <span className="h-3 w-[1px] mx-2 bg-white" />
        <span className="cursor-pointer" onClick={() => goToLink(PHONE_BETTING_URL)}>
          Phone Betting 13 78 68 (13 PUNT)
        </span>
      </div>
    </div>
  );
};

export default TopBar;
