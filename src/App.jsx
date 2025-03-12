import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryDevtools } from "react-query/devtools";
import FormManager from "./components/Form";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Rasool's Smart Insurance Portal
      </h1>
      <FormManager />
    </div>{" "}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
