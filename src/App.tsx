import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { NavBar } from "./pages/shared/NavBar";
import { Footer } from "./pages/shared/Footer";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <Router>
      <AppProvider>
        <NavBar />
        <AppRoutes />
        <Footer />
      </AppProvider>
    </Router>
  );
}
export default App;
