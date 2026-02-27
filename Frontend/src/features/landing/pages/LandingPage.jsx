import { Link } from "react-router-dom";
import React, { useRef } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiClock,
  FiMessageSquare,
  FiPlayCircle,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import Button from "../../../components/ui/Button";
import { usePageReveal } from "../../../hooks/usePageReveal";

const socialLogos = ["Vercel", "Linear", "Notion", "Figma", "Stripe"];

const painPoints = [
  {
    title: "Posting takes too long",
    description:
      "Creators waste time switching tools and lose momentum before they publish.",
    icon: <FiClock />,
  },
  {
    title: "Engagement feels random",
    description:
      "Without clear feedback, it is hard to know what content performs best.",
    icon: <FiBarChart2 />,
  },
  {
    title: "Community is scattered",
    description:
      "Profile, feed, and interactions are disconnected in most MVP social apps.",
    icon: <FiUsers />,
  },
];

const featureCards = [
  {
    title: "Outcome-first feed",
    description:
      "Fast publishing, smooth scrolling, and polished interactions that feel like a real product.",
    icon: <FiTrendingUp />,
  },
  {
    title: "Built-in community loops",
    description:
      "Follow, like, and profile discovery are connected so users keep coming back.",
    icon: <FiMessageSquare />,
  },
  {
    title: "Production-ready UX",
    description:
      "Responsive layout, clear states, and clean design tokens for long-term scaling.",
    icon: <FiShield />,
  },
];

const steps = [
  {
    title: "Create your account",
    description: "Sign up in seconds and personalize your creator profile.",
  },
  {
    title: "Share your first post",
    description: "Upload an image, add a caption, and publish instantly.",
  },
  {
    title: "Grow your audience",
    description: "Track engagement and build real community with every post.",
  },
];

const testimonials = [
  {
    quote:
      "InstaLite helped our team ship a polished social experience without rebuilding our architecture.",
    name: "Aarav M.",
    role: "Frontend Engineer",
  },
  {
    quote:
      "The profile and feed flow finally feels premium. Users instantly understand where to go next.",
    name: "Ritika S.",
    role: "Product Designer",
  },
  {
    quote:
      "Conversion to signup improved once we added this landing structure and strong CTA hierarchy.",
    name: "Nikhil P.",
    role: "Growth Lead",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$0",
    subtitle: "For personal testing",
    features: ["Basic feed", "Profile page", "Post interactions"],
    cta: "Get started free",
    recommended: false,
  },
  {
    name: "Pro",
    price: "$19",
    subtitle: "Per month, for creators",
    features: [
      "Advanced analytics",
      "Priority performance",
      "Enhanced profile customization",
    ],
    cta: "Start free trial",
    recommended: true,
  },
  {
    name: "Team",
    price: "$49",
    subtitle: "Per month, for teams",
    features: ["Team workspaces", "Role-based access", "Priority support"],
    cta: "Book a demo",
    recommended: false,
  },
];

const faqs = [
  {
    question: "Can I start without a credit card?",
    answer:
      "Yes. You can start on Starter or begin a trial on Pro without entering card details.",
  },
  {
    question: "Is this mobile responsive?",
    answer:
      "Yes. The landing page and app UI are built mobile-first with full-width CTA and tap-safe targets.",
  },
  {
    question: "Can users view other profiles?",
    answer:
      "Yes. Clicking avatar or username opens that user profile with posts, followers, and following.",
  },
  {
    question: "Will routes conflict with app pages?",
    answer:
      "No. Landing is on /, login is /login, and app pages are scoped under dedicated routes.",
  },
  {
    question: "Can I scale this design later?",
    answer:
      "Yes. Components and section structure are reusable for future marketing pages and experiments.",
  },
];

function LandingPage() {
  const pageRef = useRef(null);

  usePageReveal(pageRef, []);

  return (
    <div ref={pageRef} className="page-shell pb-24 md:pb-10">
      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="glass-surface rounded-2xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-xl font-bold">InstaLite</p>
              <p className="text-xs text-muted">Premium social platform</p>
            </div>

            <nav className="hidden items-center gap-5 text-sm font-semibold text-muted md:flex">
              <a href="#features" className="hover:text-[var(--text-primary)]">
                Features
              </a>
              <a href="#pricing" className="hover:text-[var(--text-primary)]">
                Pricing
              </a>
              <a href="#faq" className="hover:text-[var(--text-primary)]">
                FAQ
              </a>
            </nav>

            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-surface rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
              Trusted by 10,000+ creators and teams
            </p>

            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Grow your creator brand without social media chaos.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              Publish faster, understand engagement clearly, and turn profile visits
              into loyal followers with a premium Instagram-style experience.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/login">
                <Button size="lg" className="min-h-12 min-w-40">
                  Start free trial
                  <FiArrowRight />
                </Button>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-white/50 hover:text-[var(--text-primary)] dark:hover:bg-slate-700/40"
              >
                <FiPlayCircle />
                Watch how it works
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {socialLogos.map((logo) => (
                <div
                  key={logo}
                  className="rounded-xl border border-white/70 bg-white/55 px-3 py-2 text-center text-xs font-semibold text-muted dark:border-slate-600 dark:bg-slate-800/55"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-surface overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80"
              alt="Team celebrating positive growth on laptop"
              className="h-72 w-full object-cover sm:h-[420px]"
              loading="eager"
            />
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold">Outcome: faster publishing + higher retention</p>
              <p className="text-xs text-muted">
                Conversion-focused layout designed for a strong first impression in under 5 seconds.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10" id="problem">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Problem</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Most social MVPs lose users in week one</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {painPoints.map((item) => (
              <article key={item.title} className="glass-surface rounded-2xl p-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
                  {item.icon}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" id="features">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Solution</p>
          <h2 className="mt-2 font-display text-3xl font-bold">A cleaner way to launch and scale social features</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {featureCards.map((feature) => (
              <article key={feature.title} className="glass-surface rounded-2xl p-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
                  {feature.icon}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" id="how-it-works">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">How It Works</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Three steps to start growing</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="glass-surface rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Testimonials</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Proof from real product teams</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="glass-surface rounded-2xl p-5">
                <p className="text-sm leading-relaxed text-muted">"{item.quote}"</p>
                <p className="mt-4 text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted">{item.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" id="pricing">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Pricing</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Simple plans for every stage</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article
                key={tier.name}
                className={`glass-surface rounded-2xl p-5 ${
                  tier.recommended ? "ring-2 ring-[var(--accent)]" : ""
                }`}
              >
                {tier.recommended && (
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Recommended
                  </p>
                )}
                <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                <p className="mt-1 text-3xl font-extrabold">{tier.price}</p>
                <p className="mt-1 text-xs text-muted">{tier.subtitle}</p>

                <ul className="mt-4 space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-0.5 text-[var(--accent)]">
                        <FiCheck />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/login" className="mt-5 block">
                  <Button
                    variant={tier.recommended ? "primary" : "secondary"}
                    className="w-full min-h-11"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" id="faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Answers before you decide</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="glass-surface rounded-2xl p-4 open:bg-white/60 dark:open:bg-slate-800/60"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="glass-surface rounded-3xl p-6 text-center sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Final CTA</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">
              Start your free 14-day trial today.
            </h2>
            <p className="mt-3 text-sm text-muted">
              Join creators already shipping content faster and building stronger communities.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/login">
                <Button size="lg" className="min-h-12 min-w-48">
                  Start free trial
                  <FiZap />
                </Button>
              </Link>
              <Link to="/register" className="text-sm font-semibold text-[var(--accent)] hover:underline">
                Or create account now
              </Link>
            </div>
          </div>
        </section>
      </section>

      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <Link to="/login">
          <Button className="w-full min-h-12">Start free trial</Button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
