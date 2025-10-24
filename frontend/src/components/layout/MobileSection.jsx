const MobileSection = ({ children }) => {
  return (
    <div className="md:hidden bg-white border-t border-gray-100">
      <div className="container flex flex-col mx-auto space-y-2">
        {children}
      </div>
    </div>
  );
};

export default MobileSection;
