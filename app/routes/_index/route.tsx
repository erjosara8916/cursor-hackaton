import type { Route } from "./+types/route";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: "Home | Cursor Hackathon",
    },
  ];
};

export default function IndexRoute() {
  return <h1>Hello World</h1>;
}
