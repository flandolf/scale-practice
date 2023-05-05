import deps from "./package.json" assert { type: "json" };

const { dependencies } = deps;

const depsList = Object.keys(dependencies).map((dep) => {
  return `- [${dep}](https://www.npmjs.com/package/${dep})`;
});

const depsListMd = depsList.join("\n");

const depsMd = `# Dependencies
${depsListMd}
`;

console.log(depsMd);
