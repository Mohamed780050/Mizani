import React from "react";
import { Logo } from "@/components/ui/Logo";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center p-4 relative z-0">
      {/* Content Shell */}
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden bg-card rounded-[2rem] shadow-2xl shadow-primary/5 border border-border">
        
        {/* Visual/Editorial Branding (Hidden on Mobile) */}
        <section className="hidden md:flex flex-col justify-between p-12 bg-primary relative overflow-hidden text-primary-foreground min-h-[600px]">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              className="w-full h-full object-cover object-center"
              alt="abstract emerald waves"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGQNqCqYQUHQy1MaBd-G6-xMEx5wfQp6Pz88Gvr3cNB2A9mzuaT9h-lO-cl-doJHk1oAdkv9ZxJxuUY5cfYSYgWCIzJZwaOAtCDM7ueeH1-GEkNOddqAuTnVH7fdFbkv0fGOHE7b2RxlO53ETuMT6-nDcIeMHZ5W7FcfUkg1-4B4mkb2Xtmw7js5DFt2F4vm_z6TgZJZtPy71lNWjzZjSaWUtiK6RUmiynyTwh3Lo_M_Zc_8pz8YLpyK8apNOXQi16YNLXxNXZhT7u"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Logo width={40} height={40} className="brightness-0 invert" />
              </div>
              <div className="text-white text-4xl font-extrabold tracking-tight">
                Mizani
              </div>
            </div>
            <div className="text-white/70 font-medium text-lg">
              Financial Sanctuary
            </div>
          </div>
          <div className="relative z-10">
            <h1 className="text-white text-5xl font-bold leading-tight mb-6">
              مستقبلك المالي،<br />في توازن تام.
            </h1>
            <p className="text-[#83d5c6] text-xl max-w-md leading-relaxed">
              انضم إلى مجتمع ميزاني وابدأ رحلتك نحو الرخاء المالي من خلال أدوات تحليلية ذكية وتجربة استخدام راقية.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-4 rtl:space-x-reverse">
              <img className="h-10 w-10 rounded-full border-2 border-primary object-cover" alt="user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO1iob_5R-1Wm55OMEb2Lizij99k1nSEyZVejceVibqc9xUhnseKg5qWk5mj8h7LP06YtnE1HClnnYB_um6JkmD-6OeuozB9nITaqK52Metfb88s0EkkqAHbUbRwvAZPdILo03YW0EXkifzWadSxyH-k0wET3rkLcEldQaHXr72BcMiYyVWhQkZqghtxfTYZxfTsKceOE-DY-O0bvxo3vVonIZmukq_hNQf0k7_YIH9foPtxb5fBYq7i-EyH9qaLHJPnU9xQDdqjrv" />
              <img className="h-10 w-10 rounded-full border-2 border-primary object-cover" alt="user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw09lvbKn8Vfi7mAGWN0QXk5Tco5gEGsMhIcDaqvA92cRbePa3SwcVJidk2acgbsWQnkBfWqBKoxL8lrsBF4D0CqPrc_RFWLmbAhdYPGk29wRZBzdH-b5GJGZog71ZHDUcdEgeGQ5QSRveB6fn37a-GD5k9yHqa5mcfICaTStTWtT_zwpZ5dPzBA6r5UxT5du2g68bSSbSRnN6aPijyY2DmUrpVtP7S7Aey_Ya5fMqwGhYQc96QFRcrwRZlAXFsVwcjXr4R-y4b80X" />
              <img className="h-10 w-10 rounded-full border-2 border-primary object-cover" alt="user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNI8BW2r6jy71RnnuJlLXclaegphzDp9RnnRbYHKeHWYzIjwQv_abIniX1JOQsAgQFeQ1iceB1WI5RexeCTjPoSuw3of2Nxi4-mApm6nUlLe8gbiS7wXv65aysLeW-jsXD4MU5-H01nGDwXIlVoldJvY18_uQtTs0uivi5MbANv3fJ83UYE3tpmjnPk5-FvHZvsnyQChmM9GbjglbvQw-vqgYkJGYp9KT9jjdP7UxnZ0UsWxU8LuY42ih899eHr4go9kGiB9i6yTKM" />
            </div>
            <span className="text-[#9ff2e2] text-sm font-medium">أكثر من ١٠,٠٠٠ مستخدم يثقون بنا</span>
          </div>
        </section>

        {/* Dynamic Form Area */}
        <section className="p-8 md:p-16 flex flex-col justify-center bg-card">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </section>
      </main>

      {/* Background Subtle Accents */}
      <div className="fixed top-0 inset-s-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 inset-e-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 translate-y-1/3" />
    </div>
  );
}
