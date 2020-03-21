import { Construct } from "constructs";
import { Chart } from "cdk8s";

import { Deployment, Service, IntOrString } from "../imports/k8s";

export default class HelloKubernetesChart extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const label = { app: "hello-k8s" };

    new Service(this, "service", {
      spec: {
        type: "LoadBalancer",
        ports: [{ port: 80, targetPort: IntOrString.fromNumber(8080) }],
        selector: label
      }
    });

    new Deployment(this, "deployment", {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label, namespace: "fargate" },
          spec: {
            containers: [
              {
                name: "hello-kubernetes",
                image: "paulbouwer/hello-kubernetes:1.7",
                ports: [{ containerPort: 8080 }]
              }
            ]
          }
        }
      }
    });
  }
}
