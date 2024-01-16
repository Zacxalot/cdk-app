#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkStack as AppDeployment } from "../lib/cdk-stack";

const app = new cdk.App();
new AppDeployment(app, "ViteApp", {});
