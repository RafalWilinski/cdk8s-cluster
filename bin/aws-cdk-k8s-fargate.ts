#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkK8SFargateStack } from '../lib/aws-cdk-k8s-fargate-stack';

const app = new cdk.App();
new AwsCdkK8SFargateStack(app, 'AwsCdkK8SFargateStack');
