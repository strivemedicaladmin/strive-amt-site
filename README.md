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
