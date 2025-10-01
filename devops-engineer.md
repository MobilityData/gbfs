# umob DevOps engineering hiring assignment
## Introduction

- The purpose of the assignment is to test your ability to:
	- Document and communicate your way of thinking.
	- Design and build a functional, scalable and observable infrastructure.
- Invest maximum 6 hours over 1 week.

We hope you have fun building this! 
## Deliverables
- A git repo with:
	- Source code.
	- Instructions to build and run.
	- Architecture overview.
	- Things you would change if you had more time.
## The assignment: Fun with GBFS
- GBFS is a simple standard for publishing bike sharing feeds. https://github.com/MobilityData/gbfs/blob/master/gbfs.md
### Requirements
- Choose 3 providers of GBFS from this list https://github.com/MobilityData/gbfs/blob/master/systems.csv
- Design and deploy a solution that monitors changes in JSON files published by the providers and pull out stats about number of vehicles to display it in a dashboard with a historical overview.
- You have the freedom to decide on the stats and the dashboard design.
- CI/CD pipeline.
- Infrastructure needed must be defined as code.

### Bonus Points
- Make providers configurable.
- Deployed version on a cloud provider.
- Advanced comparisons between providers.
- Include alerts.