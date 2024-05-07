const AuthCard = ({ logo, children }) => (
  <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
    <div className="w-full sm:max-w-md mt-4 px-6 py-10 bg-white shadow-md overflow-hidden sm:rounded-lg">
      <img
        src="/logo.png"
        alt="TV Indoor"
        className=" h-20 fill-current text-gray-500 mx-auto"
      />
      <h1 className="text-gray-700 font-semibold text-2xl text-center mb-8 mt-4">
        Bem vindo ao TV Indoor
      </h1>

      {children}
    </div>
  </div>
);

export default AuthCard;
