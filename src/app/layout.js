import "@/app/global.css";
import Sidebar from "@/components/Sidbar";

export const metadata = {
  title: "TV Indoor",
};
const RootLayout = ({ children }) => {
  return (
    <html
      lang="
         pt-BR
        "
    >
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
