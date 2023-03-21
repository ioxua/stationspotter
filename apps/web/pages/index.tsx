import { Button, asd } from "ui";
import { data } from "@ioxua/dataset"

const useStationspotter = () => {
  
}

export default function Web() {
  return (
    <div>
      <h1>{JSON.stringify(data.example)}</h1>
      <Button />
    </div>
  );
}
