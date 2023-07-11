const fs = require("fs");
const {SAVED_DATA_PATH_NAME} = require('../constance')
const path = require("path")
const prettier = require("prettier")

async function genFeedMD() {
  const esbuild = await import("esbuild");
  const mdxEsbuild  = (await import("@mdx-js/esbuild")).default
  const rootPath = process.cwd();
  const originData = fs.readFileSync(
    path.join(rootPath, "src", SAVED_DATA_PATH_NAME),
    "utf8",
  );
  const jsonData = JSON.parse(originData) || [];
  const mdContent = jsonData
    .map((item) => {
      return `
      <LinkItem link={"${item.link}"} title={"${item.title}"}/>
    `;
    })
    .join("\n");



  const mdxFormat = await prettier.format(`<Layout>${mdContent}</Layout>`, {
    parser:"mdx"
  })

  fs.writeFileSync(path.join(rootPath, 'src','website', "mdx-components.mdx"), mdxFormat);
  const websitePath = path.join(rootPath, 'src','website', "website.jsx");
  await esbuild.build({
    entryPoints: [websitePath],
    bundle: true,
    minify: true,
    outdir: path.join(rootPath, 'docs'),
    jsx: "automatic",
    loader: {
      ".css":"css",
      ".jsx":"jsx"
    },
    plugins:[mdxEsbuild({
      providerImportSource:"@mdx-js/react"
    })]
  });
}

genFeedMD();
