# General Vehicleshare Feed Specification

Documentation for the General Vehicleshare Feed Specification (formerly General Bikeshare Feed Specification), a standardized data feed for vehicle share system availability.

## What is GVFS?
The General Vehicleshare Feed Specification, known as GVFS, is the open data standard for vehicleshare. GVFS makes real-time data feeds in a uniform format publicly available online, with an emphasis on findability.

Original advance under the [North American Bikeshare Association’s](http://www.nabsa.net) leadership, GVFS has been developed by public, private sector and non-profit vehicle share system owners and operators, application developers, and technology vendors.

GVFS is intended as a specification for real-time, read-only data - any data being written back into individual vehicleshare systems are excluded from this spec.

The specification has been designed with the following concepts in mind:
*	Provide the status of the system at this moment
*	Do not provide information whose primary purpose is historical

The data in the specification contained in this document is intended for consumption by clients intending to provide real-time (or semi-real-time) transit advice and is designed as such.

## Read the spec

* [Current spec](gvfs.md)
* [Original draft spec in a Google doc](https://docs.google.com/document/d/1BQPZCKpem4-n6lUQDD4Mi8E5hNZ0-lhY62IVtWuyhec/edit#heading=h.ic7i1m4gcev7) (reference only)

## Overview of the Change Process
GVFS is an open specification, developed and maintained by the community of producers and consumers of GVFS data.
The specification is not fixed or unchangeable. As the vehicleshare industry evolves, it is expected that the specification will be extended by the GVFS community to include new features and capabilities over time. To manage the change process, the following guidelines have been established.

The general outline for changing the spec has 4 steps:
1.	Propose a change by opening an issue at the GVFS GitHub repository.
2.	Receive comments and feedback from the GVFS community and iterate on the proposed change. Discussion lasts for as long as the proposer feels necessary, but must be at least 7 calendar days
3.	Find at least one GVFS producer to implement and test the proposed change.
4.	Submit a final request-for-comments on the proposed change to the issue discussion. If no outstanding issues are identified after one week’s time, and there is general agreement that the proposed change is worthwhile and follows the GVFS guiding principles outlined below, the proposal will be officially adopted.


## Extensions Outside of the Specification ##
To accommodate the needs of feed producers and consumers prior to the adoption of a change, additional fields can be added to feeds even if these fields are not part of the official specification. It's strongly recommended that these additional fields be documented on the wiki page in this format:

Submitted by | Field Name  | File Name | Required | Defines
---------- | ------------ | -------- | ------- |-------
publisher_name | field_name |  name of GVFS end point where field is used | yes/no | description of purpose or use

## Guiding Principles
To preserve the original vision of GVFS, the following guiding principles should be taken into consideration when proposing extensions the spec:

* **GVFS is a specification for real-time or semi-real-time, read-only data.**
The spec is not intended for historical or archival data such as trip records.
The spec is about public information intended for vehicleshare users.

* **GVFS is targeted at providing transit information to the vehicleshare end user.**
 It’s primary purpose is to power tools for riders that will make vehiclesharing more accessible to users.  GVFS is about public information. Producers and owners of GVFS data should take licensing and discoverability into account when publishing GVFS feeds.

* **Changes to the spec should be backwards-compatible.**
Caution should be taken to avoid making changes to the spec that would render existing feeds invalid.

* **Speculative features are discouraged.**
Each new addition to the spec adds complexity. We want to avoid additions to the spec that do not provide additional value to the vehicleshare end user.

## Systems Implementing GVFS
This list contains all known systems publishing GVFS feeds and is maintained by the GVFS community. If you have or are aware of a system that doesn’t appear on the list please add it.

* [systems.csv](systems.csv)

If you would like to add a system, please fork this repository and submit a pull request. Please keep this list alphabetized by country and system name.
