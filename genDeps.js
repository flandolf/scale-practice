import deps from "./package.json" assert { type: "json" };
import readline from "readline";
import { exit } from "process";
const { dependencies } = deps;
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
const depsList = Object.keys(dependencies).map((dep) => {
  return `- [${dep}](https://www.npmjs.com/package/${dep})`;
});

const depsListMd = depsList.join("\n");

const depsMd = `# Dependencies
${depsListMd}
`;

const ask = async (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};

ask("Do you want to update the dependencies? (y/n) ").then((ans) => {
  // update the dependencies in README.md
  if (ans === "y") {
    const readmePath = "./README.md"
    const readme = readFileSync(readmePath, "utf-8");
    console.log(readme)
    const updatedReadme = readme.replace(
      /# Dependencies[\s\S]*## Build/g,
      depsMd + "\n## Build"
    );
    writeFileSync(readmePath, updatedReadme);
    exit(0);
  } else {
    exit(0);
  }
});
