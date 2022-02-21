import { Metadata } from "./Metadata";

export class Ingress {
  "apiVersion"?: string;
  "kind"?: string;
  "metadata"?: Metadata;
  "spec"?: Spec;
  "status"?: {
    loadBalancer: { ingress: { hostname?: string; ip?: string }[] };
  };
}

export class Spec {
  // 'defaultBackend'?: V1IngressBackend;
  "ingressClassName"?: string;
  "rules"?: Rule[];
  "tls"?: TLS[];
}

export class TLS {
  hosts?: string[];
  secretName?: string;
}
export class Rule {
  "host"?: string;
  "http"?: { paths: Path[] };
}

export class Path {
  "backend"?: {
    serviceName?: string;
    servicePort?: string | number;
  };
  "path"?: string;
}

export class Stat {}
