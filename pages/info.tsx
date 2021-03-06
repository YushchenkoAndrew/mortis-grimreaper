import React, { useEffect, useState } from "react";
import InfoCard from "../components/Cards/InfoCard";
import InfoCardStat from "../components/info/InfoCardStat";
import Calendar from "react-calendar";
import DefaultNav from "../components/default/DefaultNav";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import { WorldMap } from "../components/WorldMap/WorldMap";
import { useSpring } from "react-spring";
import { Doughnut, Line } from "react-chartjs-2";
import { faEye, faGlobe, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Country, StatInfo } from "../types/info";
import { AnalyticsData, StatisticData } from "../types/request";
import { basePath } from "../config";

export function formatDate(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function Info() {
  const [date, onDateChange] = useState(new Date());
  const [duration, onLoadPage] = useState(1000);
  const [mapData, onMapLoad] = useState([] as Country[]);
  const [lineData, onLineLoad] = useState([] as Number[]);
  const [labels, onLabelsLoad] = useState([] as string[]);
  const [doughnutData, onDoughnutLoad] = useState([] as Number[]);
  const [infoData, onInfoLoad] = useState({
    users: { value: 0, gain: 0 },
    views: { value: 0, gain: 0 },
    countries: 0,
  } as StatInfo);
  const [chartSize, setChartSize] = useState({
    height: 310,
    width: 800,
    size: "xl",
  });

  useEffect(() => {
    function handleChartResize() {
      if (window.innerWidth <= 1200 && window.innerWidth > 992)
        return setChartSize({ height: 300, width: 800, size: "lg" });

      if (window.innerWidth <= 992 && window.innerWidth > 767)
        return setChartSize({ height: 400, width: 400, size: "xl" });

      if (window.innerWidth <= 767 && window.innerWidth > 576)
        return setChartSize({ height: 400, width: 400, size: "lg" });

      if (window.innerWidth <= 576)
        return setChartSize({ height: 400, width: 400, size: "responsive" });

      return setChartSize({ height: 310, width: 800, size: "xl" });
    }

    window.addEventListener("resize", handleChartResize);
    handleChartResize();

    return () => window.removeEventListener("resize", handleChartResize);
  }, []);

  // TODO: Maybe to run thous request in <head> ???
  useEffect(() => {
    loadStaticData(date);
    loadAnalyticsData(date);
    setTimeout(() => onLoadPage(0), 3000);
  }, [date]);

  const infoUsers = useSpring({
    reset: false,
    from: {
      value: 0,
      gain: 0,
    },
    to: infoData.users,
    delay: 200,
  });

  const infoViews = useSpring({
    reset: false,
    from: {
      value: 0,
      gain: 0,
    },
    to: infoData.views,
    delay: 200,
  });

  const infoCountries = useSpring({
    reset: false,
    from: {
      value: 0,
    },
    to: { value: infoData.countries },
    delay: 200,
  });

  function loadStaticData(date: Date) {
    fetch(
      `${basePath}/api/info/statistic?date=${formatDate(
        date
      )}&id=${localStorage.getItem("id")}`,
      // { cache: "default" }
      { cache: "no-cache" }
    )
      .then((res) => res.json())
      .then((data: StatisticData) => {
        if (data.status !== "OK") return;
        onMapLoad(data.map);
        onInfoLoad(data.info);
      })
      .catch((err) => console.log(err));
  }

  function loadAnalyticsData(date: Date) {
    fetch(
      `${basePath}/api/info/analytics?date=${formatDate(
        date
      )}&id=${localStorage.getItem("id")}`,
      // { cache: "default" }
      { cache: "no-cache" }
    )
      .then((res) => res.json())
      .then((data: AnalyticsData) => {
        if (data.status !== "OK") return;
        onLineLoad(data.line);
        onLabelsLoad(
          data.days.map((item) =>
            new Date(item).toDateString().split(" ").slice(1).join(" ")
          )
        );

        // TODO: Maybe sort value for showing specific colors more
        onDoughnutLoad([
          data.doughnut.ctr,
          data.doughnut.cr_media,
          data.doughnut.cr_projects,
        ]);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <DefaultHead>
        <title>Mortis Info</title>
      </DefaultHead>

      <DefaultHeader info />

      <div className="container">
        <div className="card-group mt-2 mb-4">
          <InfoCardStat
            title="New users"
            value={infoUsers.value}
            gain={infoUsers.gain}
            goal={infoData.users.gain}
            icon={faUserPlus}
          />
          <InfoCardStat
            title="Views"
            value={infoViews.value}
            gain={infoViews.gain}
            goal={infoData.views.gain}
            icon={faEye}
          />
          <InfoCardStat
            title="Countries"
            value={infoCountries.value}
            icon={faGlobe}
            goal={0}
          />
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-12 mb-4">
            <InfoCard title="Calendar">
              <Calendar
                onChange={(date: Date) => {
                  loadStaticData(date);
                  loadAnalyticsData(date);
                  onDateChange(date);
                }}
                value={date}
              />
            </InfoCard>
          </div>
          <div className="col col-lg-8 col-md-12 mb-4">
            <InfoCard title="Visited Country">
              <div className="d-flex justify-content-center">
                <WorldMap
                  color="#007bff"
                  size={chartSize.size}
                  data={[
                    // NOTE:  Need such hack for WorldMap Component to work properly
                    // with one country only
                    { country: "ua", value: 0 },
                    ...mapData,
                  ]}
                />
              </div>
            </InfoCard>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 col-md-12 mb-4">
            <InfoCard title="Weekdays Statistics">
              <Line
                height={chartSize.height}
                width={chartSize.width}
                options={{
                  maintainAspectRatio: false,
                  animation: {
                    duration,
                  },
                }}
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Visitors",
                      data: lineData,
                      backgroundColor: "rgba(255, 99, 132, 0.2)",
                      borderColor: "rgba(255, 99, 132, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </InfoCard>
          </div>
          <div className="col-lg-4 col-md-12 mb-4">
            <InfoCard title="Analytics">
              <Doughnut
                height={100}
                width={100}
                options={{
                  animation: {
                    duration,
                  },
                }}
                data={{
                  labels: ["CTR", "CR(media)", "CR(projects)"],
                  datasets: [
                    {
                      data: doughnutData,
                      backgroundColor: ["#ff6384", "#007bff", "#ffce56"],
                      hoverBackgroundColor: ["#ff2e5b", "#0063cc", "#febb20"],
                    },
                  ],
                }}
              />
            </InfoCard>
          </div>
        </div>
      </div>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}
