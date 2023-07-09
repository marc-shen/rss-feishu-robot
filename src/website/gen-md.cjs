const fs = require("fs");
const {SAVED_DATA_PATH_NAME} = require('../constance')
const path = require("path")

async function genFeedMD() {
  const compile = (await import("@mdx-js/mdx")).compile;
  const esbuild = await import("esbuild");
  const rootPath = process.cwd();
  const originData = fs.readFileSync(
    path.join(rootPath, "src", SAVED_DATA_PATH_NAME),
    "utf8",
  );
  const jsonData = JSON.parse(originData) || [];
  const mdContent = jsonData
    .map((item) => {
      return `
      [${item.title}](${item.link})
    `;
    })
    .join("\n");

  const jsx = await compile(mdContent);

  console.log("jsx", jsx)
  fs.writeFileSync(path.join(rootPath, 'src','website', "mdx-components.jsx"), String(jsx));
  const renderCode = `
    import react from 'react'
    import { createRoot } from 'react-dom/client';
    import WebSite from "./mdx-components.jsx"
    const App = () => {
      return (
        <>
          <WebSite />
        </>
      )
    }

    const domNode = document.getElementById('root');
    const root = createRoot(domNode);
    root.render(<App />);
`;
  const websitePath = path.join(rootPath, 'src','website', "website.jsx");
  fs.writeFileSync(websitePath, renderCode);

  await esbuild.build({
    entryPoints: [websitePath],
    bundle: true,
    minify: true,
    outdir: path.join(rootPath, 'docs'),
    jsx: "automatic",
  });
}

genFeedMD();
