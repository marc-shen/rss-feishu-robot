
    import react from 'react'
    import { createRoot } from 'react-dom/client';
    import WebSite from "./mdx-components.mdx";
    import { MDXProvider } from "@mdx-js/react"
    import { Layout } from "./components/layout.jsx";
    import { LinkItem } from "./components/file-item.jsx"
    const App = () => {
      return (
        <MDXProvider components={{Layout, LinkItem}}>
          <WebSite />
        </MDXProvider>
      )
    }

    const domNode = document.getElementById('root');
    const root = createRoot(domNode);
    root.render(<App />);
