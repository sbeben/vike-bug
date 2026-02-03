import { useGate, useUnit } from "effector-react";
import { $store } from "./model";
import { useEffect } from "react";

export default function PageHome() {
  const { store } = useUnit({
    store: $store
  });

  useEffect(() => {
    // console.log({ env: import.meta.env })
    console.log({ env: import.meta.env.PUBLIC_ENV__HOST })
    // const env = import.meta.env
    // console.log({ value: env.PUBLIC_ENV__HOST })
  })

  return (
    <div className="flex h-full bg-white text-black">
      hello {store}
    </div>
  );
}
