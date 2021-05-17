// import * as core from "@actions/core";
import * as core from "@actions/core";
import semverParse from "semver/functions/parse";
import SemVer from "semver/classes/semver";
import { context } from "@actions/github";
import { GitHub } from '@actions/github/lib/utils';

function isStableSemverVersion(version: SemVer) {
    return version.prerelease.length === 0 && version.build.length === 0
}

async function getSourceTagSHA(sourceTag: string, octokitClient: InstanceType<typeof GitHub>) {
    core.debug(`Getting info about the ${sourceTag} tag from remote repository`);
    const { data: sourceTagObj } = await octokitClient.git.getRef({
        ...context.repo,
        ref: `tags/${sourceTag}`
    });

    return sourceTagObj.object.sha;
}

async function findMajorTag(refName: string, octokitClient: InstanceType<typeof GitHub>) {
    const { data: foundRefs } = await octokitClient.git.listMatchingRefs({
        ...context.repo,
        ref: refName
    });

    return foundRefs.find( refObj => refObj.ref.endsWith(refName) );
}

export function validateSemverVersionFromTag(tag: string) {
    const semverVersion = semverParse(tag);
    if (!semverVersion) {
        throw new Error(
            `The ${tag} tag contains unsupported type of version. Only semantic versioning specification is acceptable`
        );
    }

    if (!isStableSemverVersion(semverVersion)) {
        throw new Error(
            "You have to specify only stable version to update the major tag"
        );
    }
}

export async function checkIfReleaseIsPublished(tag: string, octokitClient: InstanceType<typeof GitHub>) {
    core.debug(`Getting a release for the ${tag} tag`);
    const { data: foundRelease } = await octokitClient.rest.repos.getReleaseByTag({
        ...context.repo,
        tag,
    });

    if (foundRelease.prerelease){
        throw new Error(
            `The '${foundRelease.name}' release for the ${tag} tag should be published`
        );
    }
}

export async function updateMajorTag(sourceTag: string, octokitClient: InstanceType<typeof GitHub>) {
    const majorTag = sourceTag.split(".")[0];
    const refName = `tags/${majorTag}`;
    const sourceTagSHA = await getSourceTagSHA(sourceTag, octokitClient);
    const foundMajorTag = await findMajorTag(refName, octokitClient);

    if (foundMajorTag) {
        core.info(`Updating the ${majorTag} tag to point to the ${sourceTag} tag`);

        await octokitClient.git.updateRef({
            ...context.repo,
            ref: refName,
            sha: sourceTagSHA,
            force: true
        });
    } else {
        core.info(`Creating the ${majorTag} tag from the ${sourceTag} tag`);

        await octokitClient.git.createRef({
            ...context.repo,
            ref: `refs/${refName}`,
            sha: sourceTagSHA
        });
    }
}