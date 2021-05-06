
# General Bikeshare Feed Specification (GBFS)

This document explains the types of files and data that comprise the General Bikeshare Feed Specification (GBFS) and defines the fields used in all of those files.

# Reference version

This documentation refers to **v3.0-RC (release candidate)**.<br>
**For the current version see [**version 2.2**](https://github.com/NABSA/gbfs/blob/v2.2/gbfs.md).** For past and upcoming versions see the [README](README.md#read-the-spec--version-history).

## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119), [BCP 14](https://tools.ietf.org/html/bcp14) and [RFC8174](https://tools.ietf.org/html/rfc8174) when, and only when, they appear in all capitals, as shown here.

## Table of Contents

* [Introduction](#introduction)
* [Version Endpoints](#version-endpoints)
* [Term Definitions](#term-definitions)
* [Files](#files)
* [Accessibility](#accessibility)
* [File Requirements](#file-requirements)
* [Licensing](#licensing)
* [Field Types](#field-types)
* [Files](#files)
    * [gbfs.json](#gbfsjson)
    * [gbfs_versions.json](#gbfs_versionsjson-added-in-v11) *(added in v1.1)*
    * [system_information.json](#system_informationjson)
    * [vehicle_types.json](#vehicle_typesjson-added-in-v21) *(added in v2.1)*
    * [station_information.json](#station_informationjson)
    * [station_status.json](#station_statusjson)
    * [free_bike_status.json](#free_bike_statusjson)
    * [system_hours.json](#system_hoursjson)
    * [system_calendar.json](#system_calendarjson)
    * [system_regions.json](#system_regionsjson)
    * [system_pricing_plans.json](#system_pricing_plansjson)
    * [system_alerts.json](#system_alertsjson)
    * [geofencing_zones.json](#geofencing_zonesjson-added-in-v21) *(added in v2.1)*
* [Deep Links - Analytics and Examples](#deep-links-added-in-v11) *(added in v1.1)*

## Introduction

This specification has been designed with the following concepts in mind:

* Provide the status of the system at this moment
* Do not provide information whose primary purpose is historical

The specification supports real-time travel advice in GBFS-consuming applications.

## Version Endpoints

The version of the GBFS specification to which a feed conforms is declared in the `version` field in all files. See [Output Format](#output-format).<br />

GBFS Best Practice defines that:<br />

_GBFS producers_ SHOULD provide endpoints that conform to both the current specification long term support (LTS) branch as well as the latest release branch within at least 3 months of a new spec _MAJOR_ or _MINOR_ version release. It is not necessary to support more than one _MINOR_ release of the same _MAJOR_ release group because _MINOR_ releases are backwards-compatible. See [specification versioning](https://github.com/NABSA/gbfs/blob/master/README.md#specification-versioning)<br />

_GBFS consumers_ SHOULD, at a minimum, support the current LTS branch. It is highly RECOMMENDED that GBFS consumers support later releases.<br />

Default GBFS feed URLs, e.g. `https://www.example.com/data/gbfs.json` or `https://www.example.com/data/fr/system_information.json` MUST direct consumers to the feed that conforms to the current LTS documentation branch.

## Term Definitions

This section defines terms that are used throughout this document.

* JSON - (JavaScript Object Notation) is a lightweight format for storing and transporting data. This document uses many terms defined by the JSON standard, including field, array, and object. (https://www.w3schools.com/js/js_json_datatypes.asp)
* Field - In JSON, a name/value pair consists of a field name (in double quotes), followed by a colon, followed by a value. (https://www.w3schools.com/js/js_json_syntax.asp)
* GeoJSON - GeoJSON is a format for encoding a variety of geographic data structures. (https://geojson.org/)
* REQUIRED - The field MUST be included in the dataset, and a value MUST be provided in that field for each record.
* OPTIONAL - The field MAY be omitted from the dataset. If an OPTIONAL column is included, some of the entries in that field MAY be empty strings. An omitted field is equivalent to a field that is empty.
* Conditionally REQUIRED - The field or file is REQUIRED under certain conditions, which are outlined in the field or file description. Outside of these conditions, this field or file is OPTIONAL.

## Files

File Name | REQUIRED | Defines
---|---|---
gbfs.json | Yes <br/>*(as of v2.0)* | Auto-discovery file that links to all of the other files published by the system.
gbfs_versions.json <br/>*(added in v1.1)* | OPTIONAL | Lists all feed endpoints published according to versions of the GBFS documentation.
system_information.json | Yes | Details including system operator, system location, year implemented, URL, contact info, time zone.
vehicle_types.json <br/>*(added in v2.1)* | Conditionally REQUIRED | Describes the types of vehicles that System operator has available for rent. REQUIRED of systems that include information about vehicle types in the `free_bike_status` file. If this file is not included, then all vehicles in the feed are assumed to be non-motorized bicycles.
station_information.json | Conditionally REQUIRED | List of all stations, their capacities and locations. REQUIRED of systems utilizing docks.
station_status.json | Conditionally REQUIRED | Number of available vehicles and docks at each station and station availability. REQUIRED of systems utilizing docks.
free_bike_status.json | Conditionally REQUIRED | *(as of v2.1)* Describes all vehicles that are not currently in active rental. REQUIRED for free floating (dockless) vehicles. OPTIONAL for station based (docked) vehicles. Vehicles that are part of an active rental MUST NOT appear in this feed.
system_hours.json | OPTIONAL | Hours of operation for the system.
system_calendar.json | OPTIONAL | Dates of operation for the system.
system_regions.json | OPTIONAL | Regions the system is broken up into.
system_pricing_plans.json | OPTIONAL | System pricing scheme.
system_alerts.json | OPTIONAL | Current system alerts.
geofencing_zones.json <br/>*(added in v2.1)* | OPTIONAL | Geofencing zones and their associated rules and attributes.

## Accessibility

Datasets SHOULD be published at an easily accessible, public, permanent URL. (e.g., https://www.example.com/gbfs/v3/gbfs.json). The URL SHOULD be directly available without requiring login to access the file to facilitate download by consuming software applications.

To be compliant with GBFS, all systems MUST have an entry in the [systems.csv](https://github.com/NABSA/gbfs/blob/master/systems.csv) file.

### Feed Availability

Automated tools for application performance monitoring SHOULD be used to ensure feed availability.
Producers SHOULD provide a technical contact who can respond to feed outages in the `feed_contact_email` field in the `system_information.json` file.

### Seasonal Shutdowns, Disruptions of Service

Feeds SHOULD continue to be published during seasonal or temporary shutdowns.  Feed URLs SHOULD NOT return a 404.  An empty bikes array SHOULD be returned by `free_bike_status.json`. Stations in `station_status.json` SHOULD be set to `is_renting:false`, `is_returning:false` and `is_installed:false` where applicable. Seasonal shutdown dates SHOULD be reflected in `system_calendar.json`.

Announcements for disruptions of service, including disabled stations or temporary closures of stations or systems SHOULD be made in `system_alerts.json`.

## File Requirements

* All files SHOULD be valid JSON
* All files in the spec MAY be published at a URL path or with an alternate name (e.g., `station_info` instead of `station_information.json`) *(as of v2.0)*.
* All data SHOULD be UTF-8 encoded
* Line breaks SHOULD be represented by unix newline characters only (\n)
* Pagination is not supported.

### File Distribution

* Files are distributed as individual HTTP endpoints.
    * REQUIRED files MUST NOT 404. They MUST return a properly formatted JSON file as defined in [Output Format](#output-format).
    * OPTIONAL files MAY 404. A 404 of an OPTIONAL file SHOULD NOT be considered an error.

### Auto-Discovery

Publishers SHOULD implement auto-discovery of GBFS feeds by linking to the location of the `gbfs.json` auto-discovery endpoint.

* The location of the auto-discovery file SHOULD be provided in the HTML area of the shared mobility landing page hosted at the URL specified in the URL field of the `system_infomation.json` file.
* This is referenced via a _link_ tag with the following format:
    * `<link rel="gbfs" type="application/json" href="https://www.example.com/data/gbfs.json" />`
    * References:
      * https://microformats.org/wiki/existing-rel-values
      * https://microformats.org/wiki/rel-faq#How_is_rel_used
* A shared mobility landing page MAY contain links to auto-discovery files for multiple systems.

### Localization

* Each set of data files SHOULD be distributed in a single language as defined in system_information.json.
* A system that wants to publish feeds in multiple languages SHOULD do so by publishing multiple distributions, such as:
    * `https://www.example.com/data/en/system_information.json`
    * `https://www.example.com/data/fr/system_information.json`

### Text Fields and Naming

Rich text SHOULD NOT be stored in free form text fields. Fields SHOULD NOT contain HTML.

All customer-facing text strings (including station names) SHOULD use Mixed Case (not ALL CAPS), following local conventions for capitalization of place names on displays capable of displaying lower case characters.

   * Examples:
     * Central Park South
     * Villiers-sur-Marne
     * Market Street

Abbreviations SHOULD NOT be used for names and other text (e.g. St. for Street) unless a location is called by its abbreviated name (e.g. “JFK Airport”). Abbreviations may be problematic for accessibility by screen reader software and voice user interfaces. Consuming software can be engineered to reliably convert full words to abbreviations for display, but converting from abbreviations to full words is prone to more risk of error.

Names used for stations, virtual stations and geofenced areas SHOULD be human readable. Naming conventions used for locations SHOULD consider a variety of use cases including both text and maps.

Descriptions SHOULD NOT include information so specific that it could be used in tracking of vehicles or trips.

### Coordinate Precision

Feeds SHOULD provide 6 digits (0.000001) of precision for decimal degrees lat/lon coordinates.

Decimal places | Degrees | Distance at the Equator
---|---|---
0|1.0|111 km
1|0.1|11.1 km
2|0.01|1.11 km
3|0.001|111 m
4|0.0001|11.1 m
5|0.00001|1.11 m
**6**|**0.000001**|**0.11 m**
7|0.0000001|1.11 cm

### Data Latency

The data returned by the near-realtime endpoints `station_status.json` and `free_bike_status.json` SHOULD be as close to realtime as possible, but in no case should it be more than 5 minutes out-of-date.  Appropriate values SHOULD be set using the `ttl` property for each endpoint based on how often the data in feeds are refreshed or updated. For near-realtime endpoints where the data should always be refreshed the `ttl` value SHOULD be `0`. The`last_updated` timestamp represents the publisher's knowledge of the current state of the system at this point in time. The `last_reported` timestamp represents the last time a station or vehicle reported its status to the operator's backend.

## Licensing

It is RECOMMENDED that all GBFS data sets be offered under an open data license. Open data licenses allow consumers to freely use, modify and share GBFS data for any purpose in perpetuity. Licensing of GBFS data provides certainty to GBFS consumers, allowing them to integrate GBFS data into their work. All GBFS data sets SHOULD specify a license using the `license_id` field with an [SPDX identifier](https://spdx.org/licenses/) or by using the `license_url` field with a URL pointing to a custom license in `system_information.json`. See the GBFS repo for a [comparison of a subset of standard licenses](https://github.com/NABSA/gbfs/blob/master/data-licenses.md).

## Field Types

* Array - A JSON element consisting of an ordered sequence of zero or more values.
* Boolean - One of two possible values, `true`or `false`. Boolean values MUST be JSON booleans, not strings (i.e. `true` or `false`, not `"true"` or `"false"`). *(as of v2.0)*
* Date - Service day in the YYYY-MM-DD format. Example: `2019-09-13` for September 13th, 2019.
* Email - An email address. Example: `example@example.com`
* Enum (Enumerable values) - An option from a set of predefined constants in the "Defines" column. Enum values SHOULD be lowercase.
Example: The `rental_methods` field contains values `creditcard`, `paypass`, etc...
* Float *(added in v2.1)* - A 32-bit floating point number.
* GeoJSON FeatureCollection - A FeatureCollection as described by the IETF RFC 7946 https://tools.ietf.org/html/rfc7946#section-3.3.
* GeoJSON Multipolygon - A Geometry Object as described by the IETF RFC https://tools.ietf.org/html/rfc7946#section-3.1.7.
* ID - Should be represented as a string that identifies that particular entity. An ID:
    * MUST be unique within like fields (e.g. `station_id` MUST be unique among stations)
    * does not have to be globally unique, unless otherwise specified
    * MUST NOT contain spaces
    * MUST be persistent for a given entity (station, plan, etc). An exception is floating bike `bike_id`, which MUST NOT be persistent for privacy reasons (see `free_bike_status.json`). *(as of v2.0)*
* Language - An IETF BCP 47 language code. For an introduction to IETF BCP 47, refer to https://www.rfc-editor.org/rfc/bcp/bcp47.txt and https://www.w3.org/International/articles/language-tags/. Examples: `en` for English, `en-US` for American English, or `de` for German.
* Latitude - WGS84 latitude in decimal degrees. The value MUST be greater than or equal to -90.0 and less than or equal to 90.0. Example: `41.890169` for the Colosseum in Rome.
* Longitude - WGS84 longitude in decimal degrees. The value MUST be greater than or equal to -180.0 and less than or equal to 180.0. Example: `12.492269` for the Colosseum in Rome.
* Non-negative Float - A 32-bit floating point number greater than or equal to 0.
* Non-negative Integer - An integer greater than or equal to 0.
* Object - A JSON element consisting of key-value pairs (fields).
* String - Can only contain text. Strings MUST NOT contain any formatting codes (including HTML) other than newlines.
* Time - Service time in the HH:MM:SS format for the time zone indicated in system_information.json (00:00:00 - 47:59:59). Time can stretch up to one additional day in the future to accommodate situations where, for example, a system was open from 11:30pm - 11pm the next day (i.e. 23:30:00-47:00:00).
* Timestamp - Timestamp fields MUST be represented as integers in POSIX time. (e.g., the number of seconds since January 1st 1970 00:00:00 UTC)
* Timezone - TZ timezone from the https://www.iana.org/time-zones. Timezone names never contain the space character but MAY contain an underscore. Refer to https://en.wikipedia.org/wiki/List_of_tz_zones for a list of valid values.
Example: `Asia/Tokyo`, `America/Los_Angeles` or `Africa/Cairo`.
* URI *(added in v1.1)* - A fully qualified URI that includes the scheme (e.g., `com.example.android://`), and any special characters in the URI MUST be correctly escaped. See the following https://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URI values. Note that URIs MAY be URLs.
* URL - A fully qualified URL that includes `http://` or `https://`, and any special characters in the URL MUST be correctly escaped. See the following https://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URL values.

### Extensions Outside of the Specification

To accommodate the needs of feed producers and consumers prior to the adoption of a change, additional fields can be added to feeds even if these fields are not part of the official specification. Custom extensions that may provide value to the GBFS community and align with the [GBFS Guiding Principles](https://github.com/NABSA/gbfs/blob/master/README.md#guiding-principles) SHOULD be proposed for inclusion in the specification through the change process.

Field names of extensions SHOULD be prefixed with an underscore ( _) character. It is strongly RECOMMENDED that these additional fields be documented on the [wiki](https://github.com/NABSA/gbfs/wiki) page of the GBFS repository in this format:

Submitted by | Field Name | File Name | Defines
---|---|---|---
Publisher's name|_field_name|Name of GBFS endpoint where field is used|Description of purpose of use

## JSON Files

### Output Format

Every JSON file presented in this specification contains the same common header information at the top level of the JSON response object:

Field Name | REQUIRED | Type | Defines
---|---|---|---
`last_updated` | Yes | Timestamp | Indicates the last time data in the feed was updated. This timestamp represents the publisher's knowledge of the current state of the system at this point in time.
`ttl` | Yes | Non-negative integer | Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).
`version` <br/>*(added in v1.1)* | Yes | String | GBFS version number to which the feed confirms, according to the versioning framework.
`data` | Yes | Object | Response data in the form of name:value pairs.

##### Example:

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 3600,
  "version": "3.0",
  "data": {
    "name": "Example Bike Rental",
    "system_id": "example_cityname",
    "timezone": "US/Central",
    "language": "en"
  }
}
```

### gbfs.json

The `gbfs.json` discovery file SHOULD represent a single system or geographic area in which vehicles are operated. The location (URL) of the `gbfs.json` file SHOULD be made available to the public using the specification’s [auto-discovery](#auto-discovery) function.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`language` | Yes | Language | The language that will be used throughout the rest of the files. It MUST match the value in the [system_information.json](#system_informationjson) file.
\-&nbsp;`feeds` | Yes | Array | An array of all of the feeds that are published by this auto-discovery file. Each element in the array is an object with the keys below.
&emsp;\-&nbsp;`name` | Yes | String | Key identifying the type of feed this is. The key MUST be the base file name defined in the spec for the corresponding feed type (`system_information` for `system_information.json` file, `station_information` for `station_information.json` file).
&emsp;\-&nbsp;`url` | Yes | URL | URL for the feed. Note that the actual feed endpoints (urls) MAY NOT be defined in the `file_name.json` format. For example, a valid feed endpoint could end with `station_info` instead of `station_information.json`.

##### Example:

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
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

Field Name | REQUIRED | Type | Defines
---|---|---|---
`versions` | Yes | Array | Contains one object, as defined below, for each of the available versions of a feed. The array MUST be sorted by increasing MAJOR and MINOR version number.
\-&nbsp;`version` | Yes | String | The semantic version of the feed in the form `X.Y`.
\-&nbsp;`url` | Yes | URL | URL of the corresponding gbfs.json endpoint.

##### Example:

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
  "data": {
    "versions": [
      {
        "version": "2.0",
        "url": "https://www.example.com/gbfs/2/gbfs"
      },
      {
        "version": "3.0",
        "url": "https://www.example.com/gbfs/3/gbfs"
      }
    ]
  }
}
```

### system_information.json

The following fields are all attributes within the main "data" object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`system_id` | Yes | ID | This is a globally unique identifier for the vehicle share system.  It is up to the publisher of the feed to guarantee uniqueness and MUST be checked against existing `system_id` fields in [systems.txt](https://github.com/NABSA/gbfs/blob/master/systems.csv) to ensure this. This value is intended to remain the same over the life of the system. <br><br>Each distinct system or geographic area in which vehicles are operated SHOULD have its own `system_id`. Systems IDs SHOULD be recognizable as belonging to a particular system as opposed to random strings - for example, `bcycle_austin` or `biketown_pdx`.
`language` | Yes | Language | The language that will be used throughout the rest of the files. It MUST match the value in the [gbfs.json](#gbfsjson) file.
`name` | Yes | String | Name of the system to be displayed to customers.
`short_name` | OPTIONAL | String | OPTIONAL abbreviation for a system.
`operator` | OPTIONAL | String | Name of the system operator.
`url` | OPTIONAL | URL | The URL of the vehicle share system.
`purchase_url` | OPTIONAL | URL | URL where a customer can purchase a membership.
`start_date` | OPTIONAL | Date | Date that the system began operations.
`phone_number` | OPTIONAL | Phone Number | This OPTIONAL field SHOULD contain a single voice telephone number for the specified system’s customer service department. It can and SHOULD contain punctuation marks to group the digits of the number. Dialable text (for example, Capital Bikeshare’s "877-430-BIKE") is permitted, but the field MUST NOT contain any other descriptive text.
`email` | OPTIONAL | Email | This OPTIONAL field SHOULD contain a single contact email address actively monitored by the operator’s customer service department. This email address SHOULD be a direct contact point where riders can reach a customer service representative.
`feed_contact_email` <br/>*(added in v1.1)* | OPTIONAL | Email | This OPTIONAL field SHOULD contain a single contact email for feed consumers to report technical issues with the feed.
`timezone` | Yes | Timezone | The time zone where the system is located.
`license_id` <br/>*(added in v3.0-RC)* | Conditionally REQUIRED | String | REQUIRED if the dataset is provided under a standard license. An identifier for a standard license from the [SPDX License List](https://spdx.org/licenses/). Provide `license_id` rather than `license_url` if the license is included in the SPDX License List. See the GBFS wiki for a [comparison of a subset of standard licenses](data-licenses.md). If the `license_id` and `license_url` fields are blank or omitted, this indicates that the feed is provided under the [Creative Commons Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/legalcode).
`license_url` | Conditionally REQUIRED <br/>*(as of v3.0-RC)* | URL | REQUIRED if the dataset is provided under a customized license. A fully qualified URL of a page that defines the license terms for the GBFS data for this system. Do not specify a `license_url` if `license_id` is specified. If the `license_id` and `license_url` fields are blank or omitted, this indicates that the feed is provided under the [Creative Commons Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/legalcode). *(as of v3.0-RC)*
`attribution_organization_name` <br/>*(added in v3.0-RC)* | OPTIONAL | String | If the feed license requires attribution, name of the organization to which attribution should be provided.
`attribution_url` <br/>*(added in v3.0-RC)* | OPTIONAL | URL | URL of the organization to which attribution should be provided.
`rental_apps` <br/>*(added in v1.1)* | OPTIONAL | Object | Contains rental app information in the android and ios JSON objects.
\-&nbsp;`android` <br/>*(added in v1.1)* | OPTIONAL | Object | Contains rental app download and app discovery information for the Android platform in the `store_uri` and `discovery_uri` fields. See [examples](#examples-added-in-v11) of how to use these fields and [supported analytics](#analytics-added-in-v11).
&emsp;- `store_uri` <br/>*(added in v1.1)* | Conditionally REQUIRED | URI | URI where the rental Android app can be downloaded from. Typically this will be a URI to an app store such as Google Play. If the URI points to an app store such as Google Play, the URI SHOULD follow Android best practices so the viewing app can directly open the URI to the native app store app instead of a website. <br><br> If a `rental_uris`.`android` field is populated then this field is REQUIRED, otherwise it is OPTIONAL. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Example value: `https://play.google.com/store/apps/details?id=com.example.android`
&emsp;- `discovery_uri` <br/>*(added in v1.1)* | Conditionally REQUIRED | URI | URI that can be used to discover if the rental Android app is installed on the device (e.g., using [`PackageManager.queryIntentActivities()`](https://developer.android.com/reference/android/content/pm/PackageManager.html#queryIntentActivities)). This intent is used by viewing apps to prioritize rental apps for a particular user based on whether they already have a particular rental app installed. <br><br>This field is REQUIRED if a `rental_uris`.`android` field is populated, otherwise it is OPTIONAL. <br><br>Example value: `com.example.android://`
\-&nbsp;`ios` <br/>*(added in v1.1)* | OPTIONAL | Object | Contains rental information for the iOS platform in the `store_uri` and `discovery_uri` fields. See [examples](#examples-added-in-v11) of how to use these fields and [supported analytics](#analytics-added-in-v11).
&emsp;- `store_uri` <br/>*(added in v1.1)* | Conditionally REQUIRED | URI | URI where the rental iOS app can be downloaded from. Typically this will be a URI to an app store such as the Apple App Store. If the URI points to an app store such as the Apple App Store, the URI SHOULD follow iOS best practices so the viewing app can directly open the URI to the native app store app instead of a website. <br><br>If a `rental_uris`.`ios` field is populated then this field is REQUIRED, otherwise it is OPTIONAL. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Example value: `https://apps.apple.com/app/apple-store/id123456789`
&emsp;- `discovery_uri` <br/>*(added in v1.1)* | Conditionally REQUIRED | URI | URI that can be used to discover if the rental iOS app is installed on the device (e.g., using [`UIApplication canOpenURL:`](https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl?language=objc)). This intent is used by viewing apps to prioritize rental apps for a particular user based on whether they already have a particular rental app installed. <br><br>This field is REQUIRED if a `rental_uris`.`ios` field is populated, otherwise it is OPTIONAL. <br><br>Example value: `com.example.ios://`

##### Example:

```jsonc
{
  "last_updated": 1611598155,
  "ttl": 1800,
  "version": "3.0",
  "data": {
    "phone_number": "1-800-555-1234",
    "name": "Example Bike Rental",
    "operator": "Example Sharing, Inc",
    "start_date": "2010-06-10",
    "purchase_url": "https://www.example.com",
    "timezone": "US/Central",
    "license_url": "https://www.example.com/data-license.html",
    "short_name": "Example Bike Rental",
    "email": "customerservice@example.com",
    "url": "https://www.example.com",
    "feed_contact_email": "datafeed@example.com",
    "system_id": "example_cityname",
    "language": "en",
  }
}
```

### vehicle_types.json *(added in v2.1)*

REQUIRED of systems that include information about vehicle types in the `free_bike_status` file. If this file is not included, then all vehicles in the feed are assumed to be non-motorized bicycles. This file SHOULD be published by systems offering multiple vehicle types for rental, for example pedal bikes and ebikes. <br/>The following fields are all attributes within the main "data" object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`vehicle_types` | Yes | Array | Array that contains one object per vehicle type in the system as defined below.
\- `vehicle_type_id` | Yes | ID | Unique identifier of a vehicle type. See [Field Types](#field-types) above for ID field requirements.
\- `form_factor` | Yes | Enum | The vehicle's general form factor. <br /><br />Current valid values are:<br /><ul><li>`bicycle`</li><li>`car`</li><li>`moped`</li><li>`scooter`</li><li>`other`</li></ul>
\- `propulsion_type` | Yes | Enum | The primary propulsion type of the vehicle. <br /><br />Current valid values are:<br /><ul><li>`human` _(Pedal or foot propulsion)_</li><li>`electric_assist` _(Provides power only alongside human propulsion)_</li><li>`electric` _(Contains throttle mode with a battery-powered motor)_</li><li>`combustion` _(Contains throttle mode with a gas engine-powered motor)_</li></ul> This field was inspired by, but differs from the propulsion types field described in the [Open Mobility Foundation Mobility Data Specification](https://github.com/openmobilityfoundation/mobility-data-specification/blob/master/provider/README.md#propulsion-types).
\- `max_range_meters` | Conditionally REQUIRED | Non-negative float | If the vehicle has a motor (as indicated by having a value other than `human` in the `propulsion_type` field), this field is REQUIRED. This represents the furthest distance in meters that the vehicle can travel without recharging or refueling when it has the maximum amount of energy potential (for example, a full battery or full tank of gas).
\- `name` | OPTIONAL | String | The public name of this vehicle type.

##### Example:

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
  "data": {
    "vehicle_types": [
      {
        "vehicle_type_id": "abc123",
        "form_factor": "bicycle",
        "propulsion_type": "human",
        "name": "Example Basic Bike"
      },
      {
        "vehicle_type_id": "def456",
        "form_factor": "scooter",
        "propulsion_type": "electric",
        "name": "Example E-scooter V2",
        "max_range_meters": 12345
      },
      {
        "vehicle_type_id": "car1",
        "form_factor": "car",
        "propulsion_type": "combustion",
        "name": "Four-door Sedan",
        "max_range_meters": 523992
      }
    ]
  }
}
```

### station_information.json

All stations included in `station_information.json` are considered public (e.g., can be shown on a map for public use). If there are private stations (such as Capital Bikeshare’s White House station), these SHOULD NOT be included here. Any station that is represented in `station_information.json` MUST have a corresponding entry in `station_status.json`.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`stations` | Yes | Array | Array that contains one object per station as defined below.
\-&nbsp;`station_id` | Yes | ID | Identifier of a station.
\-&nbsp;`name` | Yes | String | The public name of the station for display in maps, digital signage and other text applications. Names SHOULD reflect the station location through the use of a cross street or local landmark. Abbreviations SHOULD NOT be used for names and other text (e.g. St. for Street) unless a location is called by its abbreviated name (e.g. “JFK Airport”). See [Text Fields and Naming](#text-fields-and-naming). <br>Examples: <ul><li>Broadway and East 22nd Street</li><li>Convention Center</li><li>Central Park South</li></ul>
\-&nbsp;`short_name` | OPTIONAL | String | Short name or other type of identifier.
\-&nbsp;`lat` | Yes | Latitude | Latitude of the station in decimal degrees. This field SHOULD have a precision of 6 decimal places (0.000001). See [Coordinate Precision](#coordinate-precision).
\-&nbsp;`lon` | Yes | Longitude | Longitude of the station in decimal degrees. This field SHOULD have a precision of 6 decimal places (0.000001). See [Coordinate Precision](#coordinate-precision).
\-&nbsp;`address` | OPTIONAL | String | Address (street number and name) where station is located. This MUST be a valid address, not a free-form text description. Example: 1234 Main Street
\-&nbsp;`cross_street` | OPTIONAL | String | Cross street or landmark where the station is located.
\-&nbsp;`region_id` | OPTIONAL | ID | Identifier of the region where station is located. See [system_regions.json](#system_regionsjson).
\-&nbsp;`post_code` | OPTIONAL | String | Postal code where station is located.
\-&nbsp;`rental_methods` | OPTIONAL | Array | Payment methods accepted at this station. <br /> Current valid values are:<br /> <ul><li>`key` (e.g. operator issued vehicle key / fob / card)</li><li>`creditcard`</li><li>`paypass`</li><li>`applepay`</li><li>`androidpay`</li><li>`transitcard`</li><li>`accountnumber`</li><li>`phone`</li></ul>
\-&nbsp;`is_virtual_station` <br/>*(added in v2.1)* | OPTIONAL | Boolean | Is this station a location with or without physical infrastructures (docks)? <br /><br /> `true` - The station is a location without physical infrastructure, defined by a point (lat/lon) and/or `station_area` (below). <br /> `false` - The station consists of physical infrastructure (docks). <br /><br /> If this field is empty, it means the station consists of physical infrastructure (docks).<br><br>This field SHOULD be published in systems that have station locations without standard, internet connected physical docking infrastructure. These may be racks or geofenced areas designated for rental and/or return of vehicles. Locations that fit within this description SHOULD have the `is_virtual_station` boolean set to `true`.
\-&nbsp;`station_area` <br/>*(added in v2.1)* | OPTIONAL | GeoJSON Multipolygon | A GeoJSON multipolygon that describes the area of a virtual station. If `station_area` is supplied then the record describes a virtual station. <br /><br /> If lat/lon and `station_area` are both defined, the lat/lon is the significant coordinate of the station (e.g. dock facility or valet drop-off and pick up point). The `station_area` takes precedence over any `ride_allowed` rules in overlapping `geofencing_zones`.
\-&nbsp;`capacity` | OPTIONAL | Non-negative integer | Number of total docking points installed at this station, both available and unavailable, regardless of what vehicle types are allowed at each dock. <br/><br/>If this is a virtual station defined using the `is_virtual_station` field, this number represents the total number of vehicles of all types that can be parked at the virtual station.<br/><br/>If the virtual station is defined by `station_area`, this is the number that can park within the station area. If `lat`/`lon` are defined, this is the number that can park at those coordinates.
\-&nbsp;`vehicle_capacity` <br/>*(added in v2.1)* | OPTIONAL | Object | An object used to describe the parking capacity of virtual stations (defined using the `is_virtual_station` field), where each key is a `vehicle_type_id` as described in [vehicle_types.json](#vehicle_typesjson-added-in-v21) and the value is a number representing the total number of vehicles of this type that can park within the virtual station.<br/><br/>If the virtual station is defined by `station_area`, this is the number that can park within the station area. If `lat`/`lon` is defined, this is the number that can park at those coordinates.
\-&nbsp;`vehicle_type_capacity` <br/>*(added in v2.1)* | OPTIONAL | Object | An object used to describe the docking capacity of a station where each key is a `vehicle_type_id` as described in [vehicle_types.json](#vehicle_typesjson-added-in-v21) and the value is a number representing the total docking points installed at this station, both available and unavailable for the specified vehicle type.
\-&nbsp;`is_valet_station` <br/>*(added in v2.1)* | OPTIONAL | Boolean | Are valet services provided at this station? <br /><br /> `true` - Valet services are provided at this station. <br /> `false` - Valet services are not provided at this station. <br /><br /> If this field is empty, it is assumed that valet services are not provided at this station. <br><br>This field’s boolean SHOULD be set to `true` during the hours which valet service is provided at the station. Valet service is defined as providing unlimited capacity at a station.
\-&nbsp;`rental_uris` <br/>*(added in v1.1)* | OPTIONAL | Object | Contains rental URIs for Android, iOS, and web in the android, ios, and web fields. See [examples](#examples-added-in-v11) of how to use these fields and [supported analytics](#analytics-added-in-v11).
&emsp;\-&nbsp;`android` <br/>*(added in v1.1)* | OPTIONAL | URI | URI that can be passed to an Android app with an `android.intent.action.VIEW` Android intent to support Android Deep Links (https://developer.android.com/training/app-links/deep-linking). Please use Android App Links (https://developer.android.com/training/app-links) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI SHOULD be a deep link specific to this station, and SHOULD NOT be a general rental page that includes information for more than one station. The deep link SHOULD take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native Android rental app. <br><br>Note that URIs do not necessarily include the station_id for this station - other identifiers can be used by the rental app within the URI to uniquely identify this station. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Android App Links example value: `https://www.example.com/app?sid=1234567890&platform=android` <br><br>Deep Link (without App Links) example value: `com.example.android://open.example.app/app?sid=1234567890`
&emsp;\-&nbsp;`ios` <br/>*(added in v1.1)* | OPTIONAL | URI | URI that can be used on iOS to launch the rental app for this station. More information on this iOS feature can be found [here](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/communicating_with_other_apps_using_custom_urls?language=objc). Please use iOS Universal Links (https://developer.apple.com/ios/universal-links/) if possible so viewing apps don’t need to manually manage the redirect of the user to the app store if the user doesn’t have the application installed. <br><br>This URI SHOULD be a deep link specific to this station, and SHOULD NOT be a general rental page that includes information for more than one station.  The deep link SHOULD take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported in the native iOS rental app. <br><br>Note that the URI does not necessarily include the station_id - other identifiers can be used by the rental app within the URL to uniquely identify this station. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>iOS Universal Links example value: `https://www.example.com/app?sid=1234567890&platform=ios` <br><br>Deep Link (without Universal Links) example value: `com.example.ios://open.example.app/app?sid=1234567890`
&emsp;\-&nbsp;`web` <br/>*(added in v1.1)* | OPTIONAL | URL | URL that can be used by a web browser to show more information about renting a vehicle at this station. <br><br>This URL SHOULD be a deep link specific to this station, and SHOULD NOT be a general rental page that includes information for more than one station.  The deep link SHOULD take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking isn’t supported for web browsers. <br><br>Example value: `https://www.example.com/app?sid=1234567890`

##### Example 1: Physical station

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
  "data": {
    "stations": [
      {
        "station_id": "pga",
        "name": "Parking garage A",
        "lat": 12.345678,
        "lon": 45.678901,
        "vehicle_type_capacity": {
          "abc123": 7,
          "def456": 9
        }
      }
    ]
  }
}
```

##### Example 2: Virtual station

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
  "data": {
    "stations": [
      {
        "station_id": "station12",
        "name": "SE Belmont & SE 10 th ",
        "lat": 12.345678,
        "lon": 45.678901,
        "is_valet_station": false,
        "is_virtual_station": true,
        "station_area": {
          "type": "MultiPolygon",
          "coordinates": [
            [
              [
                [
                  -122.655775,
                  45.516445
                ],
                [
                  -122.655705,
                  45.516445
                ],
                [
                  -122.655705,
                  45.516495
                ],
                [
                  -122.655775,
                  45.516495
                ],
                [
                  -122.655775,
                  45.516445
                ]
              ]
            ]
          ]
        },
        "capacity": 16,
        "vehicle_capacity": {
          "abc123": 8,
          "def456": 8,
          "ghi789": 16
        }
      }
    ]
  }
}
```

### station_status.json

Describes the capacity and rental availability of a station. Data returned SHOULD be as close to realtime as possible, but in no case should it be more than 5 minutes out-of-date.  See [Data Latency](#data-latentcy). Data reflects the operator's most recent knowledge of the station’s status. Any station that is represented in `station_status.json` MUST have a corresponding entry in `station_information.json`.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`stations` | Yes | Array | Array that contains one object per station in the system as defined below.
\-&nbsp;`station_id` | Yes | ID | Identifier of a station see [station_information.json](#station_informationjson).
\-&nbsp;`num_bikes_available` | Yes | Non-negative integer | Number of functional vehicles physically at the station that may be offered for rental. To know if the vehicles are available for rental, see `is_renting`. <br/><br/>If `is_renting` = `true` this is the number of vehicles that are currently available for rent. If `is_renting` =`false` this is the number of vehicles that would be available for rent if the station were set to allow rentals.
\- `vehicle_types_available` <br/>*(added in v2.1)* | Conditionally REQUIRED | Array | This field is REQUIRED if the [vehicle_types.json](#vehicle_typesjson) file has been defined. This field's value is an array of objects. Each of these objects is used to model the total number of each defined vehicle type available at a station. The total number of vehicles from each of these objects SHOULD add up to match the value specified in the `num_bikes_available`  field.
&emsp;\- `vehicle_type_id` <br/>*(added in v2.1)* | Yes | ID | The `vehicle_type_id` of each vehicle type at the station as described in [vehicle_types.json](#vehicle_typesjson). This field is REQUIRED if the [vehicle_types.json](#vehicle_typesjson) is defined.
&emsp;\- `count` <br/>*(added in v2.1)* | Yes | Non-negative integer | A number representing the total number of available vehicles of the corresponding `vehicle_type_id` as defined in [vehicle_types.json](#vehicle_typesjson) at the station.
\-&nbsp;`num_bikes_disabled` | OPTIONAL | Non-negative integer | Number of disabled vehicles of any type at the station. Vendors who do not want to publicize the number of disabled vehicles or docks in their system can opt to omit station `capacity` (in [station_information.json](#station_informationjson), `num_bikes_disabled`, and `num_docks_disabled` *(as of v2.0)*. If station `capacity` is published, then broken docks/vehicles can be inferred (though not specifically whether the decreased capacity is a broken vehicle or dock).
\-&nbsp;`num_docks_available` | Conditionally REQUIRED <br/>*(as of v2.0)* | Non-negative integer | REQUIRED except for stations that have unlimited docking capacity (e.g. virtual stations) *(as of v2.0)*. Number of functional docks physically at the station that are able to accept vehicles for return. To know if the docks are accepting vehicle returns, see `is_returning`. <br /><br/> If `is_returning` = `true` this is the number of docks that are currently available to accept vehicle returns. If `is_returning` = `false` this is the number of docks that would be available if the station were set to allow returns.
\- `vehicle_docks_available` <br/>*(added in v2.1)* | Conditionally REQUIRED | Array | This field is REQUIRED in feeds where the [vehicle_types.json](#vehicle_typesjson) is defined and where certain docks are only able to accept certain vehicle types. If every dock at the station is able to accept any vehicle type, then this field is not REQUIRED. This field's value is an array of objects. Each of these objects is used to model the number of docks available for certain vehicle types. The total number of docks from each of these objects SHOULD add up to match the value specified in the `num_docks_available` field.
&emsp;\- `vehicle_type_ids` <br/>*(added in v2.1)* | Yes | Array | An array of strings where each string represents a `vehicle_type_id` that is able to use a particular type of dock at the station
&emsp;\- `count` <br/>*(added in v2.1)* | Yes | Non-negative integer | A number representing the total number of available vehicles of the corresponding vehicle type as defined in the `vehicle_types` array at the station that can accept vehicles of the specified types in the `vehicle_types` array.
\-&nbsp;`num_docks_disabled` | OPTIONAL | Non-negative integer | Number of disabled dock points at the station.
\-&nbsp;`is_installed` | Yes | Boolean | Is the station currently on the street?<br/><br/>`true` - Station is installed on the street.<br/>`false` - Station is not installed on the street.<br/><br/>Boolean SHOULD be set to `true` when equipment is present on the street. In seasonal systems where equipment is removed during winter, boolean SHOULD be set to `false` during the off season. May also be set to false to indicate planned (future) stations which have not yet been installed.
\-&nbsp;`is_renting` | Yes | Boolean | Is the station currently renting vehicles? <br /><br />`true` - Station is renting vehicles. Even if the station is empty, if it would otherwise allow rentals, this value MUST be `true`.<br/>`false` - Station is not renting vehicles.<br/><br/>If the station is temporarily taken out of service and not allowing rentals, this field MUST be set to `false`.<br/><br/>If a station becomes inaccessible to users due to road construction or other factors this field SHOULD be set to `false`. Field SHOULD be set to `false` during hours or days when the system is not offering vehicles for rent.
\-&nbsp;`is_returning` | Yes | Boolean | Is the station accepting vehicle returns? <br /><br />`true` - Station is accepting vehicle returns. Even if the station is full, if it would otherwise allow vehicle returns, this value MUST be `true`.<br /> `false` - Station is not accepting vehicle returns.<br/><br/>If the station is temporarily taken out of service and not allowing vehicle returns, this field MUST be set to `false`.<br/><br/>If a station becomes inaccessible to users due to road construction or other factors, this field SHOULD be set to `false`.
\-&nbsp;`last_reported` | Yes | Timestamp | The last time this station reported its status to the operator's backend.

##### Example:

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
  "data": {
    "stations": [
      {
        "station_id": "station1",
        "is_installed": true,
        "is_renting": true,
        "is_returning": true,
        "last_reported": 1609866125,
        "num_docks_available": 3,
        "vehicle_docks_available": [
          {
            "vehicle_type_ids": [ "abc123" ],
            "count": 2
          },
          {
            "vehicle_type_ids": [ "def456" ],
            "count": 1
          }
        ],
        "num_bikes_available": 1,
        "vehicle_types_available": [
          {
            "vehicle_type_id": "abc123",
            "count": 1
          },
          {
            "vehicle_type_id": "def456",
            "count": 0
          }
        ]
      },
      {
        "station_id": "station2",
        "is_installed": true,
        "is_renting": true,
        "is_returning": true,
        "last_reported": 1609866106,
        "num_docks_available": 8,
        "vehicle_docks_available": [
          {
            "vehicle_type_ids": [ "abc123" ],
            "count": 6
          },
          {
            "vehicle_type_ids": [ "def456" ],
            "count": 2
          }
        ],
        "num_bikes_available": 6,
        "vehicle_types_available": [
          {
            "vehicle_type_id": "abc123",
            "count": 2
          },
          {
            "vehicle_type_id": "def456",
            "count": 4
          }
        ]
      }
    ]
  }
}
```

### free_bike_status.json

*(as of v2.1)* Describes all vehicles that are not currently in active rental. REQUIRED for free floating (dockless) vehicles. OPTIONAL for station based (docked) vehicles. Data returned SHOULD be as close to realtime as possible, but in no case should it be more than 5 minutes out-of-date.  See [Data Latency](#data-latentcy). Vehicles that are part of an active rental MUST NOT appear in this feed. Vehicles listed as available for rental MUST be in the field and accessible to users. Vehicles that are not accessible (e.g. in a warehouse or in transit) MUST NOT appear as available for rental.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`bikes` | Yes | Array | Array that contains one object per vehicle that is currently stopped as defined below.
\-&nbsp;`bike_id` | Yes | ID | Identifier of a vehicle. The `bike_id` identifier MUST be rotated to a random string after each trip to protect user privacy *(as of v2.0)*. Use of persistent vehicle IDs poses a threat to user privacy. The `bike_id` identifier SHOULD only be rotated once per trip.
\-&nbsp;`system_id` <br/>*(added in v3.0-RC)* | Conditionally REQUIRED | ID | Identifier referencing the `system_id` field in [system_information.json](#system_informationjson). REQUIRED in the case of feeds that specify free (undocked) bikes and define systems in [system_information.json](#system_informationjson).
\-&nbsp;`lat` | Conditionally REQUIRED <br/>*(as of v2.1)* | Latitude | Latitude of the vehicle in decimal degrees. *(as of v2.1)* This field is REQUIRED if `station_id` is not provided for this vehicle (free floating). This field SHOULD have a precision of 6 decimal places (0.000001). See [Coordinate Precision](#coordinate-precision).
\-&nbsp;`lon` | Conditionally REQUIRED <br/>*(as of v2.1)* | Longitude | Longitude of the vehicle. *(as of v2.1)* This field is REQUIRED if `station_id` is not provided for this vehicle (free floating).
\-&nbsp;`is_reserved` | Yes | Boolean | Is the vehicle currently reserved? <br /><br /> `true` - Vehicle is currently reserved. <br /> `false` - Vehicle is not currently reserved.
\-&nbsp;`is_disabled` | Yes | Boolean | Is the vehicle currently disabled? <br /><br /> `true` - Vehicle is currently disabled. <br /> `false` - Vehicle is not currently disabled.<br><br>This field is used to indicate vehicles that are in the field but not available for rental.  This may be due to a mechanical issue, low battery etc. Publishing this data may prevent users from attempting to rent vehicles that are disabled and not available for rental.
\-&nbsp;`rental_uris` <br/>*(added in v1.1)* | OPTIONAL | Object | JSON object that contains rental URIs for Android, iOS, and web in the android, ios, and web fields. See [examples](#examples-added-in-v11) of how to use these fields and [supported analytics](#analytics-added-in-v11).
&emsp;\-&nbsp;`android` <br/>*(added in v1.1)* | OPTIONAL | URI | URI that can be passed to an Android app with an android.intent.action.VIEW Android intent to support Android Deep Links (https://developer.android.com/training/app-links/deep-linking). Please use Android App Links (https://developer.android.com/training/app-links) if possible, so viewing apps do not need to manually manage the redirect of the user to the app store if the user does not have the application installed. <br><br>This URI SHOULD be a deep link specific to this vehicle, and SHOULD NOT be a general rental page that includes information for more than one vehicle. The deep link SHOULD take users directly to this vehicle, without any prompts, interstitial pages, or logins. Make sure that users can see this vehicle even if they never previously opened the application. Note that as a best practice providers SHOULD rotate identifiers within deep links after each rental to avoid unintentionally exposing private vehicle trip origins and destinations.<br><br>If this field is empty, it means deep linking is not supported in the native Android rental app.<br><br>Note that URIs do not necessarily include the bike_id for this vehicle - other identifiers can be used by the rental app within the URI to uniquely identify this vehicle. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Android App Links example value: `https://www.example.com/app?sid=1234567890&platform=android` <br><br>Deep Link (without App Links) example value: `com.example.android://open.example.app/app?sid=1234567890`
&emsp;\-&nbsp;`ios` <br/>*(added in v1.1)* | OPTIONAL | URI | URI that can be used on iOS to launch the rental app for this vehicle. More information on this iOS feature can be found [here](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/communicating_with_other_apps_using_custom_urls?language=objc). Please use iOS Universal Links (https://developer.apple.com/ios/universal-links/) if possible, so viewing apps do not need to manually manage the redirect of the user to the app store if the user does not have the application installed. <br><br>This URI SHOULD be a deep link specific to this vehicle, and SHOULD NOT be a general rental page that includes information for more than one vehicle.  The deep link SHOULD take users directly to this vehicle, without any prompts, interstitial pages, or logins. Make sure that users can see this vehicle even if they never previously opened the application. Note that as a best practice providers SHOULD rotate identifiers within deep links after each rental to avoid unintentionally exposing private vehicle trip origins and destinations. <br><br>If this field is empty, it means deep linking is not supported in the native iOS rental app.<br><br>Note that the URI does not necessarily include the bike_id - other identifiers can be used by the rental app within the URL to uniquely identify this vehicle. <br><br>See the [Analytics](#analytics-added-in-v11) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>iOS Universal Links example value: `https://www.example.com/app?sid=1234567890&platform=ios` <br><br>Deep Link (without Universal Links) example value: `com.example.ios://open.example.app/app?sid=1234567890`
&emsp;\-&nbsp;`web` <br/>*(added in v1.1)* | OPTIONAL | URL | URL that can be used by a web browser to show more information about renting a vehicle at this vehicle. <br><br>This URL SHOULD be a deep link specific to this vehicle, and SHOULD NOT be a general rental page that includes information for more than one vehicle.  The deep link SHOULD take users directly to this vehicle, without any prompts, interstitial pages, or logins. Make sure that users can see this vehicle even if they never previously opened the application. Note that as a best practice providers SHOULD rotate identifiers within deep links after each rental to avoid unintentionally exposing private vehicle trip origins and destinations.<br><br>If this field is empty, it means deep linking isn’t supported for web browsers. <br><br>Example value: `https://www.example.com/app?sid=1234567890`
\- `vehicle_type_id` <br/>*(added in v2.1)* | Conditionally REQUIRED | ID | The `vehicle_type_id` of this vehicle as described in [vehicle_types.json](#vehicle_typesjson-added-in-v21). This field is REQUIRED if the [vehicle_types.json](#vehicle_typesjson-added-in-v21) is defined.
\- `last_reported` <br/>*(added in v2.1)* | OPTIONAL | Timestamp | The last time this vehicle reported its status to the operator's backend.
\- `current_range_meters` <br/>*(added in v2.1)* | Conditionally REQUIRED | Non-negative float | If the corresponding `vehicle_type` definition for this vehicle has a motor, then this field is REQUIRED. This value represents the furthest distance in meters that the vehicle can travel without recharging or refueling with the vehicle's current charge or fuel.
\- `station_id` <br/>*(added in v2.1)* | Conditionally REQUIRED | ID | Identifier referencing the `station_id` field in [system_information.json](#system_informationjson). REQUIRED only if the vehicle is currently at a station and the [vehicle_types.json](#vehicle_typesjson) file has been defined.
\- `pricing_plan_id` <br/>*(added in v2.1)* | OPTIONAL | ID | The `plan_id` of the pricing plan this vehicle is eligible for as described in [system_pricing_plans.json](#system_pricing_plans.json).

##### Example:

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
  "data": {
    "bikes": [
      {
        "bike_id": "ghi789",
        "last_reported": 1609866109,
        "lat": 12.345678,
        "lon": 56.789012,
        "is_reserved": false,
        "is_disabled": false,
        "vehicle_type_id": "abc123"
      },
      {
        "bike_id": "jkl012",
        "last_reported": 1609866204,
        "is_reserved": false,
        "is_disabled": false,
        "vehicle_type_id": "def456",
        "current_range_meters": 6543,
        "station_id": "86",
        "pricing_plan_id": "plan3"
      }
    ]
  }
}

```

### system_hours.json

This OPTIONAL file is used to describe hours and days of operation when vehicles are available for rental. If `system_hours.json` is not published, it indicates that vehicles are available for rental 24 hours a day, 7 days a week.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`rental_hours` | Yes | Array | Array of objects as defined below. The array MUST contain a minimum of one object identifying hours for every day of the week or a maximum of two for each day of the week  objects ( one for each user type).
\-&nbsp;`user_types` | Yes | Array | An array of `member` and/or `nonmember` value(s). This indicates that this set of rental hours applies to either members or non-members only.
\-&nbsp;`days` | Yes | Array | An array of abbreviations (first 3 letters) of English names of the days of the week for which this object applies (e.g. `["mon", "tue", "wed", "thu", "fri", "sat, "sun"]`). Rental hours MUST NOT be defined more than once for each day and user type.
\-&nbsp;`start_time` | Yes | Time | Start time for the hours of operation of the system in the time zone indicated in [system_information.json](#system_informationjson).
\-&nbsp;`end_time` | Yes | Time | End time for the hours of operation of the system in the time zone indicated in [system_information.json](#system_informationjson).

##### Example:

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 86400,
  "version": "3.0",
  "data": {
    "rental_hours": [
      {
        "user_types": [ "member" ],
        "days": [
          "sat",
          "sun"
        ],
        "start_time": "00:00:00",
        "end_time": "23:59:59"
      },
      {
        "user_types": [ "nonmember" ],
        "days": [
          "sat",
          "sun"
        ],
        "start_time": "05:00:00",
        "end_time": "23:59:59"
      },
      {
        "user_types": [
          "member",
          "nonmember"
        ],
        "days": [
          "mon",
          "tue",
          "wed",
          "thu",
          "fri"
        ],
        "start_time": "00:00:00",
        "end_time": "23:59:59"
      }
    ]
  }
}
```

### system_calendar.json

Describes the operating calendar for a system. This OPTIONAL file SHOULD be published by systems that operate seasonally or do not offer continuous year-round service.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`calendars` | Yes | Array | Array of objects describing the system operational calendar. A minimum of one calendar object is REQUIRED. If start and end dates are the same every year, then start_year and end_year SHOULD be omitted.
\-&nbsp;`start_month` | Yes | Non-negative Integer | Starting month for the system operations (`1`-`12`).
\-&nbsp;`start_day` | Yes | Non-negative Integer | Starting date for the system operations (`1`-`31`).
\-&nbsp;`start_year` | OPTIONAL | Non-negative Integer | Starting year for the system operations.
\-&nbsp;`end_month` | Yes | Non-negative Integer | Ending month for the system operations (`1`-`12`).
\-&nbsp;`end_day` | Yes | Non-negative Integer | Ending date for the system operations (`1`-`31`).
\-&nbsp;`end_year` | OPTIONAL | Non-negative Integer | Ending year for the system operations.

##### Example:

```jsonc
{
  "last_updated": 1604333830,
  "ttl": 86400,
  "version": "3.0",
  "data": {
    "calendars": [
      {
        "start_month": 4,
        "start_day": 1,
        "start_year": 2020,
        "end_month": 11,
        "end_day": 5,
        "end_year": 2020
      }
    ]
  }
}
```

### system_regions.json

Describe regions for a system that is broken up by geographic or political region.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`regions` | Yes | Array | Array of objects as defined below.
\-&nbsp;`region_id` | Yes | ID | Identifier for the region.
\-&nbsp;`name` | Yes | String | Public name for this region.

##### Example:

```jsonc
{
  "last_updated": 1604332380,
  "ttl": 86400,
  "version": "3.0",
  "data": {
    "regions": [
      {
        "name": "North",
        "region_id": "3"
      },
      {
        "name": "East",
        "region_id": "4"
      },
      {
        "name": "South",
        "region_id": "5"
      },
      {
        "name": "West",
        "region_id": "6"
      }
    ]
  }
}
```

### system_pricing_plans.json

Describes pricing for the system.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`plans` | Yes | Array | Array of objects as defined below.
\-&nbsp;`plan_id` | Yes | ID | Identifier for a pricing plan in the system.
\-&nbsp;`url` | OPTIONAL | URL | URL where the customer can learn more about this pricing plan.
\-&nbsp;`name` | Yes | String | Name of this pricing plan.
\-&nbsp;`currency` | Yes | String | Currency used to pay the fare. <br /><br /> This pricing is in ISO 4217 code: http://en.wikipedia.org/wiki/ISO_4217 <br />(e.g. `CAD` for Canadian dollars, `EUR` for euros, or `JPY` for Japanese yen.)
\-&nbsp;`price` | Yes | Non-Negative float OR String | Fare price, in the unit specified by currency. If string, MUST be in decimal monetary value. <br/>*(added in v2.2)* Note: v3.0 may only allow non-negative float, therefore future implementations SHOULD be non-negative float.<br /><br />In case of non-rate price, this field is the total price. In case of rate price, this field is the base price that is charged only once per trip (e.g., price for unlocking) in addition to `per_km_pricing` and/or `per_min_pricing`.
\-&nbsp;`is_taxable` | Yes | Boolean | Will additional tax be added to the base price?<br /><br />`true` - Yes.<br />  `false` - No.  <br /><br />`false` MAY be used to indicate that tax is not charged or that tax is included in the base price.
\-&nbsp;`description` | Yes | String | Customer-readable description of the pricing plan. This SHOULD include the duration, price, conditions, etc. that the publisher would like users to see.
\-&nbsp;`per_km_pricing` <br/>*(added in v2.2)* | OPTIONAL | Array | Array of segments when the price is a function of distance travelled, displayed in kilometers.<br /><br />Total price is the addition of `price` and all segments in `per_km_pricing` and `per_min_pricing`. If this array is not provided, there are no variable prices based on distance.
&emsp;&emsp;\-&nbsp;`start` <br/>*(added in v2.2)* | Yes | Non-Negative Integer | The kilometer at which this segment rate starts being charged *(inclusive)*.
&emsp;&emsp;\-&nbsp;`rate` <br/>*(added in v2.2)* | Yes | Float | Rate that is charged for each kilometer `interval` after the `start`. Can be a negative number, which indicates that the traveller will receive a discount.
&emsp;&emsp;\-&nbsp;`interval` <br/>*(added in v2.2)* | Yes | Non-Negative Integer | Interval in kilometers at which the `rate` of this segment is either reapplied indefinitely, or if defined, up until (but not including) `end` kilometer.<br /><br />An interval of 0 indicates the rate is only charged once.
&emsp;&emsp;\-&nbsp; `end` <br/>*(added in v2.2)* | OPTIONAL | Non-Negative Integer | The kilometer at which the rate will no longer apply *(exclusive)* e.g. if `end` is `20` the rate no longer applies at 20.00 km.<br /><br /> If this field is empty, the price issued for this segment is charged until the trip ends, in addition to following segments.
\-&nbsp;`per_min_pricing` <br/>*(added in v2.2)* | OPTIONAL | Array | Array of segments when the price is a function of time travelled, displayed in minutes.<br /><br />Total price is the addition of `price` and all segments in `per_km_pricing` and `per_min_pricing`. If this array is not provided, there are no variable prices based on time.
&emsp;&emsp;\-&nbsp;`start` <br/>*(added in v2.2)* | Yes | Non-Negative Integer | The minute at which this segment rate starts being charged *(inclusive)*.
&emsp;&emsp;\-&nbsp;`rate` <br/>*(added in v2.2)* | Yes | Float | Rate that is charged for each minute `interval` after the `start`. Can be a negative number, which indicates that the traveller will receive a discount.
&emsp;&emsp;\-&nbsp;`interval` <br/>*(added in v2.2)* | Yes | Non-Negative Integer | Interval in minutes at which the `rate` of this segment is either reapplied indefinitely, or if defined, up until (but not including) `end` minute.<br /><br />An interval of 0 indicates the rate is only charged once.
&emsp;&emsp;\-&nbsp; `end` <br/>*(added in v2.2)* | OPTIONAL | Non-Negative Integer | The minute at which the rate will no longer apply  *(exclusive)* e.g. if `end` is `20` the rate no longer applies after 19:59.<br /><br />If this field is empty, the price issued for this segment is charged until the trip ends, in addition to following segments.
\-&nbsp;`surge_pricing` <br/>*(added in v2.2)* | OPTIONAL | Boolean | Is there currently an increase in price in response to increased demand in this pricing plan? If this field is empty, it means these is no surge pricing in effect.<br /><br />`true` - Surge pricing is in effect.<br />  `false` - Surge pricing is not in effect.

### Examples *(added in v2.2)*

##### Example 1:

The user does not pay more than the base price for the first 10 km. After 10 km the user pays $1 per km. After 25 km the user pays $0.50 per km and an additional $3 every 5 km, the extension price, in addition to $0.50 per km.

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
  "data": {
    "plans": [
      {
        "plan_id": "plan2",
        "name": "One-Way",
        "currency": "USD",
        "price": 2,
        "is_taxable": false,
        "description": "Includes 10km, overage fees apply after 10km.",
        "per_km_pricing": [
          {
            "start": 10,
            "rate": 1,
            "interval": 1,
            "end": 25
          },
          {
            "start": 25,
            "rate": 0.5,
            "interval": 1
          },
          {
            "start": 25,
            "rate": 3,
            "interval": 5
          }
        ]
      }
    ]
  }
}
```

##### Example 2:

This example demonstrates a pricing scheme that has a rate both by minute and by km. The user is charged $0.25 per km as well as $0.50 per minute. Both of these rates happen concurrently and are not dependent on one another.

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 0,
  "version": "3.0",
  "data": {
    "plans": [
      {
        "plan_id": "plan3",
        "name": "Simple Rate",
        "currency": "CAD",
        "price": 3,
        "is_taxable": true,
        "description": "$3 unlock fee, $0.25 per kilometer and 0.50 per minute.",
        "per_km_pricing": [
          {
            "start": 0,
            "rate": 0.25,
            "interval": 1
          }
        ],
        "per_min_pricing": [
          {
            "start": 0,
            "rate": 0.50,
            "interval": 1
          }
        ]
      }
    ]
  }
}
```

### system_alerts.json

This feed is intended to inform customers about changes to the system that do not fall within the normal system operations. For example, system closures due to weather would be listed here, but a system that only operated for part of the year would have that schedule listed in the system_calendar.json feed.<br />
Obsolete alerts SHOULD be removed so the client application can safely present to the end user everything present in the feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`alerts` | Yes | Array | Array of objects each indicating a system alert as defined below.
\-&nbsp;`alert_id` | Yes | ID | Identifier for this alert.
\-&nbsp;`type` | Yes | Enum | Valid values are:<br /><br /><ul><li>`system_closure`</li><li>`station_closure`</li><li>`station_move`</li><li>`other`</li></ul>
\-&nbsp;`times` | OPTIONAL | Array | Array of objects with the fields `start` and `end` indicating when the alert is in effect (e.g. when the system or station is actually closed, or when it is scheduled to be moved).
&emsp;\-&nbsp;`start` | Yes | Timestamp | Start time of the alert.
&emsp;\-&nbsp;`end` | OPTIONAL | Timestamp | End time of the alert. If there is currently no end time planned for the alert, this can be omitted.
\-&nbsp;`station_ids` | OPTIONAL | Array | If this is an alert that affects one or more stations, include their ID(s). Otherwise omit this field. If both `station_id` and `region_id` are omitted, this alert affects the entire system.
\-&nbsp;`region_ids` | OPTIONAL | Array | If this system has regions, and if this alert only affects certain regions, include their ID(s). Otherwise, omit this field. If both `station_id`s and `region_id`s are omitted, this alert affects the entire system.
\-&nbsp;`url` | OPTIONAL | URL | URL where the customer can learn more information about this alert.
\-&nbsp;`summary` | Yes | String | A short summary of this alert to be displayed to the customer.
\-&nbsp;`description` | OPTIONAL | String | Detailed description of the alert.
\-&nbsp;`last_updated` | OPTIONAL | Timestamp | Indicates the last time the info for the alert was updated.

##### Example:

```jsonc
{
  "last_updated": 1604198100,
  "ttl": 60,
  "version": "3.0",
  "data": {
    "alerts": [
      {
        "alert_id": "21",
        "type": "station_closure",
        "station_ids": [
          "123",
          "456",
          "789"
        ],
        "times": [
          {
            "start": "1604448000",
            "end": "1604674800"
          }
        ],
        "url": "https://example.com/more-info",
        "summary": "Disruption of Service",
        "description": "The three stations on Broadway will be out of service
         from 12:00am Nov 3 to 3:00pm Nov 6th to accommodate road work",
        "last_updated": 1604519393
      }
    ]
  }
}
```

### geofencing_zones.json *(added in v2.1)*

Describes geofencing zones and their associated rules and attributes.<br />
Geofenced areas are delineated using GeoJSON in accordance with [RFC 7946](https://tools.ietf.org/html/rfc7946). By default, no restrictions apply everywhere. Geofencing zones SHOULD be modeled according to restrictions rather than allowance. An operational area (outside of which vehicles cannot be used) SHOULD be defined with a counterclockwise polygon, and a limitation area (in which vehicles can be used under certain restrictions) SHOULD be defined with a clockwise polygon.<br><br>Geofences and GPS operate in two dimensions. Restrictions placed on an overpass or bridge will also  be applied to the roadway or path beneath.<br><br>Care SHOULD be taken when developing geofence based policies that rely on location data.  Location data from GPS, cellular and Wi-Fi signals are subject to interference resulting in accuracy levels in the tens of meters or greater.  This may result in vehicles being placed within a geofenced zone when they are actually outside or adjacent to the zone. Transit time between server and client can also impact when a user is notified of a geofence based policy. A vehicle traveling at 15kph can be well inside of a restricted zone before a notification is received.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`geofencing_zones` | Yes | GeoJSON FeatureCollection | Each geofenced zone and its associated rules and attributes is described as an object within the array of features, as follows.
\-&nbsp;`type` | Yes | String | “FeatureCollection” (as per IETF [RFC 7946](https://tools.ietf.org/html/rfc7946#section-3.3)).
\-&nbsp;`features` | Yes | Array | Array of objects as defined below.
&emsp;\-&nbsp;`type` | Yes | String | “Feature” (as per IETF [RFC 7946](https://tools.ietf.org/html/rfc7946#section-3.3)).
&emsp;\-&nbsp;`geometry` | Yes | GeoJSON Multipolygon | A polygon that describes where rides might not be able to start, end, go through, or have other limitations. A clockwise arrangement of points defines the area enclosed by the polygon, while a counterclockwise order defines the area outside the polygon ([right-hand rule](https://tools.ietf.org/html/rfc7946#section-3.1.6)). All geofencing zones contained in this list are public (i.e., can be shown on a map for public use).
&emsp;\-&nbsp;`properties` | Yes | Object | Properties: As defined below, describing travel allowances and limitations.
&emsp;&emsp;\-&nbsp;`name` | OPTIONAL | String | Public name of the geofencing zone.
&emsp;&emsp;\-&nbsp;`start` | OPTIONAL | Timestamp | Start time of the geofencing zone. If the geofencing zone is always active, this can be omitted.
&emsp;&emsp;\-&nbsp;`end` | OPTIONAL | Timestamp | End time of the geofencing zone. If the geofencing zone is always active, this can be omitted.
&emsp;&emsp;\-&nbsp;`rules` | OPTIONAL | Array | Array that contains one object per rule as defined below. <br /><br /> In the event of colliding rules within the same polygon, the earlier rule (in order of the JSON file) takes precedence. <br> In the case of overlapping polygons, the combined set of rules associated with the overlapping polygons applies to the union of the polygons. In the event of colliding rules in this set, the earlier rule (in order of the JSON file) also takes precedence.
&emsp;&emsp;&emsp;\-&nbsp;`vehicle_type_id` | OPTIONAL | Array | Array of IDs of vehicle types for which any restrictions SHOULD be applied (see vehicle type definitions in [PR #136](https://github.com/NABSA/gbfs/pull/136)). If vehicle_type_ids are not specified, then restrictions apply to all vehicle types.
&emsp;&emsp;&emsp;\-&nbsp;`ride_allowed` | Conditionally REQUIRED | Boolean | REQUIRED if `rules` array is defined. Is the undocked (“free bike”) ride allowed to start and end in this zone? <br /><br /> `true` - Undocked (“free bike”) ride can start and end in this zone. <br /> `false` - Undocked (“free bike”) ride cannot start and end in this zone.
&emsp;&emsp;&emsp;\-&nbsp;`ride_through_allowed` | Conditionally REQUIRED | Boolean | REQUIRED if `rules` array is defined. Is the ride allowed to travel through this zone? <br /><br /> `true` - Ride can travel through this zone. <br /> `false` - Ride cannot travel through this zone.
&emsp;&emsp;&emsp;\-&nbsp;`maximum_speed_kph` | OPTIONAL | Non-negative Integer | What is the maximum speed allowed, in kilometers per hour? <br /><br /> If there is no maximum speed to observe, this can be omitted.

##### Example:

```jsonc
{
  "last_updated": 1604198100,
  "ttl": 60,
  "version": "3.0",
  "data": {
    "geofencing_zones": {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [
                    -122.578067,
                    45.562982
                  ],
                  [
                    -122.661838,
                    45.562741
                  ],
                  [
                    -122.661151,
                    45.504542
                  ],
                  [
                    -122.578926,
                    45.5046625
                  ],
                  [
                    -122.578067,
                    45.562982
                  ]
                ]
              ],
              [
                [
                  [
                    -122.650680,
                    45.548197
                  ],
                  [
                    -122.650852,
                    45.534731
                  ],
                  [
                    -122.630939,
                    45.535212
                  ],
                  [
                    -122.630424,
                    45.548197
                  ],
                  [
                    -122.650680,
                    45.548197
                  ]
                ]
              ]
            ]
          },
          "properties": {
            "name": "NE 24th/NE Knott",
            "start": 1593878400,
            "end": 1593907260,
            "rules": [
              {
                "vehicle_type_id": [
                  "moped1",
                  "car1"
                ],
                "ride_allowed": false,
                "ride_through_allowed": true,
                "maximum_speed_kph": 10
              }
            ]
          }
        }
      ]
    }
  }
}
```

## Deep Links *(added in v1.1)*

Deep links to iOS, Android, and web apps are supported via URIs in the `system_information.json`, `station_information.json`, and `free_bike_status.json` files. The following sections describe how analytics can be added to these URIs, as well as some examples. For further examples, see ["What's New in GBFS"](https://medium.com/@mobilitydata/whats-new-in-gbfs-v2-0-63eb46e6bdc4).

### Analytics *(added in v1.1)*

In all of the rental URI fields, a viewing app can report the origin of a deep link to request to a rental app by appending the `client_id` *(added in v1.1)* parameter to the URI along with the domain name for the viewing app.

For example, if Google is the viewing app, it can append:

`client_id=google.com`

...to the URI field to report that Google is the originator of the deep link request. If the Android URI is:

`com.example.android://open.example.app/stations?id=1234567890`

...then the URI used by Google would be: `com.example.android://open.example.app/stations?id=1234567890&client_id=google.com`

Other supported parameters include:

1. `ad_id` *(added in v1.1)* - Advertising ID issued to the viewing app (e.g., IFDA on iOS)
2. `token` *(added in v1.1)* - A token identifier that was issued by the rental app to the viewing app.

#### Examples *(added in v1.1)*

##### Example 1 - App Links on Android and Universal Links on iOS are supported:

##### *system_information.json*

```jsonc
{
  "last_updated": 1572447999,
  "ttl": 60,
  "version": "3.0",
  "data": {
    "name": "Example Bike Rental",
    "system_id": "example_cityname",
    "timezone": "US/Central",
    "language": "en",
    "rental_apps": {
      "android": {
        "discovery_uri": "com.example.android://"
      },
      "ios": {
        "discovery_uri": "com.example.ios://"
      }
    }
  }
}
```

##### *station_information.json*

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 60,
  "version": "3.0",
  "data": {
    "stations": [
      {
        "station_id": "425",
        "name": "Coppertail",
        "lat": 27.956333,
        "lon": -82.430436,
        "rental_uris": {
          "android": "https://www.example.com/app?sid=1234567890&platform=android",
          "ios": "https://www.example.com/app?sid=1234567890&platform=ios"
        }
      }
    ]
  }
}
```

Note that the Android URI and iOS Universal Link URLs don’t necessarily use the same identifier as the station_id.

##### Example 2 - App Links are not supported on Android and Universal Links are not supported on iOS, but deep links are still supported on Android and iOS:

##### *system_information.json*

```jsonc
{
  "last_updated": 1572447999,
  "ttl": 60,
  "version": "3.0",
  "data": {
    "name": "Example Bike Rental",
    "system_id": "example_cityname",
    "timezone": "US/Central",
    "language": "en",
    "rental_apps": {
      "android": {
        "discovery_uri": "com.example.android://"
        "store_uri": "https://play.google.com/store/apps/details?id=com.example.android",
      },
      "ios": {
        "store_uri": "https://apps.apple.com/app/apple-store/id123456789",
        "discovery_uri": "com.example.ios://"
      }
    }
  }
}
```

##### *station_information.json*

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 60,
  "version": "3.0",
  "data": {
    "stations": [
      {
        "station_id": "425",
        "name": "Coppertail",
        "lat": 27.956333,
        "lon": -82.430436,
        "rental_uris":{
          "android":"com.example.android://open.example.app/app?sid=1234567890",
          "ios":"com.example.ios://open.example.app/app?sid=1234567890"
        }
      }
    ]
  }
}
```

##### Example 3 - Deep link web URLs are supported, but not Android or iOS native apps:

##### *station_information.json*

```jsonc
{
  "last_updated": 1609866247,
  "ttl": 60,
  "version": "3.0",
  "data": {
    "stations": [
      {
        "station_id": "425",
        "name": "Coppertail",
        "lat": 27.956333,
        "lon": -82.430436,
        "rental_uris": {
          "web": "https://www.example.com/app?sid=1234567890"
        }
      }
    ]
  }
}
```

## Disclaimers

_Apple Pay, PayPass and other third-party product and service names are trademarks or registered trademarks of their respective owners._

## License

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/).
