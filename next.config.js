module.exports = {
  future: { webpack5: true }, // Use webpack 5
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg?$/,
      oneOf: [
        {
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                prettier: false,
                svgo: true,
              },
            },
          ],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
      ],
    });
    return config;
  },
  images: {
    domains: ["images.ctfassets.net"],
  },
};
