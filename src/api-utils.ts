// import * as core from "@actions/core";
import * as core from "@actions/core";
import { context } from "@actions/github";
import { GitHub } from '@actions/github/lib/utils';

async function getTagSHA(tag: string, octokitClient: InstanceType<typeof GitHub>) {
    core.debug(`Getting info about the ${tag} tag from remote repository`);
    const { data: tagObj } = await octokitClient.git.getRef({
        ...context.repo,
        ref: `tags/${tag}`
    });

    return tagObj.object.sha;
}

async function findTag(refName: string, octokitClient: InstanceType<typeof GitHub>) {
    const { data: foundTag } = await octokitClient.git.listMatchingRefs({
        ...context.repo,
        ref: refName
    });

    return foundTag.find( refObj => refObj.ref.endsWith(refName) );
}

export async function checkIfReleaseIsPublished(tag: string, octokitClient: InstanceType<typeof GitHub>) {
    core.debug(`Getting a release for the ${tag} tag`);
    const { data: foundRelease } = await octokitClient.rest.repos.getReleaseByTag({
        ...context.repo,
        tag,
    });

    if (foundRelease.prerelease){
        throw new Error(
            `The '${foundRelease.name}' release is marked as pre-release. Updating tags for pre-release is not supported`
        );
    }
}

export async function updateTag(sourceTag: string, targetTag: string, octokitClient: InstanceType<typeof GitHub>) {
    const refName = `tags/${targetTag}`;
    const sourceTagSHA = await getTagSHA(sourceTag, octokitClient);
    const foundTargetTag = await findTag(refName, octokitClient);

    if (foundTargetTag) {
        core.info(`Updating the ${targetTag} tag to point to the ${sourceTag} tag`);

        await octokitClient.git.updateRef({
            ...context.repo,
            ref: refName,
            sha: sourceTagSHA,
            force: true
        });
    } else {
        core.info(`Creating the ${targetTag} tag from the ${sourceTag} tag`);

        await octokitClient.git.createRef({
            ...context.repo,
            ref: `refs/${refName}`,
            sha: sourceTagSHA
        });
    }
}