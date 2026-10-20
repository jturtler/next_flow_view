/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingIncludes: {
            "/*": ["./app/data/*.json"],
        },
    },
};

export default nextConfig;
