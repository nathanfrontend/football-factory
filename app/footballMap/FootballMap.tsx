"use client";
import React, { useState, useRef, useEffect, useMemo, Suspense } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
  LayerProps,
} from "react-map-gl";
import "./styles.css";
import SideBar from "../SideBar/SideBar";
import mapboxgl from "mapbox-gl";
import { IoMdClose } from "react-icons/io";
import { AiOutlineExpand } from "react-icons/ai";
import { MapLayerMouseEvent } from "react-map-gl/dist/esm/types";
import footballAreas from "../footballMap/FootballServerAction";

type teamState = {
  type: string;
  features: Geometry[];
};
type Geometry = {
  // Define the properties of the geometry
  coordinates: Coordinates[];
};
type Coordinates = {
  coordinates: [];
};

type popUpState = {
  map(arg0: (i: any) => React.JSX.Element): React.ReactNode;
  // geometry: { coordinates: [] };
  geometry: Geometry;
  data: string[];
};
type Props = {
  footballAreas: any;
  crimeByLocation: any;
};

const FootballMap: React.FC<Props> = ({ footballAreas, crimeByLocation }) => {
  const TOKEN =
    "pk.eyJ1IjoibmF0aGFuYWRvbHBodXNzaGF3IiwiYSI6ImNsa2F5N2xsajA5b2YzbG80NWdiM2hyNm4ifQ.MUnqdsFFOEQ_Vn7ejbN6VQ";

  const map = useRef<HTMLDivElement | null>(null);

  const [footballTeamData, setFootballTeamData] = useState<teamState | []>();
  const [sideBarData, setSideBarData] = useState();
  const [dateValue, setDateValue] = useState("2023-07");
  const [popupInfo, setPopupInfo] = useState<Array<{
    [key: string]: any;
  }> | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Coordinates[]>([]);

  useEffect(() => {
    footballAreas()
      .then((response: string[]) => geoJsonmap(response))
      .then((data: []) =>
        setFootballTeamData({
          type: "FeatureCollection",
          features: data.slice(0, 13),
        })
      );
  }, []);

  const geoJsonmap = (map: any) => {
    setSideBarData(map.sideBar);
    return map.geoJSON.map((res: any) => ({
      type: "Feature",
      geometry: res.geometry,
    }));
  };

  const layerStyle: LayerProps = {
    id: "point",
    type: "circle",

    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };
  function flyToStore(data: any) {
    const currentFeatures =
      data.geometry !== undefined
        ? data.geometry.coordinates
        : footballTeamData?.features[data].geometry.coordinates;

    map.current.flyTo({
      center: currentFeatures,
      zoom: 10,
    });
  }
  function zoomOut() {
    map.current.flyTo({
      zoom: 6,
    });
  }

  function mapClick(event: MapLayerMouseEvent<mapboxgl.Map>) {
    const features = map.current.queryRenderedFeatures(event.point, {
      layers: ["point"],
    });

    if (!features.length) {
      setPopupInfo(null);
      return;
    }

    const clickedPoint = features[0];
    flyToStore(clickedPoint);
    popUpDetails(clickedPoint);
  }
  async function popUpDetails(clickedPoint: popUpState) {
    const data = await crimeByLocation(clickedPoint.geometry.coordinates);
    setCurrentPoint(clickedPoint.geometry.coordinates);
    const filteredData = data.filter((res: any) =>
      res.month.includes(dateValue)
    );

    setPopupInfo(data.slice(0, 10));
  }

  function formatDateToYearMonth(sDate: Date) {
    const date = new Date(sDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 and pad with '0' if needed
    setDateValue(`${year}-${month}`);
  }
  return (
    <>
      <div>
        <SideBar
          data={sideBarData}
          fly={flyToStore}
          formatDateToYearMonth={formatDateToYearMonth}
          dateValue={dateValue}
        />

        <div className="p-4 sm:ml-64">
          <div className="relative p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className=" flex justify-end">
              <button onClick={() => zoomOut()}>
                <AiOutlineExpand size={25} />
              </button>
            </div>
            {footballTeamData ? (
              <Map
                onClick={(e) => mapClick(e)}
                ref={map}
                mapLib={import("mapbox-gl")}
                initialViewState={{
                  latitude: 52.3555177,
                  longitude: -1.1743197000000691,
                  zoom: 6,
                  bearing: 0,
                  pitch: 0,
                }}
                style={{ width: 1000, height: 800 }}
                mapStyle="mapbox://styles/nathanadolphusshaw/clkb7n4fp00sd01qrh3878o2r"
                mapboxAccessToken={TOKEN}
              >
                <Source
                  id="yourSourceId"
                  type="geojson"
                  data={footballTeamData}
                  cluster={true}
                >
                  <Layer {...layerStyle} />
                </Source>

                <GeolocateControl position="top-left" />
                <FullscreenControl position="top-left" />
                <NavigationControl position="top-left" />
                <ScaleControl />
                <Suspense fallback={<div>"....Loadin"</div>}>
                  {popupInfo && (
                    <div className="absolute top-0  overflow-x-auto shadow-md sm:rounded-lg">
                      <table className=" text-sm text-left text-gray-500 dark:text-gray-400 w-full">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Crime
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Address
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                              <button
                                className="p-4 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                                onClick={() => setPopupInfo(null)}
                              >
                                <IoMdClose size={30} />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {popupInfo.map((i) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-6 py-4">{i.category}</td>
                              <td className="px-6 py-4">
                                {i.location.street.name}
                              </td>
                              <td className="px-6 py-4">{i.month}</td>
                              <td className="px-6 py-4 text-right">
                                <a
                                  href="#"
                                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                  Details
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Suspense>
              </Map>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default FootballMap;
// nathanadolphusshaw.clkay9teq0cjq2ipg4suq8rkg-7im10
