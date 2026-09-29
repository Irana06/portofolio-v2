import { createBrowserRouter } from "react-router";
import App from "../App";
import CV from "../pages/CV";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", Component: App },
  { path: "/cv", Component: CV },
  { path: "*", Component: NotFound },
]);
