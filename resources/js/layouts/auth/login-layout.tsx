import { Link } from '@inertiajs/react';
import { ArrowUpRight, Compass, MapPin, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { home } from '@/routes';

export default function LoginLayout({ children }: { children: ReactNode }) {
    return (
        <main className="grid min-h-screen bg-[#fbfaf6] lg:grid-cols-2 dark:bg-[#102526]">
            <aside className="relative hidden min-h-screen overflow-hidden bg-[#173b39] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
                <img
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85"
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-50 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#173b39]/90 via-[#173b39]/55 to-[#122c2a]/90" />
                <div className="absolute -top-32 -right-36 size-[460px] rounded-full border border-white/10" />
                <div className="absolute top-0 -right-16 size-[340px] rounded-full border border-white/10" />

                <Link
                    href={home()}
                    className="relative z-10 inline-flex w-fit items-center gap-3"
                >
                    <span className="relative flex size-11 items-center justify-center rounded-2xl bg-[#e16a43] text-white shadow-lg">
                        <Compass size={25} strokeWidth={1.8} />
                        <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#f2c46d]" />
                    </span>
                    <span>
                        <span className="block text-xl font-semibold tracking-[-0.06em] text-white">
                            turismo<span className="text-[#ef9772]">67</span>
                        </span>
                        <span className="mt-1 block text-[9px] font-semibold tracking-[0.2em] text-white/65 uppercase">
                            Campo Grande · MS
                        </span>
                    </span>
                </Link>

                <div className="relative z-10 max-w-xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/90 uppercase backdrop-blur">
                        <Sparkles size={13} className="text-[#efbd74]" />
                        Um convite para viver a cidade
                    </span>
                    <h1 className="mt-6 font-serif text-[clamp(3.2rem,6vw,5.3rem)] leading-[0.98] tracking-[-0.065em] text-white">
                        A próxima
                        <br />
                        história começa
                        <br />
                        <span className="text-[#f0b179]">por aqui.</span>
                    </h1>
                    <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                        Entre para acompanhar seus eventos ou descobrir tudo o
                        que acontece em Campo Grande.
                    </p>
                    <span className="mt-7 inline-flex items-center gap-2 text-xs font-medium text-white/80">
                        <MapPin size={15} className="text-[#ef9772]" />
                        Cultura, encontros e bons momentos em Campo Grande, MS.
                    </span>
                </div>

                <span className="relative z-10 text-[11px] text-white/55">
                    Turismo67 · Sua cidade, de um jeito novo.
                </span>
            </aside>

            <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 sm:py-8 lg:items-center lg:justify-center lg:px-12 lg:py-12">
                <Link
                    href={home()}
                    className="mb-12 inline-flex w-fit items-center gap-2 self-start text-xs font-semibold text-[#60766b] transition hover:text-[#bd5738] lg:absolute lg:top-8 lg:right-10 lg:mb-0 dark:text-[#c1cec3]"
                >
                    <Compass size={15} />
                    Voltar para a agenda
                    <ArrowUpRight size={13} />
                </Link>
                <div className="mx-auto my-auto w-full max-w-[410px] py-8 lg:py-12">
                    <div className="mb-8 lg:hidden">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2.5"
                        >
                            <span className="relative flex size-10 items-center justify-center rounded-2xl bg-[#e16a43] text-white">
                                <Compass size={22} strokeWidth={1.8} />
                                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#f2c46d]" />
                            </span>
                            <span>
                                <span className="block text-lg font-semibold tracking-[-0.06em] text-[#17383a] dark:text-[#f3f0e5]">
                                    turismo
                                    <span className="text-[#e16a43]">67</span>
                                </span>
                                <span className="mt-1 block text-[9px] font-semibold tracking-[0.2em] text-[#778584] uppercase dark:text-[#aebcb7]">
                                    Campo Grande · MS
                                </span>
                            </span>
                        </Link>
                    </div>
                    {children}
                </div>
                <p className="mx-auto mt-auto w-full max-w-[410px] text-center text-[10px] text-[#929c92] dark:text-[#96a99f]">
                    Turismo67 · Uma agenda para viver Campo Grande.
                </p>
            </section>
        </main>
    );
}
