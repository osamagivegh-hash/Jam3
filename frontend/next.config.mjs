/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // السماح بجلب الصور من أي مصدر (للتبسيط وحل المشاكل)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4100",
        pathname: "/uploads/**",
      },
    ],
    // إيقاف التحسين التلقائي مؤقتاً لتجنب مشاكل 404 أثناء التطوير
    unoptimized: true,
  },
  // هذا التوجيه يجعل أي طلب لـ /uploads يذهب مباشرة للباك اند
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:4100/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;