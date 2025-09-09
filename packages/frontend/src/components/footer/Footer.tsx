const Footer = () => {
  return (
    <div className="w-full bg-[#111111] py-8 px-4 text-white text-sm font-medium flex flex-col gap-3">
      <span className="text-center">
        Disclaimer: This website is a non-commercial coding exercise and is not the official Unibet
        website.
      </span>
      <span className="text-center">
        &copy; {new Date().getFullYear()} a Richard Everley's Production
      </span>
    </div>
  );
};

export default Footer;
