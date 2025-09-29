# Zalo Mini App API Detailed Summary

This document provides a detailed breakdown of each API endpoint/method from the Zalo Mini App documentation at https://miniapp.zaloplatforms.com/documents/api/. Each section includes the full description, parameters, return values, examples, notes, error handling, and reference links. The information is compiled from individual API pages. For complete code snippets and updates, refer to the original documentation.

## Events API

The Events API includes methods for managing event listeners in the Zalo Mini App.

### on(eventName, listener)
- **Description**: Adds a handler function to the end of the array of existing handlers for the event specified by `eventName`. When the event occurs, all handlers for that event are called.
- **Parameters**:
  | Name       | Type     | Required | Description          |
  |------------|----------|----------|----------------------|
  | eventName | string  | Yes     | Name of the event.  |
  | listener  | Function| Yes     | Event handler function. |
- **Return Value**: None.
- **Example**:
  ```
  import { events, EventName } from "zmp-sdk/apis";
  const callback = (data) => {
    console.log(data);
  };
  events.on(EventName.NetworkChanged, callback);
  ```
- **Notes**: Supported in SDK version 2.13.0 and above. From API version 2.25.3, 'Events' renamed to 'EventName'.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/ for details.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/events/#oneventname-listener

### once(eventName, listener)
- **Description**: Adds a one-time handler for the event. When the event occurs, the handler is removed and then executed.
- **Parameters**:
  | Name       | Type     | Required | Description          |
  |------------|----------|----------|----------------------|
  | eventName | string  | Yes     | Name of the event.  |
  | listener  | Function| Yes     | Callback function.  |
- **Return Value**: None.
- **Example**:
  ```
  import { events, EventName } from "zmp-sdk/apis";
  const callback = (data) => {
    console.log(data);
  };
  events.once(EventName.NetworkChanged, callback);
  ```
- **Notes**: Supported in SDK version 2.13.0 and above. From API version 2.25.3, 'Events' renamed to 'EventName'.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/ for details.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/events/#onceeventname-listener

### off(eventName, listener)
- **Description**: Removes a specific handler from the array of handlers for the event.
- **Parameters**:
  | Name       | Type     | Required | Description          |
  |------------|----------|----------|----------------------|
  | eventName | string  | Yes     | Name of the event.  |
  | listener  | Function| Yes     | Callback function.  |
- **Return Value**: None.
- **Example**:
  ```
  import { events, EventName } from "zmp-sdk/apis";
  const callback = (data) => {
    console.log(data);
  };
  events.on(EventName.NetworkChanged, callback);
  events.off(EventName.NetworkChanged, callback);
  ```
- **Notes**: Supported in SDK version 2.13.0 and above. From API version 2.25.3, 'Events' renamed to 'EventName'.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/ for details.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/events/#offeventname-listener

### removeAllListeners(eventName)
- **Description**: Removes all handlers for the event.
- **Parameters**:
  | Name       | Type     | Required | Description          |
  |------------|----------|----------|----------------------|
  | eventName | string  | Yes     | Name of the event.  |
- **Return Value**: None.
- **Example**:
  ```
  import { events, EventName } from "zmp-sdk/apis";
  events.removeAllListeners(EventName.NetworkChanged);
  ```
- **Notes**: Supported in SDK version 2.13.0 and above. From API version 2.25.3, 'Events' renamed to 'EventName'.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/ for details.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/events/#removealllistenerseventname

## User APIs

### authorize
- **Description**: Requests user permissions for accessing certain APIs, supporting up to three permissions including the default `scope.userInfo`. Triggers a pop-up for consent if not previously granted or denied.
- **Parameters**:
  | Name   | Type     | Required | Description          |
  |--------|----------|----------|----------------------|
  | scopes | string[]| Yes     | List of permissions. |
- **Return Value**: Promise<Scopes> - Status of requested permissions (boolean per scope).
- **Example**:
  ```
  try {
    const data = await authorize({
      scopes: ["scope.userLocation", "scope.userPhonenumber"],
    });
    console.log(data["scope.userLocation"]);
  } catch (error) {
    if ((error as AppError).code === -201) {
      console.log("User denied permission");
    }
  }
  ```
- **Notes**: Supported from SDK 2.34.0. Use `getSetting` to check permissions. Persistent status.
- **Error Handling**: Code -201 for denial. See https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/authorize/

### getUserID
- **Description**: Retrieves the user's unique ID within the Zalo App, consistent across Mini Apps sharing the same Zalo App ID. No user confirmation required.
- **Parameters**: None.
- **Return Value**: Promise<string> - User ID.
- **Example**:
  ```
  const userID = await getUserID({});
  ```
- **Notes**: Supported from SDK 2.32.2.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getUserID/

### getUserInfo
- **Description**: Retrieves user information including ID, name, and avatar. Name and avatar require permission due to data protection regulations.
- **Parameters**:
  | Name                 | Type    | Required | Description          |
  |----------------------|---------|----------|----------------------|
  | autoRequestPermission| boolean| No      | Auto request permission (default false). |
  | avatarType           | string | No      | Avatar size ("small", "normal", "large"). |
- **Return Value**: Promise<GetUserInfoReturns> - User info object.
- **Example**:
  ```
  const { userInfo } = await getUserInfo({ autoRequestPermission: true });
  try {
    const { userInfo } = await getUserInfo();
  } catch (error) {
    if (error.code === -1401) {
      // Denied
    }
  }
  ```
- **Notes**: Permission required for name/avatar. Min versions for some fields.
- **Error Handling**: Code -1401 for denial. See https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getUserInfo/

### getAccessToken
- **Description**: Retrieves an access token for user authentication. Default access for ID; additional info requires permission.
- **Parameters**: None.
- **Return Value**: Promise<string> - Access token.
- **Example**:
  ```
  const accessToken = await getAccessToken();
  ```
- **Notes**: From SDK 2.35.0, no confirmation for ID. Use authorize for more info. Confirmation for multiple Mini Apps.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getAccessToken/

### getPhoneNumber
- **Description**: Retrieves the user's phone number, requiring user consent via permission notification.
- **Parameters**: None.
- **Return Value**: Promise<GetPhoneNumberReturns> - Object with token (valid 2 min).
- **Example**:
  ```
  const { token } = await getPhoneNumber();
  // Send token to server
  ```
- **Notes**: Request permission in management. Explain purpose. Token for server use.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getPhoneNumber/

### getSetting
- **Description**: Retrieves the current user settings, including authorization statuses.
- **Parameters**: None.
- **Return Value**: Promise<GetSettingReturn> - Auth settings object.
- **Example**:
  ```
  const { authSetting } = await getSetting();
  ```
- **Notes**: From SDK 2.31.0. Scopes like userInfo, location, etc.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getSetting/

## Basic APIs

### getAppInfo
- **Description**: Retrieves information about the current Zalo Mini App, such as name, version, description, logo, QR code, and share URL.
- **Parameters**: None.
- **Return Value**: Promise<GetAppInfoReturns> - App info object.
- **Example**:
  ```
  import { getAppInfo } from "zmp-sdk/apis";
  const { name, version } = await getAppInfo({});
  ```
- **Notes**: N/A.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getAppInfo/

### getSystemInfo
- **Description**: Retrieves system and device information, including versions, language, platform, and theme.
- **Parameters**: None.
- **Return Value**: Promise<SystemInfo> - System info object.
- **Example**:
  ```
  import { getSystemInfo } from "zmp-sdk/apis";
  const { version, apiVersion, zaloVersion } = getSystemInfo();
  ```
- **Notes**: From SDK 2.4.0. Min versions for some properties.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getSystemInfo/

### getDeviceIdAsync
- **Description**: Retrieves a hashed unique Device ID. Same for users on the same device and app.
- **Parameters**: None.
- **Return Value**: Promise<string> - Device ID or 'unknown'.
- **Example**:
  ```
  const deviceId = await getDeviceIdAsync();
  ```
- **Notes**: From SDK 2.20.0.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getDeviceIdAsync/

### getContextAsync
- **Description**: Retrieves context info (user/group ID and type) when opened from chat menu. Empty if invalid.
- **Parameters**: None.
- **Return Value**: Promise<ContextInfo> - Context object or empty.
- **Example**:
  ```
  const contextInfo = await getContextAsync();
  if (contextInfo) {
    const { id, type } = contextInfo;
  }
  ```
- **Notes**: From SDK 2.22.0, Android 22.06.02.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getContextAsync/

## Routing APIs

### closeApp
- **Description**: Closes the Zalo Mini App.
- **Parameters**: None.
- **Return Value**: None.
- **Example**:
  ```
  import { closeApp } from "zmp-sdk/apis";
  closeApp();
  ```
- **Notes**: N/A.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/closeApp/

### openMiniApp
- **Description**: Opens another Zalo Mini App, optionally with path or parameters.
- **Parameters**:
  | Name   | Type                  | Required | Description          |
  |--------|-----------------------|----------|----------------------|
  | appId  | string               | Yes     | Mini App ID.        |
  | params | Record<string, string>| No      | Additional params.  |
  | path   | string               | No      | Specific path.      |
- **Return Value**: None.
- **Example**:
  ```
  import { openMiniApp } from "zmp-sdk/apis";
  openMiniApp({ appId: "194839900003483517" });
  openMiniApp({ appId: "194839900003483517", path: "/profile" });
  openMiniApp({ appId: "194839900003483517", params: { utm_campaign: "spring_promo" } });
  ```
- **Notes**: From SDK 2.7.0. Path from 2.26.1.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/openMiniApp/

### openWebview
- **Description**: Loads a web page in Webview. Listen to WebviewClosed event for closure.
- **Parameters**:
  | Name            | Type   | Required | Description          |
  |-----------------|--------|----------|----------------------|
  | url            | string | Yes     | Web page URL.       |
  | config.leftButton | string | No      | Left button type (from 2.30.0). |
  | config.style   | string | No      | Display style (from 2.30.0). |
- **Return Value**: None.
- **Example**:
  ```
  import { openWebview } from "zmp-sdk/apis";
  openWebview({ url: "https://mini.zalo.me" });
  openWebview({ url: "https://mini.zalo.me", config: { style: "normal" } });
  ```
- **Notes**: From SDK 2.11.0. Config from 2.30.0.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/openWebview/

### sendDataToPreviousMiniApp
- **Description**: Sends data to the previous Mini App. Previous app listens to OnDataCallback. Last call overrides previous.
- **Parameters**:
  | Name | Type | Required | Description          |
  |------|------|----------|----------------------|
  | data | any  | Yes     | Data to send.       |
- **Return Value**: None.
- **Example**:
  // In previous app:
  ```
  import { events, EventName } from "zmp-sdk/apis";
  events.on(EventName.OnDataCallback, (data) => console.log(data));
  openMiniApp({ appId: "2953132499190403200" });
  ```
  // In current app:
  ```
  import { sendDataToPreviousMiniApp } from "zmp-sdk/apis";
  sendDataToPreviousMiniApp({ data: "Success" });
  ```
- **Notes**: From SDK 2.13.0. Listen to OnDataCallback.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/sendDataToPreviousMiniApp/

### getRouteParams
- **Description**: Retrieves parameters sent to the current page via URL query.
- **Parameters**: None.
- **Return Value**: Record<string, string> - Key-value params.
- **Example**:
  ```
  import { getRouteParams } from "zmp-sdk/apis";
  const { id } = getRouteParams();
  ```
- **Notes**: From SDK 2.11.0.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getRouteParams/

## Storage APIs

### setItem
- **Description**: Stores data in local storage synchronously. Limit 5MB, oldest deleted when full.
- **Parameters**:
  | Name  | Type   | Required | Description          |
  |-------|--------|----------|----------------------|
  | key   | string | Yes     | Key name.           |
  | value | string | Yes     | Value to store.     |
- **Return Value**: None.
- **Example**:
  ```
  import { nativeStorage } from "zmp-sdk/apis";
  nativeStorage.setItem("recentSearch", keyword);
  ```
- **Notes**: From SDK 2.43.0.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/setItem/

### getItem
- **Description**: Retrieves cached data synchronously by key. Use try/catch for JSON.
- **Parameters**:
  | Name | Type   | Required | Description          |
  |------|--------|----------|----------------------|
  | key  | string | Yes     | Key name.           |
- **Return Value**: string | null - Value or null.
- **Example**:
  ```
  const keyword = getItem("recentSearch");
  try {
    const data = JSON.parse(getItem("cache.productList"));
  } catch (error) {
    // Handle
  }
  ```
- **Notes**: From SDK 2.43.0. Try/catch for parsing.
- **Error Handling**: Try/catch for parsing. Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getItem/

### removeItem
- **Description**: Deletes data from cache synchronously by key.
- **Parameters**:
  | Name | Type   | Required | Description          |
  |------|--------|----------|----------------------|
  | key  | string | Yes     | Key name.           |
- **Return Value**: None.
- **Example**:
  ```
  import { nativeStorage } from "zmp-sdk/apis";
  nativeStorage.removeItem("recentSearch");
  ```
- **Notes**: From SDK 2.43.0.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/removeItem/

### clear
- **Description**: Deletes all data in the cache synchronously.
- **Parameters**: None.
- **Return Value**: None.
- **Example**:
  ```
  import { nativeStorage } from "zmp-sdk/apis";
  nativeStorage.clear();
  ```
- **Notes**: From SDK 2.43.0.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/clear/

### getNativeStorageInfo (getStorageInfo)
- **Description**: Retrieves cache info synchronously, including current and limit size.
- **Parameters**: None.
- **Return Value**: Promise<StorageInfo> - Object with currentSize, limitSize (in KB).
- **Example**:
  ```
  const { currentSize, limitSize } = nativeStorage.getStorageInfo();
  ```
- **Notes**: From SDK 2.43.0.
- **Error Handling**: Refer to https://miniapp.zaloplatforms.com/documents/api/errorCode/.
- **Reference Link**: https://miniapp.zaloplatforms.com/documents/api/getNativeStorageInfo/

**Note**: This covers the queried APIs. The full documentation has additional categories like UI, Location, Media, Device, etc. For those, refer to the main index at https://miniapp.zaloplatforms.com/documents/api/. If more details are needed, provide specific API names.