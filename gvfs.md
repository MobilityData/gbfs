# General Vehicleshare Feed Specification (GVFS)
This document explains the types of files and data that comprise the General Vehicleshare Feed Specification (GVFS) and defines the fields used in all of those files.

## Table of Contents

* [Revision History](#revision-history)
* [Introduction](#introduction)
* [Files](#files)
* [File Requirements](#file-requirements)
* [Field Definitions](#field-definitions)
    * [gvfs.json](#gvfsjson)
    * [system_information.json](#system_informationjson)
    * [station_information.json](#station_informationjson)
    * [station_status.json](#station_statusjson)
    * [free_vehicle_status.json](#free_vehicle_statusjson)
    * [system_hours.json](#system_hoursjson)
    * [system_calendar.json](#system_calendarjson)
    * [system_regions.json](#system_regionsjson)
    * [system_pricing_plans.json](#system_pricing_plansjson)
    * [system_alerts.json](#system_alertsjson)
* [Possible Future Enhancements](#possible-future-enhancements)

## Revision History
* ? - Update standard to accommodate different vehicle types
* 11/05/2015 - GVFS V1.0 Adopted by NABSA board
* 08/2015 - Latest changes incorporated and name change to GVFS (comments from Motivate, 8D, others)
* 06/2015 - Proposed refinements (prepared by Jesse Chan-Norris on behalf of Motivate)
* 01/2015 - NABSA Draft (prepared by Mitch Vars)

## Introduction
This specification has been designed with the following concepts in mind:

* Provide the status of the system at this moment
* Do not provide information whose primary purpose is historical

Historical data, including station details and ride data is to be provided by a more compact specification designed specifically for such archival purposes. The data in the specification contained in this document is intended for consumption by clients intending to provide real-time (or semi-real-time) transit advice and is designed as such.

## Files
This specification defines the following files along with their associated content:

File Name                   | Required                |       Defines
--------------------------- | ----------------------- | ----------
gvfs.json                   | Optional                | Auto-discovery file that links to all of the other files published by the system. This file is optional, but highly recommended.
system_information.json     | Yes                     | Describes the system including System operator, System location, year implemented, URLs, contact info, time zone and vehicle types
station_information.json    | Conditionally required  | Mostly static list of all stations, their capacities and locations. Required of systems utilizing docks.
station_status.json         | Conditionally required  | Number of available vehicles and docks at each station and station availability. Required of systems utilizing docks.
free_vehicle_status.json       | Conditionally required  | Describes vehicles that are available for rent. Required of systems that don't utilize docks or offer vehicles for rent outside of stations.
system_hours.json           | Optional                | Describes the hours of operation for the system
system_calendar.json        | Optional                | Describes the days of operation for the system
system_regions.json         | Optional                | Describes the regions the system is broken up into
system_pricing_plans.json   | Optional                | Describes the system pricing
system_alerts.json          | Optional                | Describes current system alerts

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
    * The location of the auto-discovery file will be provided in the HTML <head> area of the vehicleshare landing page hosted at the URL specified in the url field of the system_infomation.json file
    * This is referenced via a _link_ tag with the following format:
      * `<link rel="gvfs" type="application/json" href="https://www.example.com/data/gvfs.json" />`
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
    * must be unique within like fields (vehicle_id must be unique among vehicles)
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

### gvfs.json
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
system_id         | Yes       | ID field - identifier for this vehicle share system. This should be globally unique (even between different systems) and it is currently up to the publisher of the feed to guarantee uniqueness. In addition, this value is intended to remain the same over the life of the system
language          | Yes       | An IETF language tag indicating the language that will be used throughout the rest of the files. This is a string that defines a single language tag only. See https://tools.ietf.org/html/bcp47 and https://en.wikipedia.org/wiki/IETF_language_tag for details about the format of this tag
name              | Yes       | Full name of the system to be displayed to customers
short_name        | Optional  | Optional abbreviation for a system
operator          | Optional  | Name of the operator of the system
url               | Optional  | The URL of the vehicle share system. The value must be a fully qualified URL that includes http:// or https://, and any special characters in the URL must be correctly escaped. See http://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URL values
purchase_url      | Optional  | A fully qualified URL where a customer can purchase a membership or learn more about purchasing memberships
start_date        | Optional  | String in the form YYYY-MM-DD representing the date that the system began operations
phone_number      | Optional  | A single voice telephone number for the specified system. This field is a string value that presents the telephone number as typical for the system's service area. It can and should contain punctuation marks to group the digits of the number. Dialable text (for example, Capital Bikeshare’s  "877-430-BIKE") is permitted, but the field must not contain any other descriptive text
email             | Optional  | A single contact email address for customers to address questions about the system
timezone          | Yes       | The time zone where the system is located. Time zone names never contain the space character but may contain an underscore. Please refer to the "TZ" value in https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for a list of valid values
license_url       | Optional  | A fully qualified URL of a page that defines the license terms for the GVFS data for this system, as well as any other license terms the system would like to define (including the use of corporate trademarks, etc)
vehicle_types | Yes | An array of vehicles available for rent in this system. See following fields for details.
\- vehicle_type_id | Yes | The id of the vehicle type. This is referenced in other tables.
\- name | Yes | The name of this kind of vehicle
\- description | Optional | A free text description of the vehicle
\- vehicle_url | Optional | A url where more detailed information about the vehicle can be found
\- image_small | Optional | A url to a an image with a resolution of no larger than 400px x 400px for the purposes of displaying a thumbnail image in an end-user application
\- image_large | Optional | A url to a an image with a resolution larger than 800px x 400px for the purposes of displaying a full-size image in an end-user application
\- propulsion_type | Yes | An enumerable describing the propulsion type of the vehicle. <br /><br />Current valid values (in CAPS) are:<br /><ul><li>HUMAN _(Pedal or foot propulsion)_</li><li>ELECTRIC_ASSIST _(Provides power only alongside human propulsion)_</li><li>ELECTRIC _(Contains throttle mode with a battery-powered motor)_</li><li>COMBUSTION _(Contains throttle mode with a gas engine-powered motor)_</li></ul> This field was copied from [City of Los Angeles Mobility Data Specification](https://github.com/CityOfLosAngeles/mobility-data-specification/blob/73995a151f0a1d67aab3d617a4693f8f81967936/provider/README.md#propulsion-types)
\- cruising_speed | Optional | The recommended top cruising speed that the vehicle can travel at in a safe manner in kilometers per hour
\- range_with_full_energy_potential | Optional | The furthest distance in kilometers that the vehicle can travel when it has the maximum amount of energy potential (for example a full battery or full tank of gas)
\- vehicle_weight | Optional | The weight in kilograms of the vehicle
\- power_output | Optional | The maximum power output in watts that can be generated with the vehicle's motor during a safe and normal acceleration of the vehicle
\- passenger_capacity | Optional | The amount of people than can travel at once on this vehicle
\- enclosed | Optional | 1/0 boolean - whether the vehicle contains an enclosed environment that isolates the passenger(s) from the outside elements

Example:

```json
{
  "last_updated": 1434054678,
  "ttl": 12345,
  "data": {
    "system_id": "inboard",
    "language": "en",
    "name": "Inboard",
    "short_name": "ib",
    "url": "https://www.inboardtechnology.com/",
    "timezone": "America/Los_Angeles",
    "vehicle_types": [
      {
        "vehicle_type_id": "m1",
        "name": "M1 Electric Skateboard",
        "description": "Experience the most advanced e-board deck ever developed. A custom designed composite deck that combines an inverted 3D Poplar wood core with full sandwich PU sidewalls and wrapped in the same fiberglass top sheet found in premium snowboards and skis. Integrated electronics, reinforced truck mounting points, and resilient TPU nose and tail bumpers at the rails yield a remarkably light and durable platform optimized for a more responsive ride.",
        "vehicle_url": "https://www.inboardtechnology.com/products/m1-electric-skateboard",
        "image_small": "http://cdn.shopify.com/s/files/1/1136/4406/files/Skateboard_x150.png?11016692238788873189",
        "image_large": "http://cdn.shopify.com/s/files/1/1136/4406/products/m1_pdp_fullBleed_6_9e6614b5-c3e4-4dd1-b18b-fd51451d0c17_1600x.jpg?v=1535665708",
        "propulsion_type": "ELECTRIC",
        "maximum_cruising_speed": 25,
        "range_with_full_energy_potential": 11,
        "vehicle_weight": 6.57,
        "power_output": 200,
        "passenger_capacity": 1,
        "enclosed": 0
      }, {
        "vehicle_type_id": "tg",
        "name": "The Glider Scooter",
        "description": "The ultimate scooter experience, crafted with premium components, top-quality materials, and relentless attention to detail. We engineered our Glider from the ground up, with the ride experience as our ultimate focus at every step of the way; providing a smooth, safe, and insanely fun ride, every time.",
        "vehicle_url": "https://www.inboardtechnology.com/products/the-glider",
        "image_small": "http://cdn.shopify.com/s/files/1/1136/4406/files/glider_nav_1_x150.png?11016692238788873189",
        "image_large": "http://cdn.shopify.com/s/files/1/1136/4406/products/glider_pdp_4_super_duper_extended_2_de0ab82e-e603-4455-8395-dd6ec3b28cbb_375x375_crop_center.png?v=1542056407,%20//cdn.shopify.com/s/files/1/1136/4406/products/glider_pdp_4_super_duper_extended_2_de0ab82e-e603-4455-8395-dd6ec3b28cbb_750x750_crop_center.png?v=1542056407%202x",
        "propulsion_type": "ELECTRIC",
        "maximum_cruising_speed": 25,
        "range_with_full_energy_potential": 19.3,
        "vehicle_weight": 15.88,
        "power_output": 350,
        "passenger_capacity": 1,
        "enclosed": 0
      }
    ]
  }
}
```


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
\- rental_methods  | Optional  | Array of enumerables containing the payment methods accepted at this station. <br />Current valid values (in CAPS) are:<br /><ul><li>KEY _(i.e. operator issued vehicle key / fob / card)_</li> <li>CREDITCARD</li> <li>PAYPASS</li> <li>APPLEPAY</li> <li>ANDROIDPAY</li> <li>TRANSITCARD</li> <li>ACCOUNTNUMBER</li> <li>PHONE</li> </ul> This list is intended to be as comprehensive at the time of publication as possible but is subject to change, as defined in [File Requirements](#file-requirements) above
\- capacity        | Optional  | Number of total docking points installed at this station, both available and unavailable
\-allowed_vehicle_types | Required | An array of vehicle_type_ids that are allowed to be dropped off or picked up at this station

Example:

```json
{
  "last_updated": 1434054678,
  "ttl": 0,
  "data": {
    "stations": [
      {
        "station_id": "pga",
        "name": "Parking garage A",
        "lat": 12.34,
        "lon": 45.67,
        "allowed_vehicle_types": ["m1", "tg"]
      }
    ]
  }
}
```

### station_status.json
The station status is organized according to vehicle type.

Field Name            | Required  | Defines
--------------------- | ----------| ----------
stations              | Yes       | Array that contains one object per station in the system as defined below
\- station_id          | Yes       | Unique identifier of a station (see station_information.json)
\- is_installed        | Yes       | 1/0 boolean - is the station currently on the street
\- is_renting          | Yes       | 1/0 boolean - is the station currently renting vehicles (even if the station is empty, if it is set to allow rentals this value should be 1)
\- is_returning        | Yes       | 1/0 boolean - is the station accepting vehicle returns (if a station is full but would allow a return if it was not full then this value should be 1)
\- last_reported       | Yes       | Integer POSIX timestamp indicating the last time this station reported its status to the backend
\- num_vehicles_available | Yes       | An object consisting of keys that are vehicle_type_ids and values that represent the number of vehicles of the respective vehicle type available for rental
\- num_vehicles_disabled  | Optional  | An object consisting of keys that are vehicle_type_ids and values that represent the number of disabled vehicles of the respective vehicle type at the station. Vendors who do not want to publicize the number of disabled vehicles or docks in their system can opt to omit station capacity (in station_information), num_vehicles_disabled and num_docks_disabled. If station capacity is published then broken docks/vehicles can be inferred (though not specifically whether the decreased capacity is a broken vehicle or dock)
\- num_docks_available | Yes       | An object consisting of keys that are vehicle_type_ids and values that represent the number of docks accepting vehicle returns of vehicles of the respective vehicle type
\- num_docks_disabled  | Optional  | An object consisting of keys that are vehicle_type_ids and values that represent the number of empty but disabled dock points for vehicles of the respective vehicle type at the station. This value remains as part of the spec as it is possibly useful during development

Example:

```json
{
  "last_updated": 1434054678,
  "ttl": 0,
  "data": {
    "station_id": "pga",
    "is_installed": 1,
    "is_renting": 1,
    "is_returning": 1,
    "last_reported": 1434054678,
    "num_vehicles_available": {
      "m1": 3,
      "tg": 4
    },
    "num_docks_available": {
      "m1": 2,
      "tg": 1
    }
  }
}
```

### free_vehicle_status.json
Describes vehicles that are not at a station and are not currently in the middle of an active ride.

Field Name        | Required  | Defines
------------------| ----------| ----------
vehicles             | Yes       | Array that contains one object per vehicle that is currently docked/stopped outside of the system as defined below
\- vehicle_id         | Yes       | Unique identifier of a vehicle
\- lat             | Yes       | Latitude of the vehicle. The field value must be a valid WGS 84 latitude in decimal degrees format. See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees
\- lon             | Yes       | Longitude of the vehicle. The field value must be a valid WGS 84 latitude in decimal degrees format. See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees
\- is_reserved     | Yes       | 1/0 value - is the vehicle currently reserved for someone else
\- is_disabled     | Yes       | 1/0 value - is the vehicle currently disabled (broken)
\- vehicle_type | Yes | The vehicle_type_id of this vehicle as described in [system_information.json](#system_informationjson)
\- range_with_current_energy_potential | Optional | The furthest distance in kilometers that the vehicle can travel with the vehicle's current amount of energy potential

Example:

```json
{
  "last_updated": 1434054678,
  "ttl": 0,
  "data": {
    "vehicles": [
      {
        "vehicle_id": "abc123",
        "lat": 12.34,
        "lon": 56.78,
        "is_reserved": 0,
        "is_disabled": 0,
        "vehicle_type": "m1",
        "range_with_current_energy_potential": 3
      }, {
        "vehicle_id": "123abc",
        "lat": 12.34,
        "lon": 56.78,
        "is_reserved": 0,
        "is_disabled": 0,
        "vehicle_type": "tg",
        "range_with_current_energy_potential": 4.5
      }
    ]
  }
}
```

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
Describe pricing for the system. This scheme does not currently factor in lost vehicle fees as it seems outside of the scope of this specification, but they could be added. It is an array of pricing objects defined as follows:

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
\- station_ids     | Optional    | Array of strings - If this is an alert that affects one or more stations, include their ids, otherwise omit this field. If station_ids, region_ids and vehicle_type_ids are omitted, assume this alert affects the entire system
\- region_ids      | Optional    | Array of strings - If this system has regions, and if this alert only affects certain regions, include their ids, otherwise, omit this field. If station_ids, region_ids and vehicle_type_ids are omitted, assume this alert affects the entire system
\- vehicle_type_ids      | Optional    | Array of strings - If this is an alert that affects one or more vehicle types, include their ids, otherwise, omit this field. If station_ids, region_ids and vehicle_type_ids are omitted, assume this alert affects the entire system
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
    * need a way to distinguish between multiple vehicle types at a station if/when  hybrid systems using e-vehicles become available

## Disclaimers

_Apple Pay, PayPass and other third-party product and service names are trademarks or registered trademarks of their respective owners._

## License

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/).
