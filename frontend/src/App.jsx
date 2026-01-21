import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/AppLayout";

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <>
      {!usuario ? (
        <LoginPage onLogin={(u) => setUsuario(u)} />
      ) : (
        <AppLayout usuario={usuario} />
      )}
    </>
  );
}

export default App;