import React from "react";
import styles from "./CardStat.module.css";

export interface InfoCardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export default function InfoCard(props: InfoCardProps) {
  return (
    <div
      className={`card h-100 ${props.className ?? ""} ${styles["card-shadow"]}`}
    >
      <div className="card-body">
        <h4 className="card-title text-dark">{props.title}</h4>
        <div className="mt-2">{props.children}</div>
      </div>
    </div>
  );
}
