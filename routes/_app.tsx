import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  // Diese Komponente wird für jede Seite aufgerufen, sie gehört zum Framework und muss nicht verändert werden.
  return (
    <>
      <Component />
    </>
  );
}
