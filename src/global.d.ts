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



 interface Config {
   kind: string;
   apiVersion: string;
   preferences: Preferences;
   clusters: Cluster[];
   users: User[];
   contexts: Context[];
   "current-context": string;
 }

 interface Preferences {}

 interface Cluster {
   name: string;
   cluster: Cluster2;
 }

 interface Cluster2 {
   server: string;
 }

 interface User {
   name: string;
   user: User2;
 }

 interface User2 {
   token?: string;
 }

 interface Context {
   name: string;
   context: Context2;
 }

 interface Context2 {
   cluster: string;
   user: string;
   namespace: string;
 }
