import { Stat } from "./request";

export type ApiOk<T = null> = {
  status: "OK";
  message: string;
  result: T;
};

export type ApiError = {
  status: "ERR";
  result: string[];
  message: string;
};

export type ApiTokens = {
  status: "OK";
  access_token: string;
  refresh_token: string;
};

export type ApiResult = InfoSum | InfoData | WorldData | ProjectData | FileData;

export type ApiRes<Type> = {
  items: number;
  result: Type;
  status: "OK";
  totalItems: number;
};

export type InfoData = {
  id: number;
  created_at: string;
  countries: string;
  views: number;
  clicks: number;
  media: number;
  visitors: number;
};

export type InfoSum = {
  views: number;
  clicks: number;
  media: number;
  visitors: number;
};

export type WorldData = {
  id: number;
  updated_at: string;
  country: string;
  visitors: number;
};

export type FileData = {
  id?: number;
  updated_at?: string;
  name: string;
  path: string;
  type: string;
  role: string;
  project_id?: number;

  // file?: File;
  content?: string | null;
  url?: string;
};

export type LinkData = {
  id?: number;
  updated_at?: string;
  name: string;
  link: string;
  project_id?: number;
};

export type SubscriptionData = {
  id?: number;
  created_at?: string;
  name: string;
  cron_id: string;
  cron_time: string;
  method: string;
  path: string;
  token: string;
  project_id?: number;
};

export type ProjectData = {
  id?: number;
  created_at?: string;
  name: string;
  title: string;
  flag: string;
  desc: string;
  note: string;
  files: FileData[];
  links: LinkData[];
  subscription: SubscriptionData[];
};

export type GeoIpLocationData = {
  geoname_id: number;
  locale_code: string;
  continent_code: string;
  continent_name: string;
  country_iso_code: string;
  country_name: string;
  is_in_european_union: boolean;
};

export type MetricsData = {
  id: number;
  created_at: string;
  name: string;
  namespace: string;
  container_name: string;
  cpu: number;
  cpu_scale: number;
  memory: number;
  memory_scale: number;
  project_id: number;
};
