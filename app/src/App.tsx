import { useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        I have been clicked {count} times
      </Button>
    </>
  );
}

export default App;
