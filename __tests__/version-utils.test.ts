import * as versionUtils from "../src/version-utils";

describe("validateSemverVersionFromTag", () => {
    it("validate a tag containing an valid semantic version", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("1.0.0")).not.toThrow();
    });

    it("validate a tag containing an valid semantic version with 'v' prefix", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("v1.0.0")).not.toThrow();
    });

    it("validate a tag containing an valid semantic version with build metadata", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("v1.0.0+20130313144700")).not.toThrow();
    });

    it("throw when a tag contains an invalid semantic version", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("1.0.0invalid")).toThrowError(
            "The '1.0.0invalid' doesn't satisfy semantic versioning specification"
        );
    });

    describe("throw when a tag contains an valid unstable semantic version", () => {
        it.each([
            ["v1.0.0-alpha.1"],
            ["v1.0.0-beta.1"],
            ["v1.0.0-rc.1"],
        ] as [string][])("%s", (tag: string) => {
            expect(() => versionUtils.validateSemverVersionFromTag(tag)).toThrowError(
                "It is not allowed to specify pre-release version to update the major tag"
            );
        });
    });

    describe("throw when a tag contains an valid unstable semantic version with build metadata", () => {
        it.each([
            ["v1.0.0-alpha.1+20130313144700"],
            ["v1.0.0-beta.1+20130313144700"],
            ["v1.0.0-rc.1+20130313144700"],
        ] as [string][])("%s", (tag: string) => {
            expect(() => versionUtils.validateSemverVersionFromTag(tag)).toThrowError(
                "It is not allowed to specify pre-release version to update the major tag"
            );
        });
    });
});

describe("getMajorTagFromFullTag", () => {
    describe("get a valid major tag from full tag", () => {
        it.each([
            ["1.0.0", "1"],
            ["v1.0.0", "v1"],
            ["v1.0.0+20130313144700", "v1"],
        ] as [string, string][])("%s -> %s", (sourceTag: string, expectedMajorTag: string) => {
            const resultantMajorTag = versionUtils.getMajorTagFromFullTag(sourceTag);
            expect(resultantMajorTag).toBe(expectedMajorTag);
        });
    });
});