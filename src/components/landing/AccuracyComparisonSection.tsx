import { motion } from "framer-motion";
import { Trophy, TrendingUp, Shield, ExternalLink } from "lucide-react";

const accuracyData = [
  { rank: 1, name: "MailVet", accuracy: 99.2, speed: "200ms", highlight: true, website: null },
  { rank: 2, name: "ZeroBounce", accuracy: 99.0, speed: "350ms", highlight: false, website: "https://www.zerobounce.net" },
  { rank: 3, name: "NeverBounce", accuracy: 98.5, speed: "400ms", highlight: false, website: "https://www.neverbounce.com" },
  { rank: 4, name: "Clearout", accuracy: 98.2, speed: "380ms", highlight: false, website: "https://clearout.io" },
  { rank: 5, name: "EmailListVerify", accuracy: 97.8, speed: "450ms", highlight: false, website: "https://www.emaillistverify.com" },
  { rank: 6, name: "Bouncer", accuracy: 97.5, speed: "420ms", highlight: false, website: "https://www.usebouncer.com" },
  { rank: 7, name: "Hunter.io", accuracy: 97.2, speed: "500ms", highlight: false, website: "https://hunter.io" },
  { rank: 8, name: "Kickbox", accuracy: 96.8, speed: "480ms", highlight: false, website: "https://kickbox.com" },
  { rank: 9, name: "BriteVerify", accuracy: 96.5, speed: "550ms", highlight: false, website: "https://www.validity.com/everest/email-verification/" },
  { rank: 10, name: "Verifalia", accuracy: 96.2, speed: "600ms", highlight: false, website: "https://verifalia.com" },
];

export const AccuracyComparisonSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[150px] opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-cyan mb-4">Accuracy Rankings</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Industry-Leading <span className="gradient-text">99% Accuracy</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Based on comprehensive testing across major email providers. 
            MailVet consistently delivers the most accurate verification results in the market.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl border border-primary/30 bg-primary/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">#1 in Accuracy</h3>
                  <p className="text-muted-foreground">Verified by independent testing</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                MailVet achieves 99.2% accuracy using multi-layer verification including 
                SMTP validation, MX checks, and proprietary algorithms.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-cyan/30 bg-cyan/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-cyan" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">200ms Average</h3>
                  <p className="text-muted-foreground">Fastest response time</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                The fastest verification in the industry. Get results before your users 
                finish typing their email address.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Zero False Positives</h3>
                  <p className="text-muted-foreground">On Gmail, Outlook, Yahoo</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Never block a valid customer. Our advanced verification ensures 
                real emails from major providers always pass.
              </p>
            </div>
          </motion.div>

          {/* Right: Ranking Table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card/50 rounded-2xl border border-border/30 p-6 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6 text-foreground">Top 10 Email Verifiers by Accuracy</h3>
            <div className="space-y-3">
              {accuracyData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    item.highlight 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'bg-background/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      item.rank === 1 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : item.rank === 2 
                          ? 'bg-slate-400/20 text-slate-300'
                          : item.rank === 3
                            ? 'bg-orange-600/20 text-orange-400'
                            : 'bg-card text-muted-foreground'
                    }`}>
                      {item.rank}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                        {item.name}
                      </span>
                      {item.website && (
                        <a 
                          href={item.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          title={`Visit ${item.name}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`font-bold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                        {item.accuracy}%
                      </span>
                      <span className="text-xs text-muted-foreground block">accuracy</span>
                    </div>
                    <div className="text-right w-16">
                      <span className="text-sm text-muted-foreground">{item.speed}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              *Rankings based on comprehensive testing. Click names to visit provider websites.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
