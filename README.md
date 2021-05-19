# publish-action

**Please note: this action is for internal usage only, we don't track issues or accept any contributions. We also do not recommend it for public or production usage.**

This action adds reliablity to the new action version publishing and handles the following cases:
- Update major tag (v1, for example) to point to the latest release (v1.2.1, for example).
- Create major tag from the latest released tag if major tag doesn't exist 

## Status
Alpha. Action is under development and internal testing.

## Usage
Action can be triggered on release creation or manually. Actual major tag update will require manual approval. 
See [workflow.yml](./.github/workflow.yml) for usage example.

See [action.yml](action.yml) for full description of input and output fields.
Read more about action versioning notation in [action-versioning.md](https://github.com/actions/toolkit/blob/main/docs/action-versioning.md).

To rollback release in case of customer's impact, trigger workflow manually and specify the previous stable tag.

## Conributions

We don't accept contributions until action is production ready.

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE).
