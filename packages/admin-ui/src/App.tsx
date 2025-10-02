import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import TemplateEditor from './pages/TemplateEditor';
import Messages from './pages/Messages';
import MessageDetails from './pages/MessageDetails';
import { Toaster } from '@/components/ui/toaster';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/admin">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<Dashboard />} />
          <Route path="/templates/editor" element={<TemplateEditor />} />
          <Route path="/templates/editor/:templateKey" element={<TemplateEditor />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:messageId" element={<MessageDetails />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
