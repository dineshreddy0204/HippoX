import React from 'react';
import { Sparkles, Check, ShieldCheck, Zap, Globe2 } from 'lucide-react';

export const PricingView: React.FC = () => {
  const tiers = [
    {
      name: 'Starter Polyglot',
      price: '$0',
      period: 'forever free',
      desc: 'Ideal for casual personal translation and language learners.',
      popular: false,
      features: [
        'Full access to 7,191 Living Language Registry',
        '5,000 characters / day translation quota',
        'Basic grammar inspection with rule explanations',
        'Standard WebSpeech text-to-speech',
        'Single speaker mode'
      ],
      cta: 'Current Plan',
      current: true
    },
    {
      name: 'Professional Linguist',
      price: '$29',
      period: 'per month',
      desc: 'For professional translators, educators, and language researchers.',
      popular: true,
      features: [
        'Unlimited translations & document OCR',
        'Full grammar intelligence + interactive practice drill generator',
        'Real-time dual-speaker conversation streaming',
        'High-fidelity neural voice synthesis',
        'Priority sub-250ms Gemini 2.5 Flash inference',
        'Export transcripts & phrasebook folders'
      ],
      cta: 'Upgrade to Pro',
      current: false
    },
    {
      name: 'Enterprise Global',
      price: '$199',
      period: 'per month',
      desc: 'For international organizations, legal teams, and multinational enterprises.',
      popular: false,
      features: [
        'Dedicated Adapter Routing with custom fallbacks',
        '100% Zero-Data Retention guarantee (GDPR & HIPAA compliant)',
        'Full REST API access with custom rate-limits',
        '99.9% uptime SLA with 24/7 dedicated engineering support',
        'Custom dialect and specialized terminology glossaries',
        'Multi-tenant team seat licensing'
      ],
      cta: 'Contact Enterprise',
      current: false
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Scalable Tiers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1A1918]">
          One Plan for Every Global Scale
        </h1>
        <p className="text-sm text-[#6E6A61]">
          Transparent, fair pricing built for individuals, language researchers, and global enterprises.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`p-7 rounded-3xl bg-white border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-md ${
              tier.popular
                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40 bg-gradient-to-b from-[#FFFDF7] to-white'
                : 'border-[#EAE6DC]'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A1918]">{tier.name}</h3>
                <p className="text-xs text-[#7A756C] mt-1">{tier.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#1A1918] font-display">{tier.price}</span>
                <span className="text-xs text-[#8A857A]">/{tier.period}</span>
              </div>

              <div className="pt-4 border-t border-[#F2EEE4] space-y-2.5">
                <span className="text-xs font-bold text-[#1A1918] block">Included Capabilities:</span>
                {tier.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-[#524E47]">
                    <Check className="w-4 h-4 text-[#287D3C] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tier.popular
                    ? 'gold-gradient-btn text-white shadow-sm'
                    : tier.current
                    ? 'bg-[#FAF8F5] border border-[#E0DBD0] text-[#8A857A]'
                    : 'bg-[#1A1918] hover:bg-[#33312B] text-white'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
