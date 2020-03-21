import * as cdk from "@aws-cdk/core";
import * as eks from "@aws-cdk/aws-eks";
import * as iam from "@aws-cdk/aws-iam";

import HelloKubernetesChart from "../main";

export class AwsCdkK8SFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const namespaceSelector = { namespace: "fargate" };

    const clusterAdmin = new iam.Role(this, "AdminRole", {
      assumedBy: new iam.AccountRootPrincipal(),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSServicePolicy"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSClusterPolicy")
      ]
    });

    const policyStatement = new iam.PolicyStatement();
    policyStatement.addAllResources();
    policyStatement.addActions(
      "elasticloadbalancing:*",
      "ec2:CreateSecurityGroup",
      "ec2:Describe*"
    );

    clusterAdmin.addToPolicy(policyStatement);

    const cluster = new eks.Cluster(this, "k8s-eks-fargate-cluster", {
      clusterName: "k8s-eks-cluster",
      outputConfigCommand: true,
      mastersRole: clusterAdmin,
      version: "1.15",
      defaultCapacity: 0
    });

    cluster.addFargateProfile("k8s-eks-cluster-fargate-profile", {
      selectors: [namespaceSelector]
    });

    const chart = new HelloKubernetesChart(this, "HelloChart");
    cluster.addResource("hello-chart", ...chart.toJson());
  }
}
