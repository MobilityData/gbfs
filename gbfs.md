# General Bikeshare Feed Specification (GBFS)
This document explains the types of files and data that comprise the General Bikeshare Feed Specification (GBFS) and defines the fields used in all of those files.

## Table of Contents

* [Revision History](#revision-history)
* [Introduction](#introduction)
* [Files](#files)
* [File Requirements](#file-requirements)
* [Field Definitions](#field-definitions)
    * [gbfs.json](#gbfsjson)
    * [system_information.json](#system_informationjson)
    * [station_information.json](#station_informationjson)
    * [station_status.json](#station_statusjson)
    * [free_bike_status.json](#free_bike_statusjson)
    * [system_hours.json](#system_hoursjson)
    * [system_calendar.json](#system_calendarjson)
    * [system_regions.json](#system_regionsjson)
    * [system_pricing_plans.json](#system_pricing_plansjson)
    * [system_alerts.json](#system_alertsjson)
* [Possible Future Enhancements](#possible-future-enhancements)

## Revision History
* 11/05/2015 - GBFS V1.0 Adopted by NABSA board
* 08/2015 - Latest changes incorporated and name change to GBFS (comments from Motivate, 8D, others)
* 06/2015 - Proposed refinements (prepared by Jesse Chan-Norris on behalf of Motivate)
* 01/2015 - NABSA Draft (prepared by Mitch Vars)

## Introduction
This specification has been designed with the following concepts in mind:

* Provide the status of the system at this moment
* Do not provide information whose primary purpose is historical

Historical data, including station details and ride data is to be provided by a more compact specification designed specifically for such archival purposes. The data in the specification contained in this document is intended for consumption by clients intending to provide real-time (or semi-real-time) transit advice and is designed as such.

## Files
This specification defines the following files along with their associated content:

File Name                   | Required      | Defines
--------------------------- | ------------  | ----------
gbfs.json                   | Optional      | Auto-discovery file that links to all of the other files published by the system. This file is optional, but highly recommended.
system_information.json     | Yes           | Describes the system including System operator, System location, year implemented, URLs, contact info, time zone
station_information.json    | Yes           | Mostly static list of all stations, their capacities and locations
station_status.json         | Yes           | Number of available bikes and docks at each station and station availability
free_bike_status.json       | Optional      | Describes bikes that are available in non station-based systems
system_hours.json           | Optional      | Describes the hours of operation for the system
system_calendar.json        | Optional      | Describes the days of operation for the system
system_regions.json         | Optional      | Describes the regions the system is broken up into
system_pricing_plans.json   | Optional      | Describes the system pricing
system_alerts.json          | Optional      | Describes current system alerts

## File Requirements
* All files should be valid JSON
* All data should be UTF-8 encoded
* Line breaks should be represented by unix newline characters only (\n)

### File Distribution
* This specification does not dictate the implementation details around the distribution of the JSON data files
* If the publisher intends to distribute as individual HTTP endpoints then:
    * Required files must not 404 - they should return a properly formatted JSON file as defined in Output Format
    * Optional files may 404 - a 404 of an optional file should not be considered an error, it just indicates that the publisher has chosen not to publish this data
* Auto-Discovery:
    * This specification supports auto-discovery
    * The location of the auto-discovery file will be provided in the HTML <head> area of the bikeshare landing page hosted at the URL specified in the url field of the system_infomation.json file
    * This is referenced via a _link_ tag with the following format:
      * `<link rel="gbfs" type="application/json" href="https://www.example.com/data/gbfs.json" />`
    * Reference:
      * https://developers.facebook.com/docs/sharing/best-practices#tags
      * https://dev.twitter.com/cards/markup
      * http://microformats.org/wiki/existing-rel-values
      * http://microformats.org/wiki/rel-faq#How_is_rel_used

### Localization

* Each set of data files should be distributed in a single language as defined in system_information.json
* A system that wants to publish feeds in multiple languages should do so by publishing multiple distributions, such as
    * https://www.example.com/data/en/system_information.json
    * https://www.example.com/data/fr/system_information.json

## Field Definitions

* Time stamp fields must be represented as integers in POSIX time (i.e., the number of seconds since January 1st 1970 00:00:00 UTC)
* ID fields in the document should be represented as strings that identify that particular object. They:
    * must be unique within like fields (bike_id must be unique among bikes)
    * do not have to be globally unique
    * must not contain spaces
    * should be persistent for a given object (station, plan, etc)
* Text fields can only contain text - they must not contain any formatting codes (including HTML) other than newlines
* Enumerable values should be expected to change over time. Values will not be removed, but new valid values may be added as business requirements change and consumers should be designed to handle these changes

### Output Format
Every JSON file presented in this specification contains the same common header information at the top level of the JSON response object:

Field Name          | Required  | Defines
--------------------| ----------| ----------
last_updated        | Yes       | Integer POSIX timestamp indicating the last time the data in this feed was updated
ttl                 | Yes       | Integer representing the number of seconds before the data in this feed will be updated again (0 if the data should always be refreshed)
data                | Yes       | JSON hash containing the data fields for this response

Example:
```json
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
The following fields are all attributes within the main "data" object for this feed.

Field Name              | Required    | Defines
------------------------| ------------| ----------
_language_              | Yes         | The language that all of the contained files will be published in. This language must match the value in the system_information file
  \- feeds               | Yes         | An array of all of the feeds that are published by this auto-discovery file
  \- name                | Yes         | Key identifying the type of feed this is (e.g. "system_information", "station_information")
  \- url                 | Yes         | Full URL for the feed

Example:

```json
{
  "last_updated": 1434054678,
  "ttl": 0,
  "data": {
    "en": {
      "feeds": [
        {
          "name": "system_information",
          "url": "https://www.example.com/gbfs/en/system_information"
        },
        {
          "name": "station_information",
          "url": "https://www.example.com/gbfs/en/station_information"
        }
      ]
    },
    "fr" : {
      "feeds": [
        {
          "name": "system_information",
          "url": "https://www.example.com/gbfs/fr/system_information"
        },
        {
          "name": "station_information",
          "url": "https://www.example.com/gbfs/fr/station_information"
        }
      ]
    }
  }
}
```

### system_information.json
The following fields are all attributes within the main "data" object for this feed.

Field Name        | Required  | Defines
------------------| --------- | ----------
system_id         | Yes       | ID field - identifier for this bike share system. This should be globally unique (even between different systems) and it is currently up to the publisher of the feed to guarantee uniqueness. In addition, this value is intended to remain the same over the life of the system
language          | Yes       | An IETF language tag indicating the language that will be used throughout the rest of the files. This is a string that defines a single language tag only. See https://tools.ietf.org/html/bcp47 and https://en.wikipedia.org/wiki/IETF_language_tag for details about the format of this tag
name              | Yes       | Full name of the system to be displayed to customers
short_name        | Optional  | Optional abbreviation for a system
operator          | Optional  | Name of the operator of the system
url               | Optional  | The URL of the bike share system. The value must be a fully qualified URL that includes http:// or https://, and any special characters in the URL must be correctly escaped. See http://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URL values
purchase_url      | Optional  | A fully qualified URL where a customer can purchase a membership or learn more about purchasing memberships
start_date        | Optional  | String in the form YYYY-MM-DD representing the date that the system began operations
phone_number      | Optional  | A single voice telephone number for the specified system. This field is a string value that presents the telephone number as typical for the system's service area. It can and should contain punctuation marks to group the digits of the number. Dialable text (for example, Capital Bikeshare’s  "877-430-BIKE") is permitted, but the field must not contain any other descriptive text
email             | Optional  | A single contact email address for customers to address questions about the system
timezone          | Yes       | The time zone where the system is located. Time zone names never contain the space character but may contain an underscore. Please refer to the "TZ" value in https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for a list of valid values
license_url       | Optional  | A fully qualified URL of a page that defines the license terms for the GBFS data for this system, as well as any other license terms the system would like to define (including the use of corporate trademarks, etc)


### station_information.json
All stations contained in this list are considered public (ie, can be shown on a map for public use). If there are private stations (such as Capital Bikeshare’s White House station) these should not be exposed here and their status should not be included in station_status.json.

Field Name        | Required  | Defines
------------------| --------- | ----------
stations          | Yes       | Array that contains one object per station in the system as defined below
\- station_id      | Yes       | Unique identifier of a station. See [Field Definitions](#field-definitions) above for ID field requirements
\- name            | Yes       | Public name of the station
\- short_name      | No        | Short name or other type of identifier, as used by the data publisher
\- lat             | Yes       | The latitude of station. The field value must be a valid WGS 84 latitude in decimal degrees format. See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees
\- lon             | Yes       | The longitude of station. The field value must be a valid WGS 84 longitude in decimal degrees format. See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees
\- address         | Optional  | Valid street number and name where station is located. This field is intended to be an actual address, not a free form text description (see "cross_street" below)
\- cross_street    | Optional  | Cross street of where the station is located. This field is intended to be a descriptive field for human consumption. In cities, this would be a cross street, but could also be a description of a location in a park, etc.
\- region_id       | Optional  | ID of the region where station is located (see [system_regions.json](#system_regionsjson))
\- post_code       | Optional  | Postal code where station is located
\- rental_methods  | Optional  | Array of enumerables containing the payment methods accepted at this station. <br />Current valid values (in CAPS) are:<br /><ul><li>KEY _(i.e. operator issued bike key / fob / card)_</li> <li>CREDITCARD</li> <li>PAYPASS</li> <li>APPLEPAY</li> <li>ANDROIDPAY</li> <li>TRANSITCARD</li> <li>ACCOUNTNUMBER</li> <li>PHONE</li> </ul> This list is intended to be as comprehensive at the time of publication as possible but is subject to change, as defined in [File Requirements](#file-requirements) above
\- capacity        | Optional  | Number of total docking points installed at this station, both available and unavailable

### station_status.json

Field Name            | Required  | Defines
--------------------- | ----------| ----------
stations              | Yes       | Array that contains one object per station in the system as defined below
\- station_id          | Yes       | Unique identifier of a station (see station_information.json)
\- num_bikes_available | Yes       | Number of bikes available for rental
\- num_bikes_disabled  | Optional  | Number of disabled bikes at the station. Vendors who do not want to publicize the number of disabled bikes or docks in their system can opt to omit station capacity (in station_information), num_bikes_disabled and num_docks_disabled. If station capacity is published then broken docks/bikes can be inferred (though not specifically whether the decreased capacity is a broken bike or dock)
\- num_docks_available | Yes       | Number of docks accepting bike returns
\- num_docks_disabled  | Optional  | Number of empty but disabled dock points at the station. This value remains as part of the spec as it is possibly useful during development
\- is_installed        | Yes       | 1/0 boolean - is the station currently on the street
\- is_renting          | Yes       | 1/0 boolean - is the station currently renting bikes (even if the station is empty, if it is set to allow rentals this value should be 1)
\- is_returning        | Yes       | 1/0 boolean - is the station accepting bike returns (if a station is full but would allow a return if it was not full then this value should be 1)
\- last_reported       | Yes       | Integer POSIX timestamp indicating the last time this station reported its status to the backend

### free_bike_status.json
Describes bikes that are not at a station and are not currently in the middle of an active ride.

Field Name        | Required  | Defines
------------------| ----------| ----------
bikes             | Yes       | Array that contains one object per bike that is currently docked/stopped outside of the system as defined below
\- bike_id         | Yes       | Unique identifier of a bike
\- lat             | Yes       | Latitude of the bike. The field value must be a valid WGS 84 latitude in decimal degrees format. See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees
\- lon             | Yes       | Longitude of the bike. The field value must be a valid WGS 84 latitude in decimal degrees format. See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees
\- is_reserved     | Yes       | 1/0 value - is the bike currently reserved for someone else
\- is_disabled     | Yes       | 1/0 value - is the bike currently disabled (broken)

### system_hours.json
Describes the system hours of operation. A JSON array of hours defined as follows:

Field Name          | Required    | Defines
--------------------| ------------| ----------
rental_hours        | Yes         | Array of hour objects as defined below. Can contain a minimum of one object identifying hours for all days of the week or a maximum of fourteen hour objects are allowed (one for each day of the week for each "member" or "nonmember" user type)
\- user_types        | Yes         | An array of "member" and "nonmember" values. This indicates that this set of rental hours applies to either members or non-members only.
\- days              | Yes         | An array of abbreviations (first 3 letters) of English names of the days of the week that this hour object applies to (i.e. ["mon", "tue"]). Each day can only appear once within all of the hours objects in this feed.
\- start_time        | Yes         | Start time for the hours of operation of the system in the time zone indicated in system_information.json  (00:00:00 - 23:59:59)
\- end_time          | Yes         | End time for the hours of operation of the system in the time zone indicated in system_information.json (00:00:00 - 47:59:59). Time can stretch up to one additional day in the future to accommodate situations where, for example, a system was open from 11:30pm - 11pm the next day (i.e. 23:30-47:00)

Example:
```json
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
Describes the operating calendar for a system. An array of year objects defined as follows (if start/end year are omitted, then assume the start and end months do not change from year to year).

Field Name          | Required  | Defines
--------------------| ----------| ----------
calendars           | Yes       | Array of year objects describing the system operational calendar. A minimum of one calendar object is required, which could indicate a general calendar, or multiple calendars could be present indicating arbitrary start and end dates
\- start_month       | Yes       | Starting month for the system operations (1-12)
\- start_day         | Yes       | Starting day for the system operations (1-31)
\- start_year        | Optional  | Starting year for the system operations
\- end_month         | Yes       | Ending month for the system operations (1-12)
\- end_day           | Yes       | Ending day for the system operations (1-31)
\- end_year          | Optional  | Ending year for the system operations


### system_regions.json
Describe regions for a system that is broken up by geographic or political region. It is defined as a separate feed to allow for additional region metadata (such as shape definitions).

Field Name        | Required  | Defines
------------------| ----------| ----------
regions           | Yes       | Array of region objects as defined below
\- region_id       | Yes       | Unique identifier for the region
\- name           | Yes       | Public name for this region

### system_pricing_plans.json
Describe pricing for the system. This scheme does not currently factor in lost bike fees as it seems outside of the scope of this specification, but they could be added. It is an array of pricing objects defined as follows:

Field Name        | Required  | Defines
------------------| --------- | ----------
plans             | Yes       | Array of any number of plan objects as defined below:
\- plan_id         | Yes       | String - a unique identifier for this plan in the system
\- url             | Optional  | String - a fully qualified URL where the customer can learn more about this particular scheme
\- name            | Yes       | Name of this pricing scheme
\- currency        | Yes       | Currency this pricing is in (ISO 4217 code: http://en.wikipedia.org/wiki/ISO_4217)
\- price           | Yes       | Fee for this pricing scheme. This should be in the base unit as defined by the ISO 4217 currency code with the appropriate number of decimal places and omitting the currency symbol. e.g. if the price is in US Dollars the price would be 9.95
\- is_taxable      | Yes       | 1/0 value: <ul><li>0 indicates that no additional tax will be added (either because tax is not charged, or because it is included)</li> <li>1 indicates that tax will be added to the base price</li></ul>
\- description     | Yes       | Text field describing the particular pricing plan in human readable terms.  This should include the duration, price, conditions, etc. that the publisher would like users to see. This is intended to be a human-readable description and should not be used for automatic calculations

### system_alerts.json
This feed is intended to inform customers about changes to the system that do not fall within the normal system operations. For example, system closures due to weather would be listed here, but a system that only operated for part of the year would have that schedule listed in the system_calendar.json feed.

This file is an array of alert objects defined as below. Obsolete alerts should be removed so the client application can safely present to the end user everything present in the feed. The consumer could use the start/end information to determine if this is a past, ongoing or future alert and adjust the presentation accordingly.

Field Name        | Required    | Defines
----------------- | ------------| ----------
alerts            | Yes         | Array - alert objects each indicating a separate system alert as defined below
\- alert_id        | Yes         | ID - unique identifier for this alert
\- type            | Yes         | Enumerable - valid values are: <ul><li>SYSTEM_CLOSURE</li> <li>STATION_CLOSURE</li> <li>STATION_MOVE</li> <li>OTHER</li> </ul>
\- times           | Optional    | Array of hashes with the keys "start" and "end" indicating when the alert is in effect (e.g. when the system or station is actually closed, or when it is scheduled to be moved). If this array is omitted then the alert should be displayed as long as it is in the feed.
&emsp;- start     | Yes         | Integer POSIX timestamp - required if container "times" key is present
&emsp;- end       | Optional    | Integer POSIX timestamp - if there is currently no end time planned for the alert, this key can be omitted indicating that there is no currently scheduled end time for the alert
\- station_ids     | Optional    | Array of strings - If this is an alert that affects one or more stations, include their ids, otherwise omit this field. If both station_ids and region_ids are omitted, assume this alert affects the entire system
\- region_ids      | Optional    | Array of strings - If this system has regions, and if this alert only affects certain regions, include their ids, otherwise, omit this field. If both station_ids and region_ids are omitted, assume this alert affects the entire system
\- url             | Optional    | String - URL where the customer can learn more information about this alert, if there is one
\- summary         | Yes         | String - A short summary of this alert to be displayed to the customer
\- description     | Optional    | String - Detailed text description of the alert
\- last_updated    | Optional    | Integer POSIX timestamp indicating the last time the info for the particular alert was updated

## Possible Future Enhancements
There are some items that were proposed in an earlier version of this document but which do not fit into the current specification. They are collected here for reference and for possible discussion and inclusion in this or a future version.

* system_information.json
    * _system_data_ - Removed due to a lack of specificity; if metadata about the location of URLs is required / desired, the proposal is to include this in a separate feed_info.json feed which would contain an array with all of the feeds in addition to other feed information such as a feed version (if necessary)
    * _equipment_ - Removed due to a lack of specificity behind the intent of this field and a question about the actual relevance to the public
    * _jurisdictions_ - It is believed that the need for this field is negated by the presence of the system_regions.json feed

* station_status.json
    * need a way to distinguish between multiple bike types at a station if/when  hybrid systems using e-bikes become available

## Disclaimers

_Apple Pay, PayPass and other third-party product and service names are trademarks or registered trademarks of their respective owners._

## License

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/).
