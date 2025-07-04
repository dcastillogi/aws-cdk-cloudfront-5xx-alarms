# AWS CDK CloudFront 5xx Error Monitoring

This AWS CDK application automatically discovers all CloudFront distributions in your account and creates CloudWatch alarms to monitor 5xx error rates. When error thresholds are exceeded, notifications are sent to your configured SNS topic.

## Features

-   **Automatic Discovery**: Scans your AWS account for all CloudFront distributions
-   **Individual Monitoring**: Creates dedicated CloudFormation stacks per distribution
-   **Smart Alerting**: Monitors 5xx error rates with configurable thresholds
-   **SNS Integration**: Sends notifications to your existing SNS topic
-   **Production Ready**: Includes proper error handling and logging

## Architecture

The application uses the AWS SDK to enumerate CloudFront distributions, then creates:

-   CloudWatch metrics for 5xx error rates per distribution
-   CloudWatch alarms with customizable thresholds
-   SNS actions for alert notifications
-   Separate CloudFormation stacks for easy management

## Prerequisites

-   **AWS CDK v2.200+** installed globally
-   **Node.js 18+** with npm
-   **AWS CLI** configured with valid credentials
-   **SNS Topic** created for receiving notifications
-   **IAM Permissions** for CloudFront, CloudWatch, and SNS

## Quick Start

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Configure notifications**:
   Edit `config/config.json` with your SNS topic ARN and alarm settings:

    ```json
    {
        "snsTopicArn": "arn:aws:sns:us-east-1:0123456789:MySNSTopic",
        "alarmSettings": {
            "threshold": 10,
            "periodMinutes": 1,
            "evaluationPeriods": 5,
            "datapointsToAlarm": 1
        }
    }
    ```

3. **Bootstrap CDK** (first time only):

    ```bash
    cdk bootstrap
    ```

4. **List Stacks (1 per distribution)**:

    ```bash
    cdk list
    ```

5. **Deploy monitoring**:

    ```bash
    cdk deploy --all
    ```

## Configuration

### Alarm Settings

The alarms monitor CloudFront 5xx error rates with configurable thresholds. Edit `config/config.json` to customize:

```json
{
    "snsTopicArn": "arn:aws:sns:us-east-1:0123456789:MySNSTopic",
    "alarmSettings": {
        "threshold": 10,
        "periodMinutes": 1,
        "evaluationPeriods": 5,
        "datapointsToAlarm": 1
    }
}
```

## Required IAM Permissions

Your AWS credentials need the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:ListDistributions",
                "cloudwatch:PutMetricAlarm",
                "cloudwatch:DeleteAlarms",
                "sns:GetTopicAttributes",
                "cloudformation:*",
                "iam:CreateRole",
                "iam:AttachRolePolicy",
                "iam:PassRole"
            ],
            "Resource": "*"
        }
    ]
}
```

## Cost Estimation

-   **CloudWatch Alarms**: $0.10 per alarm per month
-   **SNS Notifications**: $0.50 per million notifications
-   **CloudFront Metrics**: No additional cost (included with CloudFront)

Example: 10 distributions = $1.00/month for alarms + notification costs.
