import { createPathConverter } from "./path-converter";

type TestCase = {
  removePathPrefix: Nullable<string>;
  input: string;
  expected: Nullable<string>;
};

const testCases: TestCase[] = [
  { removePathPrefix: "/foo", input: "/foo/bar", expected: "/bar" },
  { removePathPrefix: "/foo", input: "/bar", expected: undefined },
  { removePathPrefix: undefined, input: "/foo/bar", expected: "/foo/bar" },
];

const test = (testCase: TestCase) => {
  expect(createPathConverter(testCase.removePathPrefix)(testCase.input)).toBe(testCase.expected);
};

describe("createPathConverter", () => {
  it("removes path prefix", () => testCases.forEach(test));
});
