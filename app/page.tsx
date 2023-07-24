import Image from "next/image";
import FootballMap from "./footballMap/FootballMap";
import footballAreas, {
  crimeByLocation,
} from "./footballMap/FootballServerAction";
import SideBar from "./SideBar/SideBar";
export default function Home() {
  return (
    <>
      {" "}
      <div>
        <FootballMap
          footballAreas={footballAreas}
          crimeByLocation={crimeByLocation}
        />
      </div>
    </>
  );
}
