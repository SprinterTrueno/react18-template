import { createBrowserRouter } from "react-router-dom";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>React App</div>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
