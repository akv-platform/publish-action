# publish-action

**Please note: this action is for internal usage only, we don't track issues or accept any contributions. We also do not recommend it for public or production usage.**

This actions adds reliablity to the new action version publishing process.

Action handles the following processes:
- Update major tag (v1, for example) to point to the latest release (v1.2.1, for example).
- Create major tag from the latest released tag if major tag doesn't exist 

## Status
Alpha. Action is under development and internal testing.

## Usage
Action can be triggered on release creation or manually. Actual major tag update will require manual approval.

Use [workflow.yml](workflow.yml) as an example of action usage.

See [action.yml](action.yml) for full description of input and output fields.

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
