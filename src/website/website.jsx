
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
