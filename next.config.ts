import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
      fileName: true,
      topLevelImportPaths: ["@/"],
      // topLevelImportPaths: [""],
      meaninglessFileNames: ["index"],
      cssProp: true,
      namespace: "myApp",
      minify: false,
      transpileTemplateLiterals: false,
      pure: false,
    },
  }
};

export default nextConfig;
