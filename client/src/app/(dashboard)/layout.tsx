import Header from "@/components/header.component";
import Footer from "@/components/footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>
          <Header/>
          {children}
          <Footer/>
      </div>
    </div>
  );
}


