import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <h1>{message}</h1>;
}

export default Home;
