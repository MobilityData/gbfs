# General Bikeshare Feed Specification
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

Documentation for the General Bikeshare Feed Specification, a standardized data feed for bike share system availability.

## What is GBFS?
The General Bikeshare Feed Specification, known as GBFS, is the open data standard for bikeshare. GBFS makes real-time data feeds in a uniform format publicly available online, with an emphasis on findability.

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="http://www.linkedin.com/in/seanbarbeau/"><img src="https://avatars0.githubusercontent.com/u/928045?v=4" width="100px;" alt="Sean Barbeau"/><br /><sub><b>Sean Barbeau</b></sub></a><br /><a href="https://github.com/NABSA/gbfs/commits?author=barbeau" title="Tests">⚠️</a> <a href="#question-barbeau" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/mplsmitch"><img src="https://avatars3.githubusercontent.com/u/15235861?v=4" width="100px;" alt="Mitch Vars"/><br /><sub><b>Mitch Vars</b></sub></a><br /><a href="https://github.com/NABSA/gbfs/commits?author=mplsmitch" title="Tests">⚠️</a> <a href="#question-mplsmitch" title="Answering Questions">💬</a> <a href="#projectManagement-mplsmitch" title="Project Management">📆</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!