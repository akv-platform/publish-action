import * as core from "@actions/core";
import * as github from "@actions/github";
import { validateSemverVersionFromTag, updateMajorTag, checkIfReleaseIsPublished } from "./utils";

async function run() {
    try {
        const token = core.getInput('token');
        const octokitClient = github.getOctokit(token);
        const sourceTagName = core.getInput('tag-name');

        validateSemverVersionFromTag(sourceTagName);

        await checkIfReleaseIsPublished(sourceTagName, octokitClient);

        const majorTag = await updateMajorTag(sourceTagName, octokitClient);

        core.setOutput('major-tag', majorTag);
    } catch (error) {
        core.setFailed(error.message);
    }
};

run();