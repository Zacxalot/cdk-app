import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";

import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.deploymentBucket();

    // Cognito User Pool
  }

  deploymentBucket() {
    // S3 bucket
    const bucket = new s3.Bucket(this, "DeploymentBucket", {
      websiteIndexDocument: "index.html",
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    // Allow public access
    const bucketPolicy = new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      resources: [bucket.bucketArn + "/*"],
      principals: [new iam.AnyPrincipal()],
    });
    bucket.addToResourcePolicy(bucketPolicy);

    // Deploy website to S3 bucket
    new s3Deployment.BucketDeployment(this, "DeployWebsite", {
      destinationBucket: bucket,
      sources: [],
    });

    // Cloudfront distribution
    new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
    });

    // Output the bucket name
    new cdk.CfnOutput(this, "Bucket", {
      value: bucket.bucketName,
    });
  }
}
