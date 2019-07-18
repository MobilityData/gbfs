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

## Contributors ✨ via [octohatrack](https://github.com/LABHR/octohatrack)
Everyone who has contributed code, "created an issue, opened a pull requests, commented on an issue, replied to a pull request, made any in-line comments on code, edited the repo wiki, or in any other way interacted with the repo," excluding reactions. Those we like to see that feedback, too!
* aaronbrethorst (Aaron Brethorst)
* aaronlidman (Aaron Lidman)
* adamscarroll
* afischer (Andrew Fischer)
* albloptor (Alberto López del Toro)
* allcontributors[bot]
* alleyhector (Alley Hector)
* andmos (Andreas Mosti)
* AntoineGiraud (Antoine Giraud)
* antrim (Aaron Antrim)
* aospan (Abylay Ospan)
* apinho-fm
* asosnovsky (Ari Sosnovsky)
* barbeau (Sean Barbeau)
* bengavin (Ben Gavin)
* bettez (Jean-Sébastien Bettez)
* black-tea (Tim Black)
* brookemckim (Brooke McKim)
* burton024
* c-fang
* colinmcglynn (Colin McGlynn)
* contra
* cubbi (Marcin Pyla)
* daimler82
* davem2020
* davevsdave
* dierkp
* dmah21
* dsgermain
* edraheim
* edumucelli (Eduardo)
* efel85 (Edoardo Felici)
* emilesalem (emile)
* eric-poitras (Eric Poitras)
* evansiroky (Evan Siroky)
* f3d0r (Fedor Paretsky)
* f8full (Fabrice V.)
* fickas
* fkh (Frank Hebbert)
* fpurcell (Frank Purcell)
* fruminator (Michael Frumin)
* fscottfoti (Fletcher Foti)
* gaelhameon (Gaël Haméon)
* ghost (Deleted user)
* HeidiMG (Heidi G)
* hkieferling
* hobochild (Craig Mulligan)
* hpl002 (Herman Stoud Platou)
* hunterowens (Hunter Owens)
* idoco (Ido Cohen)
* iOS4ever (Jerry)
* j0kan (Johannes Vockeroth)
* jasongdove (Jason Dove)
* jcn (Jesse Chan-Norris)
* johnclary (John Clary)
* jsierles (Joshua Sierles)
* kardaj (Hassene Ben Salem)
* khonami (Matias Boselli)
* khwilson (Kevin Wilson)
* lhyfst (liheyuan)
* macroexpanse (Alex Hill)
* madupras (Marc-André Dupras)
* maduprasPBSC (Marc-André Dupras)
* marianosimone (Mariano Simone)
* mattdsteele (Matt Steele)
* mdarveau (Manuel Darveau)
* mfp22 (Mike Pearson)
* michalnaka (Michal Naka)
* midnightcomm
* mlaug (Matthias Laug)
* morganherlocker (Morgan Herlocker)
* mplsmitch (Mitch Vars)
* mvs202 (Michael Schade)
* nbdh (Daniel)
* nekromoff (Galimatias Nekromoff)
* nicklucius (Nick Lucius)
* Noe-Santana
* PierrickP (Pierrick PAUL)
* plcstpierre (Pier-Luc Caron St-Pierre)
* quicklywilliam (William Henderson)
* randyzwitch (Randy Zwitch)
* rolinger
* rompic
* rouge8 (Andy Freeland)
* sankalpsg (Sankalp Gupta)
* schnuerle (Michael Schnuerle)
* serialc (Cyrille Medard de Chardon)
* skinkie (Stefan de Konink)
* sven4all (Sven Boor)
* tague (Tague Griffith)
* tanushha
* tedder (Ted Timmons)
* TheLordHighExecutioner (Joe Huang)
* thzinc (Daniel James)
* tmontes (Tiago Montes)
* tomschenkjr (Tom Schenk Jr)
* trevorgerhardt (Trevor Gerhardt)
* wrenj
* yuzawa-san (James Yuzawa)

All Contributors: 99
