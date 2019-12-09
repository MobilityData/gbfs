# General Bikeshare Feed Specification
Documentation for the General Bikeshare Feed Specification, a standardized data feed for bike share system availability.

## Summer/Fall 2019 Update
NABSA is excited to begin our work to update and enhance GBFS. NABSA has selected [MobilityData IO](https://github.com/MobilityData) to support GBFS as NABSA’s data consultant for this project. MobilityData works to improve the coverage, completeness, and quality of mobility data standards around the world, including the General Transit Feed Specification (GTFS).

Our goals for this project are:
   * to enable new features in bikeshare systems and applications through data standardization,
   * to protect traveler privacy,
   * to support data needs for oversight and planning, and
   * to make GBFS easier to implement through specification reference clarity improvements and best practices development.

We hope you will share your valuable expertise with us by joining in the conversation here.

## What is GBFS?
The General Bikeshare Feed Specification, known as GBFS, is the open data standard for bikeshare. GBFS makes real-time data feeds in a uniform format publicly available online, with an emphasis on findability. GBFS is intended to make information publicly available online; therefore information that is personally identifiable is not currently and will not become part of the core specification.

Under the [North American Bikeshare Association’s](http://www.nabsa.net) leadership, GBFS has been developed by public, private sector and non-profit bike share system owners and operators, application developers, and technology vendors.

 GBFS is intended as a specification for real-time, read-only data - any data being written back into individual bikeshare systems are excluded from this spec.

The specification has been designed with the following concepts in mind:
*	Provide the status of the system at this moment
*	Do not provide information whose primary purpose is historical

The data in the specification contained in this document is intended for consumption by clients intending to provide real-time (or semi-real-time) transit advice and is designed as such.

## Read the spec

* [Current spec](gbfs.md)
* [Original draft spec in a Google doc](https://docs.google.com/document/d/1BQPZCKpem4-n6lUQDD4Mi8E5hNZ0-lhY62IVtWuyhec/edit#heading=h.ic7i1m4gcev7) (reference only)

## Overview of the Change Process
GBFS is an open specification, developed and maintained by the community of producers and consumers of GBFS data.
The specification is not fixed or unchangeable. As the bikeshare industry evolves, it is expected that the specification will be extended by the GBFS community to include new features and capabilities over time. To manage the change process, the following guidelines have been established.

The general outline for changing the spec has 4 steps:
1.	Propose a change by opening an issue at the GBFS GitHub repository.
2.	Receive comments and feedback from the GBFS community and iterate on the proposed change. Discussion lasts for as long as the proposer  feels necessary, but must be at least 7 calendar days
3.	Find at least one GBFS producer to implement and test the proposed change.
4.	Submit a final request-for-comments on the proposed change to the issue discussion. If no outstanding issues are identified after one week’s time, and there is general agreement that the proposed change is worthwhile and follows the GBFS guiding principles outlined below, the proposal will be officially adopted.

## Specification Versioning
To enable the evolution of GBFS, including changes that would otherwise break backwards-compatibility with consuming applications, GBFS documentation is versioned. Semantic versions are established by a git tag in the form of `vX.Y` where `X.Y` is the version name. Multiple changes (commits) may be batched into a single new release.

A whole integer increase is used for breaking changes (MAJOR changes). A decimal increase is used for non-breaking changes (MINOR changes or patches).

Examples of breaking changes include:

* Adding or removing a required endpoint or field
* Changing the data type or semantics of an existing field

Examples of non-breaking changes include:
 
* Adding or removing an optional endpoint or field
* Adding or removing enum values
* Modifying documentation or spec language in a way that clarifies semantics or recommended practices

### Version Release Cycles
* There is no strict limitation on the frequency of MAJOR releases, but the GBFS community aims to limit the MAJOR releases to 2 or fewer every 12 months. To limit releases, breaking changes can be batched together.
* MINOR changes may be applied at any time. There is no guideline to limit the number of MINOR changes. MINOR changes may be batched or released immediately, at the discretion of the pull request author and advocate.
* GBFS documentation will include a designated long-term support (LTS) branch. The LTS branch would maintain its LTS status for at least 2 years, after which a new LTS release and branch would be designated. The LTS branch will be determined according to the GBFS voting process. Non-breaking changes (MINOR) will be applied to the LTS branch when relevant.

## Extensions Outside of the Specification ##
To accommodate the needs of feed producers and consumers prior to the adoption of a change, additional fields can be added to feeds even if these fields are not part of the official specification. It's strongly recommended that these additional fields be documented on the wiki page in this format:

Submitted by | Field Name  | File Name | Required | Defines
---------- | ------------ | -------- | ------- |-------
publisher_name | field_name |  name of GBFS end point where field is used | yes/no | description of purpose or use

## Guiding Principles
To preserve the original vision of GBFS, the following guiding principles should be taken into consideration when proposing extensions the spec:

* **GBFS is a specification for real-time or semi-real-time, read-only data.**
The spec is not intended for historical or archival data such as trip records.
The spec is about public information intended for bikeshare users.

* **GBFS is targeted at providing transit information to the bikeshare end user.**
 It’s primary purpose is to power tools for riders that will make bikesharing more accessible to users.  GBFS is about public information. Producers and owners of GBFS data should take licensing and discoverability into account when publishing GBFS feeds.

* **Changes to the spec should be backwards-compatible.**
Caution should be taken to avoid making changes to the spec that would render existing feeds invalid.

* **Speculative features are discouraged.**
Each new addition to the spec adds complexity. We want to avoid additions to the spec that do not provide additional value to the bikeshare end user.

## Systems Implementing GBFS
This list contains all known systems publishing GBFS feeds and is maintained by the GBFS community. If you have or are aware of a system that doesn’t appear on the list please add it.

* [systems.csv](systems.csv)

If you would like to add a system, please fork this repository and submit a pull request. Please keep this list alphabetized by country and system name.

## GBFS and Other Shared Micromobility Resources
Including APIs, datasets, validators, research, and software can be found [here](https://github.com/NABSA/micromobility-tools-and-resources).

## Copyright
The copyright for GBFS is held by [Mitch Vars](https://github.com/mplsmitch).
