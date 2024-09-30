import { FC } from "react";
import { useRoutes } from "react-router-dom";
import NotFound from "@/pages/NotFound";

const Routes: FC = () => {
  return useRoutes([
    {
      path: "/",
      element: <div>React App</div>,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

export default Routes;
