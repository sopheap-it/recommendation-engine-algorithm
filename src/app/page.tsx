export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Cloud Infrastructure & Deployment
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Next.js 15 Application Hosted on AWS EC2 Ubuntu VM
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-12">
        {/* Infrastructure Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Infrastructure Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl mb-2">☁️</div>
              <h3 className="text-lg font-semibold mb-2">AWS EC2</h3>
              <p className="text-gray-300 text-sm">Ubuntu 24.04 LTS<br />t2.micro Instance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Next.js 15</h3>
              <p className="text-gray-300 text-sm">React 19<br />TypeScript</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="text-lg font-semibold mb-2">Nginx</h3>
              <p className="text-gray-300 text-sm">Reverse Proxy<br />Load Balancer</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="text-lg font-semibold mb-2">SSL/HTTPS</h3>
              <p className="text-gray-300 text-sm">Let&apos;s Encrypt<br />Auto-renewal</p>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Technical Stack</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Next.js 15.4.6 (Latest)</li>
                  <li>• React 19.1.0</li>
                  <li>• TypeScript 5</li>
                  <li>• Tailwind CSS 4</li>
                  <li>• Lucide React Icons</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Backend & DevOps</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Node.js 22.18.0</li>
                  <li>• PM2 Process Manager</li>
                  <li>• Nginx Web Server</li>
                  <li>• Let&apos;s Encrypt SSL</li>
                  <li>• AWS EC2 Ubuntu</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Project Team</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Team Members</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Mr. Om Sopheap</li>
                  <li>• Mr. Pich Chimi</li>
                  <li>• Mr. Phea Phorn</li>
                  <li>• Mr. Ngan Kang</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Lecturer</h4>
                <div className="text-gray-300">
                  <p className="font-semibold">SIN BUNTHOEURN</p>
                  <p>Tel: 087 929 168</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deployment Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Deployment Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold mb-2">High Performance</h3>
              <p className="text-gray-300 text-sm">Optimized Next.js build with static generation and edge caching</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Security</h3>
              <p className="text-gray-300 text-sm">SSL encryption, firewall configuration, and secure headers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Scalability</h3>
              <p className="text-gray-300 text-sm">PM2 process management with auto-restart and monitoring</p>
            </div>
          </div>
        </section>

        {/* Live Demo Status */}
        <section className="text-center">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-8 border border-green-500/30">
            <h2 className="text-2xl font-bold mb-4">Live Demo Status</h2>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>Server Online</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>Application Running</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                <span>DNS Propagating</span>
              </div>
            </div>
            <p className="text-gray-300">
              This page is being served from AWS EC2 Ubuntu VM via Nginx reverse proxy
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-400">
        <p>© 2025 Cloud Infrastructure & Deployment Project</p>
        <p className="text-sm mt-2">Built with Next.js 15 • Deployed on AWS EC2 • Powered by Ubuntu</p>
      </footer>
    </div>
  );
}
