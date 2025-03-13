import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import FormManager from "./components/Form";
import Baner from "./layouts/Baner";
import Logo from "./layouts/Logo";
import DarkModeToggle from "./layouts/DarkModeToggle";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="flex flex-col justify-start items-center min-h-screen bg-white dark:bg-gray-950 p-0 m-0 d">
      <Baner />
      <div className="flex flex-row justify-between px-6 my-6 items-center h-10 w-full">
        <Logo />
        <DarkModeToggle />
      </div>
      <h1 className="text-3xl md:text-6xl font-bold text-center mb-8 text-gray-500 dark:text-gray-400 my-20 opacity-70">
        Smart Insurance Portal
      </h1>
      <FormManager />
    </div>{" "}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
