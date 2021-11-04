export const createPathConverter = (removePathPrefix: Nullable<string>): ((path: string) => Nullable<string>) => {
  if (removePathPrefix == undefined) return (path) => path;
  const pathRegExp = new RegExp(`^${removePathPrefix}(.*)$`);

  return (path) => {
    const match = path.match(pathRegExp);
    if (match == undefined) return undefined;

    return match[1];
  };
};
