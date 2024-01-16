#!/bin/bash

STACK_NAME="ViteApp"
export STACK_NAME

# Deploy CDK Stack
(
    cd cdk || exit
    cdk deploy
)

# Build App
(
    # Get required env vars
    OUTPUT_JSON=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs" --output json | jq -r 'map({(.OutputKey): .OutputValue}) | add')
    BUCKET_NAME=$(jq -r '.Bucket' <<< "$OUTPUT_JSON")
    USER_POOL_ID=$(jq -r '.UserPoolID' <<< "$OUTPUT_JSON")
    USER_POOL_CLIENT_ID=$(jq -r '.UserPoolClientID' <<< "$OUTPUT_JSON")
    
    # Must export these for amplify auth to work
    export USER_POOL_ID
    export USER_POOL_CLIENT_ID

    # Build App
    cd app || exit
    npm run build

    # Deploy App
    echo "Pushing to $BUCKET_NAME"
    aws s3 sync dist/ "s3://$BUCKET_NAME"

    # Set correct mime-type for .js files - cut the dist/ prefix
    for file in $(find ./dist -type f | grep '\.js$' | cut -c 8-); do
        aws s3 cp "./dist/$file" "s3://$BUCKET_NAME/$file" --content-type "application/javascript"
    done
)

# Deploy Serverless API