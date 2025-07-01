# General Bikeshare Feed Specification (GBFS)

This document explains the types of files and data that comprise the General Bikeshare Feed Specification (GBFS) and defines the fields used in all of those files.

## Reference version

This documentation refers to **v3.1-RC2**.

For past and upcoming versions see the [README](https://github.com/MobilityData/gbfs/blob/master/README.md#current-version-recommended).

## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119), [BCP 14](https://tools.ietf.org/html/bcp14) and [RFC8174](https://tools.ietf.org/html/rfc8174) when, and only when, they appear in all capitals, as shown here.

## Table of Contents

* [Introduction](#introduction)
* [Term Definitions](#term-definitions)
* [Files](#files)
* [Accessibility](#accessibility)
* [File Requirements](#file-requirements)
* [Licensing](#licensing)
* [Field Types](#field-types)
* [Files](#files)
    * [gbfs.json](#gbfsjson)
    * [manifest.json](#manifestjson) *(added in v3.0)*
    * [gbfs_versions.json](#gbfs_versionsjson)
    * [system_information.json](#system_informationjson)
    * [vehicle_types.json](#vehicle_typesjson) *(added in v2.1)*
    * [station_information.json](#station_informationjson)
    * [station_status.json](#station_statusjson)
    * [vehicle_status.json](#vehicle_statusjson) *(formerly free_bike_status.json)*
    * [vehicle_availability.json](#vehicle_availabilityjson) *(added in v3.1-RC2)*
    * [system_hours.json](#system_hoursjson) *(removed in v3.0)*
    * [system_calendar.json](#system_calendarjson) *(removed in v3.0)*
    * [system_regions.json](#system_regionsjson)
    * [system_pricing_plans.json](#system_pricing_plansjson)
    * [system_alerts.json](#system_alertsjson)
    * [geofencing_zones.json](#geofencing_zonesjson) *(added in v2.1)*
* [Deep Links - Analytics and Examples](#deep-links)

## Introduction

This specification has been designed with the following concepts in mind:

* Provide the status of the system at this moment
* Do not provide information whose primary purpose is historical

The specification supports real-time travel advice in GBFS-consuming applications.

## Term Definitions

This section defines terms that are used throughout this document.

* JSON - (JavaScript Object Notation) is a lightweight format for storing and transporting data. This document uses many terms defined by the JSON standard, including field, array, and object. (https://www.w3schools.com/js/js_json_datatypes.asp)
* Field - In JSON, a name/value pair consists of a field name (in double quotes), followed by a colon, followed by a value. (https://www.w3schools.com/js/js_json_syntax.asp)
* GeoJSON - GeoJSON is a format for encoding a variety of geographic data structures. (https://geojson.org/)
* REQUIRED - The field MUST be included in the dataset, and a value MUST be provided in that field for each record. (A required field inside an OPTIONAL Object is only required when the Object is present.)
* OPTIONAL - The field MAY be omitted from the dataset. If an OPTIONAL column is included, some of the entries in that field MAY be empty strings. An omitted field is equivalent to a field that is empty.
* Conditionally REQUIRED - The field or file is REQUIRED under certain conditions, which are outlined in the field or file description. Outside of these conditions, this field or file is OPTIONAL.

## Files

File Name | REQUIRED | Defines
---|---|---
gbfs.json | REQUIRED <br/>*(as of v2.0)* | Auto-discovery file that links to the other files published for the system. To avoid circular references this file MUST NOT contain links to `manifest.json`.
manifest.json *(added in v3.0)* | Conditionally REQUIRED | Required of any GBFS dataset provider that publishes more than one GBFS dataset. For example, if you publish one set of files for Berlin and a different set for Paris, this file is REQUIRED. A discovery file containing a comprehensive list of `gbfs.json` URLs for all GBFS datasets published by the provider.
gbfs_versions.json | OPTIONAL | Lists all feed endpoints published according to versions of the GBFS documentation.
system_information.json | REQUIRED | Details including system operator, system location, year implemented, URL, contact info, time zone.
vehicle_types.json <br/>*(added in v2.1)* | Conditionally REQUIRED | Describes the types of vehicles that System operator has available for rent. REQUIRED of systems that include information about vehicle types in the `vehicle_status` file. If this file is not included, then all vehicles in the feed are assumed to be non-motorized bicycles.
station_information.json | Conditionally REQUIRED | List of all stations, their capacities and locations. REQUIRED of systems utilizing docks.
station_status.json | Conditionally REQUIRED | Number of available vehicles and docks at each station and station availability. REQUIRED of systems utilizing docks.
vehicle_status.json <br/>*(as of v3.0, formerly free_bike_status.json)* | Conditionally REQUIRED | *(as of v2.1)* Describes all vehicles that are not currently in active rental. REQUIRED for free floating (dockless) vehicles. OPTIONAL for station based (docked) vehicles. Vehicles that are part of an active rental MUST NOT appear in this feed.
vehicle_availability.json <br/>*(added in v3.1-RC2)* | OPTIONAL | Describes the future availability of each vehicle. Useful for systems that allow vehicles to be reserved in advance (e.g. carsharing, cargo bike share, etc). This file is OPTIONAL for station based (docked) vehicles. Not supported for free floating (dockless) vehicles.
system_hours.json | - | This file is removed *(as of v3.0)*. See `system_information.opening_hours` for system hours of operation.
system_calendar.json | - | This file is removed *(as of v3.0)*. See `system_information.opening_hours` for system dates of operation.
system_regions.json | OPTIONAL | Regions the system is broken up into.
system_pricing_plans.json | OPTIONAL | System pricing scheme.
system_alerts.json | OPTIONAL | Current system alerts.
geofencing_zones.json <br/>*(added in v2.1)* | OPTIONAL | Geofencing zones and their associated rules and attributes.

## Accessibility

Datasets SHOULD be published at an easily accessible, public, permanent URL. 

The URL SHOULD contain the MAJOR version number. If upgrading to a MINOR version, the URL SHOULD NOT change. (for example, https://www.example.com/gbfs/v3/gbfs.json). 

The URL SHOULD be directly available without requiring login to access the file to facilitate download by consuming software applications.

To be compliant with GBFS, all systems MUST have an entry in the [systems.csv](https://github.com/MobilityData/gbfs/blob/master/systems.csv) file.

### Feed Availability

Automated tools for application performance monitoring SHOULD be used to ensure feed availability.
Producers MUST provide a technical contact who can respond to feed outages in the `feed_contact_email` field in the `system_information.json` file.

### Seasonal Shutdowns, Disruptions of Service, Termination of Service

Feeds SHOULD continue to be published during seasonal or temporary shutdowns.  Feed URLs SHOULD NOT return a 404.  An empty vehicles array SHOULD be returned by `vehicle_status.json`. Stations in `station_status.json` SHOULD be set to `is_renting:false`, `is_returning:false` and `is_installed:false` where applicable. Seasonal shutdown dates SHOULD be reflected using `opening_hours` in `system_information.json`.

Announcements for disruptions of service, including disabled stations or temporary closures of stations or systems SHOULD be made in `system_alerts.json`.

Permanent shutdowns resulting in the termination of service SHOULD be communicated to data consumers via `system_information.json#termination_date`.

###  Hours and Dates of Operation
Beginning with v3.0, hours and dates of operation are described using the Open Street Map [opening_hours](https://wiki.openstreetmap.org/wiki/Key:opening_hours) format. The OSM opening_hours syntax is quite complex, therefore it is RECOMMENDED that publishers validate their opening_hours data to ensure its accuracy.
* [OSM opening_hours examples](https://wiki.openstreetmap.org/wiki/Key:opening_hours)
* [OSM opening_hours syntax guide](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification)
* [OSM opening_hours validation tool](https://openingh.openstreetmap.de/evaluation_tool/)
* [OSM opening_hours project and code libraries](https://github.com/opening-hours)

Hours and dates of operation SHOULD be published even in cases where services are continuously available 24/7. During periods when a system or station is outside of opening hours, stations SHOULD be set to `is_renting = false`. During these periods, `station_status.json.num_vehicles_available` and `station_status.json.num_docks_available` SHOULD reflect the number of vehicles and docks that would be available if the system or station were open. The `vehicles` array in `vehicle_status` SHOULD reflect those vehicles that are in the field and accessible to users that would be available for rental if the system were open.

## File Requirements

* All files MUST be valid JSON
* All files in the spec MAY be published at a URL path or with an alternate name (e.g., `station_info` instead of `station_information.json`) *(as of v2.0)*.
* All data MUST be UTF-8 encoded    
* All deep links MUST use HTTPS
* Line breaks MUST be represented by unix newline characters only (\n)
* Pagination is not supported.

### File Distribution

* Files are distributed as individual HTTP endpoints.
    * All endpoints MUST use HTTPS
    * REQUIRED files MUST NOT 404. They MUST return a properly formatted JSON file as defined in [Output Format](#output-format).
    * OPTIONAL files MAY 404. A 404 of an OPTIONAL file SHOULD NOT be considered an error.

### Version Endpoints

The version of the GBFS specification to which a feed conforms is declared in the `version` field in all files. See [Output Format](#output-format). All endpoints within a data set SHOULD conform to the same MAJOR or MINOR version. Mixing of versions within data sets is NOT RECOMMENDED.<br />

GBFS documentation will include a list of current and past supported MAJOR and MINOR versions. Supported versions SHALL NOT span more than two MAJOR versions. Past versions with _Supported_ status MAY be patched to correct bugs or vulnerabilities, but new features will not be introduced. Past versions with _Deprecated_ status will not be patched, and their use SHOULD be discontinued. Producers SHOULD continue to maintain existing feeds while they have _Supported_ status.

GBFS producers SHOULD provide endpoints that conform to the current MAJOR version release within 180 days of a new MAJOR version release. It is not necessary to support more than one MINOR release of the same MAJOR release group, because MINOR releases are backwards-compatible. See [Specification Versioning](https://github.com/MobilityData/gbfs/blob/master/README.md#specification-versioning).

### Auto-Discovery

Publishers SHOULD implement auto-discovery of GBFS feeds by linking to the location of the `gbfs.json` auto-discovery endpoint.

* The location of the auto-discovery file SHOULD be provided in the HTML area of the shared mobility landing page hosted at the URL specified in the `url` field of the `system_information.json` file.
* This is referenced via a _link_ tag with the following format:
    * `<link rel="gbfs" type="application/json" href="https://www.example.com/data/gbfs.json" />`
    * References:
      * https://microformats.org/wiki/existing-rel-values
      * https://microformats.org/wiki/rel-faq#How_is_rel_used
* A shared mobility landing page MAY contain links to auto-discovery files for multiple systems.

### Localization

* Each supported language MUST be listed in the `languages` field in `system_information.json`. *(as of v3.0)*
* Translations MUST be provided for each supported language for all translateable fields of type Array&lt;[Localized String](#localized-string)&gt; and Array&lt;[Localized URL](#localized-url)&gt;. *(as of v3.0)*
* URLs pointing to text intended for consumption by end-users MUST be provided for each supported language. *(as of v3.0)*

### Text Fields and Naming

Rich text SHOULD NOT be stored in free form text fields. Fields SHOULD NOT contain HTML.

All customer-facing text strings (including station names) SHOULD use Mixed Case (not ALL CAPS), following local conventions for capitalization of place names on displays capable of displaying lower case characters.

   * Examples:
     * Central Park South
     * Villiers-sur-Marne
     * Market Street

Abbreviations SHOULD NOT be used for names and other text (for example, St. for Street), unless a location is called by its abbreviated name (for example, “JFK Airport”). Abbreviations may be problematic for accessibility by screen reader software and voice user interfaces. Consuming software can be engineered to reliably convert full words to abbreviations for display, but converting from abbreviations to full words is prone to more risk of error.

Names used for stations, virtual stations, and geofenced areas SHOULD be human-readable. Naming conventions used for locations SHOULD consider a variety of use cases including both text and maps.

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

The data returned by the near-realtime endpoints `station_status.json` and `vehicle_status.json` SHOULD be as close to realtime as possible, but in no case should it be more than 5 minutes out-of-date.  Appropriate values SHOULD be set using the `ttl` property for each endpoint based on how often the data in feeds are refreshed or updated. For near-realtime endpoints where the data should always be refreshed, the `ttl` value SHOULD be `0`. The `last_updated` timestamp represents the publisher's knowledge of the current state of the system at this point in time. The `last_reported` timestamp represents the last time a station or vehicle reported its status to the operator's backend.

## Licensing

It is RECOMMENDED that all GBFS data sets be offered under an open data license. Open data licenses allow consumers to freely use, modify, and share GBFS data for any purpose in perpetuity. Licensing of GBFS data provides certainty to GBFS consumers, allowing them to integrate GBFS data into their work. All GBFS data sets SHOULD specify a license using the `license_id` field with an [SPDX identifier](https://spdx.org/licenses/) or by using the `license_url` field with a URL pointing to a custom license in `system_information.json`. See the GBFS repo for a [comparison of a subset of standard licenses](https://github.com/MobilityData/gbfs/blob/master/data-licenses.md).

## Field Types
* Array - A JSON element consisting of an ordered sequence of zero or more values.
* Array&lt;Type&gt; - A JSON element consisting of an ordered sequence of zero or more values of the specified sub-type.
* Boolean - One of two possible values, `true` or `false`. Boolean values MUST be JSON booleans, not strings (meaning `true` or `false`, not `"true"` or `"false"`). *(as of v2.0)*
* Country code - Country code following the [ISO 3166-1 alpha-2 notation](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
* Date - A date in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) Complete Date Extended Format: YYYY-MM-DD. Example: `2019-09-13` for September 13th, 2019.
* Datetime *(added in v2.3)*- Combination of a date and a time following [ISO 8601 notation](https://www.iso.org/iso-8601-date-and-time-format.html). Attributes : [year](https://docs.python.org/3/library/datetime.html#datetime.datetime.year), [month](https://docs.python.org/3/library/datetime.html#datetime.datetime.month), [day](https://docs.python.org/3/library/datetime.html#datetime.datetime.day), [hour](https://docs.python.org/3/library/datetime.html#datetime.datetime.hour), [minute](https://docs.python.org/3/library/datetime.html#datetime.datetime.minute), [second](https://docs.python.org/3/library/datetime.html#datetime.datetime.second), and timezone.
* Email - An email address. Example: `example@example.com`
* Enum (Enumerable values) - An option from a set of predefined constants in the "Defines" column. Enum values MUST (as of v3.0) be lowercase.
Example: The `rental_methods` field contains values `creditcard`, `paypass`, etc...
* Float *(added in v2.1)* - A 32-bit floating point number.
* GeoJSON FeatureCollection - A FeatureCollection as described by the IETF RFC 7946 https://tools.ietf.org/html/rfc7946#section-3.3.
* GeoJSON MultiPolygon - A Geometry Object as described by the IETF RFC https://tools.ietf.org/html/rfc7946#section-3.1.7.
* ID - Should be represented as a string that identifies that particular entity. An ID:
    * MUST be unique within like fields (for example, `station_id` MUST be unique among stations)
    * Does not have to be globally unique, unless otherwise specified
    * MUST be in the ASCII printable character range, space excluded (0x21 to 0x7E) https://en.wikipedia.org/wiki/ASCII#Printable_characters *(as of v3.0)*
    * SHOULD be restricted to `A-Z`, `a-z`, `0-9` and `.@:/_-` *(as of v3.0)*
    * MUST be persistent for a given entity (station, plan, etc.). An exception is `vehicle_id`, which MUST NOT be persistent between rentals for privacy reasons (see `vehicle_status.json`). *(as of v2.0)*
* Language - An IETF BCP 47 language code. For an introduction to IETF BCP 47, refer to https://www.rfc-editor.org/rfc/bcp/bcp47.txt and https://www.w3.org/International/articles/language-tags/. Examples: `en` for English, `en-US` for American English, or `de` for German.
* Latitude - WGS84 latitude in decimal degrees. The value MUST be greater than or equal to -90.0 and less than or equal to 90.0. Example: `41.890169` for the Colosseum in Rome.
* Longitude - WGS84 longitude in decimal degrees. The value MUST be greater than or equal to -180.0 and less than or equal to 180.0. Example: `12.492269` for the Colosseum in Rome.
* <a name="localized-string"></a> Localized String - A JSON element representing a String value that has been translated into a specific language. The element consists of the following name-value pairs:

  Field Name | REQUIRED | Type | Defines
  ---|---|---|---
  `text` | REQUIRED | String | The translated text.
  `language` | REQUIRED | Language | IETF BCP 47 language code.  Must match one of the values specified by the `languages` field in `system_information.json`.

  Most commonly specified as `Array<Localized String>` when specifying translations in multiple languages.  See [Localization](#localization) for more details.
* <a name="localized-url"></a> Localized URL - A JSON element representing the URL of a resource that has been translated into a specific language. The element consists of the following name-value pairs:

  Field Name | REQUIRED | Type | Defines
  ---|---|---|---
  `text` | REQUIRED | URL | The URL of the translated resource.
  `language` | REQUIRED | Language | IETF BCP 47 language code.  Must match one of the values specified by the `languages` field in `system_information.json`.

* Non-negative Float - A 32-bit floating point number greater than or equal to 0.
* Non-negative Integer - An integer greater than or equal to 0.
* Object - A JSON element consisting of key-value pairs (fields).
* Phone Number *as of v3.0* - Phone number in [E.164](https://www.itu.int/rec/T-REC-E.164-201011-I/en) format. The phone number MUST start with a "+". The characters following the "+" MUST be integers and MUST NOT contain any hyphens, spaces or parentheses.
* String - Can only contain text. Strings MUST NOT contain any formatting codes (including HTML) other than newlines.
* Time - Service time in the HH:MM:SS format for the time zone indicated in `system_information.json` (00:00:00 - 47:59:59). Time can stretch up to one additional day in the future to accommodate situations where, for example, a system was open from 11:30pm - 11pm the next day (23:30:00-47:00:00).
* Timestamp - Timestamp fields MUST be represented as strings in [RFC3339 format](https://www.rfc-editor.org/rfc/rfc3339), for example `2023-07-17T13:34:13+02:00`. *(as of v3.0)*
* Timezone - TZ timezone from the https://www.iana.org/time-zones. Timezone names never contain the space character but MAY contain an underscore. Refer to https://en.wikipedia.org/wiki/List_of_tz_zones for a list of valid values.
Example: `Asia/Tokyo`, `America/Los_Angeles` or `Africa/Cairo`.
* URI - A fully qualified URI that includes the scheme (for example, `com.example.android://`). Any special characters in the URI MUST be correctly escaped. See the following https://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URI values. Note that URIs MAY be URLs.
* URL - A fully qualified URL that includes `http://` or `https://`. Any special characters in the URL MUST be correctly escaped. See the following https://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URL values.

### Extensions Outside of the Specification

To accommodate the needs of feed producers and consumers prior to the adoption of a change, additional fields can be added to feeds even if these fields are not part of the official specification. Custom extensions that may provide value to the GBFS community and align with the [GBFS Guiding Principles](https://github.com/MobilityData/gbfs/blob/master/README.md#guiding-principles) SHOULD be proposed for inclusion in the specification through the change process. Extreme caution is advised to avoid introducing extensions which may be used to track the movements of vehicles or their users.

Field names of extensions SHOULD be prefixed with an underscore (_) character. It is strongly RECOMMENDED that these additional fields be documented on [gbfs.org](https://gbfs.org/specification/#extensions-outside-of-the-specification) in this format:

Field Name | File Name | Organization name | Defines
---|---|---|---
_field_name | Name of GBFS endpoint where field is used | Publisher's name | Description of purpose or use

## JSON Files

### Output Format

Every JSON file presented in this specification contains the same common header information at the top level of the JSON response object:

Field Name | REQUIRED | Type | Defines
---|---|---|---
`last_updated` | REQUIRED | Timestamp | Indicates the last time data in the feed was updated. This timestamp represents the publisher's knowledge of the current state of the system at this point in time.
`ttl` | REQUIRED | Non-negative integer | Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).
`version` | REQUIRED | String | GBFS version number to which the feed conforms, according to the versioning framework.
`data` | REQUIRED | Object | Response data in the form of name:value pairs.

**Example:**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "name": [
      {
        "text": "Example Bike Rental",
        "language": "en"
      }
    ],
    "system_id": "example_cityname",
    "timezone": "America/Chicago",
    "languages": ["en"]
  }
}
```

### gbfs.json

The `gbfs.json` discovery file SHOULD represent a single system or geographic area in which vehicles are operated. The location (URL) of the `gbfs.json` file SHOULD be made available to the public using the specification’s [auto-discovery](#auto-discovery) function. To avoild circular references, this file MUST NOT contain links to `manifest.json` files.*(as of v3.0)* <br />The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`feeds` | REQUIRED | Array&lt;Object&gt; | An array of all of the feeds that are published by this auto-discovery file.
`feeds[].name` | REQUIRED | String | Key identifying the type of feed this is. The key MUST be the base file name defined in the spec for the corresponding feed type ( `system_information` for `system_information.json` file, `station_information` for `station_information.json` file).
`feeds[].url` | REQUIRED | URL | URL for the feed. Note that the actual feed endpoints (urls) may not be defined in the `file_name.json` format. For example, a valid feed endpoint could end with `station_info` instead of `station_information.json`.

**Example:**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "feeds": [
      {
        "name": "system_information",
        "url": "https://www.example.com/gbfs/1/system_information"
      },
      {
        "name": "station_information",
        "url": "https://www.example.com/gbfs/1/station_information"
      }
    ]
  }
}
```
### manifest.json 

*(added in v3.0)*

An index of `gbfs.json` URLs for each GBFS data set produced by a publisher. A single instance of this file should be published at a single stable URL, for example: `https://example.com/gbfs/manifest.json`

The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`datasets` | REQUIRED | Array&lt;Object&gt; | An array of `datasets` produced by a publisher.
`datasets[].system_id` | REQUIRED | ID | The `system_id` from `system_information.json` for the corresponding data set(s).
`datasets[].versions` | REQUIRED | Array&lt;Object&gt; | Contains one object for each of the available versions of a feed. The array MUST be sorted by increasing MAJOR and MINOR version number. 
`datasets[].versions[].version` | REQUIRED | String | The semantic version of the feed in the form `X.Y`.                               
`datasets[].versions[].url` | REQUIRED  | URL | URL of the corresponding `gbfs.json` endpoint.
`datasets[].area` <br/>*(added in v3.1-RC)* | OPTIONAL | GeoJSON MultiPolygon | A GeoJSON MultiPolygon that describes the operating area. If `area` is supplied, then the record describes the general operating area of the system for the purpose of discovery. Geographic details of the system's operating restrictions must be explicitly specified using station locations and geofencing zones, where appropriate.
`datasets[].country_code` <br/>*(added in v3.1-RC)* | OPTIONAL | Country Code | The ISO 3166-1 alpha-2 country code of the operating area. The field MUST NOT be specified if the operating area spans multiple countries.

**Example:**
```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data":{
    "datasets":[
      {
        "system_id":"example_berlin",
        "versions":[
          {
            "version": "2.0",
            "url":"https://berlin.example.com/gbfs/2/gbfs"
          },
          {
            "version": "3.1-RC",
            "url":"https://berlin.example.com/gbfs/3.1-RC/gbfs"
          }
        ],
        "area": {
          "type": "MultiPolygon",
          "coordinates": [
            [
              [
                [
                  13.10821,
                  52.58563
                ],
                [
                  13.29743,
                  52.67046
                ],
                [
                  13.48451,
                  52.6855
                ],
                [
                  13.77993,
                  52.43458
                ],
                [
                  13.65355,
                  52.33048
                ],
                [
                  13.08165,
                  52.38793
                ],
                [
                  13.10821,
                  52.58563
                ]
              ]
            ]
          ]
        },
        "country_code": "DE"
      },
      {
        "system_id":"example_paris",
        "versions":[
          {
            "version": "2.0",
            "url":"https://paris.example.com/gbfs/2/gbfs"
          },
          {
            "version": "3.1-RC",
            "url":"https://paris.example.com/gbfs/3.1-RC/gbfs"
          }
        ],
        "area": {
          "type": "MultiPolygon",
          "coordinates": [
            [
              [
                [
                  2.14306,
                  48.89971
                ],
                [
                  2.36707,
                  48.99455
                ],
                [
                  2.60219,
                  49.01987
                ],
                [
                  2.615,
                  48.69025
                ],
                [
                  2.52167,
                  48.6867
                ],
                [
                  2.26838,
                  48.73275
                ],
                [
                  2.13103,
                  48.80833
                ],
                [
                  2.14306,
                  48.89971
                ]
              ]
            ]
          ]
        },
        "country_code": "FR"
      }
    ]
  }
}
```
### gbfs_versions.json

Each expression of a GBFS feed describes all of the versions that are available.

The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`versions` | REQUIRED | Array&lt;Object&gt; | Contains one object for each of the available versions of a feed. The array MUST be sorted by increasing MAJOR and MINOR version number.
`versions[].version` | REQUIRED | String | The semantic version of the feed in the form `X.Y`.
`versions[].url` | REQUIRED | URL | URL of the corresponding gbfs.json endpoint.

**Example:**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "versions": [
      {
        "version": "2.0",
        "url": "https://www.example.com/gbfs/2/gbfs"
      },
      {
        "version": "3.1-RC",
        "url": "https://www.example.com/gbfs/3.1-RC/gbfs"
      }
    ]
  }
}
```

### system_information.json

The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`system_id` | REQUIRED | ID | This is a globally unique identifier for the vehicle share system. Each distinct system or geographic area in which vehicles are operated MUST have its own unique `system_id`. It is up to the publisher of the feed to guarantee uniqueness and MUST be checked against existing `system_id` fields in  [systems.csv](https://github.com/MobilityData/gbfs/blob/master/systems.csv) to ensure this. This value is intended to remain the same over the life of the system. <br><br> System IDs SHOULD be recognizable as belonging to a particular system as opposed to random strings - for example, `bcycle_austin` or `biketown_pdx`.
`languages` <br/>*(added of v3.0)* | REQUIRED | Array&lt;Language&gt; | List of languages used in translated strings.
`name` <br/>*(as of v3.0)* | REQUIRED | Array&lt;Localized String&gt; | Name of the system to be displayed to customers.
`opening_hours` <br/>*(added in v3.0)*| REQUIRED | String | Hours and dates of operation for the system in [OSM opening_hours](https://wiki.openstreetmap.org/wiki/Key:opening_hours) format. *(added in v3.0)*
`short_name` *(as of v3.0)* | OPTIONAL | Array&lt;Localized String&gt; | Abbreviation for a system.
`operator` <br/>*(as of v3.0)* | OPTIONAL | Array&lt;Localized String&gt; | Name of the system operator.
`url` | OPTIONAL | URL | The URL of the vehicle share system.
`purchase_url` | OPTIONAL | URL | URL where a customer can purchase a membership.
`start_date` | OPTIONAL | Date | Date that the system began operations.
`termination_date` <br/>*(added in v3.0)* | OPTIONAL | Date | Date after which this data source will no longer be available to consuming applications.<br><br>This OPTIONAL field SHOULD be used to notify 3rd party data consumers when a service is planning a permanent (non-seasonal) shutdown. Publishers SHOULD include this date in their feeds as soon as they know of an impending shutdown. Publishers SHOULD continue to publish feeds for 30 days following a permanent shutdown after which they SHOULD return a helpful http status code and text, for example `410 service no longer available ...` for all feed endpoint URLs.
`phone_number` <br/>*(as of v3.0)* | OPTIONAL | Phone Number | This OPTIONAL field SHOULD contain a single voice telephone number for the specified system’s customer service department. MUST be in [E.164](https://www.itu.int/rec/T-REC-E.164-201011-I/en) format as defined in [Field Types](#field-types). 
`email` | OPTIONAL | Email | This OPTIONAL field SHOULD contain a single contact email address actively monitored by the operator’s customer service department. This email address SHOULD be a direct contact point where riders can reach a customer service representative.
`feed_contact_email` | REQUIRED <br/>*(as of v3.0)* | Email | This field MUST contain a single contact email for feed consumers to report issues with the feed. This email address SHOULD point to a stable email address, that does not correspond to an individual but rather the team or company that manages GBFS feeds.
`manifest_url` <br/>*(added in v3.0)* | Conditionally REQUIRED | URL | REQUIRED if the producer publishes datasets for more than one system geography, for example Berlin and Paris. A fully qualified URL pointing to the [manifest.json](#manifestjson) file for the publisher.
`timezone` | REQUIRED | Timezone | The time zone where the system is located.
`license_id` <br/>*(added in v3.0)* | Conditionally REQUIRED | String | REQUIRED if the dataset is provided under a standard license. An identifier for a standard license from the [SPDX License List](https://spdx.org/licenses/). Provide `license_id` rather than `license_url` if the license is included in the SPDX License List. See the GBFS wiki for a [comparison of a subset of standard licenses](https://github.com/MobilityData/gbfs/blob/master/data-licenses.md). If the `license_id` and `license_url` fields are blank or omitted, this indicates that the feed is provided under the [Creative Commons Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/legalcode).
`license_url` | Conditionally REQUIRED <br/>*(as of v3.0)* | URL | REQUIRED if the dataset is provided under a customized license. A fully qualified URL of a page that defines the license terms for the GBFS data for this system. Do not specify a `license_url` if `license_id` is specified. If the `license_id` and `license_url` fields are blank or omitted, this indicates that the feed is provided under the [Creative Commons Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/legalcode). *(as of v3.0)*
`attribution_organization_name` <br/>*(added in v3.0)* | OPTIONAL | Array&lt;Localized String&gt; | If the feed license requires attribution, name of the organization to which attribution should be provided.
`attribution_url` <br/>*(added in v3.0)* | OPTIONAL | URL | URL of the organization to which attribution should be provided.
`brand_assets` <br/>*(added in v2.3)*  | OPTIONAL | Object | Object containing branding information about the system.
`brand_assets.brand_last_modified` <br/>*(added in v2.3)*  | REQUIRED | Date | Date that indicates the last time any included brand assets were updated or modified.
`brand_assets.brand_terms_url` <br/>*(added in v2.3)*   | OPTIONAL |  URL |  A fully qualified URL pointing to the location of a page that defines the license terms of brand icons, colors, or other trademark information.  This field MUST NOT take the place of `license_url` or `license_id`.
`brand_assets.brand_image_url` <br/>*(added in v2.3)*  |  REQUIRED |  URL | A fully qualified URL pointing to the location of a graphic file representing the brand for the service. File MUST be in SVG V1.1 format and MUST be either square or round.
`brand_assets.brand_image_url_dark` <br/>*(added in v2.3)*  | OPTIONAL |  URL | A fully qualified URL pointing to the location of a graphic file representing the brand for the service for use in dark mode applications.  File MUST be in SVG V1.1 format and MUST be either square or round.
`brand_assets.color` <br/>*(added in v2.3)*  | OPTIONAL |  String |  Color used to represent the brand for the service expressed as a 6 digit hexadecimal color code in the form #000000.
`terms_url` <br/>*(as of v3.0)* | OPTIONAL | Array&lt;Localized String&gt; | A fully qualified URL pointing to the terms of service (also often called "terms of use" or "terms and conditions") for the service.
`terms_last_updated` <br/>*(added in v2.3)* | Conditionally REQUIRED | Date | REQUIRED if `terms_url` is defined. The date that the terms of service provided at `terms_url` were last updated. 
`privacy_url` <br/>*(as of v3.0)*| OPTIONAL | Array&lt;Localized String&gt; | A fully qualified URL pointing to the privacy policy for the service.
`privacy_last_updated` <br/>*(added in v2.3)* | Conditionally REQUIRED | Date | REQUIRED if `privacy_url` is defined. The date that the privacy policy provided at `privacy_url` was last updated. 
`rental_apps` | OPTIONAL | Object | Contains rental app information in the `android` and `ios` JSON objects.
`rental_apps.android` | OPTIONAL | Object | Contains rental app download and app discovery information for the Android platform in the `store_uri` and `discovery_uri` fields. See [examples](#deep-links-examples) of how to use these fields and [supported analytics](#analytics).
`rental_apps.android.store_uri`  | REQUIRED | URI | URI where the rental Android app can be downloaded from. Typically this will be a URI to an app store, such as Google Play. If the URI points to an app store, the URI SHOULD follow Android best practices so the viewing app can directly open the URI to the native app store app instead of a website.<br><br>See the [Analytics](#analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Example value: `https://play.google.com/store/apps/details?id=com.example.android`
`rental_apps.android.discovery_uri`  | REQUIRED | URI | URI that can be used to discover if the rental Android app is installed on the device (for example, using [`PackageManager.queryIntentActivities()`](https://developer.android.com/reference/android/content/pm/PackageManager.html#queryIntentActivities)). This intent is used by viewing apps to prioritize rental apps for a particular user based on whether they already have a particular rental app installed.<br><br>Example value: `com.example.android://`
`rental_apps.ios` | OPTIONAL | Object | Contains rental information for the iOS platform in the `store_uri` and `discovery_uri` fields. See [examples](#deep-links-examples) of how to use these fields and [supported analytics](#analytics).
`rental_apps.ios.store_uri`  | REQUIRED | URI | URI where the rental iOS app can be downloaded from. Typically this will be a URI to an app store, such as the Apple App Store. If the URI points to an app store, the URI SHOULD follow iOS best practices so the viewing app can directly open the URI to the native app store app instead of a website.<br><br>See the [Analytics](#analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Example value: `https://apps.apple.com/app/apple-store/id123456789`
`rental_apps.ios.discovery_uri`  | REQUIRED | URI | URI that can be used to discover if the rental iOS app is installed on the device (for example, using [`UIApplication canOpenURL:`](https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl?language=objc)). This intent is used by viewing apps to prioritize rental apps for a particular user based on whether they already have a particular rental app installed.<br><br>Example value: `com.example.ios://`

**Example:**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "system_id": "example_cityname",
    "languages": ["en"],
    "name": [
      {
        "text": "Example Bike Rental",
        "language": "en"
      }
    ],
    "short_name": [
      {
        "text": "Example Bike",
        "language": "en"
      }
    ],
    "operator": [
      {
        "text": "Example Sharing, Inc",
        "language": "en"
      }
    ],
    "opening_hours": "Apr 1-Nov 3 00:00-24:00",
    "start_date": "2010-06-10",
    "url": "https://www.example.com",
    "purchase_url": "https://www.example.com",
    "phone_number": "+18005551234",
    "email": "customerservice@example.com",
    "feed_contact_email": "datafeed@example.com",
    "timezone": "America/Chicago",
    "license_url": "https://www.example.com/data-license.html",
    "terms_url": [
      {
         "text": "https://www.example.com/en/terms",
         "language": "en"
      }
    ],
    "terms_last_updated": "2021-06-21",
    "privacy_url": [
      {
         "text": "https://www.example.com/en/privacy-policy",
         "language": "en"
      }
    ],
    "privacy_last_updated": "2019-01-13",
    "rental_apps": {
      "android": {
        "discovery_uri": "com.example.android://",
        "store_uri": "https://play.google.com/store/apps/details?id=com.example.android"
      },
      "ios": {
        "store_uri": "https://apps.apple.com/app/apple-store/id123456789",
        "discovery_uri": "com.example.ios://"
      }
    },
    "brand_assets": {
        "brand_last_modified": "2021-06-15",
        "brand_image_url": "https://www.example.com/assets/brand_image.svg",
        "brand_image_url_dark": "https://www.example.com/assets/brand_image_dark.svg",
        "color": "#C2D32C",
        "brand_terms_url": "https://www.example.com/assets/brand.pdf"
      }
      
  }
}
```

### vehicle_types.json

*(added in v2.1)*

REQUIRED of systems that include information about vehicle types in the `vehicle_status.json` file. If this file is not included, then all vehicles in the feed are assumed to be non-motorized bicycles. This file SHOULD be published by systems offering multiple vehicle types for rental, for example pedal bikes and ebikes. <br/>The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`vehicle_types` | REQUIRED | Array&lt;Object&gt; | Contains one object per vehicle type.
`vehicle_types[].vehicle_type_id` | REQUIRED | ID | Unique identifier of a vehicle type. See [Field Types](#field-types) above for ID field requirements.
`vehicle_types[].form_factor` | REQUIRED | Enum | The vehicle's general form factor. <br /><br />Current valid values are:<br /><ul><li>`bicycle`</li><li>`cargo_bicycle` *(added in v2.3)*</li><li>`car`</li><li>`moped`</li><li>`scooter_standing` *(standing kick scooter, added in v2.3)*</li><li>`scooter_seated` *(this is a kick scooter with a seat, not to be confused with `moped`, added in v2.3)*</li><li>`other`</li></ul>
`vehicle_types[].rider_capacity`<br/>*(added in v2.3)* | OPTIONAL | Non-negative integer | The number of riders (driver included) the vehicle can legally accommodate.
`vehicle_types[].cargo_volume_capacity`<br/>*(added in v2.3)* | OPTIONAL | Non-negative integer | Cargo volume available in the vehicle, expressed in liters. For cars, it corresponds to the space between the boot floor, including the storage under the hatch, to the rear shelf in the trunk.
`vehicle_types[].cargo_load_capacity`<br/>*(added in v2.3)* | OPTIONAL | Non-negative integer | The capacity of the vehicle cargo space (excluding passengers), expressed in kilograms.
`vehicle_types[].propulsion_type` | REQUIRED | Enum | The primary propulsion type of the vehicle. <br /><br />Current valid values are:<br /><ul><li>`human` _(Pedal or foot propulsion)_</li><li>`electric_assist` _(Provides electric motor assist only in combination with human propulsion - no throttle mode)_</li><li>`electric` _(Powered by battery-powered electric motor with throttle mode)_</li><li>`combustion` _(Powered by gasoline combustion engine)_</li><li>`combustion_diesel` _(Powered by diesel combustion engine, added in v2.3)_</li><li>`hybrid` _(Powered by combined combustion engine and battery-powered motor, added in v2.3)_</li><li>`plug_in_hybrid` _(Powered by combined combustion engine and battery-powered motor with plug-in charging, added in v2.3)_</li><li>`hydrogen_fuel_cell` _(Powered by hydrogen fuel cell powered electric motor, added in v2.3)_</li></ul> This field was inspired by, but differs from the propulsion types field described in the [Open Mobility Foundation Mobility Data Specification](https://github.com/openmobilityfoundation/mobility-data-specification/blob/main/general-information.md#propulsion-types).
`vehicle_types[].eco_labels`<br/>*(as of v3.0)* | OPTIONAL | Array&lt;Object&gt; | Vehicle air quality certificate. Official anti-pollution certificate, based on the information on the vehicle's registration certificate, attesting to its level of pollutant emissions based on a defined standard. In Europe, for example, it is the European emission standard. The aim of this measure is to encourage the use of the least polluting vehicles by allowing them to drive during pollution peaks or in low emission zones.
`vehicle_types[].eco_labels[].country_code`<br/>*(added in v2.3)*| REQUIRED | Country code | Country where the `eco_sticker` applies.
`vehicle_types[].eco_labels[].eco_sticker`<br/>*(added in v2.3)* | REQUIRED | String | Name of the eco label. The name must be written in lowercase, separated by an underscore.<br /><br />Example of `eco_sticker` in Europe :<ul><li>CritAirLabel (France) <ul><li>critair</li><li>critair_1</li><li>critair_2</li><li>critair_3</li><li>critair_4</li><li>critair_5</li></ul></li><li>UmweltPlakette (Germany)<ul><li>euro_2</li><li>euro_3</li><li>euro_4</li><li>euro_5</li><li>euro_6</li><li>euro_6_temp</li><li>euro_E</li></ul></li><li>UmweltPickerl (Austria)<ul><li>euro_1</li><li>euro_2</li><li>euro_3</li><li>euro_4</li><li>euro_5</li></ul><li>Reg_certificates (Belgium)<ul><li>reg_certificates</li></ul><li>Distintivo_ambiental (Spain)<ul><li>0</li><li>eco</li><li>b</li><li>c</li></ul></li></ul>
`vehicle_types[].max_range_meters` | Conditionally REQUIRED | Non-negative float | If the vehicle has a motor (as indicated by having a value other than `human` in the `propulsion_type` field), this field is REQUIRED. This represents the furthest distance in meters that the vehicle can travel without recharging or refueling when it has the maximum amount of energy potential (for example, a full battery or full tank of gas).
`vehicle_types[].name` <br/>*(as of v3.0)* | OPTIONAL | Array&lt;Localized String&gt; | The public name of this vehicle type.
`vehicle_types[].vehicle_accessories`<br/>*(added in v2.3)* | OPTIONAL | Array&lt;String&gt; | Description of accessories available in the vehicle.  These accessories are part of the vehicle and are not supposed to change frequently. Current valid values are:<ul><li>`air_conditioning` _(Vehicle has air conditioning)_</li><li>`automatic` _(Automatic gear switch)_</li><li>`manual` _(Manual gear switch)_</li><li>`convertible` _(Vehicle is convertible)_</li><li>`cruise_control` _(Vehicle has a cruise control system ("Tempomat"))_</li><li>`doors_2` _(Vehicle has 2 doors)_</li><li>`doors_3` _(Vehicle has 3 doors)_</li><li>`doors_4` _(Vehicle has 4 doors)_</li><li>`doors_5` _(Vehicle has 5 doors)_</li><li>`navigation` _(Vehicle has a built-in navigation system)_</li></ul>
`vehicle_types[].g_CO2_km`<br/>*(added in v2.3)* | OPTIONAL | Non-negative integer | Maximum quantity of CO2, in grams, emitted per kilometer, according to the [WLTP](https://en.wikipedia.org/wiki/Worldwide_Harmonised_Light_Vehicles_Test_Procedure).
`vehicle_types[].vehicle_image`<br/>*(added in v2.3)* | OPTIONAL | URL | URL to an image that would assist the user in identifying the vehicle (for example, an image of the vehicle or a logo).<br /> Allowed formats: JPEG, PNG.
`vehicle_types[].make`<br/>*(as of v3.0)* | OPTIONAL| Array&lt;Localized String&gt; | The name of the vehicle manufacturer. <br><br>Example: <ul><li>CUBE Bikes</li><li>Renault</li></ul>
`vehicle_types[].model`<br/>*(as of v3.0)* | OPTIONAL| Array&lt;Localized String&gt; | The name of the vehicle model. <br><br>Example <ul><li>Giulia</li><li>MX50</li></ul>
`vehicle_types[].color`<br/>*(added in v2.3)*| OPTIONAL| String| The color of the vehicle. <br><br>All words must be in lower case, without special characters, quotation marks, hyphens, underscores, commas, or dots. Spaces are allowed in case of a compound name. <br><br>Example <ul><li>green</li><li>dark blue</li></ul> 
`vehicle_types[].description`<br/>*(added in v3.0)*| OPTIONAL | Array&lt;Localized String&gt; | Customer-readable description of the vehicle type outlining special features or how-tos.
`vehicle_types[].wheel_count`<br/>*(added in v2.3)* | OPTIONAL | Non-negative Integer | Number of wheels this vehicle type has.
`vehicle_types[].max_permitted_speed`<br/>*(added in v2.3)* | OPTIONAL | Non-negative Integer | The maximum speed in kilometers per hour this vehicle is permitted to reach in accordance with local permit and regulations.
`vehicle_types[].rated_power`<br/>*(added in v2.3)* | OPTIONAL | Non-negative Integer | The rated power of the motor for this vehicle type in watts.
`vehicle_types[].default_reserve_time`<br/>*(added in v2.3)* | Conditionally REQUIRED | Non-negative Integer | REQUIRED if `reservation_price_per_min` or `reservation_price_flat_rate` are defined. Maximum time in minutes that a vehicle can be reserved before a rental begins. When a vehicle is reserved by a user, the vehicle remains locked until the rental begins. During this time the vehicle is unavailable and cannot be reserved or rented by other users. The vehicle status in `vehicle_status.json` MUST be set to `is_reserved = true`. If the value of `default_reserve_time` elapses without a rental beginning, the vehicle status MUST change to `is_reserved = false`. If `default_reserve_time` is set to `0`, the vehicle type cannot be reserved. 
`vehicle_types[].return_constraint`<br/>*(as of v2.3)*| OPTIONAL | Enum | The conditions for returning the vehicle at the end of the rental. <br /><br />Current valid values are:<br /><ul><li>`free_floating` _(The vehicle can be returned anywhere permitted within the service area. Note that the vehicle is subject to rules in `geofencing_zones.json` if defined.)_</li><li>`roundtrip_station` _(The vehicle has to be returned to the same station from which it was initially rented. Note that a specific station can be assigned to the vehicle in `vehicle_status.json` using `home_station`.)_</li><li>`any_station` _(The vehicle has to be returned to any station within the service area.)_</li><li>`hybrid` (The vehicle can be returned to any station, or anywhere else permitted within the service area. Note that the vehicle is subject to rules in `geofencing_zones.json` if defined.)</li>
`vehicle_types[].vehicle_assets`<br/>*(added in v2.3)*| OPTIONAL | Object | Object containing the branding information for this vehicle type.
`vehicle_types[].vehicle_assets.icon_url`<br/>*(added in v2.3)*| REQUIRED | URL | A fully qualified URL pointing to the location of a graphic icon file that MAY be used to represent this vehicle type on maps and in other applications. File MUST be in SVG V1.1 format and MUST be either square or round.
`vehicle_types[].vehicle_assets.icon_url_dark`<br/>*(added in v2.3)*| OPTIONAL | URL | A fully qualified URL pointing to the location of a graphic icon file to be used to represent this vehicle type when in dark mode on maps and in other applications. File MUST be in SVG V1.1 format and MUST be either square or round.
`vehicle_types[].vehicle_assets.icon_last_modified`<br/>*(added in v2.3)*| REQUIRED | Date | Date that indicates the last time any included vehicle icon images were modified or updated. 
`vehicle_types[].default_pricing_plan_id`<br/>*(added in v2.3)*| Conditionally REQUIRED | ID | REQUIRED if `system_pricing_plans.json` is defined. A `plan_id`, as defined in `system_pricing_plans.json`, that identifies a default pricing plan for this vehicle to be used by trip planning applications for purposes of calculating the cost of a single trip using this vehicle type. This default pricing plan is superseded by `pricing_plan_id` when `pricing_plan_id` is defined in `vehicle_status.json` Publishers SHOULD define `default_pricing_plan_id` first and then override it using `pricing_plan_id` in `vehicle_status.json` when necessary.
`vehicle_types[].pricing_plan_ids`<br/>*(added in v2.3)* | OPTIONAL | Array&lt;ID&gt; | An array of `pricing_plan_ids`, as defined in `system_pricing_plans.json`, that are applied to this vehicle type. <br /><br />This array SHOULD be published when there are multiple pricing plans defined in `system_pricing_plans.json` that apply to a single vehicle type.

**Example:**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "vehicle_types": [
      {
        "vehicle_type_id": "abc123",
        "form_factor": "bicycle",
        "propulsion_type": "human",
        "name": [
          {
            "text": "Example Basic Bike",
            "language": "en"
          }
        ],
        "wheel_count": 2,
        "default_reserve_time": 30,
        "return_constraint": "any_station",
        "vehicle_assets": {
          "icon_url": "https://www.example.com/assets/icon_bicycle.svg",
          "icon_url_dark": "https://www.example.com/assets/icon_bicycle_dark.svg",
          "icon_last_modified": "2021-06-15"
        },
        "default_pricing_plan_id": "bike_plan_1",
        "pricing_plan_ids": [
          "bike_plan_1",
          "bike_plan_2",
          "bike_plan_3"
        ]
      },
      {
        "vehicle_type_id": "cargo123",
        "form_factor": "cargo_bicycle",
        "propulsion_type": "human",
        "name": [
          {
            "text": "Example Cargo Bike",
            "language": "en"
          }
        ],
        "description": [
          {
            "text": "Extra comfortable seat with additional suspension.\n\nPlease be aware of the cargo box lock: you need to press it down before pulling it up again!",
            "language": "en"
          }
        ],            
        "wheel_count": 3,
        "default_reserve_time": 30,
        "return_constraint": "roundtrip_station",
        "vehicle_assets": {
          "icon_url": "https://www.example.com/assets/icon_cargobicycle.svg",
          "icon_url_dark": "https://www.example.com/assets/icon_cargobicycle_dark.svg",
          "icon_last_modified": "2021-06-15"
        },
        "default_pricing_plan_id": "cargo_plan_1",
        "pricing_plan_ids": [
          "cargo_plan_1",
          "cargo_plan_2",
          "cargo_plan_3"
        ]
      },
      {
        "vehicle_type_id": "def456",
        "form_factor": "scooter_standing",
        "propulsion_type": "electric",
        "name": [
          {
            "text": "Example E-scooter V2",
            "language": "en"
          }
        ],
        "wheel_count": 2,
        "max_permitted_speed": 25,
        "rated_power": 350,
        "default_reserve_time": 30,
        "max_range_meters": 12345,
        "return_constraint": "free_floating",
        "vehicle_assets": {
          "icon_url": "https://www.example.com/assets/icon_escooter.svg",
          "icon_url_dark": "https://www.example.com/assets/icon_escooter_dark.svg",
          "icon_last_modified": "2021-06-15"
        },
        "default_pricing_plan_id": "scooter_plan_1"
      },
      {
        "vehicle_type_id": "car1",
        "form_factor": "car",
        "rider_capacity": 5,
        "cargo_volume_capacity": 200,
        "propulsion_type": "combustion_diesel",
        "eco_labels": [
          {
            "country_code": "FR",
            "eco_sticker": "critair_1"
          },
          {
            "country_code": "DE",
            "eco_sticker": "euro_2"
          }
        ],
        "name": [
          {
            "text": "Four-door Sedan",
            "language": "en"
          }
        ],
        "wheel_count": 4,
        "default_reserve_time": 0,
        "max_range_meters": 523992,
        "return_constraint": "roundtrip_station",
        "vehicle_accessories": [
          "doors_4",
          "automatic",
          "cruise_control"
        ],
        "g_CO2_km": 120,
        "vehicle_image": "https://www.example.com/assets/renault-clio.jpg",
        "make": [
          {
            "text": "Renault",
            "language": "en"
          }
        ],
        "model": [
          {
            "text": "Clio",
            "language": "en"
          }
        ],
        "color": "white",
        "vehicle_assets": {
          "icon_url": "https://www.example.com/assets/icon_car.svg",
          "icon_url_dark": "https://www.example.com/assets/icon_car_dark.svg",
          "icon_last_modified": "2021-06-15"
        },
        "default_pricing_plan_id": "car_plan_1"
      }
    ]
  }
}
```

### station_information.json

All stations included in `station_information.json` are considered public (meaning they can be shown on a map for public use). If there are private stations (such as Capital Bikeshare’s White House station), these SHOULD NOT be included here. Any station that is represented in `station_information.json` MUST have a corresponding entry in `station_status.json`.<br/>The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`stations` | REQUIRED | Array&lt;Object&gt; | Contains one object per station.
`stations[].station_id` | REQUIRED | ID | Identifier of a station.
`stations[].name` <br/>*(as of v3.0)* | REQUIRED | Array&lt;Localized String&gt; | The public name of the station for display in maps, digital signage, and other text applications. Names SHOULD reflect the station location through the use of a cross street or local landmark. Abbreviations SHOULD NOT be used for names and other text (for example, "St." for "Street") unless a location is called by its abbreviated name (for example, “JFK Airport”). See [Text Fields and Naming](#text-fields-and-naming). <br>Examples: <ul><li>Broadway and East 22nd Street</li><li>Convention Center</li><li>Central Park South</li></ul>.
`stations[].short_name` <br/>*(as of v3.0)*  | OPTIONAL | Array&lt;Localized String&gt; | Short name or other type of identifier.
`stations[].lat` | REQUIRED | Latitude | Latitude of the station in decimal degrees. This field SHOULD have a precision of 6 decimal places (0.000001). See [Coordinate Precision](#coordinate-precision).
`stations[].lon` | REQUIRED | Longitude | Longitude of the station in decimal degrees. This field SHOULD have a precision of 6 decimal places (0.000001). See [Coordinate Precision](#coordinate-precision).
`stations[].address` | OPTIONAL | String | Address (street number and name) where station is located. This MUST be a valid address, not a free-form text description. Example: 1234 Main Street
`stations[].cross_street` | OPTIONAL | String | Cross street or landmark where the station is located.
`stations[].region_id` | OPTIONAL | ID | Identifier of the region where station is located. See [system_regions.json](#system_regionsjson).
`stations[].post_code` | OPTIONAL | String | Postal code where station is located.
`stations[].city` <br/>*(added in v3.1-RC2)* | OPTIONAL | String | City where station is located.
`stations[].station_opening_hours` <br/>*(added in v3.0)* | OPTIONAL | String | Hours of operation for the station in [OSM opening_hours](https://wiki.openstreetmap.org/wiki/Key:opening_hours) format. If `station_opening_hours` is defined it overrides any `opening_hours` defined in `system_information.json` for the station for which it is defined.
`stations[].rental_methods` | OPTIONAL | Array&lt;String&gt; | Payment methods accepted at this station. <br /> Current valid values are:<br /> <ul><li>`key` (operator issued vehicle key / fob / card)</li><li>`creditcard`</li><li>`paypass`</li><li>`applepay`</li><li>`androidpay`</li><li>`transitcard`</li><li>`accountnumber`</li><li>`phone`</li></ul>
`stations[].is_virtual_station` <br/>*(added in v2.1)* | OPTIONAL | Boolean | Is this station a location with or without smart dock technology? <br /><br /> `true` - The station is a location without smart docking infrastructure.<br /><br /> `false` - The station consists of smart docking infrastructure (docks). <br /><br /> This field SHOULD be published by mobility systems that have station locations without standard, internet connected physical docking infrastructure. These may be racks or geofenced areas designated for rental and/or return of vehicles. Locations that fit within this description SHOULD have the `is_virtual_station` boolean set to `true`.
`stations[].station_area` <br/>*(added in v2.1)* | OPTIONAL | GeoJSON MultiPolygon | A GeoJSON MultiPolygon that describes the area of a virtual station. If `station_area` is supplied, then the record describes a virtual station. <br /><br /> If lat/lon and `station_area` are both defined, the lat/lon is the significant coordinate of the station (for example, parking facility or valet drop-off and pick up point). The `station_area` takes precedence over any `ride_start_allowed` and `ride_end_allowed` rules in overlapping `geofencing_zones`.
`stations[].parking_type` <br/>*(added in v2.3)* | OPTIONAL | Enum | Type of parking station.<br /><br />Current valid values are:<ul><li>`parking_lot` _(Off-street parking lot)_</li><li>`street_parking` _(Curbside parking)_</li><li>`underground_parking` _(Parking that is below street level, station may be non-communicating)_</li><li>`sidewalk_parking` _(Park vehicle on sidewalk, out of the pedestrian right of way)_</li><li>`other`</li></ul>
`stations[].parking_hoop`<br/>*(added in v2.3)* | OPTIONAL | Boolean | Are parking hoops present at this station?<br /><br />`true` - Parking hoops are present at this station.<br />`false` - Parking hoops are not present at this station.<br /><br />Parking hoops are lockable devices that are used to secure a parking space to prevent parking of unauthorized vehicles.
`stations[].contact_phone`<br/>*(added in v2.3)* | OPTIONAL | Phone number | Contact phone of the station.
`stations[].capacity` | OPTIONAL | Non-negative integer | Number of total docking points installed at this station, both available and unavailable, regardless of what vehicle types are allowed at each dock. <br/><br/>If this is a virtual station defined using the `is_virtual_station` field, this number represents the total number of vehicles of all types that can be parked at the virtual station.<br/><br/>If the virtual station is defined by `station_area`, this is the number that can park within the station area. If `lat`/`lon` are defined, this is the number that can park at those coordinates.
`stations[].vehicle_types_capacity` <br/>*(as of v3.0)* | OPTIONAL | Array&lt;Object&gt; | These objects are used to model the parking capacity of virtual stations (defined using the `is_virtual_station` field) for each vehicle type that can be returned to this station. The total number of vehicles from each of these objects SHOULD add up to match the value specified in the `capacity` field.
`stations[].vehicle_types_capacity[].vehicle_type_ids` <br/>*(as of v3.0)* | REQUIRED | Array&lt;ID&gt; | An array of `vehicle_type_ids`, as defined in `vehicle_types.json`, that may park at the virtual station.
`stations[].vehicle_types_capacity[].count`| REQUIRED | Non-negative integer | A number representing the total number of vehicles of the specified `vehicle_type_ids` that can park within the virtual station.<br /><br />If the virtual station is defined by `station_area`, this is the number that can park within the station area. If `lat`/`lon` is defined, this is the number that can park at those coordinates.
`stations[].vehicle_docks_capacity` <br/>*(as of v3.0)* | OPTIONAL | Array&lt;Object&gt; | These objects are used to model the total docking capacity of a station, both available and unavailable, for each type of vehicle that may dock at this station. The total number of docks from each of these objects SHOULD add up to match the value specified in the `capacity` field.
`stations[].vehicle_docks_capacity[].vehicle_type_ids` <br/>*(as of v3.0)* | REQUIRED | Array&lt;ID&gt; | An array of `vehicle_type_ids` that are able to use a particular type of dock at the station.
`stations[].vehicle_docks_capacity[].count`| REQUIRED | Non-negative integer | A number representing the total number of docks at the station, both available and unavailable, that may accept the vehicle types specified by `vehicle_type_ids`.
`stations[].is_valet_station` <br/>*(added in v2.1)* | OPTIONAL | Boolean | Are valet services provided at this station? <br /><br /> `true` - Valet services are provided at this station. <br /> `false` - Valet services are not provided at this station. <br /><br /> If this field is empty, it is assumed that valet services are not provided at this station. <br><br>This field’s boolean SHOULD be set to `true` during the hours which valet service is provided at the station. Valet service is defined as providing unlimited capacity at a station.
`stations[].is_charging_station` <br/>*(added in v2.3)* | OPTIONAL | Boolean | Does the station support charging of electric vehicles? <br /><br /> `true` - Electric vehicle charging is available at this station. <br /> `false` -  Electric vehicle charging is not available at this station.
`stations[].rental_uris` | OPTIONAL | Object | Contains rental URIs for Android, iOS, and web in the `android`, `ios`, and `web` fields. See [examples](#deep-links-examples) of how to use these fields and [supported analytics](#analytics).
`stations[].rental_uris.android` | OPTIONAL | URI | URI that can be passed to an Android app with an `android.intent.action.VIEW` Android intent to support Android Deep Links (https://developer.android.com/training/app-links/deep-linking). Please use Android App Links (https://developer.android.com/training/app-links) if possible so viewing apps do not need to manually manage the redirect of the user to the app store if the user does not have the application installed. <br><br>This URI SHOULD be a deep link specific to this station, and SHOULD NOT be a general rental page that includes information for more than one station. The deep link SHOULD take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking is not supported in the native Android rental app. <br><br>Note that the URI does not necessarily include the `station_id` for this station - other identifiers can be used by the rental app within the URI to uniquely identify this station. <br><br>See the [Analytics](#analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Android App Links example value: `https://www.example.com/app?sid=1234567890&platform=android` <br><br>Deep Link (without App Links) example value: `com.example.android://open.example.app/app?sid=1234567890`
`stations[].rental_uris.ios` | OPTIONAL | URI | URI that can be used on iOS to launch the rental app for this station. More information on this iOS feature can be found [here](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/communicating_with_other_apps_using_custom_urls?language=objc). Please use iOS Universal Links (https://developer.apple.com/ios/universal-links/) if possible so viewing apps provide a fallback web experience if the application is not installed. <br><br>This URI SHOULD be a deep link specific to this station, and SHOULD NOT be a general rental page that includes information for more than one station.  The deep link SHOULD take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking is not supported in the native iOS rental app. <br><br>Note that the URI does not necessarily include the `station_id` for this station - other identifiers can be used by the rental app within the URI to uniquely identify this station. <br><br>See the [Analytics](#analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>iOS Universal Links example value: `https://www.example.com/app?sid=1234567890&platform=ios` <br><br>Deep Link (without Universal Links) example value: `com.example.ios://open.example.app/app?sid=1234567890`
`stations[].rental_uris.web` | OPTIONAL | URL | URL that can be used by a web browser to show more information about renting a vehicle at this station. <br><br>This URL SHOULD be a deep link specific to this station, and SHOULD NOT be a general rental page that includes information for more than one station.  The deep link SHOULD take users directly to this station, without any prompts, interstitial pages, or logins. Make sure that users can see this station even if they never previously opened the application.  <br><br>If this field is empty, it means deep linking is not supported for web browsers. <br><br>Example value: `https://www.example.com/app?sid=1234567890`

**Example 1: Physical station with limited hours of operation**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "stations": [
      {
        "station_id": "pga",
        "name": [
          {
            "text": "Parking garage A",
            "language": "en"
          }
        ],
        "lat": 12.345678,
        "lon": 45.678901,
        "station_opening_hours": "Su-Th 05:00-22:00; Fr-Sa 05:00-01:00",
        "parking_type": "underground_parking",
        "parking_hoop": false,
        "contact_phone": "+33109874321",
        "is_charging_station": true,
        "vehicle_docks_capacity": [
          {
            "vehicle_type_ids": ["abc123"],
            "count": 7
          }
        ]
      }
    ]
  }
}
```

**Example 2: Virtual station**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "stations": [
      {
        "station_id": "station12",
        "name": [
          {
            "text": "SE Belmont & SE 10th",
            "language": "en"
          }
        ],
        "lat": 45.516445,
        "lon": -122.655775,
        "city": "Portland, OR",
        "is_valet_station": false,
        "is_virtual_station": true,
        "is_charging_station": false,
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
        "vehicle_types_capacity": [
          {
            "vehicle_type_ids": ["abc123", "def456"],
            "count": 15
          },
          {
            "vehicle_type_ids": ["def456"],
            "count": 1
          }

        ]
      }
    ]
  }
}
```

### station_status.json

Describes the capacity and rental availability of a station. Data returned SHOULD be as close to realtime as possible, but in no case should it be more than 5 minutes out-of-date.  See [Data Latency](#data-latency). Data reflects the operator's most recent knowledge of the station’s status. Any station that is represented in `station_status.json` MUST have a corresponding entry in `station_information.json`.<br/>The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`stations` | REQUIRED | Array&lt;Object&gt; | Contains one object per station.
`stations[].station_id` | REQUIRED | ID | Identifier of a station. See [station_information.json](#station_informationjson).
`stations[].num_vehicles_available` | REQUIRED | Non-negative integer | Number of functional vehicles physically at the station that may be offered for rental. To know if the vehicles are available for rental, see `is_renting`. <br/><br/>If `is_renting` = `true` this is the number of vehicles that are currently available for rent. If `is_renting` =`false` this is the number of vehicles that would be available for rent if the station were set to allow rentals.
`stations[].vehicle_types_available` <br/>*(added in v2.1)* | Conditionally REQUIRED | Array&lt;Object&gt; | REQUIRED if the [vehicle_types.json](#vehicle_typesjson) file has been defined. This field's value is an array of objects. Each of these objects is used to model the total number of each defined vehicle type available at a station. The total number of vehicles from each of these objects SHOULD add up to match the value specified in the `num_vehicles_available`  field.
`stations[].vehicle_types_available[].vehicle_type_id` <br/>*(added in v2.1)* | REQUIRED | ID | The `vehicle_type_id` of each vehicle type at the station as described in [vehicle_types.json](#vehicle_typesjson). A vehicle type not available at the station can be omitted from the list or specified with `count` = `0`.
`stations[].vehicle_types_available[].count` <br/>*(added in v2.1)* | REQUIRED | Non-negative integer | A number representing the total number of available vehicles of the corresponding `vehicle_type_id` as defined in [vehicle_types.json](#vehicle_typesjson) at the station.
`stations[].num_vehicles_disabled` | OPTIONAL | Non-negative integer | Number of disabled vehicles of any type at the station. Vendors who do not want to publicize the number of disabled vehicles or docks in their system can opt to omit station `capacity` (in [station_information.json](#station_informationjson), `num_vehicles_disabled`, and `num_docks_disabled` *(as of v2.0)*. If station `capacity` is published, then broken docks/vehicles can be inferred (though not specifically whether the decreased capacity is a broken vehicle or dock).
`stations[].num_docks_available` | Conditionally REQUIRED <br/>*(as of v2.0)* | Non-negative integer | REQUIRED except for stations that have unlimited docking capacity (e.g. virtual stations) *(as of v2.0)*. Number of functional docks physically at the station that are able to accept vehicles for return. To know if the docks are accepting vehicle returns, see `is_returning`. <br /><br/> If `is_returning` = `true` this is the number of docks that are currently available to accept vehicle returns. If `is_returning` = `false` this is the number of docks that would be available if the station were set to allow returns.
`stations[].vehicle_docks_available` <br/>*(added in v2.1)* | Conditionally REQUIRED | Array&lt;Object&gt; | This field is REQUIRED in feeds where the [vehicle_types.json](#vehicle_typesjson) is defined and where certain docks are only able to accept certain vehicle types. If every dock at the station is able to accept any vehicle type, then this field is not REQUIRED. This field's value is an array of objects. Each of these objects is used to model the number of docks available for certain vehicle types. The total number of docks from each of these objects SHOULD add up to match the value specified in the `num_docks_available` field.
`stations[].vehicle_docks_available[].vehicle_type_ids` <br/>*(added in v2.1)* | REQUIRED | Array&lt;ID&gt; | An array of `vehicle_type_ids` that are able to use a particular type of dock at the station
`stations[].vehicle_docks_available[].count` <br/>*(added in v2.1)* | REQUIRED | Non-negative integer | A number representing the total number of available vehicles of the corresponding vehicle type as defined in the `vehicle_types` array at the station that can accept vehicles of the specified types in the `vehicle_types` array.
`stations[].num_docks_disabled` | OPTIONAL | Non-negative integer | Number of disabled dock points at the station.
`stations[].is_installed` | REQUIRED | Boolean | Is the station currently on the street?<br/><br/>`true` - Station is installed on the street.<br/>`false` - Station is not installed on the street.<br/><br/>Boolean SHOULD be set to `true` when equipment is present on the street. In seasonal systems where equipment is removed during winter, boolean SHOULD be set to `false` during the off season. May also be set to false to indicate planned (future) stations which have not yet been installed.
`stations[].is_renting` | REQUIRED | Boolean | Is the station currently renting vehicles? <br /><br />`true` - Station is renting vehicles. Even if the station is empty, if it would otherwise allow rentals, this value MUST be `true`.<br/>`false` - Station is not renting vehicles.<br/><br/>If the station is temporarily taken out of service and not allowing rentals, this field MUST be set to `false`.<br/><br/>If a station becomes inaccessible to users due to road construction or other factors this field SHOULD be set to `false`. Field SHOULD be set to `false` during hours or days when the system is not offering vehicles for rent.
`stations[].is_returning` | REQUIRED | Boolean | Is the station accepting vehicle returns? <br /><br />`true` - Station is accepting vehicle returns. Even if the station is full, if it would otherwise allow vehicle returns, this value MUST be `true`.<br /> `false` - Station is not accepting vehicle returns.<br/><br/>If the station is temporarily taken out of service and not allowing vehicle returns, this field MUST be set to `false`.<br/><br/>If a station becomes inaccessible to users due to road construction or other factors, this field SHOULD be set to `false`.
`stations[].last_reported` | REQUIRED | Timestamp | The last time this station reported its status to the operator's backend.

**Example:**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 0,
  "version": "3.1-RC",
  "data": {
    "stations": [
      {
        "station_id": "station1",
        "is_installed": true,
        "is_renting": true,
        "is_returning": true,
        "last_reported": "2023-07-17T13:34:13+02:00",
        "num_docks_available": 3,
        "num_docks_disabled" : 1,
        "vehicle_docks_available": [
          {
            "vehicle_type_ids": [ "abc123", "def456" ],
            "count": 2
          },
          {
            "vehicle_type_ids": [ "def456" ],
            "count": 1
          }
        ],
        "num_vehicles_available": 1,
        "num_vehicles_disabled": 2,
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
        "last_reported": "2023-07-17T13:34:13+02:00",
        "num_docks_available": 8,
        "num_docks_disabled" : 1,
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
        "num_vehicles_available": 6,
        "num_vehicles_disabled": 1, 
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

### vehicle_status.json
*(as of v3.0, formerly free_bike_status)*
*(as of v2.1)* Describes all vehicles that are not currently in active rental. REQUIRED for free floating (dockless) vehicles. OPTIONAL for station based (docked) vehicles. Data returned SHOULD be as close to realtime as possible, but in no case should it be more than 5 minutes out-of-date.  See [Data Latency](#data-latency). Vehicles that are part of an active rental MUST NOT appear in this feed. Vehicles listed as available for rental MUST be in the field and accessible to users. Vehicles that are not accessible (for example, in a warehouse or in transit) MUST NOT appear as available for rental.<br/>The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`vehicles`<br />*(as of v3.0)*  | REQUIRED | Array&lt;Object&gt; | Contains one object per vehicle that is currently deployed in the field and not part of an active rental.
`vehicles[].vehicle_id`<br />*(as of v3.0)*  | REQUIRED | ID | Identifier of a vehicle. The `vehicle_id` identifier MUST be rotated to a random string after each trip to protect user privacy *(as of v2.0)*. Use of persistent vehicle IDs poses a threat to user privacy. The `vehicle_id` identifier SHOULD only be rotated once per trip.<br/><br/>The `vehicle_id` SHOULD be the same as in [vehicle_availability.json](#vehicle_availabilityjson) if the file has been defined.
`vehicles[].lat` | Conditionally REQUIRED <br/>*(as of v2.1)* | Latitude | Latitude of the vehicle in decimal degrees. *(as of v2.1)* REQUIRED if `station_id` is not provided for this vehicle (free floating). This field SHOULD have a precision of 6 decimal places (0.000001). See [Coordinate Precision](#coordinate-precision).
`vehicles[].lon` | Conditionally REQUIRED <br/>*(as of v2.1)* | Longitude | Longitude of the vehicle in decimal degrees. *(as of v2.1)* REQUIRED if `station_id` is not provided for this vehicle (free floating). This field SHOULD have a precision of 6 decimal places (0.000001). See [Coordinate Precision](#coordinate-precision).
`vehicles[].is_reserved` | REQUIRED | Boolean | Is the vehicle currently reserved? <br /><br /> `true` - Vehicle is currently reserved. <br /> `false` - Vehicle is not currently reserved.
`vehicles[].is_disabled` | REQUIRED | Boolean | Is the vehicle currently disabled? <br /><br /> `true` - Vehicle is currently disabled. <br /> `false` - Vehicle is not currently disabled.<br><br>This field is used to indicate vehicles that are in the field but not available for rental due to a mechanical issue or low battery etc. Publishing this data may prevent users from attempting to rent vehicles that are disabled and not available for rental. This field SHOULD NOT be set to `true` when the system is closed for vehicles that would otherwise be rentable. 
`vehicles[].rental_uris` | OPTIONAL | Object | JSON object that contains rental URIs for Android, iOS, and web in the `android`, `ios`, and `web` fields. See [examples](#deep-links-examples) of how to use these fields and [supported analytics](#analytics).
`vehicles[].rental_uris.android` | OPTIONAL | URI | URI that can be passed to an Android app with an android.intent.action.VIEW Android intent to support Android Deep Links (https://developer.android.com/training/app-links/deep-linking). Please use Android App Links (https://developer.android.com/training/app-links) if possible, so viewing apps do not need to manually manage the redirect of the user to the app store if the user does not have the application installed. <br><br>This URI SHOULD be a deep link specific to this vehicle, and SHOULD NOT be a general rental page that includes information for more than one vehicle. The deep link SHOULD take users directly to this vehicle, without any prompts, interstitial pages, or logins. Make sure that users can see this vehicle even if they never previously opened the application. Note that providers MUST rotate identifiers within deep links after each rental to avoid unintentionally exposing private vehicle trip origins and destinations.<br><br>If this field is empty, it means deep linking is not supported in the native Android rental app.<br><br>Note that the URI does not necessarily include the `vehicle_id` for this vehicle - other identifiers can be used by the rental app within the URI to uniquely identify this vehicle. <br><br>See the [Analytics](#analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>Android App Links example value: `https://www.example.com/app?sid=1234567890&platform=android` <br><br>Deep Link (without App Links) example value: `com.example.android://open.example.app/app?sid=1234567890`
`vehicles[].rental_uris.ios` | OPTIONAL | URI | URI that can be used on iOS to launch the rental app for this vehicle. More information on this iOS feature can be found [here](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/communicating_with_other_apps_using_custom_urls?language=objc). Please use iOS Universal Links (https://developer.apple.com/ios/universal-links/) if possible, so viewing apps provide a fallback web experience if the application is not installed. <br><br>This URI SHOULD be a deep link specific to this vehicle, and SHOULD NOT be a general rental page that includes information for more than one vehicle.  The deep link SHOULD take users directly to this vehicle, without any prompts, interstitial pages, or logins. Make sure that users can see this vehicle even if they never previously opened the application. Note that providers MUST rotate identifiers within deep links after each rental to avoid unintentionally exposing private vehicle trip origins and destinations. <br><br>If this field is empty, it means deep linking is not supported in the native iOS rental app.<br><br>Note that the URI does not necessarily include the `vehicle_id` - other identifiers can be used by the rental app within the URL to uniquely identify this vehicle. <br><br>See the [Analytics](#analytics) section for how viewing apps can report the origin of the deep link to rental apps. <br><br>iOS Universal Links example value: `https://www.example.com/app?sid=1234567890&platform=ios` <br><br>Deep Link (without Universal Links) example value: `com.example.ios://open.example.app/app?sid=1234567890`
`vehicles[].rental_uris.web` | OPTIONAL | URL | URL that can be used by a web browser to show more information about renting a vehicle at this vehicle. <br><br>This URL SHOULD be a deep link specific to this vehicle, and SHOULD NOT be a general rental page that includes information for more than one vehicle.  The deep link SHOULD take users directly to this vehicle, without any prompts, interstitial pages, or logins. Make sure that users can see this vehicle even if they never previously opened the application. Note that providers MUST rotate identifiers within deep links after each rental to avoid unintentionally exposing private vehicle trip origins and destinations.<br><br>If this field is empty, it means deep linking is not supported for web browsers. <br><br>Example value: `https://www.example.com/app?sid=1234567890`
`vehicles[].vehicle_type_id` <br/>*(added in v2.1)* | Conditionally REQUIRED | ID | The `vehicle_type_id` of this vehicle, as described in [vehicle_types.json](#vehicle_typesjson). REQUIRED if the [vehicle_types.json](#vehicle_typesjson) file is defined.
`vehicles[].last_reported` <br/>*(added in v2.1)* | OPTIONAL | Timestamp | The last time this vehicle reported its status to the operator's backend.
`vehicles[].current_range_meters` <br/>*(added in v2.1)* | Conditionally REQUIRED | Non-negative float | REQUIRED if the corresponding `vehicle_type` definition for this vehicle has a motor. This value represents the furthest distance in meters that the vehicle can travel with the vehicle's current charge or fuel (without recharging or refueling). Note that in the case of carsharing, the given range is indicative and can be different from the one displayed on the vehicle's dashboard.
`vehicles[].current_fuel_percent` <br/>*(added in v2.3)*| OPTIONAL | Non-negative float | This value represents the current percentage, expressed from 0 to 1, of fuel or battery power remaining in the vehicle.
`vehicles[].station_id` <br/>*(added in v2.1)* | Conditionally REQUIRED | ID | REQUIRED if the vehicle is currently at a station and the [vehicle_types.json](#vehicle_typesjson) file has been defined. Identifier referencing the `station_id` field in [station_information.json](#station_informationjson). 
`vehicles[].home_station_id` <br/>*(added in v2.3)* | OPTIONAL | ID | The `station_id` of the station this vehicle must be returned to as defined in [station_information.json](#station_informationjson).
`vehicles[].pricing_plan_id` <br/>*(added in v2.2)* | OPTIONAL | ID | The `plan_id` of the pricing plan this vehicle is eligible for as described in [system_pricing_plans.json](#system_pricing_plansjson). If this field is defined it supersedes `default_pricing_plan_id` in `vehicle_types.json`. This field SHOULD be used to override `default_pricing_plan_id` in `vehicle_types.json` to define pricing plans for individual vehicles when necessary.
`vehicles[].vehicle_equipment`<br/>*(added in v2.3)* | OPTIONAL | Array&lt;String&gt; | List of vehicle equipment provided by the operator in addition to the accessories already provided in the vehicle (field `vehicle_accessories` of `vehicle_types.json`) but subject to more frequent updates.<br/><br/>Current valid values are:<ul><li>`child_seat_a` _(Baby seat ("0-10kg"))_</li><li>`child_seat_b`	 _(Seat or seat extension for small children ("9-18 kg"))_</li><li>`child_seat_c`	_(Seat or seat extension for older children ("15-36 kg"))_</li><li>`winter_tires` 	_(Vehicle has tires for winter weather)_</li><li>`snow_chains`</li></ul>
`vehicles[].available_until`<br/>*(added in v2.3)* | OPTIONAL |  Datetime | The date and time when any rental of the vehicle must be completed. The vehicle must be returned and made available for the next user by this time. If this field is empty, it indicates that the vehicle is available indefinitely.<br /><br /> This field SHOULD be published by carsharing or other mobility systems where vehicles can be booked in advance for future travel.


**Example 1: Micromobility**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 0,
  "version": "3.1-RC",
  "data":{
    "vehicles":[
      {
        "vehicle_id":"973a5c94-c288-4a2b-afa6-de8aeb6ae2e5",
        "last_reported": "2023-07-17T13:34:13+02:00",
        "lat":12.345678,
        "lon":56.789012,
        "is_reserved":false,
        "is_disabled":false,
        "vehicle_type_id":"abc123",
        "rental_uris": {
          "android": "https://www.example.com/app?vehicle_id=973a5c94-c288-4a2b-afa6-de8aeb6ae2e5&platform=android&",
          "ios": "https://www.example.com/app?vehicle_id=973a5c94-c288-4a2b-afa6-de8aeb6ae2e5&platform=ios"
        }
      },
      {
        "vehicle_id":"987fd100-b822-4347-86a4-b3eef8ca8b53",
        "last_reported": "2023-07-17T13:34:13+02:00",
        "is_reserved":false,
        "is_disabled":false,
        "vehicle_type_id":"def456",
        "current_range_meters":6543.0,
        "station_id":"86",
        "pricing_plan_id":"plan3"
      }
    ]
  }
}
```

**Example 2: Carsharing**

```json

 {
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 0,
  "version": "3.1-RC",
  "data":{
    "vehicles":[
      {
        "vehicle_id":"45bd3fb7-a2d5-4def-9de1-c645844ba962",
        "last_reported": "2023-07-17T13:34:13+02:00",
        "lat":12.345678,
        "lon":56.789012,
        "is_reserved":false,
        "is_disabled":false,
        "vehicle_type_id":"abc123",
        "current_range_meters":400000.0,
        "available_until":"2021-05-17T15:00:00Z",
        "home_station_id":"station1",
        "vehicle_equipment":[
          "child_seat_a",
          "winter_tires"
        ]
      },
      {
        "vehicle_id":"d4521def-7922-4e46-8e1d-8ac397239bd0",
        "last_reported": "2023-07-17T13:34:13+02:00",
        "is_reserved":false,
        "is_disabled":false,
        "vehicle_type_id":"def456",
        "current_fuel_percent":0.7,
        "current_range_meters":6543.0,
        "station_id":"86",
        "pricing_plan_id":"plan3",
        "home_station_id":"146",
        "vehicle_equipment":[
          "child_seat_a"
        ]
      }
    ]
  }
}
```

### vehicle_availability.json

*(added in v3.1-RC2)*

Describes the future availability of each vehicle. Useful for systems that allow vehicles to be reserved in advance (e.g. carsharing, cargo bike share, etc). This file is OPTIONAL for station based (docked) vehicles. Not supported for free floating (dockless) vehicles. Data returned SHOULD be as close to realtime as possible, but in no case should it be more than 5 minutes out-of-date. See [Data Latency](#data-latency).<br/>The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`vehicles` | REQUIRED | Array&lt;Object&gt; | Contains one object per vehicle.
`vehicles[].vehicle_id` | REQUIRED | ID | Identifier of a vehicle. The `vehicle_id` identifier MUST be rotated to a random string after each trip to protect user privacy *(as of v2.0)*. Use of persistent vehicle IDs poses a threat to user privacy. The `vehicle_id` identifier SHOULD only be rotated once per trip.<br/><br/>The `vehicle_id` SHOULD be the same as in [vehicle_status.json](#vehicle_statusjson) if the file has been defined and the vehicle is currently available.
`vehicles[].vehicle_type_id` | REQUIRED | ID | Unique identifier of a vehicle type as defined in [vehicle_types.json](#vehicle_typesjson).
`vehicles[].station_id` | REQUIRED | ID | The `station_id` of the station where this vehicle is located when available as defined in [station_information.json](#station_informationjson).
`vehicles[].pricing_plan_id` | OPTIONAL | ID | The `plan_id` of the pricing plan this vehicle is eligible for as described in [system_pricing_plans.json](#system_pricing_plansjson). If this field is defined it supersedes `default_pricing_plan_id` in `vehicle_types.json`. This field SHOULD be used to override `default_pricing_plan_id` in `vehicle_types.json` to define pricing plans for individual vehicles when necessary.
`vehicles[].vehicle_equipment` | OPTIONAL | Array&lt;String&gt; | List of vehicle equipment provided by the operator in addition to the accessories already provided in the vehicle (field `vehicle_accessories` of `vehicle_types.json`) but subject to more frequent updates.<br/><br/>Current valid values are:<ul><li>`child_seat_a` _(Baby seat ("0-10kg"))_</li><li>`child_seat_b`	 _(Seat or seat extension for small children ("9-18 kg"))_</li><li>`child_seat_c`	_(Seat or seat extension for older children ("15-36 kg"))_</li><li>`winter_tires` 	_(Vehicle has tires for winter weather)_</li><li>`snow_chains`</li></ul>
`vehicles[].availabilities[]` | REQUIRED | Array&lt;Object&gt; | Array of time slots during which the specified vehicle is available.
`vehicles[].availabilities[].from` | REQUIRED | Datetime | Start date and time of available time slot.
`vehicles[].availabilities[].until` | OPTIONAL | Datetime | End date and time of available time slot. If this field is empty, it means that the vehicle is available all the time from the date in the `from` field.

**Example**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 0,
  "version": "3.1-RC2",
  "data": {
    "vehicles": [
      {
        "vehicle_id": "45bd3fb7-a2d5-4def-9de1-c645844ba962",
        "vehicle_type_id": "abc123",
        "station_id": "station1",
        "pricing_plan_id": "plan3",
        "vehicle_equipment": [
          "child_seat_a"
        ],
        "availabilities": [
          {
            "from": "2024-12-24T08:15:00Z",
            "until": "2024-12-24T09:15:00Z"
          },
          {
            "from": "2024-12-25T10:30:00Z"
          }
        ]
      },
      {
        "vehicle_id": "987fd100-b822-4347-86a4-b3eef8ca8b53",
        "vehicle_type_id": "def456",
        "station_id": "86",
        "availabilities": [
          {
            "from": "2024-12-24T08:45:00Z"
          }
        ]
      }
    ]
  }
}
```

### system_hours.json

This file has been removed in v3.0. For earlier versions see the [README](https://github.com/MobilityData/gbfs/blob/master/README.md#current-version-recommended). 

### system_calendar.json

This file has been removed in v3.0. For earlier versions see the [README](https://github.com/MobilityData/gbfs/blob/master/README.md#current-version-recommended). 

### system_regions.json

Describes regions for a system. Regions are a subset of a shared mobility system as defined by `system_id` in `system_information.json`. Regions may be defined for any purpose, for example political jurisdictions, neighborhoods or economic zones.<br/>The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`regions` | REQUIRED | Array&lt;Object&gt; | Contains one object per region.
`regions[].region_id` | REQUIRED | ID | Identifier for the region.
`regions[].name` <br/>*(as of v3.0)* | REQUIRED | Array&lt;Localized String&gt; | Public name for this region.

**Example:**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "regions": [
      {
        "name": [
          {
            "text": "North",
            "language": "en"
          }
        ],
        "region_id": "3"
      },
      {
        "name": [
          {
            "text": "East",
            "language": "en"
          }
        ],
        "region_id": "4"
      },
      {
        "name": [
          {
            "text": "South",
            "language": "en"
          }
        ],
        "region_id": "5"
      },
      {
        "name": [
          {
            "text": "West",
            "language": "en"
          }
        ],
        "region_id": "6"
      }
    ]
  }
}
```

### system_pricing_plans.json

Describes pricing for the system. <br/>The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`plans` | REQUIRED | Array&lt;Object&gt; | Contains one object per pricing plan.
`plans[].plan_id` | REQUIRED | ID | Identifier for a pricing plan in the system.
`plans[].url` | OPTIONAL | URL | URL where the customer can learn more about this pricing plan.
`plans[].name` <br/>*(as of v3.0)* | REQUIRED | Array&lt;Localized String&gt; | Name of this pricing plan.
`plans[].currency` | REQUIRED | String | Currency used to pay the fare. <br /><br /> This pricing is in ISO 4217 code: http://en.wikipedia.org/wiki/ISO_4217 <br />(for example, `CAD` for Canadian dollars, `EUR` for euros, or `JPY` for Japanese yen.)
`plans[].price` | REQUIRED | Non-Negative Float | Fare price, in the unit specified by `currency`. <br/>*(added in v2.2)* In case of non-rate price, this field is the total price. In case of rate price, this field is the base price that is charged only once per trip (typically the price for unlocking) in addition to `per_km_pricing` and/or `per_min_pricing`.
`plans[].reservation_price_per_min` <br/>*(added in v3.1-RC)* | OPTIONAL | Non-Negative Float | The cost, described as per minute rate, to reserve the vehicle prior to beginning a rental. This amount is charged for each minute of the vehicle reservation until the rental is initiated, or until the number of minutes defined in `vehicle_types.json#default_reserve_time` elapses, whichever comes first. When using this field, you MUST declare a value in `vehicle_types.json#default_reserve_time`. This field MUST NOT be combined in a single pricing plan with `reservation_price_flat_rate`.
`plans[].reservation_price_flat_rate` <br/>*(added in v3.1-RC)* | OPTIONAL | Non-Negative Float | The cost, described as a flat rate, to reserve the vehicle prior to beginning a rental. This amount is charged once to reserve the vehicle for the duration of the time defined by `vehicle_types.json#default_reserve_time`. When using this field, you MUST declare a value in `vehicle_types.json#default_reserve_time`. This field MUST NOT be combined in a single pricing plan with `reservation_price_per_min`.
`plans[].is_taxable` | REQUIRED | Boolean | Will additional tax be added to the base price?<br /><br />`true` - Yes.<br />  `false` - No.  <br /><br />`false` MAY be used to indicate that tax is not charged or that tax is included in the base price.
`plans[].description` <br/>*(as of v3.0)* | REQUIRED | Array&lt;Localized String&gt; | Customer-readable description of the pricing plan. This SHOULD include the duration, price, conditions, etc. that the publisher would like users to see.
`plans[].per_km_pricing` <br/>*(added in v2.2)* | OPTIONAL | Array&lt;Object&gt; | Array of segments when the price is a function of distance traveled, displayed in kilometers.<br /><br />Total cost is the addition of `price` and all segments in `per_km_pricing` and `per_min_pricing`. If this array is not provided, there are no variable costs based on distance.
`plans[].per_km_pricing[].start` <br/>*(added in v2.2)* | REQUIRED | Non-Negative Integer | The kilometer at which this segment rate starts being charged *(inclusive)*.
`plans[].per_km_pricing[].rate` <br/>*(added in v2.2)* | REQUIRED | Float | Rate that is charged for each kilometer `interval` after the `start`. Can be a negative number, which indicates that the traveler will receive a discount.
`plans[].per_km_pricing[].interval` <br/>*(added in v2.2)* | REQUIRED | Non-Negative Integer | Interval in kilometers at which the `rate` of this segment is either reapplied indefinitely, or if defined, up until (but not including) `end` kilometer.<br /><br />An interval of 0 indicates the rate is only charged once.
`plans[].per_km_pricing[].end` <br/>*(added in v2.2)* | OPTIONAL | Non-Negative Integer | The kilometer at which the rate will no longer apply *(exclusive)* for example, if `end` is `20` the rate no longer applies at 20.00 km.<br /><br /> If this field is empty, the price issued for this segment is charged until the trip ends, in addition to the cost of any subsequent segments.
`plans[].per_min_pricing` <br/>*(added in v2.2)* | OPTIONAL | Array&lt;Object&gt; | Array of segments when the price is a function of time traveled, displayed in minutes.<br /><br />Total cost is the addition of `price` and all segments in `per_km_pricing` and `per_min_pricing`. If this array is not provided, there are no variable costs based on time.
`plans[].per_min_pricing[].start` <br/>*(added in v2.2)* | REQUIRED | Non-Negative Integer | The minute at which this segment rate starts being charged *(inclusive)*.
`plans[].per_min_pricing[].rate` <br/>*(added in v2.2)* | REQUIRED | Float | Rate that is charged for each minute `interval` after the `start`. Can be a negative number, which indicates that the traveler will receive a discount.
`plans[].per_min_pricing[].interval` <br/>*(added in v2.2)* | REQUIRED | Non-Negative Integer | Interval in minutes at which the `rate` of this segment is either reapplied indefinitely, or up until (but not including) the `end` minute, if `end` is defined.<br /><br />An interval of 0 indicates the rate is only charged once.
`plans[].per_min_pricing[].end` <br/>*(added in v2.2)* | OPTIONAL | Non-Negative Integer | The minute at which the rate will no longer apply  *(exclusive)* for example, if `end` is `20` the rate no longer applies after 19:59.<br /><br />If this field is empty, the price issued for this segment is charged until the trip ends, in addition to the cost of any subsequent segments.
`plans[].surge_pricing` <br/>*(added in v2.2)* | OPTIONAL | Boolean | Is there currently an increase in price in response to increased demand in this pricing plan? If this field is empty, it means there is no surge pricing in effect.<br /><br />`true` - Surge pricing is in effect.<br />  `false` - Surge pricing is not in effect.
`plans[].fare_capping` <br/>*(added in v3.1-RC2)* | OPTIONAL | Object | Object defining a capped fare once a price threshold has been spent within a timeframe. The same fare cap applies to each subsequent timeframe. For example, a fare capped at 15.00 CAD per 12-hour period.
`plans[].fare_capping.duration` <br/>*(added in v3.1-RC2)* | REQUIRED | Non-Negative Integer | Amount of time in minutes during which the fare is capped.
`plans[].fare_capping.price` <br/>*(added in v3.1-RC2)* | REQUIRED | Non-Negative Float | The maximum fare threshold for the current timeframe, in the unit specified by `currency`.

**Example 1:**

The user does not pay more than the base price for the first 10 km. After 10 km the user pays $1 per km. After 25 km the user pays $0.50 per km and an additional $3 every 5 km, the extension price, in addition to $0.50 per km.

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "plans": [
      {
        "plan_id": "plan2",
        "name": [
          {
            "text": "One-Way",
            "language": "en"
          }
        ],
        "currency": "USD",
        "price": 2.00,
        "reservation_price_per_min": 0.15,
        "is_taxable": false,
        "description": [
          {
            "text": "Includes 10km, overage fees apply after 10km.",
            "language": "en"
          }
        ],
        "per_km_pricing": [
          {
            "start": 10,
            "rate": 1.00,
            "interval": 1,
            "end": 25
          },
          {
            "start": 25,
            "rate": 0.50,
            "interval": 1
          },
          {
            "start": 25,
            "rate": 3.00,
            "interval": 5
          }
        ]
      }
    ]
  }
}
```

**Example 2:**

This example demonstrates a pricing scheme that has a rate both by minute and by km. The user is charged $0.25 per km as well as $0.50 per minute. Both of these rates happen concurrently and are not dependent on one another. The fare is capped at 15.00 CAD per 12-hour period (720 minutes).

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "plans": [
      {
        "plan_id": "plan3",
        "name": [
          {
            "text": "Simple Rate",
            "language": "en"
          }
        ],
        "currency": "CAD",
        "price": 3.00,
        "is_taxable": true,
        "description": [
          {
            "text": "$3 unlock fee, $0.25 per kilometer and 0.50 per minute, capped at $15 per 12-hour period.",
            "language": "en"
          }
        ],
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
        ],
        "fare_capping": {
          "duration": 720,
          "price": 15.00
        }
      }
    ]
  }
}
```

### system_alerts.json

This feed is intended to inform customers about changes to the system that do not fall within the normal system operations. For example, system closures due to weather would be listed here, but a system that only operated for part of the year would have that schedule listed in the `system_calendar.json` feed.<br />
Obsolete alerts SHOULD be removed so the client application can safely present to the end user everything present in the feed. <br/>The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`alerts` | REQUIRED | Array&lt;Object&gt; | Contains one object per system alert.
`alerts[].alert_id` | REQUIRED | ID | Identifier for this alert.
`alerts[].type` | REQUIRED | Enum | Valid values are:<br /><br /><ul><li>`system_closure`</li><li>`station_closure`</li><li>`station_move`</li><li>`other`</li></ul>
`alerts[].times` | OPTIONAL | Array&lt;Object&gt; | The fields `start` and `end` indicate when the alert is in effect (for example, when the system or station is actually closed, or when a station is scheduled to be moved).
`alerts[].times[].start` | REQUIRED | Timestamp | Start time of the alert.
`alerts[].times[].end` | OPTIONAL | Timestamp | End time of the alert. If there is currently no end time planned for the alert, this can be omitted.
`alerts[].station_ids` | OPTIONAL | Array&lt;ID&gt; | If this is an alert that affects one or more stations, include their ID(s). Otherwise omit this field. If both `station_ids` and `region_ids` are omitted, this alert affects the entire system.
`alerts[].region_ids` | OPTIONAL | Array&lt;ID&gt; | If this system has regions, and if this alert only affects certain regions, include their ID(s). Otherwise, omit this field. If both `station_ids` and `region_ids` are omitted, this alert affects the entire system.
`alerts[].url` <br/>*(as of v3.0)* | OPTIONAL | Array&lt;Localized URL&gt; | A fully qualified URL where the customer can learn more information about this alert.
`alerts[].summary` <br/>*(as of v3.0)*  | REQUIRED | Array&lt;Localized String&gt; | A short summary of this alert to be displayed to the customer.
`alerts[].description` <br/>*(as of v3.0)*  | OPTIONAL | Array&lt;Localized String&gt; | Detailed description of the alert.
`alerts[].last_updated` | OPTIONAL | Timestamp | Indicates the last time the info for the alert was updated.

**Example:**

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 60,
  "version": "3.1-RC",
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
            "start": "2023-07-17T13:34:13+02:00",
            "end": "2023-07-18T13:34:13+02:00"
          }
        ],
        "url": [
          {
            "text": "https://example.com/more-info",
            "language": "en"
          }
        ], 
        "summary": [
          {
            "text": "Disruption of Service",
            "language": "en"
          }
        ],
        "description": [
          {
            "text": "The three stations on Broadway will be out of service from 12:00am Nov 3 to 3:00pm Nov 6th to accommodate road work",
            "language": "en"
          }
        ],
        "last_updated": "2023-07-17T13:34:13+02:00"
      }
    ]
  }
}
```

### geofencing_zones.json

*(added in v2.1)*

Describes geofencing zones and their associated rules and attributes. Geofenced areas are delineated using GeoJSON in accordance with [RFC 7946](https://tools.ietf.org/html/rfc7946).

When `geofencing_zones.json` is defined, the `global_rules` field determines the default ride restrictions for all areas not explicitly covered by a geofence zones and its associated rules.  See [Geofencing Rule Precedence](#geofencing-rule-precedence) for more details.  When `geofencing_zones.json` is not defined, then no such ride restrictions apply.

Geofences and GPS operate in two dimensions. Restrictions placed on an overpass or bridge will also  be applied to the roadway or path beneath.<br><br>Care SHOULD be taken when developing geofence based policies that rely on location data.  Location data from GPS, cellular and Wi-Fi signals are subject to interference resulting in accuracy levels in the tens of meters or greater.  This may result in vehicles being placed within a geofenced zone when they are actually outside or adjacent to the zone. Transit time between server and client can also impact when a user is notified of a geofence based policy. A vehicle traveling at 15kph can be well inside of a restricted zone before a notification is received.

The following fields are all attributes within the main `data` object for this feed.

Field Name | REQUIRED | Type | Defines
---|---|---|---
`geofencing_zones` | REQUIRED | GeoJSON FeatureCollection | Each geofenced zone and its associated rules and attributes is described as an object within the array of features, as follows.
`geofencing_zones[].type` | REQUIRED | String | “FeatureCollection” (as per IETF [RFC 7946](https://tools.ietf.org/html/rfc7946#section-3.3)).
`geofencing_zones[].features` | REQUIRED | Array&lt;Object&gt; | An array of GeoJSON Feature representing the geofenced zone.
`geofencing_zones[].features[].type` | REQUIRED | String | “Feature” (as per IETF [RFC 7946](https://tools.ietf.org/html/rfc7946#section-3.3)).
`geofencing_zones[].features[].geometry` | REQUIRED | GeoJSON MultiPolygon | A polygon that describes where rides may or may not be able to start, end, go through, or have other limitations or affordances. Rules may only apply to the interior of a polygon. All geofencing zones contained in this list are public (meaning they can be displayed on a map for public use).
`geofencing_zones[].features[].properties` | REQUIRED | Object | Travel allowances and limitations.
`geofencing_zones[].features[].properties.name` <br/>*(as of v3.0)*  | OPTIONAL | Array&lt;Localized String&gt; | Public name of the geofencing zone.
`geofencing_zones[].features[].properties.start` | OPTIONAL | Timestamp | Start time of the geofencing zone. If the geofencing zone is always active, this can be omitted.
`geofencing_zones[].features[].properties.end` | OPTIONAL | Timestamp | End time of the geofencing zone. If the geofencing zone is always active, this can be omitted.
`geofencing_zones[].features[].properties.rules` | OPTIONAL | Array&lt;[Rule](#geofencing-rule-object)&gt; | Array of [Rule](#geofencing-rule-object) objects defining restrictions that apply within the area of the polygon.  See [Geofencing Rule Precedence](#geofencing-rule-precedence) for details on semantics of overlapping polygons, vehicle types, and other precedence rules.
`global_rules` <br/>*(added in v3.0)* | REQUIRED | Array&lt;[Rule](#geofencing-rule-object)&gt; | Array of [Rule](#geofencing-rule-object) objects defining restrictions that apply globally in all areas as the default restrictions, except where overridden with an explicit geofencing zone.  See [Geofencing Rule Precedence](#geofencing-rule-precedence) for more details.<br/>A rule or list of rules, as appropriate, must be specified in the global rules list covering all vehicle types in the feed.

#### Geofencing Rule Object

A `Rule` object defines the set of restrictions in place for a particular zone.  `Rule` objects are used as a value type in multiple places in `geofencing_zones.json`.  A `Rule` object has the following fields:

Field Name | REQUIRED | Type | Defines
---|---|---|---
`vehicle_type_ids` <br/>*(as of v3.0)* | OPTIONAL | Array&lt;ID&gt; | An array of `vehicle_type_ids` for which any restrictions SHOULD be applied (see vehicle type definitions in `vehicle_types.json`). If `vehicle_type_ids` are not specified, then restrictions apply to all vehicle types.
`ride_start_allowed` | REQUIRED | Boolean | Is the ride allowed to start in this zone? <br /><br /> `true` - Ride can start in this zone. <br /> `false` - Ride cannot start in this zone.
`ride_end_allowed` | REQUIRED | Boolean | Is the ride allowed to end in this zone? <br /><br /> `true` - Ride can end in this zone. <br /> `false` - Ride cannot end in this zone.
`ride_through_allowed` | REQUIRED | Boolean | Is the ride allowed to travel through this zone? <br /><br /> `true` - Ride can travel through this zone. <br /> `false` - Ride cannot travel through this zone.
`maximum_speed_kph` | OPTIONAL | Non-negative Integer | What is the maximum speed allowed, in kilometers per hour? <br /><br /> If there is no maximum speed to observe, this can be omitted.
`station_parking`<br/>*(added in v2.3)* | OPTIONAL | Boolean | Can vehicles only be parked at stations defined in `station_information.json` within this geofence zone? <br /><br />`true` - Vehicles can only be parked at stations.  <br /> `false` - Vehicles may be parked outside of stations.

#### Geofencing Rule Precedence

Geofencing [Rule](#geofencing-rule-object) objects are specified within arrays for the `rules` and `global_rules` fields of `geofencing_zones.json` to allow for different restrictions for different vehicle types.  When multiple rules in the same array apply to a particular vehicle type, per the semantics of the `vehicle_type_ids` field, then the earlier rule (in order of the JSON file) takes precedence for that vehicle type.

When multiple overlapping polygons define rules that apply to a particular vehicle type, then the rules from the earlier polygon (in order of the JSON file) takes precedence for that vehicle type in the overlapping area.  Polygons with inactive time ranges should be excluded from consideration when considering precedence.

When a polygon and the `global_rules` field define rules that apply to a particular vehicle type, then the rules from the polygon take precedence for that vehicle type in the area of the polygon.

See examples below.

#### Geofencing Examples

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
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
              ]
            ]
          },
          "properties": {
            "name": [
              {
                "text": "NE 24th/NE Knott",
                "language": "en"
              }
            ],
            "start": "2023-07-17T13:34:13+02:00",
            "end": "2024-07-18T13:34:13+02:00",
            "rules": [
              {
                "vehicle_type_ids": [
                  "moped1",
                  "car1"
                ],
                "ride_start_allowed": true,
                "ride_end_allowed": true,
                "ride_through_allowed": true,
                "maximum_speed_kph": 10,
                "station_parking": true
              }
            ]
          }
        }
      ]
    },
    "global_rules": [
      {
        "ride_start_allowed": false,
        "ride_end_allowed": false,
        "ride_through_allowed": true
      }
    ]
  }
}
```

##### Polygon Overlap Examples

The following polygon diagram will be used in a number of examples below of geofencing rule resolution.

![Geofencing Example Diagram with two overlapping polygons A and B, and areas a, b, and ab.](https://raw.githubusercontent.com/MobilityData/gbfs/master/images/geofencing_example.svg)

In the examples below, only a minimal set of fields are specified for clarity.

##### Partially Overlapping Polygons with Same Vehicle Types

```json
"geofencing_zones.features": [
  {
    "geometry": { "#": "... Polygon A ..." },
    "properties": {
      "rules": [
        {
          "vehicle_type_ids": ["bike"],
          "ride_through_allowed": true
        }
      ]
    }
  },
  {
    "geometry": { "#": "... Polygon B ..." },
    "properties": {
      "rules": [
        {
          "vehicle_type_ids": ["bike"],
          "ride_through_allowed": false,
          "maximum_speed_kph": 20
        }
      ]
    }
  }
],
"global_rules": [
  {
    "vehicle_type_ids": ["bike"],
    "ride_through_allowed": false,
    "maximum_speed_kph": 10
  }
]
```
 
Both polygons specify rules for vehicle type `bike`.  In addition, there is a global rule for `bike` as well.  For `ride_through_allowed`, which is defined in both polygons, polygon A takes precedence over polygon B in area `ab` because it appears earlier in the JSON.  For `maximum_speed_kph`, only polygon B specifies a rule for this restriction, so it is used for area `ab`, despite the presence of polygon A.  For the remainder of polygon A in area `a`, the speed defaults to the global rule.


Area | Vehicle Type | ride_through_allowed | maximum_speed_kph
---|------|-------|----------
a  | bike | true  | 10
ab | bike | true  | 20 
b  | bike | false | 20
g  | bike | false | 10


##### Partially Overlapping Polygons with Different Vehicle Types

```json
"geofencing_zones.features": [
  {
    "geometry": { "#": "... Polygon A ..." },
    "properties": {
      "rules": [
        {
          "vehicle_type_ids": ["bike"],
          "ride_through_allowed": true
        }
      ]
    }
  },
  {
    "geometry": { "#": "... Polygon B ..." },
    "properties": {
      "rules": [
        {
          "vehicle_type_ids": ["scooter"],
          "ride_through_allowed": false
        }
      ]
    }
  }
],
"global_rules": [
  {
    "vehicle_type_ids": ["bike"],
    "ride_through_allowed": false
  },
  {
    "vehicle_type_ids": ["scooter"],
    "ride_through_allowed": true
  }
]
``` 

Though polygon A appears earlier in the file than polygon B, polygon A does not mention vehicle type `scooter`, so it is not considered when determining applicable rules for area `ab` for scooters.

Area | Vehicle Type | ride_through_allowed
---|---------|-------
a  | bike    | true
ab | bike    | true
b  | bike    | false
g  | bike    | false
a  | scooter | true
ab | scooter | false
b  | scooter | false
g  | scooter | true


##### Partially Overlapping Polygons with Some Overlapping Vehicle Types

```json
"geofencing_zones.features": [
  {
    "geometry": { "#": "... Polygon A ..." },
    "properties": {
      "rules": [
        {
          "vehicle_type_ids": ["bike", "scooter"],
          "ride_through_allowed": true
        }
      ]
    }
  },
  {
    "geometry": { "#": "... Polygon B ..." },
    "properties": {
      "rules": [
        {
          "vehicle_type_ids": ["scooter"],
          "ride_through_allowed": false
        }
      ]
    }
  }
],
"global_rules": [
  {
    "ride_through_allowed": false
  }
]
```

For vehicle type `scooter`, polygon A takes precedence over Polygon B in area `ab` because it appears earlier in the JSON.

Area | Vehicle Type | ride_through_allowed
---|---------|-------
a  | bike    | true
ab | bike    | true
b  | bike    | false
g  | bike    | false
a  | scooter | fales
ab | scooter | true
b  | scooter | false
g  | scooter | false

## Deep Links

Deep links to iOS, Android, and web apps are supported via URIs in the `system_information.json`, `station_information.json`, and `vehicle_status.json` files. The following sections describe how analytics can be added to these URIs, as well as some examples. For further examples, see ["What's New in GBFS"](https://medium.com/@mobilitydata/whats-new-in-gbfs-v2-0-63eb46e6bdc4).

### Analytics

In all of the rental URI fields, a viewing app can report the origin of a deep link request to a rental app by appending the `client_id` parameter to the URI along with the domain name for the viewing app.

For example, if Google is the viewing app, it can append:

`client_id=google.com`

...to the URI field to report that Google is the originator of the deep link request. If the Android URI is:

`com.example.android://open.example.app/stations?id=1234567890`

...then the URI used by Google would be: `com.example.android://open.example.app/stations?id=1234567890&client_id=google.com`

Other supported parameters include:

1. `ad_id`  - Advertising ID issued to the viewing app (for example, IFDA on iOS)
2. `token`  - A token identifier that was issued by the rental app to the viewing app.

#### Deep links Examples 

**Example 1 - App Links on Android and Universal Links on iOS are supported:**

***system_information.json***

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "name": [
      {
        "text": "Example Bike Rental",
        "language": "en"
      }
    ],
    "system_id": "example_cityname",
    "timezone": "America/Chicago",
    "languages": ["en"],
    "rental_apps": {
      "android": {
        "store_uri": "https://play.google.com/store/apps/details?id=com.example.android",
        "discovery_uri": "com.example.android://"
      },
      "ios": {
        "store_uri": "https://apps.apple.com/app/apple-store/id123456789",
        "discovery_uri": "com.example.ios://"
      }
    }
  }
}
```

***station_information.json***

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "stations": [
      {
        "station_id": "425",
        "name": [
          {
            "text": "Coppertail",
            "language": "en"
          }
        ],
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

Note that the Android URI and iOS Universal Link URLs do not necessarily use the same identifier as the `station_id`.

**Example 2 - App Links are not supported on Android and Universal Links are not supported on iOS, but deep links are still supported on Android and iOS:**

***system_information.json***

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "name": [
      {
        "text": "Example Bike Rental",
        "language": "en"
      }
    ],
    "system_id": "example_cityname",
    "timezone": "America/Chicago",
    "languages": ["en"],
    "rental_apps": {
      "android": {
        "discovery_uri": "com.example.android://",
        "store_uri": "https://play.google.com/store/apps/details?id=com.example.android"
      },
      "ios": {
        "store_uri": "https://apps.apple.com/app/apple-store/id123456789",
        "discovery_uri": "com.example.ios://"
      }
    }
  }
}
```

***station_information.json***

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "stations": [
      {
        "station_id": "425",
        "name": [
          {
            "text": "Coppertail",
            "language": "en"
          }
        ],
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

**Example 3 - Deep link web URLs are supported, but not Android or iOS native apps:**

***station_information.json***

```json
{
  "last_updated": "2023-07-17T13:34:13+02:00",
  "ttl": 300,
  "version": "3.1-RC",
  "data": {
    "stations": [
      {
        "station_id": "425",
        "name": [
          {
            "text": "Coppertail",
            "language": "en"
          }
        ],
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

_Apple Pay, PayPass, and other third-party product and service names are trademarks or registered trademarks of their respective owners._

## License

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/).
