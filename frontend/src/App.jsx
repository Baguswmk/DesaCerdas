import IndexRoute from "./routes/Index";
import { fetchCsrfToken } from '@/services/csrf';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetchCsrfToken();
  }, []);
  return (
    <IndexRoute />
  );
}

export default App;