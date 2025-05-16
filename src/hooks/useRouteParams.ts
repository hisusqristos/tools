import { useContext, createContext } from "react";

type RouteParams = {
  tool?: string;
  size?: string;
  color?: string;
};

const ParamsContext = createContext<RouteParams>({});
const useRouteParams = () => useContext(ParamsContext);

export { ParamsContext, useRouteParams }