import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HowToPlay from "./pages/HowToPlay";
import GameSetup from "./pages/GameSetup";
import GamePlay from "./pages/GamePlay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* O basename avisa ao React que o site começa a partir desta pasta */}
      <BrowserRouter basename="/projetos/jogo-mimica">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/setup" element={<GameSetup />} />
          <Route path="/play" element={<GamePlay />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;