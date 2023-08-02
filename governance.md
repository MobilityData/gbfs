## Governance Process

GBFS is an open specification, developed and maintained by the community of producers and consumers of GBFS data.
The specification is not fixed or unchangeable. As the shared mobility industry evolves, it is expected that the specification will be extended by the GBFS community to include new features and capabilities over time. If you are new to engaging with the community on this repository, firstly welcome! Please identify which organization you represent when posting.

To manage the change process, the following guidelines have been established.

* Anyone can propose a change.
* A change is proposed by opening a Pull Request (PR) at the GBFS GitHub repository. The proposer becomes “The Advocate”. Comments and feedback from the GBFS community are received to iterate on the proposed change. Discussion lasts for as long as necessary to address questions and revisions, but must be at least 7 calendar days.
* After 7 calendar days, The Advocate can call for a vote. Should The Advocate not call a vote or respond to comments from the community for a period of 30 full calendar days, anyone in the community can call for a vote. Vote lasts the minimum period sufficient to cover 10 full calendar days. Voting ends at 23:59:59 UTC. The vote announcement must conform to this template:
    * *I hereby call a vote on this proposal. Voting will be open for 10 full calendar days until 11:59PM UTC on X.<br /> Please vote for or against the proposal, and include the organization for which you are voting in your comment. <br /> Please note if you can commit to implementing the proposal.*
* The person calling for the vote should announce the vote in the [GBFS Slack channel](https://mobilitydata-io.slack.com) with a link to the PR. The message should conform to this template:
    * *A vote has been called on PR # [title of PR] (link to PR). This vote will be open for 10 full calendar days, until 11:59PM UTC on X. Please vote for or against the proposal on GitHub.*
* MobilityData will both comment on the PR on GitHub and send a reminder in the GBFS Slack channel when there are 2 calendar days remaining on the vote. The reminder should conform to this template:
    * Slack: <br />*Voting on PR # [title of PR] (link to PR) closes in 2 calendar days. Please vote for or against the proposal on GitHub.*
    * GitHub:<br />*Voting on this PR closes in 2 calendar days. Please vote for or against the proposal, and include the organization for which you are voting in your comment. Please note if you can commit to implementing the proposal.*
* Once a vote is called, a "Vote Open" label will be added to the PR. After the 2 day reminder, the label will be replaced with "Vote Closing Soon", once the vote is closed, the label will become either “Vote Passed” or “Voted Failed” depending on the vote outcome.
* A vote passes if there is unanimous consensus with at least 3 votes in favor.
    * At least one of these votes MUST be from a producer and at least one  MUST be from a consumer.
    * The producer and consumer votes MUST come from stakeholders other than The Advocate.
    * MobilityData serves as facilitator but does not vote on proposed changes.
* Votes against a proposal can stop a proposal from passing if they provide a specific reason for voting against and contain actionable feedback.
* The Advocate should cancel a vote and restart the process if significant changes are made to the proposal after stakeholders have voted.
* Should the vote fail, The Advocate can choose to continue work on the proposal with the feedback received and restart the governance process, or abandon the proposal by closing the Pull Request. Another interested member of the community can take over the proposal if they feel the addition is valuable.
* When a vote passes, the change is placed into Release Candidate (RC) status. The change remains in RC status pending implementation.
    * Implementation requirements are that at least 1 producer and 1 consumer implement the changes.
    * The implementors MUST be stakeholders other than The Advocate.
    * Once implemented successfully, the change is merged into an official current release.
* Editorial changes as well as items that are not found in [gbfs.md](https://github.com/MobilityData/gbfs/blob/master/gbfs.md) do not need to be voted on. Extensions that include new capabilities and features MUST be voted on.
* Issues and pull requests will be considered stale after 120 days, at which point participants will be notified via comment. Should they wish to keep the discussion open, it is the responsibility of the participants to re-engage in the conversation. If there is no re-engagement, the issue or pull request will be closed 60 days after the stale date.

