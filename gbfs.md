# General Bikeshare Feed Specification (GBFS)
This document explains the types of files and data that comprise the General Bikeshare Feed Specification (GBFS) and defines the fields used in all of those files.

# Reference version
This documentation refers to **version 1.1 release candidate**. For past and upcoming versions see the [README](README.md).

## Table of Contents

* [Revision History](#revision-history)
* [Introduction](#introduction)
* [Version endpoints](#version-endpoints)
* [Term Definitions](#term-definitions)
* [Files](#files)
* [File Requirements](#file-requirements)
* [Field Definitions](#field-definitions)
    * [gbfs.json](#gbfsjson)
    * [gbfs_versions.json (beta)](#gbfs_versionsjson-beta)
    * [system_information.json](#system_informationjson)
    * [station_information.json](#station_informationjson)
    * [station_status.json](#station_statusjson)
    * [free_bike_status.json](#free_bike_statusjson)
    * [system_hours.json](#system_hoursjson)
    * [system_calendar.json](#system_calendarjson)
    * [system_regions.json](#system_regionsjson)
    * [system_pricing_plans.json](#system_pricing_plansjson)
    * [system_alerts.json](#system_alertsjson)
* [Deep Links - Analytics and Examples](#deep-links-beta) *(beta)*

## Introduction
This specification has been designed with the following concepts in mind:

* Provide the status of the system at this moment
* Do not provide information whose primary purpose is historical

The specification supports real-time travel advice in GBFS-consuming applications.

## Version endpoints
The version of the GBFS specification to which a feed conforms is declared in the `version` field in all files. See [Output Format](#output-format).<br />

GBFS Best Practice defines that:<br />

_GBFS producers_ should provide endpoints that conform to both the current specification long term support (LTS) branch as well as the latest release branch within at least 3 months of a new spec `MAJOR` or `MINOR` version release. It is not necessary to support more than one MINOR release of the same `MAJOR` release group because `MINOR` releases are backwards-compatible. See [specification versioning](https://github.com/NABSA/gbfs/blob/master/README.md#specification-versioning)<br />

_GBFS consumers_ should, at a minumum, support the current LTS branch. It highly recommended that GBFS consumers support later releases.<br />

Default GBFS feed URLs, e.g. `https://www.example.com/data/gbfs.json` or `https://www.example.com/data/fr/system_information.json` must direct consumers to the feed that conforms to the current LTS documentation branch.


## Term Definitions
This section defines terms that are used throughout this document.

* JSON - (JavaScript Object Notation) is a lightweight format for storing and transporting data. This document uses many terms defined by the JSON standard, including field, array, and object. (https://www.w3schools.com/js/js_json_datatypes.asp)
* Field - In JSON, a name/value pair consists of a field name (in double quotes), followed by a colon, followed by a value. (https://www.w3schools.com/js/js_json_syntax.asp)
* GeoJSON - GeoJSON is a format for encoding a variety of geographic data structures. (https://geojson.org/)
* Required - The field must be included in the dataset, and a value must be provided in that field for each record.
* Optional - The field may be omitted from the dataset. If an optional column is included, some of the entries in that field may be empty strings. An omitted field is equivalent to a field that is empty.
* Conditionally required - The field or file is required under certain conditions, which are outlined in the field or file description. Outside of these conditions, this field or file is optional.



## Files
This specification defines the following files along with their associated content:

File Name                   | Required                |       Defines
--------------------------- | ----------------------- | ----------
gbfs.json                   | Optional                | Auto-discovery file that links to all of the other files published by the system. This file is optional, but highly recommended.
gbfs_versions.json *(beta)* | Optional                | Lists all feed endpoints published according to versions of the GBFS documentation.
system_information.json     | Yes                     | Details including system operator, system location, year implemented, URL, contact info, time zone.
station_information.json    | Conditionally required  | List of all stations, their capacities and locations. Required of systems utilizing docks.
station_status.json         | Conditionally required  | Number of available bikes and docks at each station and station availability. Required of systems utilizing docks.
free_bike_status.json       | Conditionally required  | Bikes that are available for rent. Required of systems that offer bikes for rent outside of stations.
system_hours.json           | Optional                | Hours of operation for the system.
system_calendar.json        | Optional                | Dates of operation for the system.
system_regions.json         | Optional                | Regions the system is broken up into.
system_pricing_plans.json   | Optional                | The system pricing scheme.
system_alerts.json          | Optional                | Current system alerts.

## File Requirements
* All files should be valid JSON.
* All data should be UTF-8 encoded.
* Line breaks should be represented by unix newline characters only (\n).
* Pagination is not supported.

### File Distribution
* If the publisher intends to distribute as individual HTTP endpoints then:
    * Required files must not 404. They should return a properly formatted JSON file as defined in [Output Format](#output-format).
    * Optional files may 404. A 404 of an optional file should not be considered an error.
* Auto-Discovery:
    * This specification supports auto-discovery.
    * The location of the auto-discovery file will be provided in the HTML area of the bikeshare landing page hosted at the URL specified in the URL field of the system_infomation.json file.
    * This is referenced via a link tag with the following format:
      * `<link rel="gbfs" type="application/json" href="https://www.example.com/data/gbfs.json" />`
    * Reference:
      * http://microformats.org/wiki/existing-rel-values
      * http://microformats.org/wiki/rel-faq#How_is_rel_used

### Localization

* Each set of data files should be distributed in a single language as defined in system_information.json.
* A system that wants to publish feeds in multiple languages should do so by publishing multiple distributions, such as:
    * https://www.example.com/data/en/system_information.json
    * https://www.example.com/data/fr/system_information.json

## Field Types

* Array - A JSON element consisting of an ordered sequence of zero or more values.
* Boolean - One of two possible values, 1= true and 0= false. Boolean values must be JSON booleans, not strings (i.e. true or false, not "true" or "false")
* Date - Service day in the YYYY-MM-DD format. Example: 2019-09-13 for September 13th, 2019.
* Email - An email address. _Example: example@example.com_
* Enum (Enumerable values) - An option from a set of predefined constants in the "Defines" column.
Example: The rental_methods field contains values CREDITCARD, PAYPASS, etc...
* Timestamp - Timestamp fields must be represented as integers in POSIX time. (e.g., the number of seconds since January 1st 1970 00:00:00 UTC)
* ID - Should be represented as a string that identifies that particular entity. An ID:
	* must be unique within like fields (e.g. bike_id must be unique among bikes)
	* does not have to be globally unique, unless otherwise specified
	* must not contain spaces
	* should be persistent for a given entity (station, plan, etc)
* String - Can only contain text. Strings must not contain any formatting codes (including HTML) other than newlines.
* Language - An IETF BCP 47 language code. For an introduction to IETF BCP 47, refer to http://www.rfc-editor.org/rfc/bcp/bcp47.txt and http://www.w3.org/International/articles/language-tags/.
Examples: _en_ for English, _en-US_ for American English, or _de_ for German.
* Latitude - WGS84 latitude in decimal degrees. The value must be greater than or equal to -90.0 and less than or equal to 90.0.
_Example: 41.890169 for the Colosseum in Rome._
* Longitude - WGS84 longitude in decimal degrees. The value must be greater than or equal to -180.0 and less than or equal to 180.0.
_Example: 12.492269 for the Colosseum in Rome._
* Non-negative Integer - An integer greater than or equal to 0.
* Non-negative Float - A floating point number greater than or equal to 0.
* Timezone - TZ timezone from the https://www.iana.org/time-zones. Timezone names never contain the space character but may contain an underscore. Refer to http://en.wikipedia.org/wiki/List_of_tz_zones for a list of valid values.
_Example: Asia/Tokyo, America/Los_Angeles or Africa/Cairo._
* URL - A fully qualified URL that includes http:// or https://, and any special characters in the URL must be correctly escaped. See the following http://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URL values.

### Output Format
Every JSON file presented in this specification contains the same common header information at the top level of the JSON response object:

Field Name          | Required  |  Type                |  Defines
--------------------| ----------| -------------------  | ------------------
last_updated        | Yes       |  Timestamp           | Last time the data in the feed was updated.
ttl                 | Yes       | Non-negative integer | Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).
version *(beta)*    | Yes       | String               | GBFS version number to which the feed confirms, according to the versioning framework.
data                | Yes       | Object               | Response data in the form of name:value pairs.


Example:
```
{
  "last_updated": 1434054678,
  "ttl": 3600,
  "data": {
    "name": "Citi Bike",
    "system_id": "citibike_com"
  }
}
```

### gbfs.json

Field Name              | Required    |  Type         | Defines
------------------------| ------------| ------------  | -------------------
_language_              | Yes         | Language code | The language that will be used throughout the rest of the files. It must match the value in the system_information file.
\-&nbsp;feeds           | Yes         | Array         | An array of all of the feeds that are published by this auto-discovery file.
\-&nbsp;name            | Yes         | String        | The type of feed this is (e.g. "system_information", "station_information").
\-&nbsp;url             | Yes         | URL           | URL for the feed.


Example:

```
{
  "last_updated": 1434054678,
  "ttl": 0,
  "version": "1.1",
  "data": {
    "en": {
      "feeds": [
        {
          "name": "system_information",
          "url": "https://www.example.com/gbfs/1/en/system_information"
        },
        {
          "name": "station_information",
          "url": "https://www.example.com/gbfs/1/en/station_information"
        }
      ]
    },
    "fr" : {
      "feeds": [
        {
          "name": "system_information",
          "url": "https://www.example.com/gbfs/1/fr/system_information"
        },
        {
          "name": "station_information",
          "url": "https://www.example.com/gbfs/1/fr/station_information"
        }
      ]
    }
  }
}
```

### gbfs_versions.json *(beta)*

Each expression of a GBFS feed describes all of the versions that are available.

The following fields are all attributes within the main "data" object for this feed.

Field Name              | Required    | Type       | Defines
------------------------| ------------| ---------- |-----------------------
_versions_              | Yes         | Array      | Contains one object, as defined below, for each of the available versions of a feed. The array must be sorted by increasing MAJOR and MINOR version number.
\-&nbsp;version         | Yes         | String     | The semantic version of the feed in the form X.Y.
\-&nbsp;url             | Yes         | URL        | URL of the corresponding gbfs.json endpoint.
  
```
{
  "last_updated": 1434054678,
  "ttl": 0,
  "version": "1.1",
  "data": {
    "versions": [
      {
        "version":"1",
        "url":"https://www.example.com/gbfs/1/gbfs"
      },
      {
        "version":"2",
        "url":"https://www.example.com/gbfs/2/gbfs"
      }
    ]
  }
}
```

### system_information.json
The following fields are all attributes within the main "data" object for this feed.

Field Name                      | Required               | Type          | Defines
-----------------------------   | ---------------------  | ----------    | -----------------------
system_id                       | Yes                    | ID            | Identifier for this bike share system. This should be globally unique (even between different systems) - for example,  bcycle_austin or biketown_pdx. It is up to the publisher of the feed to guarantee uniqueness. This value is intended to remain the same over the life of the system.
language                        | Yes                    | Language code | The language that will be used throughout the rest of the files. It must match the value in the gbfs.json file.
name                            | Yes                    | String        | Name of the system to be displayed to customers.
short_name                      | Optional               | String        | Optional abbreviation for a system.
operator                        | Optional               | String        | Name of the operator.
url                             | Optional               | URL           | The URL of the bike share system.
purchase_url                    | Optional               | URL           | URL where a customer can purchase a membership.
start_date                      | Optional               | Date          | Date that the system began operations.
phone_number                    | Optional               | Phone Number  | A single voice telephone number for the specified system that presents the telephone number as typical for the system's service area. It can and should contain punctuation marks to group the digits of the number. Dialable text (for example, Capital Bikeshare’s "877-430-BIKE") is permitted, but the field must not contain any other descriptive text.
email                           | Optional               | Email         | Email address actively monitored by the operator’s customer service department. This email address should be a direct contact point where riders can reach a customer service representative.
feed_contact_email *(beta)*     | Optional               | Email         | A single contact email address for consumers of this feed to report technical issues.
timezone                        | Yes                    | Timezone      | The time zone where the system is located.
license_url                     | Optional               | URL           | URL of a page that defines the license terms for the GBFS data for this system.
rental_apps *(beta)*            | Optional               | JSON          | JSON object that contains rental app information in the android and ios JSON objects.
\-&nbsp;android *(beta)*        | Optional               | JSON          | JSON object that contains rental app download and app discovery information for the Android platform in the store_uri and discovery_uri fields. See [examples](#Examples) of how to use these fields and [supported analytics](#Analytics).       
&emsp;- store_uri *(beta)*      | Conditionally Required | URI           | URI where the rental Android app can be downloaded from. Typically this will be a URI to an app store such as Google Play. If the URI points to an app store such as Google Play, the URI should follow Android best practices so the viewing app can directly open the URI to the native app store app instead of a website. <br><br> If a rental_uris.android field is populated then this field is required, otherwise it is optional. <br><br>See the [Analytics](#Analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Example value: `https://play.google.com/store/apps/details?id=com.abcrental.android`
&emsp;- discovery_uri *(beta)*  | Conditionally Required | URI           | URI that can be used to discover if the rental Android app is installed on the device (e.g., using [`PackageManager.queryIntentActivities()`](https://developer.android.com/reference/android/content/pm/PackageManager.html#queryIntentActivities)). This intent is used by viewing apps prioritize rental apps for a particular user based on whether they already have a particular rental app installed. <br><br>This field is required if a rental_uris.android field is populated, otherwise it is optional. <br><br>Example value: `com.abcrental.android://`
\-&nbsp;ios *(beta)*            | Optional               | JSON          | JSON object that contains rental information for the iOS platform in the store_uri and discovery_uri fields. See [examples](#Examples) of how to use these fields and [supported analytics](#Analytics).
&emsp;- store_uri *(beta)*      | Conditionally Required | URI           | URI where the rental iOS app can be downloaded from. Typically this will be a URI to an app store such as the Apple App Store. If the URI points to an app store such as the Apple App Store, the URI should follow iOS best practices so the viewing app can directly open the URI to the native app store app instead of a website. <br><br>If a rental_uris.ios field is populated then this field is required, otherwise it is optional. <br><br>See the [Analytics](#Analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Example value: `https://apps.apple.com/app/apple-store/id123456789`
&emsp;- discovery_uri *(beta)*  | Conditionally Required | URI           | URI that can be used to discover if the rental iOS app is installed on the device (e.g., using [`UIApplication canOpenURL:`](https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl?language=objc)). This intent is used by viewing apps prioritize rental apps for a particular user based on whether they already have a particular rental app installed. <br><br>This field is required if a rental_uris.ios field is populated, otherwise it is optional. <br><br>Example value: `com.abcrental.ios://`


### station_information.json
All stations included in station_information.json are considered public (e.g., can be shown on a map for public use). If there are private stations (such as Capital Bikeshare’s White House station), these should not be included here.

Field Name                       | Required  | Type                  | Defines
-------------------------------- | --------- | --------------------- | -----------------------
_stations_                       | Yes       | Array                 | Array that contains one object per station as defined below.
\-&nbsp;station_id               | Yes       | ID                    | Identifier of a station.
\-&nbsp;name                     | Yes       | String                | Public name of the station.
\-&nbsp;short_name               | No        | String                | Short name or other type of identifier.
\-&nbsp;lat                      | Yes       | Latitude              | The latitude of station.
\-&nbsp;lon                      | Yes       | Longitude             | The longitude of station.
\-&nbsp;address                  | Optional  | String                | Address (street number and name) where station is located. This must be a valid address, not a free-form text description (see "cross_street" below).
\-&nbsp;cross_street             | Optional  | String                | Cross street or landmark where the station is located.
\-&nbsp;region_id                | Optional  | ID                    | Identifier of the region where station is located. See [system_regions.json](#system_regionsjson).
\-&nbsp;post_code                | Optional  | String                | Postal code where station is located.
\-&nbsp;rental_methods           | Optional  | Array                 | Payment methods accepted at this station. <br /> Current valid values are:<br /> <ul><li>KEY (e.g. operator issued bike key / fob / card)</li><li>CREDITCARD</li><li>PAYPASS</li><li>APPLEPAY</li><li>ANDROIDPAY</li><li>TRANSITCARD</li><li>ACCOUNTNUMBER</li><li>PHONE</li></ul>
\-&nbsp;capacity                 | Optional  | Non-negative integer  | Number of total docking points installed at this station, both available and unavailable.
\-&nbsp;rental_uris *(beta)*     | Optional  | JSON                  | JSON object that contains rental URIs for Android, iOS, and web in the android, ios, and web fields. See [examples](#Examples) of how to use these fields and [supported analytics](#Analytics).      
&emsp;\-&nbsp;android *(beta)*   | Optional  | URI                   | URI that can be passed to an Android app with an `android.intent.action.VIEW` Android intent to support Android Deep Links (https://developer.android.com/training/app-links/deep-linking). Please use Android App Links (https://developer.android.com/training/app-links) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI should be a deep link specific to this station, and should not be a general rental page that includes information for more than one station. The deep link should take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native Android rental app. <br><br>Note that URIs do not necessarily include the station_id for this station - other identifiers can be used by the rental app within the URI to uniquely identify this station. <br><br>See the [Analytics](#Analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Android App Links example value: `https://www.abc.com/app?sid=1234567890&platform=android` <br><br>Deep Link (without App Links) example value: `com.abcrental.android://open.abc.app/app?sid=1234567890`
&emsp;\-&nbsp;ios *(beta)*       | Optional  | URI                   | URI that can be used on iOS to launch the rental app for this station. More information on this iOS feature can be found [here](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/communicating_with_other_apps_using_custom_urls?language=objc). Please use iOS Universal Links (https://developer.apple.com/ios/universal-links/) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI should be a deep link specific to this station, and should not be a general rental page that includes information for more than one station.  The deep link should take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native iOS rental app. <br><br>Note that the URI does not necessarily include the station_id - other identifiers can be used by the rental app within the URL to uniquely identify this station. <br><br>See the [Analytics](#Analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>iOS Universal Links example value: `https://www.abc.com/app?sid=1234567890&platform=ios` <br><br>Deep Link (without Universal Links) example value: `com.abcrental.ios://open.abc.app/app?sid=1234567890`
&emsp;\-&nbsp;web *(beta)*       | Optional  | URL                   | URL that can be used by a web browser to show more information about renting a vehicle at this station. <br><br>This URL should be a deep link specific to this station, and should not be a general rental page that includes information for more than one station.  The deep link should take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported for web browsers. <br><br>Example value: https://www.abc.com/app?sid=1234567890

### station_status.json
Describes the capacity and rental availability of a station.

Field Name                  | Required  | Type                   | Defines
--------------------------- | ----------| ---------------------- | ------------------
_stations_                  | Yes       | Array                  | Array that contains one object per station in the system as defined below.
\-&nbsp;station_id          | Yes       | ID                     | Identifier of a station see [station_information.json](#station_informationjson).
\-&nbsp;num_bikes_available | Yes       | Non-negative integer   | Number of bikes available for rental.
\-&nbsp;num_bikes_disabled  | Optional  | Non-negative integer   | Number of disabled bikes at the station.
\-&nbsp;num_docks_available | Yes       | Non-negative integer   | Number of docks accepting bike returns.
\-&nbsp;num_docks_disabled  | Optional  | Non-negative integer   | Number of empty but disabled dock points at the station.
\-&nbsp;is_installed        | Yes       | Boolean                | Is the station currently on the street? <br /><br /> 1 - Station is installed on the street.<br />0 - Station is not installed on the street.
\-&nbsp;is_renting          | Yes       | Boolean                | Is the station currently renting bikes? <br /><br /> 1- Station is renting bikes.<br /> 0- Station is not renting bikes.<br /><br /> Even if the station is empty, if it is set to allow rentals this value should be 1.
\-&nbsp;is_returning        | Yes       | Boolean                | Is the station accepting bike returns? <br /><br /> 1- Station is accepting bike returns.<br /> 0- Station is not accepting bike returns.<br /><br /> If a station is full but would allow a return if it was not full, then this value should be 1.
\-&nbsp;last_reported       | Yes       | Timestamp              | The last time this station reported its status.

### free_bike_status.json
Describes bikes that are not at a station and are not currently in the middle of an active ride.

Field Name                     | Required  | Type            | Defines
------------------------------ | ----------| --------------- | ---------------------
_bikes_                        | Yes       | Array           | Array that contains one object per bike that is currently stopped as defined below.
\-&nbsp;bike_id                | Yes       | ID              | Identifier of a bike.
\-&nbsp;lat                    | Yes       | Latitude        | Latitude of the bike.
\-&nbsp;lon                    | Yes       | Longitude       | Longitude of the bike.
\-&nbsp;is_reserved            | Yes       | Boolean         | Is the bike currently reserved? <br /><br /> 1- Bike is currently reserved. <br /> 0- Bike is not currently reserved.
\-&nbsp;is_disabled            | Yes       | Boolean         | Is the bike currently disabled (broken)? <br /><br /> 1- Bike is currently disabled. <br /> 0- Bike is not currently disabled.
\-&nbsp;rental_uris *(beta)*   | Optional  | JSON            | JSON object that contains rental URIs for Android, iOS, and web in the android, ios, and web fields. See [examples](#Examples) of how to use these fields and [supported analytics](#Analytics).      
&emsp;\-&nbsp;android *(beta)* | Optional  | URI             | URI that can be passed to an Android app with an android.intent.action.VIEW Android intent to support Android Deep Links (https://developer.android.com/training/app-links/deep-linking). Please use Android App Links (https://developer.android.com/training/app-links) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI should be a deep link specific to this bike, and should not be a general rental page that includes information for more than one bike. The deep link should take users directly to this bike, without any prompts, interstitial pages, or logins. Make sure that users can see this bike even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native Android rental app. <br><br>Note that URIs do not necessarily include the bike_id for this bike - other identifiers can be used by the rental app within the URI to uniquely identify this bike. <br><br>See the [Analytics](#Analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Android App Links example value: `https://www.abc.com/app?sid=1234567890&platform=android` <br><br>Deep Link (without App Links) example value: `com.abcrental.android://open.abc.app/app?sid=1234567890`
&emsp;\-&nbsp;ios *(beta)*     | Optional  | URI             | URI that can be used on iOS to launch the rental app for this bike. More information on this iOS feature can be found here: https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/communicating_with_other_apps_using_custom_urls?language=objc. Please use iOS Universal Links (https://developer.apple.com/ios/universal-links/) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI should be a deep link specific to this bike, and should not be a general rental page that includes information for more than one bike.  The deep link should take users directly to this bike, without any prompts, interstitial pages, or logins. Make sure that users can see this bike even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native iOS rental app. <br><br>Note that the URI does not necessarily include the bike_id - other identifiers can be used by the rental app within the URL to uniquely identify this bike. <br><br>See the [Analytics](#Analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>iOS Universal Links example value: `https://www.abc.com/app?sid=1234567890&platform=ios` <br><br>Deep Link (without Universal Links) example value: `com.abcrental.ios://open.abc.app/app?sid=1234567890`
&emsp;\-&nbsp;web *(beta)*     | Optional  | URL             | URL that can be used by a web browser to show more information about renting a vehicle at this bike. <br><br>This URL should be a deep link specific to this bike, and should not be a general rental page that includes information for more than one bike.  The deep link should take users directly to this bike, without any prompts, interstitial pages, or logins. Make sure that users can see this bike even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported for web browsers. <br><br>Example value: https://www.abc.com/app?sid=1234567890

### system_hours.json
Describes the system hours of operation.

Field Name          | Required    | Type        | Defines
--------------------| ----------- | ----------- | ---------------------------
_rental_hours_      | Yes         | Array       | Array of objects as defined below. The array must contain a minimum of one object identifying hours for every day of the week or a maximum of two for each day of the week  objects ( one for each user type).
\-&nbsp;user_types  | Yes         | Array       | An array of "member" and/or "nonmember" value(s). This indicates that this set of rental hours applies to either members or non-members only.
\-&nbsp;days        | Yes         | Array       | An array of abbreviations (first 3 letters) of English names of the days of the week for which this object applies (e.g. ["mon", "tue", “wed”, “thu”, “fri”, “sat”, “sun”]). Rental hours must not be defined more than once for each day and user type.
\-&nbsp;start_time  | Yes         | Time        | Start time for the hours of operation of the system in the time zone indicated in system_information.json.
\-&nbsp;end_time    | Yes         | Time        | End time for the hours of operation of the system in the time zone indicated in system_information.json.

Example:
```
{
  "last_updated": 1434054678,
  "ttl": 0,
  "data": {
    "rental_hours": [
      {
        "user_types": [ "member" ],
        "days": ["sat", "sun"],
        "start_time": "00:00:00",
        "end_time": "23:59:59"
      },
      {
        "user_types": [ "nonmember" ],
        "days": ["sat", "sun"],
        "start_time": "05:00:00",
        "end_time": "23:59:59"
      },
      {
        "user_types": [ "member", "nonmember" ],
        "days": ["mon", "tue", "wed", "thu", "fri"],
        "start_time": "00:00:00",
        "end_time": "23:59:59"
      }
    ]
  }
}
```

### system_calendar.json
Describes the operating calendar for a system. 

Field Name            | Required  | Type                  | Defines
--------------------- | ----------| --------------------- | --------------------------------
_calendars_           | Yes       | Array                 | Array of objects describing the system operational calendar. A minimum of one calendar object is required. If start and end dates are the same every year, then start_year and end_year should be omitted.
\-&nbsp;start_month   | Yes       | Non-negative Integer  | Starting month for the system operations (1-12).
\-&nbsp;start_day     | Yes       | Non-negative Integer  | Starting date for the system operations (1-31).
\-&nbsp;start_year    | Optional  | Non-negative Integer  | Starting year for the system operations.
\-&nbsp;end_month     | Yes       | Non-negative Integer  | Ending month for the system operations (1-12).
\-&nbsp;end_day       | Yes       | Non-negative Integer  | Ending date for the system operations (1-31).
\-&nbsp;end_year      | Optional  | Non-negative Integer  | Ending year for the system operations.


### system_regions.json
Describe regions for a system that is broken up by geographic or political region.

Field Name          | Required  | Type       | Defines
------------------- | --------- | ---------- | -----------
_regions_           | Yes       | Array      | Array of objects as defined below.
\-&nbsp;region_id   | Yes       | ID         | Identifier for the region.
\-&nbsp;name        | Yes       | String     | Public name for this region.

### system_pricing_plans.json
Describes pricing for the system.

Field Name              | Required  | Type               | Defines
----------------------- | --------- | ------------------ | --------------------------
_plans_                 | Yes       | Array              | Array of objects as defined below.
\-&nbsp;plan_id         | Yes       | ID                 | Identifier for a pricing plan in the system.
\-&nbsp;url             | Optional  | URL                | URL where the customer can learn more about this pricing plan.
\-&nbsp;name            | Yes       | String             | Name of this pricing plan.
\-&nbsp;currency        | Yes       | String             | Currency used to pay the fare. <br /><br /> This pricing is in ISO 4217 code: http://en.wikipedia.org/wiki/ISO_4217 <br />(e.g. CAD for Canadian dollars, EUR for euros, or JPY for Japanese yen.)
\-&nbsp;price           | Yes       | Non-negative float | Fare price, in the unit specified by currency.
\-&nbsp;is_taxable      | Yes       | Boolean            | Will additional tax be added to the base price?<br /><br />1 - Yes.<br />  0 - No.  <br /><br />0 may be used to indicate that tax is not charged or that tax is included in the base price.
\-&nbsp;description     | Yes       | String             | Customer-readable description of the pricing plan. This should include the duration, price, conditions, etc. that the publisher would like users to see.

### system_alerts.json
This feed is intended to inform customers about changes to the system that do not fall within the normal system operations. For example, system closures due to weather would be listed here, but a system that only operated for part of the year would have that schedule listed in the system_calendar.json feed.<br />
Obsolete alerts should be removed so the client application can safely present to the end user everything present in the feed.


Field Name              | Required    | Type               | Defines
----------------------- | ------------| ------------------ | ---------------------------
_alerts_                | Yes         | Array              | Array of objects each indicating a system alert as defined below.
\-&nbsp;alert_id        | Yes         | ID                 | Identifier for this alert.
\-&nbsp;type            | Yes         | Enum               | Valid values are:<br /><br /><ul><li>SYSTEM_CLOSURE</li><li>STATION_CLOSURE</li><li>STATION_MOVE</li><li>OTHER</li></ul>
\-&nbsp;times           | Optional    | Array              | Array of objects with the fields "start" and "end" indicating when the alert is in effect (e.g. when the system or station is actually closed, or when it is scheduled to be moved).
&emsp;\-&nbsp;start     | Yes         | Timestamp          | Start time of the alert.
&emsp;\-&nbsp;end       | Optional    | Timestamp          | End time of the alert. If there is currently no end time planned for the alert, this can be omitted.
\-&nbsp;station_ids     | Optional    | Array              | If this is an alert that affects one or more stations, include their ID(s). Otherwise omit this field. If both station_id and region_id are omitted, this alert affects the entire system.
\-&nbsp;region_ids      | Optional    | Array              | If this system has regions, and if this alert only affects certain regions, include their ID(s). Otherwise, omit this field. If both station_ids and region_ids are omitted, this alert affects the entire system.
\-&nbsp;url             | Optional    | URL                | URL where the customer can learn more information about this alert.
\-&nbsp;summary         | Yes         | String             | A short summary of this alert to be displayed to the customer.
\-&nbsp;description     | Optional    | String             | Detailed description of the alert.
\-&nbsp;last_updated    | Optional    | Timestamp          | Indicates the last time the info for the alert was updated.

## Deep Links *(beta)*

Deep links to iOS, Android, and web apps are supported via URIs in the `system_information.json`, `station_information.json`, and `free_bike_status.json` files. The following sections describe how analytics can be added to these URIs, as well as some examples.

### Analytics *(beta)*

In all of the rental URI fields, a viewing app can report the origin of a deep link to request to a rental app by appending the `client_id` *(beta)* parameter to the URI along with the domain name for the viewing app. 

For example, if Google is the viewing app, it can append:

`client_id=google.com` 

...to the URI field to report that Google is the originator of the deep link request. If the Android URI is:

`com.abcrental.android://open.abc.app/stations?id=1234567890`

...then the URI used by Google would be: `com.abcrental.android://open.abc.app/stations?id=1234567890&client_id=google.com`

Other supported parameters include:

1. `ad_id` *(beta)* - Advertising ID issued to the viewing app (e.g., IFDA on iOS)
2. `token` *(beta)* - A token identifier that was issued by the rental app to the viewing app.

### Examples *(beta)*

#### Example 1 - App Links on Android and Universal Links on iOS are supported:

*system_information.json*

```
{
  "last_updated": 1572447999,
  "data": {
  "system_id": "1000",
  "short_name": "ABC Bike Rental",
  "rental_apps": {
    "android": {
      "discovery_uri": "com.abcrental.android://"
    },
    "ios": {
      "discovery_uri": "com.abcrental.ios://"
    }
  }
  ...
```

*station_information.json*

```
"stations": [
  { 
    "station_id": 425,
    "name": "Coppertail",
    "lat": 27.9563335328521,
    "lon": -82.430436084371,
    "rental_uris": {
      "android": "https://www.abc.com/app?sid=1234567890&platform=android",
      "ios": "https://www.abc.com/app?sid=1234567890&platform=ios"
    }
  },
  ...
```


Note that the Android URI and iOS Universal Link URLs don’t necessarily use the same identifier as the station_id.


#### Example 2 - App Links are not supported on Android and Universal Links are not supported on iOS, but deep links are still supported on Android and iOS:

*system_information.json*

```
{
  "last_updated": 1572447999,
  "data": {
    "system_id": "1000",
    "short_name": "ABC Bike Rental",
    "rental_apps": {
      "android": {
        "discovery_uri": "com.abcrental.android://"
        "store_uri": "https://play.google.com/store/apps/details?id=com.abcrental.android",
      },
      "ios": {
        "store_uri": "https://apps.apple.com/app/apple-store/id123456789",
        "discovery_uri": "com.abcrental.ios://"
      }
    },
    ...
```

*station_information.json*

```
"stations": [
  { 
    "station_id": 425,
    "name": "Coppertail",
    "lat": 27.9563335328521,
    "lon": -82.430436084371,
    "rental_uris": {
      "android": "com.abcrental.android://open.abc.app/app?sid=1234567890",
      "ios": "com.abcrental.ios://open.abc.app/app?sid=1234567890"
    }
  },
  ...
```

#### Example 3 - Deep link web URLs are supported, but not Android or iOS native apps:

*station_information.json*

```
"stations": [ 
  {
    "station_id":425,
    "name":"Coppertail",
    "lat":27.9563335328521,
    "lon":-82.430436084371,
    "rental_uris": {
      "web":"https://www.abc.com/app?sid=1234567890",
    }
  },
  ...
```

## Disclaimers

_Apple Pay, PayPass and other third-party product and service names are trademarks or registered trademarks of their respective owners._

## License

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/).
