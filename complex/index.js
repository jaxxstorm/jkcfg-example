import { Labels } from './labels';
import * as k from './kube';

export function KubeService(service) {
  return [
    k.Deployment(service),
    k.Service(service),
    k.Ingress(service),
  ];
}

export { Labels };
