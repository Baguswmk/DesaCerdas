import IndexRoute from "./routes/Index";
import { fetchCsrfToken } from '@/services/csrf';
import { useEffect } from 'react';
import useAuthStore from '@/store/auth';

function App() {
  const { autoLogin } = useAuthStore();

  useEffect(() => {
    
    const initializeApp = async () => {
      try {
        
        await fetchCsrfToken();
        
        
        await autoLogin();
        
        console.log('✅ App initialized successfully');
      } catch (error) {
        console.error('❌ App initialization failed:', error);
      }
    };

    initializeApp();
  }, [autoLogin]);

  return <IndexRoute />;
}

export default App;