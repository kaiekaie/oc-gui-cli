interface OcItems {
  apiVersion: string;
  items: Item[];
  kind: string;
  metadata: Metadata2;
}

interface Item {
  apiVersion: string;
  kind: string;
  metadata: Metadata;
  spec: Spec;
  status: Status;
}

interface Metadata {
  annotations: Annotations;
  namespace: string;
  creationTimestamp: string;
  labels: Labels;
  name: string;
  resourceVersion: string;
  uid: string;
}

interface Annotations {
  "openshift.io/description": string;
  "openshift.io/display-name": string;
  "openshift.io/requester": string;
  "openshift.io/sa.scc.mcs": string;
  "openshift.io/sa.scc.supplemental-groups": string;
  "openshift.io/sa.scc.uid-range": string;
}

interface Labels {
  "kubernetes.io/metadata.name": string;
  "pod-security.kubernetes.io/audit": string;
  "pod-security.kubernetes.io/audit-version": string;
  "pod-security.kubernetes.io/warn": string;
  "pod-security.kubernetes.io/warn-version": string;
  "statnett.no/project-name": string;
  "trust.statnett.no/inject-statnett-bundle"?: string;
}

interface Spec {
  finalizers: string[];
  replicas: number;
}

interface Status {
  phase: string;
}

interface Metadata2 {
  resourceVersion: string;
}
