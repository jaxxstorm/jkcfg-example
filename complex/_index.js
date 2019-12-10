import * as param from '@jkcfg/std/param';
import * as api from '@jkcfg/kubernetes/api';
import * as std from '@jkcfg/std';
// Import the akp packages
import * as ks from '@jaxxstorm/jkcfg-example'; // This is my package name

// This reads the params file specified on the command line
const service = param.Object('service');
// Set the value of manifest (written to a file later) to the exported function
const manifest = ks.KubeServiceService(service);

// Read the params file for the config object
const config = param.Object('config');

// ConfigMaps are generally unique to each service
function ConfigMap(service) {
    return new api.core.v1.ConfigMap(service.name, {
        metadata: {
            namespace: service.namespace,
            labels: ks.Labels(service),
        },
        data: config
    })
}

// Add the ConfigMap function output to the manifest that is written
manifest.push(ConfigMap(service))

// Write the contents of manifest to a manifest file
std.write(manifest, `manifests/${service.name}.yaml`, { format: std.Format.YAMLStream });
