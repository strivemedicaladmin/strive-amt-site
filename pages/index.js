// Strive Advanced Medical Training - Starter React App (single-file)
// ---------------------------------------------------------------
// This file is a production-ready starter React component using Tailwind CSS.
// It includes a landing page, auth hooks for Supabase, a simple podcast player
// section (with RSS/embed support), and placeholders for payments (Stripe).
//
// How to use:
// 1) Create a new Next.js (or Vite+React) project. This component is written as
//    a single-page React component you can drop into a Next.js page like
//    `pages/index.js` or into App Router `app/page.jsx`.
// 2) Install dependencies: `npm i @supabase/supabase-js react-player`.
// 3) Add Tailwind to your project and configure it normally.
// 4) Set environment variables (see README section below).
//
// Important: replace `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`,
// `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `REACT_APP_PODCAST_RSS` with your
// actual values.

import React, {useEffect, useState} from 'react';
import {createClient} from '@supabase/supabase-js';

// ----- CONFIG (replace with your env vars) -----
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const PODCAST_RSS = process.env.NEXT_PUBLIC_PODCAST_RSS || 'https://example.com/feed.xml';
const LOGO_PATH = '/logo.png'; // drop your generated logo at /public/logo.png
// -----------------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function HomePage(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState([]);
  const [playingUrl, setPlayingUrl] = useState(null);

  // auth listener
  useEffect(()=>{
    const init = async ()=>{
      const {data: {session}} = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }
    init();
    const {data: sub} = supabase.auth.onAuthStateChange((_event, session)=>{
      setUser(session?.user ?? null);
    });
    return ()=> sub?.subscription?.unsubscribe?.();
  },[]);

  // simple RSS fetcher for podcast (server-side proxy recommended for CORS)
  useEffect(()=>{
    async function loadRSS(){
      try{
        const res = await fetch('/api/podcast?feed='+encodeURIComponent(PODCAST_RSS));
        if(!res.ok) return;
        const data = await res.json();
        setEpisodes(data.items || []);
      }catch(e){
        console.warn('Podcast load failed', e);
      }
    }
    loadRSS();
  },[]);

  // Auth helpers
  async function signUp(email){
    await supabase.auth.signUp({email});
    alert('Check your email for verification link (magic link).');
  }
  async function signIn(email){
    await supabase.auth.signInWithOtp({email});
    alert('Check your email for sign-in link.');
  }
  async function signOut(){
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900">
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={LOGO_PATH} alt="Strive AMT" className="h-14 w-14 object-contain"/>
          <div>
            <h1 className="text-2xl font-extrabold">Strive <span className="text-blue-700">Advanced Medical Training</span></h1>
            <p className="text-sm text-gray-600">Critical care paramedic course — online & live skills labs</p>
          </div>
        </div>
        <nav>
          {loading ? <span className="text-sm text-gray-500">Loading…</span> : (
            user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{user.email ?? 'Account'}</span>
                <button onClick={signOut} className="px-3 py-1 rounded bg-gray-200">Sign out</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={()=>{const email = prompt('Enter email for magic link'); if(email) signIn(email);}} className="px-3 py-1 rounded bg-blue-600 text-white">Sign in</button>
                <button onClick={()=>{const email = prompt('Enter email to create account'); if(email) signUp(email);}} className="px-3 py-1 rounded border">Create account</button>
              </div>
            )
          )}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold">Critical Care Paramedic Course</h2>
            <p className="mt-4 text-gray-700">A modular, hands-on curriculum built by clinicians for clinicians. Includes high-fidelity scenarios, case-based learning, and an online course platform to track progress and certification.</p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>• Interactive video lectures & quizzes</li>
              <li>• Secure student accounts & progress tracking</li>
              <li>• Live skills labs and assessment sign-ups</li>
              <li>• Continuing education credits (CEU) support</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a href="#courses" className="px-4 py-2 rounded bg-blue-600 text-white">View Courses</a>
              <a href="#podcast" className="px-4 py-2 rounded border">Listen to Podcast</a>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold">Start Learning</h3>
            <p className="text-sm text-gray-600">Sign up with your email to create an account. Payment and course enrollment handled after login.</p>
            <div className="mt-4">
              <input id="email" placeholder="you@dept.org" className="w-full border rounded px-3 py-2" />
              <div className="mt-3 flex gap-2">
                <button onClick={()=>{const e = (document.getElementById('email') as HTMLInputElement).value; if(e) signUp(e);}} className="px-3 py-2 rounded bg-green-600 text-white">Create Account</button>
                <button onClick={()=>{const e = (document.getElementById('email') as HTMLInputElement).value; if(e) signIn(e);}} className="px-3 py-2 rounded border">Sign In</button>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">We use Supabase for secure auth and storage. You can also connect to SSO (Google/Microsoft) for your agency.</div>
          </div>
        </section>

        <section id="podcast" className="mt-16">
          <h3 className="text-2xl font-bold">Strive Podcast</h3>
          <p className="text-gray-600">Interviews, case reviews, and critical care deep dives. Episodes below — or subscribe with your podcast app via RSS.</p>
          <div className="mt-4 space-y-4">
            {episodes.length===0 && <div className="text-sm text-gray-500">No episodes found (this app fetches your RSS feed via /api/podcast). You can host episodes on Buzzsprout, Podbean, Anchor, Libsyn, etc.</div>}
            {episodes.slice(0,6).map((ep, idx)=> (
              <article key={idx} className="bg-white p-3 rounded shadow flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold">{ep.title}</div>
                  <div className="text-xs text-gray-500">{ep.pubDate}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>setPlayingUrl(ep.enclosure?.url || ep.audioUrl)} className="px-3 py-1 rounded border">Play</button>
                  <a href={ep.link} className="px-3 py-1 rounded bg-gray-100">Notes</a>
                </div>
              </article>
            ))}

            {playingUrl && (
              <div className="mt-4">
                <audio controls src={playingUrl} className="w-full" />
                <button onClick={()=>setPlayingUrl(null)} className="mt-2 text-sm text-gray-600">Stop</button>
              </div>
            )}
          </div>
        </section>

        <section id="security" className="mt-16 bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold">Security & Compliance</h3>
          <ul className="mt-3 text-sm text-gray-700 space-y-2">
            <li>• Serve the site over HTTPS (Vercel, Netlify, or managed host provide automatic SSL).</li>
            <li>• Use HTTPS-only cookies, CSRF protections, and secure JWT flows (Supabase handles much of this).</li>
            <li>• If you will store any Protected Health Information (PHI), ensure your host and providers sign a BAA and that data-at-rest encryption & access auditing are enabled.</li>
            <li>• Regular backups, automated testing, and rate-limiting on auth endpoints.</li>
          </ul>
        </section>

        <section id="next" className="mt-12 text-sm text-gray-700">
          <h4 className="font-semibold">Next steps (deploy & finish integration)</h4>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Provision Supabase (Auth, Database, Storage) and add env vars.</li>
            <li>Provision Stripe/PayPal for payments; add checkout endpoints in serverless functions.</li>
            <li>Choose a podcast host (Buzzsprout, Podbean, Anchor, Libsyn) and add RSS to env var.</li>
            <li>Deploy to Vercel or Netlify and enable automatic CI/CD from GitHub.</li>
          </ol>
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">© {new Date().getFullYear()} Strive Advanced Medical Training</footer>
    </div>
  );
}

/*
README / setup notes (paste into your project README):

ENV variables required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_PODCAST_RSS
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

Server-side helpers:
- /api/podcast (serverless): fetch the RSS feed server-side and return JSON with episodes.
  This avoids CORS and allows caching. Use a small XML->JSON parser.

Supabase notes:
- Use Supabase Auth (magic links or OAuth). Use Row Level Security (RLS) policies
  for course materials so only enrolled students can access content.
- Use Supabase Storage for video uploads or link to an external video host (Vimeo/Cloudflare Stream).

Payments:
- Use Stripe Checkout sessions or Stripe Billing to sell course access. Create a webhook
  to listen for successful payments and then create an enrollment row in the DB.

Podcast hosting:
- Hosts like Buzzsprout, Podbean, Anchor, and Libsyn simplify distribution and analytics.
  Add the RSS link to your site for play/embed.

Deployment:
- Vercel offers an easy deploy path and automatic SSL.

Security & HIPAA:
- If you collect PHI (unlikely for a course site), ensure a BAA with your providers.

*/
