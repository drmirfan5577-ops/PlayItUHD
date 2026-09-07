import { Link } from 'react-router-dom';
import { Play, Music, Image, Edit3, Film, Headphones, Star, Zap, Shield, Monitor } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const FEATURES = [
  { icon: Film, title: '8K Ultra HD Video', desc: 'Play 1K to 8K resolution videos with hardware acceleration', color: 'from-rose-500 to-pink-600' },
  { icon: Headphones, title: 'Hi-Fi Audio', desc: 'MP3, FLAC, WAV, OGG, OPUS and every audio format', color: 'from-purple-500 to-violet-600' },
  { icon: Image, title: 'Image Gallery', desc: 'Full gallery with lightbox, zoom, slideshow & info', color: 'from-emerald-500 to-teal-600' },
  { icon: Edit3, title: 'Image Editor', desc: 'Filters, brightness, contrast, rotation, flip & export', color: 'from-amber-500 to-orange-600' },
  { icon: Zap, title: 'Drag & Drop', desc: 'Drop any media file to instantly add to playlist', color: 'from-cyan-500 to-blue-600' },
  { icon: Shield, title: 'Privacy First', desc: 'All processing is local — no uploads, no cloud required', color: 'from-slate-500 to-slate-600' },
];

const QUICK_LINKS = [
  { path: '/player', label: 'Video Player', icon: Play, desc: 'Play MP4, WebM, MKV & more', gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', accent: 'text-cyan-400' },
  { path: '/audio', label: 'Audio Player', icon: Music, desc: 'MP3, FLAC, WAV, OGG & more', gradient: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', accent: 'text-purple-400' },
  { path: '/gallery', label: 'Image Gallery', icon: Image, desc: 'View & manage your images', gradient: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', accent: 'text-emerald-400' },
  { path: '/editor', label: 'Image Editor', icon: Edit3, desc: 'Edit, filter & export images', gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', accent: 'text-amber-400' },
];

const SUPPORTED = [
  { label: 'Video', formats: 'MP4 · WebM · MKV · AVI · MOV · FLV · WMV · 3GP · M4V · MPEG · TS · OGV' },
  { label: 'Audio', formats: 'MP3 · WAV · OGG · FLAC · AAC · M4A · WMA · OPUS · AIFF · AMR · WebM' },
  { label: 'Image', formats: 'JPG · PNG · GIF · WebP · BMP · SVG · TIFF · AVIF · HEIC · ICO' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-[#060a12]">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="PlayIt UHD+" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a12]/60 via-[#060a12]/40 to-[#060a12]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060a12] via-transparent to-[#060a12]/80" />
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-8">
              <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Ultra HD Plus — All Formats Supported</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              PlayIt
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> UHD+</span>
            </h1>
            <p className="text-xl text-slate-300 mb-4 leading-relaxed">
              A professional media player built for the modern era. Play any video, audio, or image — from 360p to 8K Ultra HD.
            </p>
            <p className="text-slate-500 mb-10">
              Complete with playlist management, image gallery, and a powerful image editor — all running locally in your browser.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/player"
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-200"
              >
                <Play className="w-5 h-5 fill-white" />
                Launch Player
              </Link>
              <Link
                to="/gallery"
                className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl font-bold text-lg transition-all duration-200 backdrop-blur-sm"
              >
                <Image className="w-5 h-5" />
                Open Gallery
              </Link>
            </div>

            {/* Resolution badges */}
            <div className="flex flex-wrap gap-2 mt-10">
              {['8K', '4K', '2K', '1080p', '720p', '480p'].map(r => (
                <span key={r} className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-white/70">
                  {r}
                </span>
              ))}
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-500">
                + All formats
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map(({ path, label, icon: Icon, desc, gradient, border, accent }) => (
            <Link
              key={path}
              to={path}
              className={`group p-6 rounded-2xl bg-gradient-to-br ${gradient} border ${border} hover:scale-[1.02] transition-all duration-200`}
            >
              <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${accent}`} />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{label}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything You Need</h2>
          <p className="text-slate-500">Professional media playback capabilities, right in your browser</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-white/15 hover:bg-white/5 transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Formats */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Supported Formats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUPPORTED.map(({ label, formats }) => (
            <div key={label} className="p-6 rounded-2xl bg-[#0a0f1a] border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <h3 className="text-white font-semibold">{label}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-loose">{formats}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center">
        <p className="text-slate-600 text-sm">PlayIt UHD+ — Ultra HD Digital Media Player • All processing runs locally in your browser</p>
      </footer>
    </div>
  );
}
