import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";
import Index from "./pages";

// Create a client
const queryClient = new QueryClient();

// Mock API endpoint for development
if (import.meta.env.DEV) {
  const mockApiHandler = async (req: Request) => {
    if (req.url.includes('/api/send-report')) {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Report sent successfully" 
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(null, { status: 404 });
  };
  
  // Register the mock handler
  window.addEventListener('fetch', (event: any) => {
    if (event.request.url.includes('/api/')) {
      event.respondWith(mockApiHandler(event.request));
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);