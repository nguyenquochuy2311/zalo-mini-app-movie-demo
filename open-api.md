# Zalo Mini App Open APIs Documentation

This is a detailed summary and compilation of the content from the Zalo Mini App Open APIs documentation, based on the provided link (adjusted to the functional domain mini.zalo.me for complete access). The content has been translated to English, structured in Markdown, and includes all available sections, headings, text, code snippets, tables, and links. Additional research revealed sub-sections and related pages, which are incorporated here for fullness.

## Table of Contents

- [Overview](#overview)
- [Getting API Key](#getting-api-key)
- [Error Codes](#error-codes)
- [Statistics](#statistics)
- [Sending Notifications to Users](#sending-notifications-to-users)
  - [Detailed Setup for Sending Messages](#detailed-setup-for-sending-messages)
- [Partner Introduction](#partner-introduction)
  - [Integration Process](#integration-process)
  - [Setup Client](#setup-client)
  - [Event Review Mini App](#event-review-mini-app)
- [App Management Introduction](#app-management-introduction)
- [App Management V2 Introduction](#app-management-v2-introduction)
- [User Revocation of Consent and Data Deletion Events](#user-revocation-of-consent-and-data-deletion-events)
  - [Open Endpoint Version](#open-endpoint-version)
  - [Webhook Version](#webhook-version)

## Overview

# Overview | Zalo Mini App

[Jump to main content](#__docusaurus_skipToContent_fallback)

# Overview

This document guides the integration and usage of Zalo Mini App Open APIs. The document targets two main audiences:

### 1. Individuals or Businesses Independently Developing Mini Apps: [https://mini.zalo.me/documents/open-apis/#1-cá-nhân-hoặc-doanh-nghiệp-tự-phát-triển-mini-app-độc-lập]

- Can self-register to create a Mini App and obtain an API Key directly, without going through a separate registration process.
- Mainly supports basic features: setting up webhooks (with some basic events) and viewing statistics (stats) about their Mini App.

### 2. Solution Partners Developing Mini Apps for Customers: [https://mini.zalo.me/documents/open-apis/#2-đối-tác-giải-pháp-phát-triển-mini-app-cho-khách-hàng]

- These are entities or businesses that have officially signed cooperation agreements with Zalo Mini App, granted extended access rights for large-scale management and automation.
- Fully supported with advanced features: creating and managing a large number of Mini Apps, automated deployment and approval, full API integration, receiving webhooks with all types of events as required.

### Getting Started: [https://mini.zalo.me/documents/open-apis/#bắt-đầu]

miniapp-logo

Explore
----------------------------------------------------------------------------------------------------

## Getting API Key

# Guide to Get API Key | Zalo Mini App

[Jump to content](#__docusaurus_skipToContent_fallback)

# Guide to Get API Key

To interact and use the Open APIs, you need to set up an API Key for your Zalo App. Please follow the instructions below to get an API Key:

my-zalo-apps

* Then select Open APIs.

my-apps

* In the API Management section, set up the following information:

  * IP Access: you must declare the IP Server or Gateway of yours to access these APIs.
  * Webhook URL: to receive notifications when there are changes related to the Mini App.
  * Scopes: The scope you want the API to interact with:

  * apps.send.notification: allows sending notifications to users via the common OA of Zalo Mini App.
  * apps.get.stats: Allows retrieving statistics of the Mini App.

* Then select Update, the system will create an API Key corresponding to the information you have set up.

manage-apis
----------------------------------------------------------------------------------------------------

## Error Codes

# Error Codes | Zalo Mini App

[Chuyển tới nội dung chính](#__docusaurus_skipToContent_fallback)

# Error Codes

Table describing error codes when integrating APIs

| Value | Description                          |
|-------|--------------------------------------|
| -100  | Required parameters wasn't present   |
| -101  | Invalid parameters                   |
| -102  | Invalid Api Key                      |
| -103  | Too many requests                    |
| -104  | Authentication is required           |
| -107  | Failed                               |
| -108  | App ID is invalid                    |
| -109  | Out of Quota                         |
| -110  | Invalid User Id                      |
| -111  | Invalid request. Your app is currently unable to send notifications to this user |
| -112  | Invalid scope                        |
| -113  | Invalid IP                           |
| -114  | Invalid Mini App Id                  |
| -115  | Partner is invalid                   |
| -116  | Partner Api Key is invalid           |
| -117  | The file upload has exceeded the limit for file size |
| 0     | Success                              |

miniapp-logo

Khám phá
----------------------------------------------------------------------------------------------------

## Statistics

# Statistics

Used to collect statistical information of a Mini App within a specific time period.

### Parameters [](https://mini.zalo.me/documents/open-apis/open/stats/#parameters)

| Field        | Type   | Example              | Required | Description                                                  |
|--------------|--------|----------------------|----------|--------------------------------------------------------------|
| miniAppId    | long   | 3595174957789840753  | true     | ID of the corresponding Mini App                              |
| type         | string | access-traffic       | true     | Type of statistical data to retrieve, refer to StatsType list below |
| startTime    | long   | 1692032400000        | true     | Start time for data retrieval                                 |
| endTime      | long   | 1692032400000        | true     | End time for data retrieval                                   |
| utmSource    | string | all                  |          | Only required with certain type parameters                   |
| utmCampaign  | string | all                  |          | Only required with certain type parameters                   |
| os           | string | all                  |          | Only required with certain type parameters                   |

**Note:**

* The data retrieval period is within 90 days.
* startTime, endTime are in milliseconds.
* startTime must be at 0:00 (UTC+7) of the day to retrieve.
* endTime can be any value within the day, the system will automatically round to the end of the day.

### Return Value [](https://mini.zalo.me/documents/open-apis/open/stats/#return-value)

| Attribute | Type   | Description                          |
|-----------|--------|--------------------------------------|
| err       | number | Success / failure                    |
| msg       | string | Success / failure                    |
| data      | object | Successful data (if available)       |

### Sample Code [](https://mini.zalo.me/documents/open-apis/open/stats/#sample-code)

Code demo fallback when rendering server side!

## Error Code [](https://mini.zalo.me/documents/open-apis/open/stats/#error-code)

Refer [here](https://mini.zalo.me/documents/open-apis/errorCode/)

## StatsType [](https://mini.zalo.me/documents/open-apis/open/stats/#statstype)

### utm-sources [](https://mini.zalo.me/documents/open-apis/open/stats/#utm-sources)

Definition: List of utm sources of the mini app.

### access-traffic [](https://mini.zalo.me/documents/open-apis/open/stats/#access-traffic)

Definition: Statistics of the mini app's access sources.

Corresponding chart:

stats-access

### traffic-by-sources [](https://mini.zalo.me/documents/open-apis/open/stats/#traffic-by-sources)

Definition: Statistics of access sources by utm sources.

Corresponding chart:

stats-traffic-by-sources

### platform [](https://mini.zalo.me/documents/open-apis/open/stats/#platform)

Definition: Statistics by operating system.

Corresponding chart:

stats-platform

### age [](https://mini.zalo.me/documents/open-apis/open/stats/#age)

Definition: Statistics by age.

### gender [](https://mini.zalo.me/documents/open-apis/open/stats/#gender)

Definition: Statistics by gender.

Corresponding chart:

stats-age

### avg-used-time [](https://mini.zalo.me/documents/open-apis/open/stats/#avg-used-time)

Definition: Statistics of average usage time.

### used-time [](https://mini.zalo.me/documents/open-apis/open/stats/#used-time)

Definition: Statistics of usage time.

Corresponding chart:

stats-used-time

miniapp-logo

Explore
----------------------------------------------------------------------------------------------------

## Sending Notifications to Users

# Sending Notifications to Users | Zalo Mini App

[Jump to main content](#__docusaurus_skipToContent_fallback)

# Sending Notifications to Users

Your Zalo Mini App can send notifications to users through the Zalo Official Account (Zalo OA) system.

See the detailed initial setup steps [here](https://mini.zalo.me/documents/intro/send-message-oa-to-user/).

There are two Zalo OA channels you can use:

* Business Zalo OA
* Zalo OA “Zalo Mini App”

Custom tab fallback when rendering server side!

miniapp-logo

Explore
----------------------------------------------------------------------------------------------------

### Detailed Setup for Sending Messages

# Sending Notifications to Users

[Skip to main content](#__docusaurus_skipToContent_fallback)

# Sending Notifications to Users

To enhance quick and convenient interaction between users and businesses, the platform has introduced the benefit of sending notifications via Zalo Official Account (OA) to users who have interacted with Mini Apps.

**Note**  
This benefit applies to partners meeting the conditions below. Currently, the policy is under trial.

## 1. Applicable Objects [](/documents/intro/send-message-oa-to-user/#1-đối-tượng-áp-dụng)

Partners receive the benefit of sending notifications when users interact with Mini Apps, provided the business deploying the Mini App meets the platform's standards, including:  
- Meets censorship conditions (details [here](https://mini.zalo.me/documents/zalo-mini-app-censorship-policy))  
- Meets performance conditions (details [here](https://mini.zalo.me/blog/huong-dan-cai-thien-hieu-suat-lcp-cho-zalo-mini-app-2/))  
- Verified by OA (details [here](https://mini.zalo.me/blog/thong-bao-huong-dan-xac-thuc-mini-app-qua-zalo-oa/))

## 2. Conditions for Receiving Benefits [](/documents/intro/send-message-oa-to-user/#2-điều-kiện-nhận-quyền-lợi)

Users perform one of the following actions in the Mini App:

| STT | Action | Scope of Application | Effective Time |
|-----|--------|----------------------|----------------|
| 1   | Scan QR code to access F&B Mini App via Zalo Camera | - F&B Mini App | From 1/7/2024 |
| 2   | Click a button for the purpose of transaction payment (e.g., "Pay", "Call a car", "Book a car",...) and see payment methods in the bottom sheet of Checkout SDK | - Mini Apps of all industries and fields<br>- Mini Apps successfully integrated with Checkout SDK (applies from version 2.39.5)<br><br>Checkout SDK documentation [here](https://mini.zalo.me/documents/payment) | From 1/7/2024 |
| 3<br><br>New | Click functionButton in Mini App. FunctionButton must be one of the following fixed templates:<br><br>- Payment<br>- Order food<br>- Book a car<br>- Place an order<br>- Buy tickets<br>- Booking<br>- Reserve a seat<br>- Create an order<br>- Pre-order<br>- Shop<br>- Schedule<br>- Lookup<br>- Check | - Mini Apps of all industries and fields<br><br>FunctionButton documentation [here](https://mini.zalo.me/documents/api/showFunctionButtonWidget/) | From 16/4/2025 |

See detailed installation guide [here](https://mini.zalo.me/pages/tin-mini-app/tich-hop-va-cai-dat-tin-mini-app/). Notifications and installation guides for upcoming conditions will be sent to partners via Zalo OA Mini App - Partners and the website [mini.zalo.me](https://mini.zalo.me/).

## 3. Benefit Details [](/documents/intro/send-message-oa-to-user/#3-nội-dung-quyền-lợi)

Partners meeting the conditions will receive the following benefits:  
- Send notifications via the Consultation/Transaction message mechanism of Zalo OA (details [here](https://developers.zalo.me/docs/official-account/tin-nhan/tong-quan))  
- When using the Consultation message mechanism, partners can choose from the following sending formats:  
  - Current formats: Free text, images, forms, stickers, files  
  - Mini App message format (new): Template messages optimized for notification needs based on specific industries  

**Note**  
- All formats using the Consultation message mechanism will follow the same quota and fee calculation mechanism, see details [here](https://oa.zalo.me/home/resources/news/thong-bao-chinh-sach-gui-tin-va-quy-dinh-phi-gui-tin_1433049880779375099).  
- The Mini App message format can only be used when users have interacted with the Mini App.

![image1]  
Figure 1: Mini App message template format  

![image2]  
Figure 2: Example of quota and fee calculation mechanism for Consultation messages (Current format and Mini App message format)

## 4. Template List [](/documents/intro/send-message-oa-to-user/#4-danh-sách-template)

A list of message templates optimized for the F&B and E-commerce sectors. Partners not belonging to these two sectors can still choose templates suitable for their context and purpose. The platform will update additional templates and sectors in the future.

## Partner Introduction

# Introduction | Zalo Mini App

[Go to main content](#__docusaurus_skipToContent_fallback)

# Introduction

This document guides partners who need to automate the management and development of Mini Apps by integrating server-to-server APIs.

This feature is only available for Zalo Mini App partners. For more information about solution partners, see [here](https://mini.zalo.me/solution-partner).

After successfully registering as a solution partner, please contact Zalo Mini App to receive an API Key and usage instructions.

### Document Structure [](/documents/open-apis/partner/#cấu-trúc-tài-liệu)

1. [Open API Configuration Information](/documents/open-apis/partner/integration-process/)
2. [Client Setup and API Integration Documentation](/documents/open-apis/partner/setup-client/)
3. [Webhook Events](/documents/open-apis/partner/event-review-mini-app/)

### Introduction

zi-chevron-up

miniapp-logo

Explore
----------------------------------------------------------------------------------------------------

### Integration Process

# Configuration Information

When you become a solution partner, you will be provided with a pair of values, Partner API Key - Partner Id, to interact and use these APIs from your Server.

Below are some accompanying information when you register to use OpenAPI for solution partners:

+ List of IP Access: List of IP Servers or Gateways you have registered to access these APIs.
+ Webhook Url: URL to receive notifications and data updates from Zalo Mini App.
+ Scopes (Range) of APIs you can interact with:

  * apps.create: allows creating a Mini App.
  * apps.getlist: allows retrieving the list of your Mini Apps.
  * apps.deploy: allows deploying a new version of the Mini App to the Zalo system.
  * apps.versions: retrieves the list of versions of the Mini App.
  * apps.request.publish: allows sending a request to review the Mini App.
  * apps.publish: allows publishing the Mini App.
  * apps.request.permission: allows sending a request for permission.
  * apps.get.stats: allows retrieving statistics of the Mini App.
  * apps.get.payment.channels: allows retrieving the list of payment methods of the Mini App.
  * apps.create.update.payment.channels: allows creating and updating payment methods of the Mini App.

Note, all APIs have rate limits for each Zalo App, you can view detailed information in the API Management section.

miniapp-logo

Explore
----------------------------------------------------------------------------------------------------

### Setup Client

# Setting up the Client | Zalo Mini App

[Jump to main content](#__docusaurus_skipToContent_fallback)

# Setting up the Client

PartnerClient is the object that executes HTTP requests to OpenAPI, with common properties that rarely need to be changed for each request. The best approach is to make PartnerClient a static instance and set it up once for all requests.

### PartnerClient [](https://mini.zalo.me/documents/open-apis/partner/setup-client/#partnerclient)

#### Properties [](https://mini.zalo.me/documents/open-apis/partner/setup-client/#properties)

| Property      | Type   | Description                                                                 |
|---------------|--------|-----------------------------------------------------------------------------|
| partnerId     | String | ID of the partner                                                          |
| partnerApiKey | String | API Key corresponding to the partner used for authentication when calling Zalo Platform APIs |
| proxy         |        | Configuration of host, port for the proxy intermediary of HTTP requests, defaults to no proxy usage |

#### Sample Code [](https://mini.zalo.me/documents/open-apis/partner/setup-client/#sample-code)

Code demo fallback when rendering server side!

## Download Open API SDK [](https://mini.zalo.me/documents/open-apis/partner/setup-client/#tải-về-sdk-open-api)

Sample install config

```
<dependency>
  <groupId>com.vng.zalo</groupId>
  <artifactId>zalo-miniapp-openapi-sdk</artifactId>
  <version>2.2.1</version>
  <scope>system</scope>
  <systemPath>{your_path_to_file_sdk}</systemPath>
</dependency>
```

### Setting up the Client

zi-chevron-up

miniapp-logo

Explore
----------------------------------------------------------------------------------------------------

### Event Review Mini App

# Event Review for Mini App

Zalo will send HTTP POST requests to the Webhook URL of the application when there are changes related to the approval or rejection of the application's version.

* URL: Webhook URL of the application
* Method: POST
* Headers: X-ZEvent-Signature (see the signature verification guide below)
* Content-Type: application/json
* Parameters:

  | Parameter  | Data Type | Required | Value          | Description                              |
  |------------|-----------|----------|----------------|------------------------------------------|
  | event      | String    | Yes      | versions.review.done | Name of the event                       |
  | appId      | String    | Yes      |                | Mini App ID                             |
  | versionId  | Integer   | Yes      |                | ID of the version                       |
  | status     | Integer   | Yes      | 0 or -1        | 0 - version approved, -1 version rejected |
  | description| String    | Optional |                | Description of the reason for rejection  |
  | timestamp  | Long      |          |                | Time of the event                       |

Example:

```
{	
    "event": "versions.review.done",	
    "appId": "2646373759294038927",	
    "versionId": 101,	
    "status": 0,	
    "description": "",	
    "timestamp": 1670553442564
}
```

miniapp-logo

Explore
----------------------------------------------------------------------------------------------------

## App Management Introduction

# Introduction | Zalo Mini App

[Jump to content](#__docusaurus_skipToContent_fallback)

# Introduction

This document guides partners who need to automate the management and development of Mini Apps by integrating server-server APIs.

During the trial phase, the feature is only available to certain partners. To use this feature, please contact [mini@zalo.me](mailto:mini@zalo.me) with your Zalo App ID and information about your business and product. We will review and evaluate to support you in using this feature.
----------------------------------------------------------------------------------------------------

## App Management V2 Introduction

# Introduction | Zalo Mini App

[Jump to content](#__docusaurus_skipToContent_fallback)

# Introduction

This document guides partners who need to automate the management and development of Mini Apps by integrating server-server APIs.

This feature is only available to Zalo Mini App partners, for more information about solution partners [click here](https://mini.zalo.me/solution-partner).
----------------------------------------------------------------------------------------------------

## User Revocation of Consent and Data Deletion Events

### Open Endpoint Version

# User Revocation of Consent and Data Deletion Events | Zalo Mini App

[Jump to main content](#__docusaurus_skipToContent_fallback)

# User Revocation of Consent and Data Deletion Events

Zalo will send HTTP POST requests to the Webhook URL of the application when there are changes related to users revoking consent and deleting data usage for Mini Apps.

- URL: Webhook URL of the application
- Method: POST
- Headers: X-ZEvent-Signature (see signature verification guide below)
- Content-Type: application/json
- Parameters:

| Parameter  | Data Type | Required | Value              | Description          |
|------------|-----------|----------|--------------------|----------------------|
| event      | String    | Yes      | user.revoke.consent | Name of the event    |
| appId      | String    | Yes      |                    | Mini App ID          |
| userId     | String    | Yes      |                    | User ID              |
| timestamp  | Long      |          |                    | Time of the event    |

Example:

```
{
    "event": "user.revoke.consent",
    "appId": "2646373759294038927",
    "userId": "4047671499938107249",
    "timestamp": 1670553442564
}
```

miniapp-logo

Explore
----------------------------------------------------------------------------------------------------

### Webhook Version

# Event: User Revokes Consent and Deletes Data | Zalo Mini App

[Jump to content](#__docusaurus_skipToContent_fallback)

# Event: User Revokes Consent and Deletes Data

**Note**

To set up Webhook URL, please refer to the guide [here](https://mini.zalo.me/documents/open-apis/webhook/integration-webhook/).

Zalo will send HTTP POST Requests to the application's Webhook URL when there are changes related to the user revoking consent and deleting data usage for the Mini App.

+ URL: Webhook URL of the application
+ Method: POST
+ Headers: X-ZEvent-Signature (see the signature verification guide below)
+ Content-Type: application/json
+ Parameters:

| Parameter | Data Type | Required | Value | Description |
|-----------|-----------|----------|-------|-------------|
| event     | String    | Yes      | user.revoke.consent | Name of the event |
| appId     | String    | Yes      |       | Mini App ID |
| userId    | String    | Yes      |       | User ID |
| timestamp | Long      |          |       | Time of the event |

**Example**

```
{	"event": "user.revoke.consent",	"appId": "2646373759294038927",	"userId": "4047671499938107249",	"timestamp": 1670553442564}
```

## Additional Notes

The documentation includes references to further sub-pages under app-management/v2/, such as creating Mini Apps, deploying versions, and listing banks, which can be explored at the respective URLs for more technical details. For complete implementation, registration as a partner is required to access API keys and advanced scopes.