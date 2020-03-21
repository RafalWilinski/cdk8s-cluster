#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AwsCdkK8SFargateStack } from "../lib/aws-cdk-k8s-fargate-stack";

const env = {
  region: "us-east-1"
};
const app = new cdk.App();
new AwsCdkK8SFargateStack(app, "AwsCdkK8SFargateStack", { env });
