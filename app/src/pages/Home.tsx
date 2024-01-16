import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Button>
        <Link to='/login'>Login</Link>
      </Button>
    </>
  );
}

export default Home;
