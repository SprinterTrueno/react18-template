import { FC } from "react";
import { useRoutes } from "react-router-dom";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const Routes: FC = () => {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

export default Routes;
