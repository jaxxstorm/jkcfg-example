import * as api from '@jkcfg/kubernetes/api';
import { Labels } from './labels';

function Deployment(service) {
  return new api.apps.v1.Deployment(service.name, {
    metadata: {
      namespace: service.namespace,
      labels: Labels(service),
      annotations: service.deployment.annotations,
    },
    spec: {
      selector: {
        matchLabels: Labels(service),
      },
      replicas: service.replicas,
      template: {
        metadata: {
          labels: Labels(service),
          annotations: service.deployment.annotations,
        },
        spec: {
          containers: [{
            name: service.name,
            image: `${service.deployment.image}:${service.version}`,
            imagePullPolicy: 'IfNotPresent',
            readinessProbe: {
              httpGet: {
                  path: '/healthcheck',
                  port: service.ports.health,
              },
              initialDelaySeconds: 10,
              timeoutSeconds: 10,
            },
            envFrom: [{
              configMapRef: {
                name: service.name,
              },
            }],
            ports: [{
              containerPort: service.ports.web,
            }, {
              containerPort: service.ports.health,
            }],
            resources: service.resources,
          }],
        },
      },
      securityContext: {
        runAsNonRoot: true,
        runAsUser: 65534,
      },
    },
  });
}

function Service(service) {
  return new api.core.v1.Service(service.name, {
    metadata: {
      namespace: service.namespace,
      labels: Labels(service),
    },
    spec: {
      selector: Labels(service),
      ports: [{
        name: 'web',
        port: service.ports.web,
        protocol: 'TCP',
        targetPort: service.ports.web,
      }, {
        name: 'health',
        port: service.ports.health,
        protocol: 'TCP',
        targetPort: service.ports.health,
      }],
    },
  });
}

function Ingress(service) {
  return new api.extensions.v1beta1.Ingress(service.name, {
    metadata: {
      namespace: service.namespace,
      labels: Labels(service),
      annotations: {
        'ingress.kubernetes.io/ssl-redirect': 'true',
        'kubernetes.io/ingress.class': service.ingress.class,
      },
    },
    spec: {
      rules: [{
            host: service.ingress.host,
            http: {
                paths: [{
                        path: '/',
                        backend: {
                            serviceName: service.name,
                            servicePort: service.ports.web,
                        },
                    },
                    {
                        path: '/health',
                        backend: {
                            serviceName: service.name,
                            servicePort: service.ports.health,
                        },
                }],
            },
      }],
    },
  });
}


export {
  Deployment,
  Ingress,
  Service,
};
