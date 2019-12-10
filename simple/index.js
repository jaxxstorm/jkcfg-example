import * as k8s from '@jkcfg/kubernetes/api';
import * as std from '@jkcfg/std';
import * as param from '@jkcfg/std/param';

const replicas = param.Number('replicas', 1)

const deployment = new k8s.apps.v1.Deployment(`myapp`, { 
    metadata: {
      namespace: 'myapp',
    },
    spec: {
      replicas: replicas,
      template: {
        spec: {
          containers: [{
            image: 'jaxxstorm/myapp',
            imagePullPolicy: 'IfNotPresent',
            name: 'myapp',
            resources: {
              requests: {
                cpu: "500m",
                memory: "500Mi"
              },
              limits: {
                cpu: "2000m",
                memory: "2000Mi"
              }
            },
            ports: [{
              containerPort: 8080,
              protocol: 'TCP',
            }],
          }],
        },
      },
    }
  });


  const myapp = [
    deployment,
]

std.write(myapp, `manifests/myapp.yaml`, { format: std.Format.YAMLStream });
