import { ThemeProvider } from "@/components/theme-provider";

const About = () => {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">


      <div style={{width: '100%', height: '100vh', padding: '20px'}}>Data Fetching</div>

      </ThemeProvider>
    )
  }
  
  export default About