
# General Bikeshare Feed Specification (GBFS)
This document explains the types of files and data that comprise the General Bikeshare Feed Specification (GBFS) and defines the fields used in all of those files.

# Reference version
This documentation refers to **v3.0-RC (release candidate)**. For past and upcoming versions see the [README](README.md#read-the-spec--version-history).

## Table of Contents

* [Introduction](#introduction)
* [Version Endpoints](#version-endpoints)
* [Term Definitions](#term-definitions)
* [Files](#files)
* [File Requirements](#file-requirements)
* [Field Types](#field-types)
    * [gbfs.json](#gbfsjson)
    * [gbfs_versions.json](#gbfs_versionsjson-added-in-v11) *(added in v1.1)*
    * [system_information.json](#system_informationjson)
    * [station_information.json](#station_informationjson)
    * [station_status.json](#station_statusjson)
    * [free_bike_status.json](#free_bike_statusjson)
    * [system_hours.json](#system_hoursjson)
    * [system_calendar.json](#system_calendarjson)
    * [system_regions.json](#system_regionsjson)
    * [system_pricing_plans.json](#system_pricing_plansjson)
    * [system_alerts.json](#system_alertsjson)
* [Deep Links - Analytics and Examples](#deep-links-added-in-v11) *(added in v1.1)*

## Introduction
This specification has been designed with the following concepts in mind:

* Provide the status of the system at this moment
* Do not provide information whose primary purpose is historical

The specification supports real-time travel advice in GBFS-consuming applications.

## Version Endpoints
The version of the GBFS specification to which a feed conforms is declared in the `version` field in all files. See [Output Format](#output-format).<br />

GBFS Best Practice defines that:<br />

_GBFS producers_ should provide endpoints that conform to both the current specification long term support (LTS) branch as well as the latest release branch within at least 3 months of a new spec _MAJOR_ or _MINOR_ version release. It is not necessary to support more than one _MINOR_ release of the same _MAJOR_ release group because _MINOR_ releases are backwards-compatible. See [specification versioning](https://github.com/NABSA/gbfs/blob/master/README.md#specification-versioning)<br />

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
File Name | Required | Defines
---|---|---
gbfs.json | Yes <br/>*(as of v2.0)* | Auto-discovery file that links to all of the other files published by the system.
gbfs_versions.json <br/>*(added in v1.1)* | Optional | Lists all feed endpoints published according to versions of the GBFS documentation.
system_information.json | Yes | Details including system operator, system location, year implemented, URL, contact info, time zone.
station_information.json | Conditionally required | List of all stations, their capacities and locations. Required of systems utilizing docks.
station_status.json | Conditionally required | Number of available bikes and docks at each station and station availability. Required of systems utilizing docks.
free_bike_status.json | Conditionally required | Bikes that are available for rent. Required of systems that offer bikes for rent outside of stations.
system_hours.json | Optional | Hours of operation for the system.
system_calendar.json | Optional | Dates of operation for the system.
system_regions.json | Optional | Regions the system is broken up into.
system_pricing_plans.json | Optional | System pricing scheme.
system_alerts.json | Optional | Current system alerts.

## File Requirements
* All files should be valid JSON
* All files in the spec may be published at a URL path or with an alternate name (e.g., `station_info` instead of `station_information.json`) *(as of v2.0)*.
* All data should be UTF-8 encoded
* Line breaks should be represented by unix newline characters only (\n)
* Pagination is not supported.

### File Distribution
* If the publisher intends to distribute as individual HTTP endpoints then:
    * Required files must not 404. They should return a properly formatted JSON file as defined in [Output Format](#output-format).
    * Optional files may 404. A 404 of an optional file should not be considered an error.
* Auto-Discovery:
    * This specification supports auto-discovery.
    * The location of the auto-discovery file will be provided in the HTML area of the shared mobility landing page hosted at the URL specified in the URL field of the system_infomation.json file.
    * This is referenced via a _link_ tag with the following format:
      * `<link rel="gbfs" type="application/json" href="https://www.example.com/data/gbfs.json" />`
    * References:
      * http://microformats.org/wiki/existing-rel-values
      * http://microformats.org/wiki/rel-faq#How_is_rel_used

### Localization
* Each set of data files should be distributed in a single language as defined in system_information.json.
* A system that wants to publish feeds in multiple languages should do so by publishing multiple distributions, such as:
    * `https://www.example.com/data/en/system_information.json`
    * `https://www.example.com/data/fr/system_information.json`

## Field Types

* Array - A JSON element consisting of an ordered sequence of zero or more values.
* Object - A JSON element consisting of key-value pairs (fields).
* Boolean - One of two possible values, `true`or `false`. Boolean values must be JSON booleans, not strings (i.e. `true` or `false`, not `"true"` or `"false"`). *(as of v2.0)*
* Date - Service day in the YYYY-MM-DD format. Example: `2019-09-13` for September 13th, 2019.
* Email - An email address. Example: `example@example.com`
* Enum (Enumerable values) - An option from a set of predefined constants in the "Defines" column.
Example: The `rental_methods` field contains values `CREDITCARD`, `PAYPASS`, etc...
* Timestamp - Timestamp fields must be represented as integers in POSIX time. (e.g., the number of seconds since January 1st 1970 00:00:00 UTC)
* ID - Should be represented as a string that identifies that particular entity. An ID:
	* must be unique within like fields (e.g. `station_id` must be unique among stations)
	* does not have to be globally unique, unless otherwise specified
	* must not contain spaces
	* should be persistent for a given entity (station, plan, etc). An exception is floating bike `bike_id`, which should not be persistent for privacy reasons (see `free_bike_status.json`). *(as of v2.0)*
* String - Can only contain text. Strings must not contain any formatting codes (including HTML) other than newlines.
* Language - An IETF BCP 47 language code. For an introduction to IETF BCP 47, refer to http://www.rfc-editor.org/rfc/bcp/bcp47.txt and http://www.w3.org/International/articles/language-tags/.
Examples: `en` for English, `en-US` for American English, or `de` for German.
* Latitude - WGS84 latitude in decimal degrees. The value must be greater than or equal to -90.0 and less than or equal to 90.0.
Example: `41.890169` for the Colosseum in Rome.
* Longitude - WGS84 longitude in decimal degrees. The value must be greater than or equal to -180.0 and less than or equal to 180.0.
Example: `12.492269` for the Colosseum in Rome.
* Non-negative Integer - An integer greater than or equal to 0.
* Non-negative Float - A floating point number greater than or equal to 0.
* Timezone - TZ timezone from the https://www.iana.org/time-zones. Timezone names never contain the space character but may contain an underscore. Refer to http://en.wikipedia.org/wiki/List_of_tz_zones for a list of valid values.
Example: `Asia/Tokyo`, `America/Los_Angeles` or `Africa/Cairo`.
* URI *(added in v1.1)* - A fully qualified URI that includes the scheme (e.g., `com.abcrental.android://`), and any special characters in the URI must be correctly escaped. See the following http://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URI values. Note that URIs may be URLs.
* URL - A fully qualified URL that includes `http://` or `https://`, and any special characters in the URL must be correctly escaped. See the following http://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URL values.

### Output Format
Every JSON file presented in this specification contains the same common header information at the top level of the JSON response object:

Field Name | Required | Type | Defines
---|---|---|---
`last_updated` | Yes | Timestamp | Last time the data in the feed was updated.
`ttl` | Yes | Non-negative integer | Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).
`version` <br/>*(added in v1.1)* | Yes | String | GBFS version number to which the feed confirms, according to the versioning framework.
`data` | Yes | Object | Response data in the form of name:value pairs.


Example:
```jsonc
{
  "last_updated": 1434054678,
  "ttl": 3600,
  "version": "2.0",
  "data": {
    "name": "Citi Bike",
    "system_id": "citibike_com"
  }
}
```

### gbfs.json

Field Name | Required | Type | Defines
---|---|---|---
`language` | Yes | Language | The language that will be used throughout the rest of the files. It must match the value in the [system_information.json](#system_informationjson) file.
\-&nbsp;`feeds` | Yes | Array | An array of all of the feeds that are published by this auto-discovery file. Each element in the array is an object with the keys below.
&emsp;\-&nbsp;`name` | Yes | String | Key identifying the type of feed this is. The key must be the base file name defined in the spec for the corresponding feed type (`system_information` for `system_information.json` file, `station_information` for `station_information.json` file).
&emsp;\-&nbsp;`url` | Yes | URL | URL for the feed. Note that the actual feed endpoints (urls) may not be defined in the `file_name.json` format. For example, a valid feed endpoint could end with `station_info` instead of `station_information.json`.

Example:

```jsonc
{
  "last_updated": 1434054678,
  "ttl": 0,
  "version": "2.0",
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

### gbfs_versions.json *(added in v1.1)*

Each expression of a GBFS feed describes all of the versions that are available.

The following fields are all attributes within the main "data" object for this feed.

Field Name | Required | Type | Defines
---|---|---|---
`versions` | Yes | Array | Contains one object, as defined below, for each of the available versions of a feed. The array must be sorted by increasing MAJOR and MINOR version number.
\-&nbsp;`version` | Yes | String | The semantic version of the feed in the form `X.Y`.
\-&nbsp;`url` | Yes | URL | URL of the corresponding gbfs.json endpoint.

```jsonc
{
  "last_updated": 1434054678,
  "ttl": 0,
  "version": "2.0",
  "data": {
    "versions": [
      {
        "version":"1.0",
        "url":"https://www.example.com/gbfs/1/gbfs"
      },
      {
        "version":"2.0",
        "url":"https://www.example.com/gbfs/2/gbfs"
      }
    ]
  }
}
```

### system_information.json
The following fields are all attributes within the main "data" object for this feed.

Field Name | Required | Type | Defines
---|---|---|---
`system_id` | Yes | ID | Identifier for this bike share system. This should be globally unique (even between different systems) - for example,  `bcycle_austin` or `biketown_pdx`. It is up to the publisher of the feed to guarantee uniqueness. This value is intended to remain the same over the life of the system.
`language` | Yes | Language | The language that will be used throughout the rest of the files. It must match the value in the [gbfs.json](#gbfsjson) file.
`name` | Yes | String | Name of the system to be displayed to customers.
`short_name` | Optional | String | Optional abbreviation for a system.
`operator` | Optional | String | Name of the operator.
`url` | Optional | URL | The URL of the bike share system.
`purchase_url` | Optional | URL | URL where a customer can purchase a membership.
`start_date` | Optional | Date | Date that the system began operations.
`phone_number` | Optional | Phone Number | A single voice telephone number for the specified system that presents the telephone number as typical for the system's service area. It can and should contain punctuation marks to group the digits of the number. Dialable text (for example, Capital Bikeshare’s "877-430-BIKE") is permitted, but the field must not contain any other descriptive text.
`email` | Optional | Email | Email address actively monitored by the operator’s customer service department. This email address should be a direct contact point where riders can reach a customer service representative.
`feed_contact_email` <br/>*(added in v1.1)* | Optional | Email | A single contact email address for consumers of this feed to report technical issues.
`timezone` | Yes | Timezone | The time zone where the system is located.
`license_id` <br/>*(added in v3.0-RC)* | Conditionally required | String | Required if the dataset is provided under a standard license. An identifier for a standard license from the [SPDX License List](https://spdx.org/licenses/). Provide `license_id` rather than `license_url` if the license is included in the SPDX License List. See the GBFS wiki for a [comparison of a subset of standard licenses](data-licenses.md). If the license_id or license_url fields are blank or omitted, this indicates that the feed is provided under the [Creative Commons Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/legalcode).
`license_url` | Conditionally required <br/>*(as of v3.0-RC)* | URL | Required if the dataset is  provided under a customized license. A fully qualified URL of a page that defines the license terms for the GBFS data for this system. Do not specify a `license_url` if `license_id` is specified. If the license_id or license_url fields are blank or omitted, this indicates that the feed is provided under the [Creative Commons Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/legalcode). *(as of v3.0-RC)*
`attribution_organization_name` <br/>*(added in v3.0-RC)* | Optional | String | If the feed license requires attribution, name of the organization to which attribution should be provided.
`attribution_url` <br/>*(added in v3.0-RC)* | Optional | URL | URL of the organization to which attribution should be provided.
`rental_apps` <br/>*(added in v1.1)* | Optional | Object | Contains rental app information in the android and ios JSON objects.
\-&nbsp;`android` <br/>*(added in v1.1)* | Optional | Object | Contains rental app download and app discovery information for the Android platform in the `store_uri` and `discovery_uri` fields. See [examples](#examples-added-in-v11) of how to use these fields and [supported analytics](#analytics-added-in-v11).
&emsp;- `store_uri` <br/>*(added in v1.1)* | Conditionally Required | URI | URI where the rental Android app can be downloaded from. Typically this will be a URI to an app store such as Google Play. If the URI points to an app store such as Google Play, the URI should follow Android best practices so the viewing app can directly open the URI to the native app store app instead of a website. <br><br> If a `rental_uris`.`android` field is populated then this field is required, otherwise it is optional. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Example value: `https://play.google.com/store/apps/details?id=com.abcrental.android`
&emsp;- `discovery_uri` <br/>*(added in v1.1)* | Conditionally Required | URI | URI that can be used to discover if the rental Android app is installed on the device (e.g., using [`PackageManager.queryIntentActivities()`](https://developer.android.com/reference/android/content/pm/PackageManager.html#queryIntentActivities)). This intent is used by viewing apps prioritize rental apps for a particular user based on whether they already have a particular rental app installed. <br><br>This field is required if a `rental_uris`.`android` field is populated, otherwise it is optional. <br><br>Example value: `com.abcrental.android://`
\-&nbsp;`ios` <br/>*(added in v1.1)* | Optional | Object | Contains rental information for the iOS platform in the `store_uri` and `discovery_uri` fields. See [examples](#examples-added-in-v11) of how to use these fields and [supported analytics](#analytics-added-in-v11).
&emsp;- `store_uri` <br/>*(added in v1.1)* | Conditionally Required | URI | URI where the rental iOS app can be downloaded from. Typically this will be a URI to an app store such as the Apple App Store. If the URI points to an app store such as the Apple App Store, the URI should follow iOS best practices so the viewing app can directly open the URI to the native app store app instead of a website. <br><br>If a `rental_uris`.`ios` field is populated then this field is required, otherwise it is optional. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Example value: `https://apps.apple.com/app/apple-store/id123456789`
&emsp;- `discovery_uri` <br/>*(added in v1.1)* | Conditionally Required | URI | URI that can be used to discover if the rental iOS app is installed on the device (e.g., using [`UIApplication canOpenURL:`](https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl?language=objc)). This intent is used by viewing apps prioritize rental apps for a particular user based on whether they already have a particular rental app installed. <br><br>This field is required if a `rental_uris`.`ios` field is populated, otherwise it is optional. <br><br>Example value: `com.abcrental.ios://`

### station_information.json
All stations included in station_information.json are considered public (e.g., can be shown on a map for public use). If there are private stations (such as Capital Bikeshare’s White House station), these should not be included here.

Field Name | Required | Type | Defines
---|---|---|---
`stations` | Yes | Array | Array that contains one object per station as defined below.
\-&nbsp;`station_id` | Yes | ID | Identifier of a station.
\-&nbsp;`name` | Yes | String | Public name of the station.
\-&nbsp;`short_name` | No | String | Short name or other type of identifier.
\-&nbsp;`lat` | Yes | Latitude | The latitude of station.
\-&nbsp;`lon` | Yes | Longitude | The longitude of station.
\-&nbsp;`address` | Optional | String | Address (street number and name) where station is located. This must be a valid address, not a free-form text description (see "cross_street" below).
\-&nbsp;`cross_street` | Optional | String | Cross street or landmark where the station is located.
\-&nbsp;`region_id` | Optional | ID | Identifier of the region where station is located. See [system_regions.json](#system_regionsjson).
\-&nbsp;`post_code` | Optional | String | Postal code where station is located.
\-&nbsp;`rental_methods` | Optional | Array | Payment methods accepted at this station. <br /> Current valid values are:<br /> <ul><li>`KEY` (e.g. operator issued bike key / fob / card)</li><li>`CREDITCARD`</li><li>`PAYPASS`</li><li>`APPLEPAY`</li><li>`ANDROIDPAY`</li><li>`TRANSITCARD`</li><li>`ACCOUNTNUMBER`</li><li>`PHONE`</li></ul>
\-&nbsp;`capacity` | Optional | Non-negative integer | Number of total docking points installed at this station, both available and unavailable.
\-&nbsp;`rental_uris` <br/>*(added in v1.1)* | Optional | Object | Contains rental URIs for Android, iOS, and web in the android, ios, and web fields. See [examples](#examples-added-in-v11) of how to use these fields and [supported analytics](#analytics-added-in-v11).
&emsp;\-&nbsp;`android` <br/>*(added in v1.1)* | Optional | URI | URI that can be passed to an Android app with an `android.intent.action.VIEW` Android intent to support Android Deep Links (https://developer.android.com/training/app-links/deep-linking). Please use Android App Links (https://developer.android.com/training/app-links) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI should be a deep link specific to this station, and should not be a general rental page that includes information for more than one station. The deep link should take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native Android rental app. <br><br>Note that URIs do not necessarily include the station_id for this station - other identifiers can be used by the rental app within the URI to uniquely identify this station. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Android App Links example value: `https://www.abc.com/app?sid=1234567890&platform=android` <br><br>Deep Link (without App Links) example value: `com.abcrental.android://open.abc.app/app?sid=1234567890`
&emsp;\-&nbsp;`ios` <br/>*(added in v1.1)* | Optional | URI | URI that can be used on iOS to launch the rental app for this station. More information on this iOS feature can be found [here](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/communicating_with_other_apps_using_custom_urls?language=objc). Please use iOS Universal Links (https://developer.apple.com/ios/universal-links/) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI should be a deep link specific to this station, and should not be a general rental page that includes information for more than one station.  The deep link should take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native iOS rental app. <br><br>Note that the URI does not necessarily include the station_id - other identifiers can be used by the rental app within the URL to uniquely identify this station. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>iOS Universal Links example value: `https://www.abc.com/app?sid=1234567890&platform=ios` <br><br>Deep Link (without Universal Links) example value: `com.abcrental.ios://open.abc.app/app?sid=1234567890`
&emsp;\-&nbsp;`web` <br/>*(added in v1.1)* | Optional | URL | URL that can be used by a web browser to show more information about renting a vehicle at this station. <br><br>This URL should be a deep link specific to this station, and should not be a general rental page that includes information for more than one station.  The deep link should take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported for web browsers. <br><br>Example value: `https://www.abc.com/app?sid=1234567890`

### station_status.json
Describes the capacity and rental availability of a station.

Field Name | Required | Type | Defines
---|---|---|---
`stations` | Yes | Array | Array that contains one object per station in the system as defined below.
\-&nbsp;`station_id` | Yes | ID | Identifier of a station see [station_information.json](#station_informationjson).
\-&nbsp;`num_bikes_available` | Yes | Non-negative integer | Number of bikes available for rental. Number of functional bikes physically at the station. To know if the bikes are available for rental, see `is_renting`.
\-&nbsp;`num_bikes_disabled` | Optional | Non-negative integer | Number of disabled bikes at the station. Vendors who do not want to publicize the number of disabled bikes or docks in their system can opt to omit station capacity (in station_information), `num_bikes_disabled` and `num_docks_disabled` *(as of v2.0)*. If station capacity is published, then broken docks/bikes can be inferred (though not specifically whether the decreased capacity is a broken bike or dock).
\-&nbsp;`num_docks_available` | Conditionally required <br/>*(as of v2.0)* | Non-negative integer | Required except for stations that have unlimited docking capacity (e.g. virtual stations) *(as of v2.0)*. Number of functional docks physically at the station. To know if the docks are accepting bike returns, see `is_returning`.
\-&nbsp;`num_docks_disabled` | Optional | Non-negative integer | Number of empty but disabled dock points at the station.
\-&nbsp;`is_installed` | Yes | Boolean | Is the station currently on the street? <br /><br />`true` - Station is installed on the street.<br />`false` - Station is not installed on the street.
\-&nbsp;`is_renting` | Yes | Boolean | Is the station currently renting bikes? <br /><br />`true` - Station is renting bikes. Even if the station is empty, if it is set to allow rentals this value should be 1.<br /> `false` - Station is not renting bikes.
\-&nbsp;`is_returning` | Yes | Boolean | Is the station accepting bike returns? <br /><br />`true` - Station is accepting bike returns. If a station is full but would allow a return if it was not full, then this value should be 1.<br /> `false` - Station is not accepting bike returns.
\-&nbsp;`last_reported` | Yes | Timestamp | The last time this station reported its status.

### free_bike_status.json
Describes bikes that are not at a station and are not currently in the middle of an active ride.

Field Name | Required | Type | Defines
---|---|---|---
`bikes` | Yes | Array | Array that contains one object per bike that is currently stopped as defined below.
\-&nbsp;`bike_id` | Yes | ID | Identifier of a bike, rotated to a random string, at minimum, after each trip to protect privacy *(as of v2.0)*. Note: Persistent bike_id, published publicly, could pose a threat to individual traveler privacy.
\-&nbsp;`lat` | Yes | Latitude | Latitude of the bike.
\-&nbsp;`lon` | Yes | Longitude | Longitude of the bike.
\-&nbsp;`is_reserved` | Yes | Boolean | Is the bike currently reserved? <br /><br /> `true` - Bike is currently reserved. <br /> `false` - Bike is not currently reserved.
\-&nbsp;`is_disabled` | Yes | Boolean | Is the bike currently disabled (broken)? <br /><br /> `true` - Bike is currently disabled. <br /> `false` - Bike is not currently disabled.
\-&nbsp;`rental_uris` <br/>*(added in v1.1)* | Optional | Object | JSON object that contains rental URIs for Android, iOS, and web in the android, ios, and web fields. See [examples](#examples-added-in-v11) of how to use these fields and [supported analytics](#analytics-added-in-v11).
&emsp;\-&nbsp;`android` <br/>*(added in v1.1)* | Optional | URI | URI that can be passed to an Android app with an android.intent.action.VIEW Android intent to support Android Deep Links (https://developer.android.com/training/app-links/deep-linking). Please use Android App Links (https://developer.android.com/training/app-links) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI should be a deep link specific to this bike, and should not be a general rental page that includes information for more than one bike. The deep link should take users directly to this bike, without any prompts, interstitial pages, or logins. Make sure that users can see this bike even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native Android rental app. <br><br>Note that URIs do not necessarily include the bike_id for this bike - other identifiers can be used by the rental app within the URI to uniquely identify this bike. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Android App Links example value: `https://www.abc.com/app?sid=1234567890&platform=android` <br><br>Deep Link (without App Links) example value: `com.abcrental.android://open.abc.app/app?sid=1234567890`
&emsp;\-&nbsp;`ios` <br/>*(added in v1.1)* | Optional | URI | URI that can be used on iOS to launch the rental app for this bike. More information on this iOS feature can be found [here](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/communicating_with_other_apps_using_custom_urls?language=objc). Please use iOS Universal Links (https://developer.apple.com/ios/universal-links/) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI should be a deep link specific to this bike, and should not be a general rental page that includes information for more than one bike.  The deep link should take users directly to this bike, without any prompts, interstitial pages, or logins. Make sure that users can see this bike even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native iOS rental app. <br><br>Note that the URI does not necessarily include the bike_id - other identifiers can be used by the rental app within the URL to uniquely identify this bike. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>iOS Universal Links example value: `https://www.abc.com/app?sid=1234567890&platform=ios` <br><br>Deep Link (without Universal Links) example value: `com.abcrental.ios://open.abc.app/app?sid=1234567890`
&emsp;\-&nbsp;`web` <br/>*(added in v1.1)* | Optional | URL | URL that can be used by a web browser to show more information about renting a vehicle at this bike. <br><br>This URL should be a deep link specific to this bike, and should not be a general rental page that includes information for more than one bike.  The deep link should take users directly to this bike, without any prompts, interstitial pages, or logins. Make sure that users can see this bike even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported for web browsers. <br><br>Example value: `https://www.abc.com/app?sid=1234567890`

### system_hours.json
Describes the system hours of operation.

Field Name | Required | Type | Defines
---|---|---|---
`rental_hours` | Yes | Array | Array of objects as defined below. The array must contain a minimum of one object identifying hours for every day of the week or a maximum of two for each day of the week  objects ( one for each user type).
\-&nbsp;`user_types` | Yes | Array | An array of `member` and/or `nonmember` value(s). This indicates that this set of rental hours applies to either members or non-members only.
\-&nbsp;`days` | Yes | Array | An array of abbreviations (first 3 letters) of English names of the days of the week for which this object applies (e.g. `["mon", "tue", "wed", "thu", "fri", "sat, "sun"]`). Rental hours must not be defined more than once for each day and user type.
\-&nbsp;`start_time` | Yes | Time | Start time for the hours of operation of the system in the time zone indicated in system_information.json.
\-&nbsp;`end_time` | Yes | Time | End time for the hours of operation of the system in the time zone indicated in system_information.json.

Example:
```jsonc
{
  "last_updated": 1434054678,
  "ttl": 0,
  "version": "2.0",
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

Field Name | Required | Type | Defines
---|---|---|---
`calendars` | Yes | Array | Array of objects describing the system operational calendar. A minimum of one calendar object is required. If start and end dates are the same every year, then start_year and end_year should be omitted.
\-&nbsp;`start_month` | Yes | Non-negative Integer | Starting month for the system operations (`1`-`12`).
\-&nbsp;`start_day` | Yes | Non-negative Integer | Starting date for the system operations (`1`-`31`).
\-&nbsp;`start_year` | Optional | Non-negative Integer | Starting year for the system operations.
\-&nbsp;`end_month` | Yes | Non-negative Integer | Ending month for the system operations (`1`-`12`).
\-&nbsp;`end_day` | Yes | Non-negative Integer | Ending date for the system operations (`1`-`31`).
\-&nbsp;`end_year` | Optional | Non-negative Integer | Ending year for the system operations.


### system_regions.json
Describe regions for a system that is broken up by geographic or political region.

Field Name | Required | Type | Defines
---|---|---|---
`regions` | Yes | Array | Array of objects as defined below.
\-&nbsp;`region_id` | Yes | ID | Identifier for the region.
\-&nbsp;`name` | Yes | String | Public name for this region.

### system_pricing_plans.json
Describes pricing for the system.

Field Name | Required | Type | Defines
---|---|---|---
`plans` | Yes | Array | Array of objects as defined below.
\-&nbsp;`plan_id` | Yes | ID | Identifier for a pricing plan in the system.
\-&nbsp;`url` | Optional | URL | URL where the customer can learn more about this pricing plan.
\-&nbsp;`name` | Yes | String | Name of this pricing plan.
\-&nbsp;`currency` | Yes | String | Currency used to pay the fare. <br /><br /> This pricing is in ISO 4217 code: http://en.wikipedia.org/wiki/ISO_4217 <br />(e.g. `CAD` for Canadian dollars, `EUR` for euros, or `JPY` for Japanese yen.)
\-&nbsp;`price` | Yes | Non-negative float OR String | Fare price, in the unit specified by currency. If String, must be in decimal monetary value.
\-&nbsp;`is_taxable` | Yes | Boolean | Will additional tax be added to the base price?<br /><br />`true` - Yes.<br />  `false` - No.  <br /><br />`false` may be used to indicate that tax is not charged or that tax is included in the base price.
\-&nbsp;`description` | Yes | String | Customer-readable description of the pricing plan. This should include the duration, price, conditions, etc. that the publisher would like users to see.

### system_alerts.json
This feed is intended to inform customers about changes to the system that do not fall within the normal system operations. For example, system closures due to weather would be listed here, but a system that only operated for part of the year would have that schedule listed in the system_calendar.json feed.<br />
Obsolete alerts should be removed so the client application can safely present to the end user everything present in the feed.

Field Name | Required | Type | Defines
---|---|---|---
`alerts` | Yes | Array | Array of objects each indicating a system alert as defined below.
\-&nbsp;`alert_id` | Yes | ID | Identifier for this alert.
\-&nbsp;`type` | Yes | Enum | Valid values are:<br /><br /><ul><li>`SYSTEM_CLOSURE`</li><li>`STATION_CLOSURE`</li><li>`STATION_MOVE`</li><li>`OTHER`</li></ul>
\-&nbsp;`times` | Optional | Array | Array of objects with the fields `start` and `end` indicating when the alert is in effect (e.g. when the system or station is actually closed, or when it is scheduled to be moved).
&emsp;\-&nbsp;`start` | Yes | Timestamp | Start time of the alert.
&emsp;\-&nbsp;`end` | Optional | Timestamp | End time of the alert. If there is currently no end time planned for the alert, this can be omitted.
\-&nbsp;`station_ids` | Optional | Array | If this is an alert that affects one or more stations, include their ID(s). Otherwise omit this field. If both `station_id` and `region_id` are omitted, this alert affects the entire system.
\-&nbsp;`region_ids` | Optional | Array | If this system has regions, and if this alert only affects certain regions, include their ID(s). Otherwise, omit this field. If both `station_id`s and `region_id`s are omitted, this alert affects the entire system.
\-&nbsp;`url` | Optional | URL | URL where the customer can learn more information about this alert.
\-&nbsp;`summary` | Yes | String | A short summary of this alert to be displayed to the customer.
\-&nbsp;`description` | Optional | String | Detailed description of the alert.
\-&nbsp;`last_updated` | Optional | Timestamp | Indicates the last time the info for the alert was updated.

## Deep Links *(added in v1.1)*

Deep links to iOS, Android, and web apps are supported via URIs in the `system_information.json`, `station_information.json`, and `free_bike_status.json` files. The following sections describe how analytics can be added to these URIs, as well as some examples.

### Analytics *(added in v1.1)*

In all of the rental URI fields, a viewing app can report the origin of a deep link to request to a rental app by appending the `client_id` *(added in v1.1)* parameter to the URI along with the domain name for the viewing app.

For example, if Google is the viewing app, it can append:

`client_id=google.com`

...to the URI field to report that Google is the originator of the deep link request. If the Android URI is:

`com.abcrental.android://open.abc.app/stations?id=1234567890`

...then the URI used by Google would be: `com.abcrental.android://open.abc.app/stations?id=1234567890&client_id=google.com`

Other supported parameters include:

1. `ad_id` *(added in v1.1)* - Advertising ID issued to the viewing app (e.g., IFDA on iOS)
2. `token` *(added in v1.1)* - A token identifier that was issued by the rental app to the viewing app.

### Examples *(added in v1.1)*

#### Example 1 - App Links on Android and Universal Links on iOS are supported:

*system_information.json*

```jsonc
{
  "last_updated": 1572447999,
  "data": {
  "system_id": "abc_cityname",
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

```jsonc
"stations": [
  {
    "station_id": "425",
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

```jsonc
{
  "last_updated": 1572447999,
  "data": {
    "system_id": "abc_cityname",
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

```jsonc
"stations": [
  {
    "station_id": "425",
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

```jsonc
"stations": [
  {
    "station_id":"425",
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
