# General Bikeshare Feed Specification
Documentation for the General Bikeshare Feed Specification, a standardized data feed for shared mobility system availability.

**Please note that GBFS is now hosted at [github.com/MobilityData/gbfs](https://github.com/MobilityData/gbfs).**

## Table of Contents
* [What is GBFS?](#what-is-gbfs)
* [How to Participate](#how-to-participate)
* [Current Version](#current-version-recommended)
* [Guiding Principles](#guiding-principles)
* [Specification Versioning](#specification-versioning)
* [Systems Catalog - Systems Implementing GBFS](#systems-catalog---systems-implementing-gbfs)
* [GBFS JSON Schemas](#gbfs-json-schemas)
* [GBFS and Other Shared Mobility Resources](#gbfs-and-other-shared-mobility-resources)
* [Relationship Between GBFS and MDS](#relationship-between-gbfs-and-mds)

## What is GBFS?
The General Bikeshare Feed Specification, known as GBFS, is the open data standard for shared mobility. GBFS makes real-time data feeds in a uniform format publicly available online, with an emphasis on findability. GBFS is intended to make information publicly available online; therefore information that is personally identifiable is not currently and will not become part of the core specification.
 
GBFS was created in 2014 by [Mitch Vars](https://github.com/mplsmitch) with collaboration from public, private sector and non-profit shared mobility system owners and operators, application developers, and technology vendors. [Michael Frumin](https://github.com/fruminator), [Jesse Chan-Norris](https://github.com/jcn) and others made significant contributions of time and expertise toward the development of v1.0 on behalf of Motivate International LLC (now Lyft). The [North American Bikeshare Association’s](http://www.nabsa.net) endorsement, support, and hosting was key to its success starting in 2015. In 2019, NABSA chose MobilityData to govern and facilitate the improvement of GBFS. MobilityData hosts a [GBFS Resource Center](https://gbfs.org/) and a [public GBFS Slack channel](https://share.mobilitydata.org/slack) - you are welcome to contact us there or at <sharedmobility@mobilitydata.org> with questions.  

GBFS is intended as a specification for real-time, read-only data - any data being written back into individual shared mobility systems are excluded from this spec.

The specification has been designed with the following concepts in mind:
*	Provide the status of the system at this moment
*	Do not provide information whose primary purpose is historical

The data in the specification contained in this document is intended for consumption by clients intending to provide real-time (or semi-real-time) transit advice and is designed as such.

## How to Participate
GBFS is an open source project developed under a consensus-based governance model. Contributors come from across the shared mobility industry, public sector, civic technology and elsewhere. GBFS is not owned by any one person or organization. The specification is not fixed or unchangeable. As the shared mobility industry evolves, it is expected that the specification will be extended by the GBFS community to include new features and capabilities over time. <br/><br> Comments or questions can be addressed to the community by [opening an issue](https://github.com/MobilityData/gbfs/issues). Proposals for changes or additions to the specification can be made through [pull requests](https://github.com/MobilityData/gbfs/pulls). Questions can also be addressed to the community via the [public GBFS Slack channel](https://bit.ly/mobilitydata-slack) or to the shared mobility staff at MobilityData: [sharedmobility@mobilitydata.org](mailto:sharedmobility@mobilitydata.org).
If you are new to engaging with the community on this repository, firstly welcome! Here is a brief overview of how to contribute to the specification:
* Anyone can raise an issue.
* Anyone can open a pull request - make sure PRs in line with our [Guiding Principles](#guiding-principles).
* If you are wanting to open a pull request but don't know how, MobiilityData is happy to help. Get in touch at [sharedmobility@mobilitydata.org](mailto:sharedmobility@mobilitydata.org).
* Discussions on pull requests must be a minimum of 7 calendar days.
* Votes are open for a total of 10 calendar days, anyone can vote.
* A successful vote must have at least 3 votes, not including the pull request author.
* A successful vote must include a vote from a GBFS producer and a GBFS consumer.

Find a real-world example of the governance in action [here](https://github.com/MobilityData/gbfs/pull/454). For a more in depth look at the change and contribution process, go to [governance.md](https://github.com/MobilityData/gbfs/blob/master/governance.md).

### Project Roadmap
MobiltyData has compiled a [project roadmap](https://portal.productboard.com/26qpteg4wct9px3jts94uqv8/tabs/99-planned) with a list of major features, changes and other work coming up in the near future.

## Current Version *(Recommended)* 
|   Version | Type  | Release Date |  Status | JSON Schema | Release Notes |
|:---:|:---:|---|---|---| ---|
| [v2.3](https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md) | MINOR  | April 5, 2022 | :white_check_mark: &nbsp; *Current Version*  | [v2.3 Schema](https://github.com/MobilityData/gbfs-json-schema/tree/master/v2.3) | [v2.3 Release Notes](https://github.com/MobilityData/gbfs/releases/tag/v2.3) |


### Upcoming MAJOR Version 
| Version                            | Type  | Release Target |  Status |
|------------------------------------|:---:|---|---|
| No current upcoming major versions |   |   |  |

### Release Candidates 
Release Candidates will receive *Current Version* status when they have been fully implemented in public feeds.

|  Version | Type  | Release Date   | Status                     | JSON Schema                                                                            | Release Notes       |
|:---:|:-----:|----------------|----------------------------|----------------------------------------------------------------------------------------|---------------------|
|[v3.0-RC2](https://github.com/MobilityData/gbfs/blob/master/gbfs.md) | MAJOR | November 14, 2023 | ✅ Ready for implementation | [v3.0-RC2 Schema](https://github.com/MobilityData/gbfs-json-schema/tree/master/v3.0-RC2) | [v3.0-RC2 Release Notes](https://github.com/MobilityData/gbfs/releases/tag/v3.0-RC2) |
|[v3.0-RC](https://github.com/MobilityData/gbfs/blob/v3.0-RC/gbfs.md) | MAJOR | March 10, 2023 | ✅ Ready for implementation | [v3.0-RC Schema](https://github.com/MobilityData/gbfs-json-schema/tree/master/v3.0-RC) | [v3.0-RC Article](https://mobilitydata.org/2023-the-year-of-v3/) |

### Past Version Releases 
Past versions with *Supported* status MAY be patched to correct bugs or vulnerabilities but new features will not be introduced.<br />
Past  versions with *Deprecated* status will not be patched and their use SHOULD be discontinued.

|  Version | Type  | Release Date |  Status | JSON Schema | Release Notes |
|:---:|:---:|---|---|---|---|
|  [v2.2](https://github.com/MobilityData/gbfs/blob/v2.2/gbfs.md) | MINOR  | March 19, 2021 |:white_check_mark: &nbsp; *Supported*  | [v2.2 Schema](https://github.com/MobilityData/gbfs-json-schema/tree/master/v2.2)| [v2.2 Article](https://mobilitydata.org/cities-gbfs-v2-2-is-here-for-you/)
|  [v2.1](https://github.com/MobilityData/gbfs/blob/v2.1/gbfs.md) | MINOR  | March 18, 2021 |:white_check_mark: &nbsp; *Supported*  | [v2.1 Schema](https://github.com/MobilityData/gbfs-json-schema/tree/master/v2.1)| [v2.1 Article](https://mobilitydata.org/gbfs-now-fully-supports-dockless-systems-%f0%9f%9b%b4%f0%9f%91%8f/)
|  [v2.0](https://github.com/MobilityData/gbfs/blob/v2.0/gbfs.md) | MAJOR  | March 16, 2020 | :white_check_mark: &nbsp;  *Supported*  | [v2.0 Schema](https://github.com/MobilityData/gbfs-json-schema/tree/master/v2.0) | [v2.0 Article](https://mobilitydata.org/whats-new-in-gbfs-v2-0-%f0%9f%9a%b2%f0%9f%9b%b4/) |
|  [v1.1](https://github.com/MobilityData/gbfs/blob/v1.1/gbfs.md) | MINOR | March 16, 2020 |:white_check_mark: &nbsp; *Supported*  | [v1.1 Schema](https://github.com/MobilityData/gbfs-json-schema/tree/master/v1.1) | |
|  [v1.0](https://github.com/MobilityData/gbfs/blob/v1.0/gbfs.md) | MAJOR  | Prior to October 2019 | :x: &nbsp; *Deprecated*  | [v1.0 Schema](https://github.com/MobilityData/gbfs-json-schema/tree/master/v1.0)| |
 
### Full Version History 
The complete GBFS version history is available on the [wiki](https://github.com/MobilityData/gbfs/wiki/Complete-Version-History).

## Specification Versioning
To enable the evolution of GBFS, including changes that would otherwise break backwards-compatibility with consuming applications, GBFS uses [semantic versioning](https://semver.org/).
Semantic versions are established by a git tag in the form of `vX.Y` where `X.Y` is the version name. A whole integer increase is used for breaking changes (MAJOR changes). A decimal increase is used for non-breaking changes (MINOR changes or patches). MINOR versions may introduce new features as long as those changes are OPTIONAL and do not break backwards compatibility.

Examples of breaking changes include:

* Changes to requirements, like adding or removing a REQUIRED endpoint or field, or changing an OPTIONAL endpoint or field to REQUIRED.
* Changing the data type or semantics of an existing field.

Examples of non-breaking changes include:

* Adding an OPTIONAL endpoint or field
* Adding new enum values
* Modifying documentation or specification language in a way that clarifies semantics or recommended practices


#### Version Release Cycles - Release Deprecation
See the [Governance](https://github.com/MobilityData/gbfs/blob/master/governance.md#version-release-cycles) for Version Release Cycles.
* GBFS documentation will include a list of current and supported MAJOR and MINOR versions. Supported versions SHALL NOT span more than two MAJOR versions. Past versions that are beyond the two most recent MAJOR versions will be deprecated 180 days after the latest MAJOR version becomes official.
 
## Guiding Principles
To preserve the original vision of GBFS, the following guiding principles should be taken into consideration when proposing extensions to the spec:

* **GBFS is a specification for real-time or semi-real-time, read-only data.**
The spec is not intended for historical or archival data such as trip records.
The spec is about public information intended for shared mobility users.

* **GBFS is targeted at providing transit information to the shared mobility end user.**
 Its primary purpose is to power tools for riders that will make shared mobility more accessible to users.  GBFS is about public information. Producers and owners of GBFS data should take licensing and discoverability into account when publishing GBFS feeds.

* **Changes to the spec should be backwards-compatible, when possible.**
Caution should be taken to avoid making changes to the spec that would render existing feeds invalid.

* **Speculative features are discouraged.**
Each new addition to the spec adds complexity. We want to avoid additions to the spec that do not provide additional value to the shared mobility end user.

## Systems Catalog - Systems Implementing GBFS
There are now over 900 shared mobility systems publishing GBFS worldwide. This list contains all known systems publishing GBFS feeds and is maintained by the GBFS community. This is an incomplete list. If you have or are aware of a system that doesn’t appear on the list please add it.
If you would like to add a system, please fork this repository and submit a pull request. Please keep this list alphabetized by country and system name. Alternatively, fill out [this contribution form](https://forms.gle/WSXFuXx9k4PSTfbC9) for a Github-less contribution. 
* [systems.csv](systems.csv)

 Field Name | REQUIRED | Definition 
 --- | :---: | ---- 
|Country Code | Yes | ISO 3166-1 alpha-2 code designating the country where the system is located. For a list of valid codes [see here](https://en.wikipedia.org/wiki/ISO_3166-1).
| Name | Yes| Name of the mobility system. This MUST match the `name` field in `system_information.json`
Location | Yes| Primary city in which the system is located, followed by the 2-letter state code for US systems. The location name SHOULD be in English if the location has an English name (eg: `Brussels`).
System ID | Yes | ID for the system. This MUST match the `system_id` field in `system_information.json`.
URL | Yes | URL for the system from the `url` field in `system_information.json`. If the `url` field is not included in `system_information.json` this SHOULD be the primary URL for the system operator.
Auto-Discovery URL | Yes | URL for the system's `gbfs.json` auto-discovery file.
Authentication Info | Conditionally REQUIRED | If authentication is required, this MUST contain a URL to a human-readable page describing how the authentication should be performed and how credentials can be created, or directly contain the public key-value pair to append to the feed URLs.

## GBFS JSON Schemas
Complete JSON schemas for each version of GBFS can be found [here](https://github.com/MobilityData/gbfs-json-schema).
## GBFS and Other Shared Mobility Resources
Including APIs, datasets, validators, research, and software can be found [here](https://gbfs.org/toolbox/resources/).
## Relationship Between GBFS and MDS
There are many similarities between GBFS and [MDS](https://github.com/openmobilityfoundation/mobility-data-specification) (Mobility Data Specification), however, their intended use cases are different. GBFS is a real-time or near real-time specification for public data primarily intended to provide transit advice through consumer-facing applications. MDS is not public data and is intended for use only by mobility regulators. Publishing a public GBFS feed is a [requirement](https://github.com/openmobilityfoundation/mobility-data-specification#gbfs-requirement) of all MDS compatible *Provider* APIs.
## Copyright
The copyright for GBFS is held by the [MobilityData](https://mobilitydata.org/). 
