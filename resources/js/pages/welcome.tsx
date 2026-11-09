import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    Check,
    ChevronDown,
    Clock3,
    Compass,
    ExternalLink,
    Filter,
    Image as ImageIcon,
    LockKeyhole,
    LogIn,
    LogOut,
    Mail,
    MapPin,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    Ticket,
    Upload,
    UserRound,
    X,
} from 'lucide-react';
import { login, logout, register } from '@/routes';
import { store as loginStore } from '@/routes/login';
import { request as passwordReset } from '@/routes/password';
import { store as registerStore } from '@/routes/register';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
    dateFromToday,
    formatEventDate,
    MOCK_CATEGORIES,
    MOCK_CURATORS,
    MOCK_EVENTS,
    type Curator,
    type EventDraft,
    type EventStatus,
    type TourismEvent,
} from '@/lib/turismo67';

type PanelRole = 'organizer' | 'curator' | 'admin';
type Profile = 'visitor' | PanelRole;

const profileAreaLabels: Record<PanelRole, string> = {
    organizer: 'Organizador',
    curator: 'Curador',
    admin: 'Admin',
};

const categoryColors: Record<string, string> = {
    Música: 'bg-[#f7e8d9] text-[#9a4e26]',
    Feiras: 'bg-[#e3eee5] text-[#416849]',
    Gastronomia: 'bg-[#f5e4d7] text-[#a75a29]',
    Exposição: 'bg-[#e8e4f2] text-[#665684]',
    Teatro: 'bg-[#f2e4e6] text-[#974f5d]',
    Dança: 'bg-[#f4ecd5] text-[#8c6b24]',
};

const statusColors: Record<EventStatus, string> = {
    Pendente: 'bg-[#fff1d2] text-[#8a5a08]',
    Aprovado: 'bg-[#e1f1e7] text-[#2e6846]',
    Reprovado: 'bg-[#fbe6e3] text-[#a23f36]',
};

function Logo({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            className="group flex items-center gap-2.5 text-left"
            onClick={onClick}
            aria-label="Turismo67 — voltar à agenda"
        >
            <span className="relative flex size-10 items-center justify-center rounded-2xl bg-[#e16a43] text-white shadow-[0_8px_20px_-10px_#a74628] transition-transform group-hover:-rotate-6">
                <Compass size={23} strokeWidth={1.8} />
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#f2c46d]" />
            </span>
            <span className="leading-none">
                <span className="block text-[19px] font-semibold tracking-[-0.06em] text-[#17383a] dark:text-[#f3f0e5]">
                    turismo<span className="text-[#e16a43]">67</span>
                </span>
                <span className="mt-1 block text-[9px] font-semibold tracking-[0.2em] text-[#778584] uppercase dark:text-[#aebcb7]">
                    Campo Grande · MS
                </span>
            </span>
        </button>
    );
}

function StatusBadge({ status }: { status: EventStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColors[status]}`}
        >
            <span className="size-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}

function CategoryBadge({ category }: { category: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryColors[category] ?? 'bg-stone-100 text-stone-600'}`}
        >
            {category}
        </span>
    );
}

function EventCard({
    event,
    onSelect,
    featured = false,
}: {
    event: TourismEvent;
    onSelect: (event: TourismEvent) => void;
    featured?: boolean;
}) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#eae8df] bg-white shadow-[0_8px_26px_-20px_rgba(27,54,49,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-22px_rgba(27,54,49,0.35)] dark:border-[#2b4744] dark:bg-[#173332]">
            <button
                type="button"
                onClick={() => onSelect(event)}
                className="relative block w-full overflow-hidden text-left"
                aria-label={`Ver detalhes: ${event.name}`}
            >
                <img
                    src={event.image}
                    alt=""
                    className={`w-full object-cover transition duration-700 group-hover:scale-[1.04] ${featured ? 'h-56' : 'h-48'}`}
                />
                <span className="absolute top-3 left-3 flex flex-col items-center rounded-xl bg-[#fffdf8] px-3 py-2 text-[#17383a] shadow-lg">
                    <span className="text-[9px] font-bold tracking-[0.13em] text-[#e16a43] uppercase">
                        {formatEventDate(event.date, {
                            month: 'short',
                        }).replace('.', '')}
                    </span>
                    <span className="text-xl leading-5 font-semibold">
                        {formatEventDate(event.date, { day: '2-digit' })}
                    </span>
                </span>
                {featured && (
                    <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-[#17383a]/80 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                        <Sparkles size={12} />
                        Destaque da semana
                    </span>
                )}
            </button>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between gap-2">
                    <CategoryBadge category={event.category} />
                    <span className="text-xs font-medium text-[#74817d] dark:text-[#b2c0ba]">
                        {event.ticketType === 'Gratuito'
                            ? 'Gratuito'
                            : `A partir de R$ ${event.price.toFixed(2).replace('.', ',')}`}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => onSelect(event)}
                    className="mt-3 text-left text-[17px] leading-snug font-semibold tracking-[-0.035em] text-[#183638] transition-colors hover:text-[#cf5c39] dark:text-[#f3f0e5]"
                >
                    {event.name}
                </button>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#74817d] dark:text-[#b2c0ba]">
                    <MapPin size={13} className="shrink-0 text-[#e16a43]" />
                    <span className="truncate">{event.venue}</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#425b57] dark:text-[#d1d8ce]">
                        <Clock3 size={13} />
                        {event.startTime}
                    </span>
                    <button
                        type="button"
                        onClick={() => onSelect(event)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#c65434] hover:text-[#873d28]"
                    >
                        Ver detalhes
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            </div>
        </article>
    );
}

function Modal({
    title,
    eyebrow,
    onClose,
    children,
    wide = false,
}: {
    title: string;
    eyebrow?: string;
    onClose: () => void;
    children: React.ReactNode;
    wide?: boolean;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#102626]/65 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`my-auto w-full rounded-[24px] border border-[#ebe8df] bg-[#fffdf8] p-5 shadow-2xl sm:p-7 dark:border-[#35504c] dark:bg-[#173332] ${wide ? 'max-w-3xl' : 'max-w-lg'}`}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        {eyebrow && (
                            <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-[#d56340] uppercase">
                                {eyebrow}
                            </p>
                        )}
                        <h2 className="text-2xl font-semibold tracking-[-0.05em] text-[#183638] dark:text-[#f3f0e5]">
                            {title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f2f0e9] text-[#385450] transition hover:bg-[#e6e2d9] dark:bg-[#284744] dark:text-[#e9e9dc]"
                        aria-label="Fechar"
                    >
                        <X size={17} />
                    </button>
                </div>
                {children}
            </section>
        </div>
    );
}

function SiteHeader({
    profile,
    authenticated,
    onHome,
    onDemoOpen,
    onSignOut,
}: {
    profile: Profile;
    authenticated: boolean;
    onHome: () => void;
    onDemoOpen: () => void;
    onSignOut: () => void;
}) {
    return (
        <header className="sticky top-0 z-30 border-b border-[#e9e7dd]/90 bg-[#fbfaf6]/95 backdrop-blur-xl dark:border-[#314a46] dark:bg-[#112a29]/95">
            <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-4 px-5 lg:px-8">
                <Logo onClick={onHome} />
                {profile === 'visitor' ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            onClick={onDemoOpen}
                            className="inline-flex items-center gap-2 rounded-full bg-[#193b3c] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285552] sm:px-5 sm:text-sm"
                        >
                            <LogIn size={15} />
                            Entrar
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {authenticated ? (
                            <Link
                                href={logout().url}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-2 rounded-full bg-[#193b3c] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285552]"
                            >
                                Sair
                                <LogOut size={14} />
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={onSignOut}
                                className="inline-flex items-center gap-2 rounded-full bg-[#193b3c] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285552]"
                            >
                                Sair
                                <LogOut size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

function PublicAgenda({
    events,
    categories,
    onSelectEvent,
    onLoginOpen,
    onReturnToProfile,
    returnToProfileLabel,
}: {
    events: TourismEvent[];
    categories: string[];
    onSelectEvent: (event: TourismEvent) => void;
    onLoginOpen: () => void;
    onReturnToProfile?: () => void;
    returnToProfileLabel?: string;
}) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const publicEvents = useMemo(
        () =>
            events
                .filter(
                    (event) =>
                        event.status === 'Aprovado' &&
                        event.date >= dateFromToday(0),
                )
                .sort((a, b) => a.date.localeCompare(b.date)),
        [events],
    );
    const filteredEvents = publicEvents.filter((event) => {
        const query = search.trim().toLocaleLowerCase('pt-BR');

        return (
            (!query ||
                [event.name, event.venue, event.category]
                    .join(' ')
                    .toLocaleLowerCase('pt-BR')
                    .includes(query)) &&
            (!category || event.category === category) &&
            (!date || event.date === date)
        );
    });

    return (
        <>
            {onReturnToProfile && returnToProfileLabel && (
                <div className="mx-auto max-w-[1240px] px-5 pt-8 lg:px-8">
                    <header className="flex justify-start">
                        <button
                            type="button"
                            onClick={onReturnToProfile}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#587167] transition hover:text-[#c65434] dark:text-[#c1cec3]"
                        >
                            <ArrowLeft size={14} />
                            {returnToProfileLabel}
                        </button>
                    </header>
                </div>
            )}
            <section className="relative overflow-hidden bg-[#f4f1e7] dark:bg-[#163331]">
                <div className="pointer-events-none absolute -top-32 -right-32 size-[440px] rounded-full border border-[#dcd7c5]/60 dark:border-[#39544b]" />
                <div className="pointer-events-none absolute top-12 -right-20 size-[300px] rounded-full border border-[#dcd7c5]/60 dark:border-[#39544b]" />
                <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pt-12 pb-16 md:grid-cols-[1.02fr_0.98fr] md:items-center md:gap-12 md:pt-16 md:pb-20 lg:px-8 lg:pt-20">
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#d8d5c6] bg-[#fbfaf5]/70 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-[#567167] uppercase dark:border-[#456159] dark:bg-[#21423d] dark:text-[#c4d7c5]">
                            <span className="size-1.5 rounded-full bg-[#df7550]" />
                            O que acontece por aqui
                        </span>
                        <h1 className="mt-6 max-w-xl font-serif text-[clamp(3.1rem,7vw,5.55rem)] leading-[0.98] tracking-[-0.065em] text-[#17383a] dark:text-[#f3f0e5]">
                            Campo Grande
                            <br />
                            tem encontro
                            <br />
                            <span className="relative inline-block text-[#d96341]">
                                marcado.
                                <svg
                                    viewBox="0 0 250 14"
                                    aria-hidden="true"
                                    className="absolute -bottom-1 left-0 h-2.5 w-full text-[#edb66c]"
                                >
                                    <path
                                        d="M3 9C67 2 176 2 247 8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeWidth="5"
                                    />
                                </svg>
                            </span>
                        </h1>
                        <p className="mt-6 max-w-lg text-[15px] leading-7 text-[#596e68] dark:text-[#c1cec3]">
                            Um guia feito para descobrir a cultura, os sabores e
                            os encontros da nossa cidade. Escolha um programa e
                            viva Campo Grande de um jeito novo.
                        </p>
                        <a
                            href="#eventos"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#bb5234] transition hover:gap-3"
                        >
                            Explorar programação
                            <ArrowDownRight size={17} />
                        </a>
                        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#dedacb] pt-5 text-xs text-[#667a72] dark:border-[#456159] dark:text-[#c1cec3]">
                            <span className="flex items-center gap-2">
                                <ShieldCheck
                                    size={15}
                                    className="text-[#63896a]"
                                />
                                Programação curada
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin size={15} className="text-[#d66b48]" />
                                Campo Grande, MS
                            </span>
                        </div>
                    </div>
                    <div className="relative mx-auto w-full max-w-[540px]">
                        <div className="absolute -top-6 right-5 z-10 flex size-[92px] -rotate-6 flex-col items-center justify-center rounded-full bg-[#e4b85e] text-center text-[#17383a] shadow-lg">
                            <Sparkles size={18} />
                            <span className="mt-1 text-[10px] leading-tight font-bold tracking-wide uppercase">
                                Vem viver
                                <br />
                                a cidade
                            </span>
                        </div>
                        <div className="relative aspect-[1.1/1] overflow-hidden rounded-[30px] border-[7px] border-white shadow-[0_30px_70px_-35px_rgba(29,53,48,.48)] dark:border-[#294744]">
                            <img
                                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85"
                                alt="Paisagem ao ar livre sob a luz do fim de tarde"
                                className="size-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#142e2c]/85 via-[#142e2c]/10 to-transparent" />
                            <div className="absolute right-5 bottom-5 left-5 text-white sm:right-7 sm:bottom-7 sm:left-7">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md">
                                    <CalendarDays size={13} />
                                    UM CONVITE PARA SAIR
                                </span>
                                <p className="mt-3 max-w-sm font-serif text-3xl leading-tight tracking-[-0.04em] sm:text-4xl">
                                    Sua próxima história começa aqui.
                                </p>
                            </div>
                        </div>
                        <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-[#eee9dc] bg-[#fffdf8] px-4 py-3 shadow-xl sm:-left-8 dark:border-[#39544b] dark:bg-[#21403c]">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#e5efe4] text-[#527c5d] dark:bg-[#385845] dark:text-[#d2e3ca]">
                                <CalendarDays size={20} />
                            </span>
                            <span>
                                <span className="block text-[10px] text-[#76837c] dark:text-[#c1cec3]">
                                    Próximos dias
                                </span>
                                <span className="block text-sm font-semibold text-[#17383a] dark:text-[#f3f0e5]">
                                    {publicEvents.length} programas na agenda
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="eventos"
                className="mx-auto max-w-[1240px] scroll-mt-24 px-5 pt-14 pb-20 lg:px-8 lg:pt-20"
            >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.18em] text-[#d1613e] uppercase">
                            A cidade está acontecendo
                        </p>
                        <h2 className="mt-2 font-serif text-4xl tracking-[-0.055em] text-[#17383a] sm:text-[44px] dark:text-[#f3f0e5]">
                            Uma agenda cheia de vida
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-6 text-[#718078] dark:text-[#b2c0ba]">
                        Shows, feiras, sabores e cultura pertinho de você.
                        Programas aprovados, prontos para descobrir.
                    </p>
                </div>

                <div className="mt-7 rounded-[20px] border border-[#e8e5db] bg-white p-3 shadow-[0_12px_35px_-28px_rgba(27,54,49,0.4)] sm:p-4 dark:border-[#2e4a46] dark:bg-[#173332]">
                    <div className="grid gap-3 md:grid-cols-[1.2fr_0.78fr_0.78fr_auto]">
                        <label className="flex min-w-0 items-center gap-3 rounded-xl bg-[#f7f6f1] px-4 py-3 dark:bg-[#203d39]">
                            <Search
                                size={17}
                                className="shrink-0 text-[#72827b]"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="O que você quer encontrar?"
                                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17383a] outline-none placeholder:text-[#98a29a] focus:ring-0 dark:text-[#f3f0e5] dark:placeholder:text-[#98aaa1]"
                            />
                        </label>
                        <label className="flex items-center gap-3 rounded-xl bg-[#f7f6f1] px-4 py-3 dark:bg-[#203d39]">
                            <Filter
                                size={16}
                                className="shrink-0 text-[#72827b]"
                            />
                            <select
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                                className="w-full cursor-pointer border-0 bg-transparent text-sm text-[#52655d] outline-none focus:ring-0 dark:text-[#d2dacf]"
                                aria-label="Filtrar por categoria"
                            >
                                <option value="">Todas as categorias</option>
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={14}
                                className="pointer-events-none -ml-6 shrink-0 text-[#72827b]"
                            />
                        </label>
                        <label className="flex items-center gap-3 rounded-xl bg-[#f7f6f1] px-4 py-3 dark:bg-[#203d39]">
                            <CalendarDays
                                size={16}
                                className="shrink-0 text-[#72827b]"
                            />
                            <input
                                type="date"
                                value={date}
                                min={dateFromToday(0)}
                                onChange={(event) =>
                                    setDate(event.target.value)
                                }
                                aria-label="Filtrar por data"
                                className="w-full min-w-0 border-0 bg-transparent text-sm text-[#52655d] outline-none focus:ring-0 dark:text-[#d2dacf]"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setCategory('');
                                setDate('');
                            }}
                            className="rounded-xl border border-[#dfe5dc] px-5 py-3 text-sm font-semibold text-[#47635a] transition hover:bg-[#f1f5ee] dark:border-[#425c55] dark:text-[#e1e8dc] dark:hover:bg-[#213e39]"
                        >
                            Limpar
                        </button>
                    </div>
                </div>

                {!search && !category && !date && (
                    <div className="mt-14">
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.17em] text-[#d1613e] uppercase">
                                    Para já colocar no roteiro
                                </p>
                                <h3 className="mt-1 font-serif text-3xl tracking-[-0.05em] text-[#17383a] dark:text-[#f3f0e5]">
                                    Em destaque esta semana
                                </h3>
                            </div>
                            <span className="hidden items-center gap-1.5 text-xs font-medium text-[#718078] sm:flex dark:text-[#b2c0ba]">
                                Uma boa desculpa para sair
                                <ArrowRight size={14} />
                            </span>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {publicEvents.slice(0, 3).map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    featured
                                    onSelect={onSelectEvent}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-14">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.17em] text-[#d1613e] uppercase">
                                {search || category || date
                                    ? 'Sua busca'
                                    : 'Escolha o seu próximo programa'}
                            </p>
                            <h3 className="mt-1 font-serif text-3xl tracking-[-0.05em] text-[#17383a] dark:text-[#f3f0e5]">
                                {search || category || date
                                    ? `${filteredEvents.length} ${filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}`
                                    : 'Descubra a programação'}
                            </h3>
                        </div>
                    </div>
                    {filteredEvents.length ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onSelect={onSelectEvent}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[22px] border border-dashed border-[#d8d9cf] bg-white px-6 py-14 text-center dark:border-[#425c55] dark:bg-[#173332]">
                            <CalendarDays
                                size={26}
                                className="mx-auto text-[#8a9b91]"
                            />
                            <h4 className="mt-3 font-semibold text-[#17383a] dark:text-[#f3f0e5]">
                                Nenhum evento por aqui
                            </h4>
                            <p className="mt-1 text-sm text-[#718078] dark:text-[#b2c0ba]">
                                Tente mudar a data, categoria ou busca.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section
                id="sobre"
                className="border-y border-[#e9e6da] bg-[#eef1e8] dark:border-[#314a46] dark:bg-[#183632]"
            >
                <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div className="flex items-start gap-4">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#fffdf8] text-[#648267] dark:bg-[#274842] dark:text-[#c6d9c2]">
                            <MapPin size={22} />
                        </span>
                        <div>
                            <p className="font-serif text-2xl tracking-[-0.04em] text-[#17383a] dark:text-[#f3f0e5]">
                                Campo Grande, do seu jeito.
                            </p>
                            <p className="mt-1 max-w-xl text-sm leading-6 text-[#68796f] dark:text-[#c1cec3]">
                                Feita para moradores e visitantes encontrarem
                                boas histórias, pessoas e lugares pela cidade.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onLoginOpen}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#193b3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285552]"
                    >
                        Divulgue seu evento
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            <footer className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-8 text-xs text-[#7b8981] sm:flex-row sm:items-center sm:justify-between lg:px-8 dark:text-[#aebcb7]">
                <Logo
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                />
                <p>Turismo67 · Uma agenda para viver Campo Grande.</p>
            </footer>
        </>
    );
}

function EventDetails({
    event,
    onClose,
    showReview = false,
}: {
    event: TourismEvent;
    onClose: () => void;
    showReview?: boolean;
}) {
    const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(`${event.venue}, ${event.address}, Campo Grande, MS`)}`;

    return (
        <Modal
            title={event.name}
            eyebrow={`${event.category} · Campo Grande`}
            onClose={onClose}
            wide
        >
            <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <img
                        src={event.image}
                        alt={`Imagem de ${event.name}`}
                        className="h-56 w-full rounded-2xl object-cover sm:h-72"
                    />
                    <p className="mt-5 text-sm leading-7 text-[#5e7168] dark:text-[#c1cec3]">
                        {event.description}
                    </p>
                    <div className="mt-5 flex items-center gap-2">
                        <CategoryBadge category={event.category} />
                        <span className="rounded-full bg-[#f1eee5] px-2.5 py-1 text-[11px] font-semibold text-[#586c62] dark:bg-[#284744] dark:text-[#d1d8ce]">
                            {event.ticketType === 'Gratuito'
                                ? 'Entrada gratuita'
                                : `Ingresso · R$ ${event.price.toFixed(2).replace('.', ',')}`}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="rounded-2xl bg-[#f4f2eb] p-4 dark:bg-[#203d39]">
                        <p className="text-[10px] font-bold tracking-[0.15em] text-[#d1613e] uppercase">
                            Quando
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#254542] dark:text-[#f3f0e5]">
                            <CalendarDays
                                size={16}
                                className="text-[#d66b48]"
                            />
                            {formatEventDate(event.date, {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#62756b] dark:text-[#c1cec3]">
                            <Clock3 size={16} />
                            {event.startTime} às {event.endTime}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-[#f4f2eb] p-4 dark:bg-[#203d39]">
                        <p className="text-[10px] font-bold tracking-[0.15em] text-[#d1613e] uppercase">
                            Onde
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#254542] dark:text-[#f3f0e5]">
                            <MapPin size={16} className="text-[#d66b48]" />
                            {event.venue}
                        </p>
                        <p className="mt-1 pl-6 text-sm leading-6 text-[#62756b] dark:text-[#c1cec3]">
                            {event.address}
                        </p>
                    </div>
                    <a
                        href={mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex min-h-32 flex-1 items-end overflow-hidden rounded-2xl border border-[#e5e3d9] bg-[#e7ebdf] p-4 dark:border-[#425c55] dark:bg-[#29433c]"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-60"
                            style={{
                                backgroundImage:
                                    'linear-gradient(32deg, transparent 47%, #fffdf8 48%, #fffdf8 51%, transparent 52%), linear-gradient(140deg, transparent 47%, #fffdf8 48%, #fffdf8 51%, transparent 52%), linear-gradient(90deg, transparent 48%, #d2d9c9 49%, #d2d9c9 51%, transparent 52%)',
                                backgroundSize:
                                    '64px 64px, 85px 85px, 100% 100%',
                            }}
                        />
                        <span className="relative flex w-full items-center justify-between rounded-xl bg-white/90 p-3 backdrop-blur dark:bg-[#173332]/90">
                            <span className="flex items-center gap-2 text-xs font-semibold text-[#31514a] dark:text-[#e2e8dc]">
                                <MapPin size={16} className="text-[#d66b48]" />
                                Ver localização no mapa
                            </span>
                            <ExternalLink
                                size={15}
                                className="text-[#60766b] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </span>
                    </a>
                    <div className="flex items-center gap-2 pt-1 text-xs text-[#76847b] dark:text-[#b2c0ba]">
                        <Ticket size={15} />
                        Organizado por {event.organizer}
                    </div>
                    {showReview && (
                        <div className="rounded-2xl border border-[#e5e5dc] bg-white p-4 dark:border-[#38544e] dark:bg-[#173332]">
                            <p className="text-[10px] font-bold tracking-[0.15em] text-[#d1613e] uppercase">
                                Análise da curadoria
                            </p>
                            <div className="mt-3 flex items-center justify-between gap-3">
                                <span className="text-xs font-medium text-[#62756b] dark:text-[#c1cec3]">
                                    Status
                                </span>
                                <StatusBadge status={event.status} />
                            </div>
                            {event.status !== 'Pendente' && (
                                <p className="mt-3 text-xs leading-5 text-[#62756b] dark:text-[#c1cec3]">
                                    {event.status === 'Aprovado'
                                        ? 'Aprovado por'
                                        : 'Reprovado por'}{' '}
                                    <strong className="text-[#294a45] dark:text-[#f3f0e5]">
                                        {event.reviewedBy ??
                                            'Curadoria não informada'}
                                    </strong>
                                </p>
                            )}
                            {event.status === 'Reprovado' && (
                                <div className="mt-3 rounded-xl bg-[#fbefec] p-3 dark:bg-[#4a3431]">
                                    <p className="text-[10px] font-bold tracking-wide text-[#a23f36] uppercase">
                                        Motivo da reprovação
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-[#854a40] dark:text-[#f0c3b9]">
                                        {event.rejectionReason ??
                                            'Motivo não informado.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

function PanelLayout({
    onHome,
    children,
}: {
    onHome: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto max-w-[1240px] px-5 py-8 lg:px-8 lg:py-10">
            <header className="mb-6 flex justify-start">
                <button
                    type="button"
                    onClick={onHome}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#587167] transition hover:text-[#c65434] dark:text-[#c1cec3]"
                >
                    <ArrowLeft size={14} />
                    Voltar para a agenda
                </button>
            </header>
            <main className="min-w-0">{children}</main>
        </div>
    );
}

function MetricCard({
    label,
    value,
    note,
    tone = 'green',
}: {
    label: string;
    value: string | number;
    note: string;
    tone?: 'green' | 'orange' | 'blue';
}) {
    const tones = {
        green: 'bg-[#e8f0e7] text-[#517753]',
        orange: 'bg-[#f7e9dc] text-[#b5673d]',
        blue: 'bg-[#e7edf0] text-[#557382]',
    };

    return (
        <div className="rounded-[18px] border border-[#e8e6dc] bg-white p-4 sm:p-5 dark:border-[#2f4b46] dark:bg-[#173332]">
            <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium text-[#748078] dark:text-[#b2c0ba]">
                    {label}
                </span>
                <span
                    className={`flex size-8 items-center justify-center rounded-xl ${tones[tone]}`}
                >
                    <CalendarDays size={15} />
                </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#193a3b] dark:text-[#f3f0e5]">
                {value}
            </p>
            <p className="mt-1 text-[11px] text-[#849087] dark:text-[#aebcb7]">
                {note}
            </p>
        </div>
    );
}

function OrganizerPanel({
    events,
    onCreate,
    onEdit,
}: {
    events: TourismEvent[];
    onCreate: () => void;
    onEdit: (event: TourismEvent) => void;
}) {
    const [eventSearch, setEventSearch] = useState('');
    const [eventStatusFilter, setEventStatusFilter] = useState<
        EventStatus | 'Todos'
    >('Todos');
    const ownEvents = events.filter(
        (event) => event.organizer === 'Marina Costa',
    );
    const filteredEvents = useMemo(() => {
        const query = eventSearch.trim().toLocaleLowerCase('pt-BR');

        return ownEvents
            .filter((event) => {
                const matchesSearch =
                    !query ||
                    [event.name, event.category, event.venue].some((value) =>
                        value.toLocaleLowerCase('pt-BR').includes(query),
                    );
                const matchesStatus =
                    eventStatusFilter === 'Todos' ||
                    event.status === eventStatusFilter;

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [eventSearch, eventStatusFilter, ownEvents]);
    const pending = ownEvents.filter(
        (event) => event.status === 'Pendente',
    ).length;
    const approved = ownEvents.filter(
        (event) => event.status === 'Aprovado',
    ).length;

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.16em] text-[#d1613e] uppercase">
                        Olá, Marina
                    </p>
                    <h1 className="mt-1 font-serif text-4xl tracking-[-0.055em] text-[#17383a] dark:text-[#f3f0e5]">
                        Seus eventos
                    </h1>
                    <p className="mt-2 text-sm text-[#738078] dark:text-[#b2c0ba]">
                        Acompanhe a programação que você está organizando.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d96341] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_#a74628] transition hover:bg-[#bf5537]"
                >
                    <Plus size={17} />
                    Cadastrar evento
                </button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <MetricCard
                    label="Meus eventos"
                    value={ownEvents.length}
                    note="Na sua programação"
                    tone="blue"
                />
                <MetricCard
                    label="Em análise"
                    value={pending}
                    note="Aguardando a curadoria"
                    tone="orange"
                />
                <MetricCard
                    label="Publicados"
                    value={approved}
                    note="Visíveis na agenda"
                    tone="green"
                />
            </div>
            <div className="mt-9">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#1d3d3d] dark:text-[#f3f0e5]">
                            Seus envios
                        </h2>
                        <p className="mt-1 text-xs text-[#7e8980] dark:text-[#b2c0ba]">
                            Eventos enviados entram como pendentes.
                        </p>
                    </div>
                </div>
                <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
                    <label className="flex min-w-0 items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-[#e8e6dc] dark:bg-[#173332] dark:ring-[#2f4b46]">
                        <Search size={17} className="shrink-0 text-[#72827b]" />
                        <input
                            type="search"
                            value={eventSearch}
                            onChange={(change) =>
                                setEventSearch(change.target.value)
                            }
                            placeholder="Buscar por evento ou local"
                            aria-label="Buscar nos seus envios"
                            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17383a] outline-none placeholder:text-[#98a29a] focus:ring-0 dark:text-[#f3f0e5] dark:placeholder:text-[#98aaa1]"
                        />
                    </label>
                    <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-[#e8e6dc] dark:bg-[#173332] dark:ring-[#2f4b46]">
                        <Filter size={16} className="shrink-0 text-[#72827b]" />
                        <select
                            value={eventStatusFilter}
                            onChange={(change) =>
                                setEventStatusFilter(
                                    change.target.value as
                                        | EventStatus
                                        | 'Todos',
                                )
                            }
                            aria-label="Filtrar seus envios por status"
                            className="w-full cursor-pointer border-0 bg-transparent text-sm text-[#52655d] outline-none focus:ring-0 dark:text-[#d2dacf]"
                        >
                            <option value="Todos">Todos os status</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Reprovado">Reprovado</option>
                        </select>
                        <ChevronDown
                            size={14}
                            className="pointer-events-none -ml-6 shrink-0 text-[#72827b]"
                        />
                    </label>
                </div>
                <div className="overflow-hidden rounded-[20px] border border-[#e8e6dc] bg-white dark:border-[#2f4b46] dark:bg-[#173332]">
                    {filteredEvents.length ? (
                        filteredEvents.map((event) => (
                            <article
                                key={event.id}
                                className="flex flex-col gap-4 border-b border-[#efeee8] p-4 last:border-b-0 sm:flex-row sm:items-center sm:p-5 dark:border-[#2b4744]"
                            >
                                <img
                                    src={event.image}
                                    alt=""
                                    className="size-16 shrink-0 rounded-xl object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-[#254542] dark:text-[#f3f0e5]">
                                            {event.name}
                                        </h3>
                                        <StatusBadge status={event.status} />
                                    </div>
                                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#76847b] dark:text-[#b2c0ba]">
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarDays size={13} />
                                            {formatEventDate(event.date, {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={13} />
                                            {event.venue}
                                        </span>
                                    </p>
                                    {event.status === 'Reprovado' &&
                                        event.rejectionReason && (
                                            <p className="mt-2 rounded-lg bg-[#fff1ee] px-3 py-2 text-xs leading-5 text-[#9d4e42] dark:bg-[#4a3431] dark:text-[#f1c3b5]">
                                                <strong>
                                                    Correção solicitada:
                                                </strong>{' '}
                                                {event.rejectionReason}
                                            </p>
                                        )}
                                </div>
                                {event.status === 'Reprovado' && (
                                    <button
                                        type="button"
                                        onClick={() => onEdit(event)}
                                        className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full border border-[#e4d4c8] px-4 py-2 text-xs font-semibold text-[#b25435] transition hover:bg-[#fcf2eb] sm:self-center dark:border-[#6b4d40] dark:text-[#edb18e] dark:hover:bg-[#45382f]"
                                    >
                                        Corrigir e reenviar
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </article>
                        ))
                    ) : (
                        <div className="px-6 py-14 text-center">
                            <CalendarDays className="mx-auto text-[#8a9b91]" />
                            <p className="mt-3 text-sm text-[#718078] dark:text-[#b2c0ba]">
                                {ownEvents.length === 0
                                    ? 'Você ainda não cadastrou eventos.'
                                    : 'Nenhum evento encontrado com esses filtros.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CuratorPanel({
    events,
    tab,
    onTabChange,
    onApprove,
    onReject,
}: {
    events: TourismEvent[];
    tab: 'pending' | 'all';
    onTabChange: (tab: 'pending' | 'all') => void;
    onApprove: (id: number) => void;
    onReject: (id: number, reason: string) => void;
}) {
    const [rejecting, setRejecting] = useState<number | null>(null);
    const [reason, setReason] = useState('');
    const [eventSearch, setEventSearch] = useState('');
    const [eventStatusFilter, setEventStatusFilter] = useState<
        EventStatus | 'Todos'
    >('Todos');
    const [selectedEvent, setSelectedEvent] = useState<TourismEvent | null>(
        null,
    );
    const pending = events.filter((event) => event.status === 'Pendente');
    const visible = useMemo(() => {
        const query = eventSearch.trim().toLocaleLowerCase('pt-BR');
        const source =
            tab === 'pending'
                ? events.filter((event) => event.status === 'Pendente')
                : events;

        return source.filter((event) => {
            const matchesSearch =
                !query ||
                [
                    event.name,
                    event.description,
                    event.organizer,
                    event.category,
                    event.venue,
                ].some((value) =>
                    value.toLocaleLowerCase('pt-BR').includes(query),
                );
            const matchesStatus =
                tab === 'pending' ||
                eventStatusFilter === 'Todos' ||
                event.status === eventStatusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [events, eventSearch, eventStatusFilter, tab]);
    const approvedCount = events.filter(
        (event) => event.status === 'Aprovado',
    ).length;

    function submitRejection(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (rejecting === null || !reason.trim()) return;

        onReject(rejecting, reason.trim());
        setRejecting(null);
        setReason('');
    }

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.16em] text-[#d1613e] uppercase">
                        Qualidade e confiança
                    </p>
                    <h1 className="mt-1 font-serif text-4xl tracking-[-0.055em] text-[#17383a] dark:text-[#f3f0e5]">
                        Fila de curadoria
                    </h1>
                    <p className="mt-2 text-sm text-[#738078] dark:text-[#b2c0ba]">
                        Revise os envios antes que apareçam na agenda pública.
                    </p>
                </div>
                <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#fff1d2] px-3.5 py-2 text-xs font-semibold text-[#8a5a08] sm:self-auto">
                    <span className="size-1.5 rounded-full bg-[#d89929]" />
                    {pending.length} aguardando análise
                </span>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <MetricCard
                    label="Na fila"
                    value={pending.length}
                    note="Aguardando revisão"
                    tone="orange"
                />
                <MetricCard
                    label="Aprovados"
                    value={approvedCount}
                    note="Na agenda pública"
                    tone="green"
                />
                <MetricCard
                    label="Total de envios"
                    value={events.length}
                    note="Todos os status"
                    tone="blue"
                />
            </div>
            <div className="mt-8 flex gap-1 border-b border-[#e5e6dc] dark:border-[#38544e]">
                {[
                    { id: 'pending', label: `Pendentes (${pending.length})` },
                    { id: 'all', label: 'Todos os eventos' },
                ].map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                            onTabChange(item.id as 'pending' | 'all')
                        }
                        className={`border-b-2 px-4 py-3 text-xs font-semibold transition ${tab === item.id ? 'border-[#d96341] text-[#bd5738]' : 'border-transparent text-[#78847c] hover:text-[#395c51] dark:text-[#b2c0ba]'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <div
                className={`mt-4 grid gap-3 ${tab === 'all' ? 'sm:grid-cols-[minmax(0,1fr)_220px]' : ''}`}
            >
                <label className="flex min-w-0 items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-[#e8e6dc] dark:bg-[#173332] dark:ring-[#2f4b46]">
                    <Search size={17} className="shrink-0 text-[#72827b]" />
                    <input
                        type="search"
                        value={eventSearch}
                        onChange={(change) =>
                            setEventSearch(change.target.value)
                        }
                        placeholder="Buscar por evento ou organizador"
                        aria-label="Buscar eventos da curadoria"
                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17383a] outline-none placeholder:text-[#98a29a] focus:ring-0 dark:text-[#f3f0e5] dark:placeholder:text-[#98aaa1]"
                    />
                </label>
                {tab === 'all' && (
                    <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-[#e8e6dc] dark:bg-[#173332] dark:ring-[#2f4b46]">
                        <Filter size={16} className="shrink-0 text-[#72827b]" />
                        <select
                            value={eventStatusFilter}
                            onChange={(change) =>
                                setEventStatusFilter(
                                    change.target.value as
                                        | EventStatus
                                        | 'Todos',
                                )
                            }
                            aria-label="Filtrar eventos por status"
                            className="w-full cursor-pointer border-0 bg-transparent text-sm text-[#52655d] outline-none focus:ring-0 dark:text-[#d2dacf]"
                        >
                            <option value="Todos">Todos os status</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Reprovado">Reprovado</option>
                        </select>
                        <ChevronDown
                            size={14}
                            className="pointer-events-none -ml-6 shrink-0 text-[#72827b]"
                        />
                    </label>
                )}
            </div>
            <div className="mt-4 flex flex-col gap-3">
                {visible.map((event) => (
                    <article
                        key={event.id}
                        onClick={(click) => {
                            if (
                                click.target instanceof Element &&
                                click.target.closest('button, a')
                            ) {
                                return;
                            }

                            setSelectedEvent(event);
                        }}
                        className="flex cursor-pointer flex-col gap-4 rounded-[20px] border border-[#e8e6dc] bg-white p-4 transition hover:border-[#cbd8c8] hover:shadow-sm sm:flex-row sm:p-5 dark:border-[#2f4b46] dark:bg-[#173332] dark:hover:border-[#547168]"
                    >
                        <img
                            src={event.image}
                            alt=""
                            className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-36"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <CategoryBadge category={event.category} />
                                <StatusBadge status={event.status} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedEvent(event)}
                                className="mt-2 block text-left text-lg font-semibold tracking-[-0.03em] text-[#1e3d3c] hover:text-[#bd5738] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd5738] dark:text-[#f3f0e5] dark:hover:text-[#edb18e]"
                                aria-label={`Ver detalhes de ${event.name}`}
                            >
                                {event.name}
                            </button>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#748078] dark:text-[#b2c0ba]">
                                {event.description}
                            </p>
                            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#75837a] dark:text-[#b2c0ba]">
                                <span>
                                    Por <strong>{event.organizer}</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                    <CalendarDays size={12} />
                                    {formatEventDate(event.date, {
                                        day: 'numeric',
                                        month: 'short',
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {event.venue}
                                </span>
                            </p>
                        </div>
                        {event.status === 'Pendente' && (
                            <div className="flex shrink-0 gap-2 sm:flex-col sm:justify-center">
                                <button
                                    type="button"
                                    onClick={() => onApprove(event.id)}
                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#e4f0e5] px-4 py-2.5 text-xs font-semibold text-[#39734c] transition hover:bg-[#d4e8d7] sm:flex-none dark:bg-[#2b4c39] dark:text-[#d1e6cf] dark:hover:bg-[#365942]"
                                >
                                    <Check size={14} />
                                    Aprovar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRejecting(event.id)}
                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#eadbd5] px-4 py-2.5 text-xs font-semibold text-[#a64c3c] transition hover:bg-[#fbefec] sm:flex-none dark:border-[#644740] dark:text-[#efb8aa] dark:hover:bg-[#4a3431]"
                                >
                                    Reprovar
                                </button>
                            </div>
                        )}
                    </article>
                ))}
                {!visible.length && (
                    <div className="rounded-[20px] border border-dashed border-[#d8d9cf] bg-white px-6 py-14 text-center dark:border-[#425c55] dark:bg-[#173332]">
                        <Check size={26} className="mx-auto text-[#65946c]" />
                        <p className="mt-3 text-sm font-medium text-[#53685e] dark:text-[#c1cec3]">
                            {tab === 'pending' && pending.length === 0
                                ? 'Tudo em dia. Não há eventos pendentes.'
                                : 'Nenhum evento encontrado com esses filtros.'}
                        </p>
                    </div>
                )}
            </div>
            {selectedEvent && (
                <EventDetails
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    showReview
                />
            )}
            {rejecting !== null && (
                <Modal
                    title="O que precisa ser corrigido?"
                    eyebrow="Reprovar evento"
                    onClose={() => {
                        setRejecting(null);
                        setReason('');
                    }}
                >
                    <form onSubmit={submitRejection}>
                        <p className="mb-4 text-sm leading-6 text-[#6f7d73] dark:text-[#c1cec3]">
                            Explique o motivo para o organizador corrigir o
                            cadastro e enviar novamente.
                        </p>
                        <label
                            htmlFor="rejection-reason"
                            className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]"
                        >
                            Motivo da reprovação *
                        </label>
                        <textarea
                            id="rejection-reason"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            required
                            rows={4}
                            minLength={5}
                            placeholder="Ex.: complete as informações sobre o local do evento."
                            className="w-full resize-y rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] transition outline-none focus:border-[#d58765] focus:ring-2 focus:ring-[#d58765]/15 dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        />
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setRejecting(null);
                                    setReason('');
                                }}
                                className="rounded-full px-4 py-2.5 text-xs font-semibold text-[#69776e] hover:bg-[#f0efe8] dark:text-[#c1cec3] dark:hover:bg-[#284744]"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded-full bg-[#b7513b] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#963e2e]"
                            >
                                Enviar reprovação
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

function AdminPanel({
    events,
    curators,
    categories,
    activeTab,
    onTabChange,
    onAddCurator,
    onToggleCurator,
    onAddCategory,
    onRemoveCategory,
}: {
    events: TourismEvent[];
    curators: Curator[];
    categories: string[];
    activeTab: 'events' | 'curators' | 'categories';
    onTabChange: (tab: 'events' | 'curators' | 'categories') => void;
    onAddCurator: (name: string, email: string) => void;
    onToggleCurator: (id: number) => void;
    onAddCategory: (name: string) => void;
    onRemoveCategory: (name: string) => void;
}) {
    const [curatorModal, setCuratorModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TourismEvent | null>(
        null,
    );
    const [curatorName, setCuratorName] = useState('');
    const [curatorEmail, setCuratorEmail] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [eventSearch, setEventSearch] = useState('');
    const [eventStatusFilter, setEventStatusFilter] = useState<
        EventStatus | 'Todos'
    >('Todos');
    const filteredEvents = useMemo(() => {
        const query = eventSearch.trim().toLocaleLowerCase('pt-BR');

        return events
            .filter((event) => {
                const matchesStatus =
                    eventStatusFilter === 'Todos' ||
                    event.status === eventStatusFilter;
                const matchesSearch =
                    !query ||
                    [
                        event.name,
                        event.organizer,
                        event.category,
                        event.venue,
                    ].some((value) =>
                        value.toLocaleLowerCase('pt-BR').includes(query),
                    );

                return matchesStatus && matchesSearch;
            })
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [events, eventSearch, eventStatusFilter]);
    const pendingCount = events.filter(
        (event) => event.status === 'Pendente',
    ).length;
    const publishedCount = events.filter(
        (event) => event.status === 'Aprovado',
    ).length;

    function submitCurator(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onAddCurator(curatorName.trim(), curatorEmail.trim());
        setCuratorName('');
        setCuratorEmail('');
        setCuratorModal(false);
    }

    function submitCategory(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onAddCategory(newCategory.trim());
        setNewCategory('');
    }

    return (
        <div>
            <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-[#d1613e] uppercase">
                    Painel de controle
                </p>
                <h1 className="mt-1 font-serif text-4xl tracking-[-0.055em] text-[#17383a] dark:text-[#f3f0e5]">
                    Administração
                </h1>
                <p className="mt-2 text-sm text-[#738078] dark:text-[#b2c0ba]">
                    Gerencie a programação, a equipe e as categorias da agenda.
                </p>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <MetricCard
                    label="Eventos cadastrados"
                    value={events.length}
                    note="Todos os status"
                    tone="blue"
                />
                <MetricCard
                    label="Aguardando curadoria"
                    value={pendingCount}
                    note="Envios pendentes"
                    tone="orange"
                />
                <MetricCard
                    label="Na agenda pública"
                    value={publishedCount}
                    note="Eventos aprovados"
                    tone="green"
                />
            </div>
            <div className="mt-8 flex gap-1 overflow-x-auto border-b border-[#e5e6dc] dark:border-[#38544e]">
                {[
                    { id: 'events', label: 'Eventos' },
                    { id: 'curators', label: 'Curadores' },
                    { id: 'categories', label: 'Categorias' },
                ].map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                            onTabChange(
                                item.id as 'events' | 'curators' | 'categories',
                            )
                        }
                        className={`shrink-0 border-b-2 px-4 py-3 text-xs font-semibold transition ${activeTab === item.id ? 'border-[#d96341] text-[#bd5738]' : 'border-transparent text-[#78847c] hover:text-[#395c51] dark:text-[#b2c0ba]'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {activeTab === 'events' && (
                <div className="mt-5 overflow-hidden rounded-[20px] border border-[#e8e6dc] bg-white dark:border-[#2f4b46] dark:bg-[#173332]">
                    <div className="flex flex-col gap-4 border-b border-[#efeee8] px-4 py-4 sm:px-5 dark:border-[#2b4744]">
                        <div>
                            <h2 className="text-sm font-semibold text-[#274542] dark:text-[#f3f0e5]">
                                Todos os eventos
                            </h2>
                            <p className="mt-1 text-[11px] text-[#7b8981] dark:text-[#b2c0ba]">
                                {filteredEvents.length} de {events.length}{' '}
                                eventos · Acompanhe o status de cada envio.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
                            <label className="flex min-w-0 items-center gap-3 rounded-xl bg-[#f7f6f1] px-4 py-3 dark:bg-[#203d39]">
                                <Search
                                    size={17}
                                    className="shrink-0 text-[#72827b]"
                                />
                                <input
                                    type="search"
                                    value={eventSearch}
                                    onChange={(event) =>
                                        setEventSearch(event.target.value)
                                    }
                                    placeholder="Buscar evento ou organizador"
                                    aria-label="Buscar eventos"
                                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17383a] outline-none placeholder:text-[#98a29a] focus:ring-0 dark:text-[#f3f0e5] dark:placeholder:text-[#98aaa1]"
                                />
                            </label>
                            <label className="flex items-center gap-3 rounded-xl bg-[#f7f6f1] px-4 py-3 dark:bg-[#203d39]">
                                <Filter
                                    size={16}
                                    className="shrink-0 text-[#72827b]"
                                />
                                <select
                                    value={eventStatusFilter}
                                    onChange={(event) =>
                                        setEventStatusFilter(
                                            event.target.value as
                                                | EventStatus
                                                | 'Todos',
                                        )
                                    }
                                    aria-label="Filtrar eventos por status"
                                    className="w-full cursor-pointer border-0 bg-transparent text-sm text-[#52655d] outline-none focus:ring-0 dark:text-[#d2dacf]"
                                >
                                    <option value="Todos">
                                        Todos os status
                                    </option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Aprovado">Aprovado</option>
                                    <option value="Reprovado">Reprovado</option>
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="pointer-events-none -ml-6 shrink-0 text-[#72827b]"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-xs">
                            <thead className="bg-[#f7f6f1] text-[#77847c] dark:bg-[#203d39] dark:text-[#b2c0ba]">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Evento
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Organizador
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Data
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-10 text-center text-sm text-[#7b8981] dark:text-[#b2c0ba]"
                                        >
                                            Nenhum evento encontrado com esses
                                            filtros.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <tr
                                            key={event.id}
                                            className="border-t border-[#efeee8] dark:border-[#2b4744]"
                                        >
                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedEvent(event)
                                                    }
                                                    className="block text-left font-semibold text-[#294a45] hover:text-[#bd5738] dark:text-[#e9ede2] dark:hover:text-[#edb18e]"
                                                    aria-label={`Ver detalhes de ${event.name}`}
                                                >
                                                    {event.name}
                                                </button>
                                                <span className="mt-1 block text-[10px] text-[#849087] dark:text-[#aebcb7]">
                                                    {event.category}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-[#61736a] dark:text-[#c1cec3]">
                                                {event.organizer}
                                            </td>
                                            <td className="px-5 py-4 text-[#61736a] dark:text-[#c1cec3]">
                                                {formatEventDate(event.date, {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={event.status}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {selectedEvent && (
                <EventDetails
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    showReview
                />
            )}

            {activeTab === 'curators' && (
                <div className="mt-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-xs text-[#7b8981] dark:text-[#b2c0ba]">
                            Curadores são cadastrados pela administração.
                        </p>
                        <button
                            type="button"
                            onClick={() => setCuratorModal(true)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#193b3c] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285552]"
                        >
                            <Plus size={14} />
                            Adicionar curador
                        </button>
                    </div>
                    <div className="overflow-hidden rounded-[20px] border border-[#e8e6dc] bg-white dark:border-[#2f4b46] dark:bg-[#173332]">
                        {curators.map((curator) => (
                            <article
                                key={curator.id}
                                className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeee8] p-4 last:border-0 sm:p-5 dark:border-[#2b4744]"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6eee6] text-sm font-semibold text-[#54775a] dark:bg-[#29463b] dark:text-[#d0e0cb]">
                                        {curator.name
                                            .split(' ')
                                            .map((part) => part[0])
                                            .slice(0, 2)
                                            .join('')}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-sm font-semibold text-[#294a45] dark:text-[#f3f0e5]">
                                            {curator.name}
                                        </span>
                                        <span className="block truncate text-xs text-[#849087] dark:text-[#aebcb7]">
                                            {curator.email}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${curator.active ? 'bg-[#e1f1e7] text-[#2e6846]' : 'bg-[#efeee8] text-[#778078] dark:bg-[#304642] dark:text-[#c1cec3]'}`}
                                    >
                                        {curator.active
                                            ? 'Ativo'
                                            : 'Desativado'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onToggleCurator(curator.id)
                                        }
                                        className="text-xs font-semibold text-[#b25435] hover:text-[#873d28] dark:text-[#edb18e]"
                                    >
                                        {curator.active
                                            ? 'Desativar'
                                            : 'Ativar'}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="mt-5">
                    <div className="rounded-[20px] border border-[#e8e6dc] bg-white p-4 sm:p-5 dark:border-[#2f4b46] dark:bg-[#173332]">
                        <h2 className="text-sm font-semibold text-[#274542] dark:text-[#f3f0e5]">
                            Adicionar categoria
                        </h2>
                        <form
                            onSubmit={submitCategory}
                            className="mt-3 flex flex-col gap-2 sm:flex-row"
                        >
                            <input
                                value={newCategory}
                                onChange={(event) =>
                                    setNewCategory(event.target.value)
                                }
                                required
                                maxLength={30}
                                placeholder="Ex.: Cinema"
                                aria-label="Nome da categoria"
                                className="min-w-0 flex-1 rounded-xl border border-[#dfe3d8] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#254542] transition outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#193b3c] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285552]"
                            >
                                <Plus size={14} />
                                Criar categoria
                            </button>
                        </form>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const inUse = events.some(
                                (event) => event.category === category,
                            );

                            return (
                                <span
                                    key={category}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#e5e5da] bg-white py-1.5 pr-1.5 pl-3 text-xs font-medium text-[#48635a] dark:border-[#38544e] dark:bg-[#173332] dark:text-[#dce3d8]"
                                >
                                    {category}
                                    <button
                                        type="button"
                                        disabled={inUse}
                                        onClick={() =>
                                            onRemoveCategory(category)
                                        }
                                        title={
                                            inUse
                                                ? 'Esta categoria está sendo usada por um evento'
                                                : 'Remover categoria'
                                        }
                                        aria-label={`Remover categoria ${category}`}
                                        className="flex size-6 items-center justify-center rounded-full text-[#839087] transition hover:bg-[#f4e8e3] hover:text-[#ac4b36] disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-[#4a3431] dark:hover:text-[#efb8aa]"
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
            {curatorModal && (
                <Modal
                    title="Adicionar curador"
                    eyebrow="Equipe de curadoria"
                    onClose={() => setCuratorModal(false)}
                >
                    <form onSubmit={submitCurator} className="space-y-4">
                        <p className="text-sm leading-6 text-[#718078] dark:text-[#c1cec3]">
                            O perfil de curador é criado pela administração e
                            não tem cadastro público.
                        </p>
                        <label className="block">
                            <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                                Nome completo *
                            </span>
                            <input
                                value={curatorName}
                                onChange={(event) =>
                                    setCuratorName(event.target.value)
                                }
                                required
                                maxLength={80}
                                className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                                E-mail *
                            </span>
                            <input
                                type="email"
                                value={curatorEmail}
                                onChange={(event) =>
                                    setCuratorEmail(event.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                            />
                        </label>
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#193b3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285552]"
                        >
                            Criar perfil de curador
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}

function EventFormModal({
    event,
    categories,
    onClose,
    onSave,
}: {
    event?: TourismEvent;
    categories: string[];
    onClose: () => void;
    onSave: (draft: EventDraft, id?: number) => void;
}) {
    const [draft, setDraft] = useState<EventDraft>(() =>
        event
            ? {
                  name: event.name,
                  description: event.description,
                  category: event.category,
                  date: event.date,
                  startTime: event.startTime,
                  endTime: event.endTime,
                  venue: event.venue,
                  address: event.address,
                  image: event.image,
                  ticketType: event.ticketType,
                  price: event.price,
                  organizer: 'Marina Costa',
              }
            : {
                  name: '',
                  description: '',
                  category: categories[0] ?? '',
                  date: dateFromToday(7),
                  startTime: '18:00',
                  endTime: '21:00',
                  venue: '',
                  address: '',
                  image: '',
                  ticketType: 'Gratuito',
                  price: 0,
                  organizer: 'Marina Costa',
              },
    );

    function updateDraft<Key extends keyof EventDraft>(
        key: Key,
        value: EventDraft[Key],
    ) {
        setDraft((current) => ({ ...current, [key]: value }));
    }

    return (
        <Modal
            title={event ? 'Corrigir evento' : 'Conte o que vai acontecer'}
            eyebrow={event ? 'Atualizar envio' : 'Novo evento'}
            onClose={onClose}
            wide
        >
            <form
                onSubmit={(formEvent) => {
                    formEvent.preventDefault();
                    if (!draft.image) {
                        toast.error(
                            'Adicione pelo menos uma imagem para o evento.',
                        );
                        return;
                    }
                    onSave(draft, event?.id);
                }}
                className="space-y-4"
            >
                <p className="text-sm leading-6 text-[#718078] dark:text-[#c1cec3]">
                    {event
                        ? 'Revise as informações solicitadas e reenvie para aprovação.'
                        : 'Preencha os detalhes. Seu evento será enviado para análise antes de aparecer na agenda.'}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Nome do evento *
                        </span>
                        <input
                            value={draft.name}
                            onChange={(change) =>
                                updateDraft('name', change.target.value)
                            }
                            required
                            maxLength={100}
                            placeholder="Ex.: Festival de música do Cerrado"
                            className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        />
                    </label>
                    <label>
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Categoria *
                        </span>
                        <select
                            value={draft.category}
                            onChange={(change) =>
                                updateDraft('category', change.target.value)
                            }
                            required
                            className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Data *
                        </span>
                        <input
                            type="date"
                            value={draft.date}
                            min={dateFromToday(0)}
                            onChange={(change) =>
                                updateDraft('date', change.target.value)
                            }
                            required
                            className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        />
                    </label>
                    <label>
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Horário de início *
                        </span>
                        <input
                            type="time"
                            value={draft.startTime}
                            onChange={(change) =>
                                updateDraft('startTime', change.target.value)
                            }
                            required
                            className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        />
                    </label>
                    <label>
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Horário de encerramento *
                        </span>
                        <input
                            type="time"
                            value={draft.endTime}
                            onChange={(change) =>
                                updateDraft('endTime', change.target.value)
                            }
                            required
                            className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        />
                    </label>
                    <label>
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Local do evento *
                        </span>
                        <input
                            value={draft.venue}
                            onChange={(change) =>
                                updateDraft('venue', change.target.value)
                            }
                            required
                            maxLength={100}
                            placeholder="Nome do espaço ou endereço"
                            className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        />
                    </label>
                    <label>
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Endereço completo *
                        </span>
                        <input
                            value={draft.address}
                            onChange={(change) =>
                                updateDraft('address', change.target.value)
                            }
                            required
                            maxLength={150}
                            placeholder="Rua, número e bairro"
                            className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        />
                    </label>
                    <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Descrição *
                        </span>
                        <textarea
                            value={draft.description}
                            onChange={(change) =>
                                updateDraft('description', change.target.value)
                            }
                            required
                            minLength={10}
                            maxLength={1000}
                            rows={3}
                            placeholder="Conte o que as pessoas vão encontrar no evento."
                            className="w-full resize-y rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm leading-6 text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                        />
                    </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                            Ingresso *
                        </span>
                        <div className="flex gap-2">
                            {(['Gratuito', 'Pago'] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() =>
                                        updateDraft('ticketType', type)
                                    }
                                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${draft.ticketType === type ? 'bg-[#e4eee2] text-[#42684b] dark:bg-[#2b4c39] dark:text-[#d1e6cf]' : 'bg-[#f1f0e9] text-[#76847b] dark:bg-[#284744] dark:text-[#c1cec3]'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    {draft.ticketType === 'Pago' && (
                        <label>
                            <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                                Valor do ingresso (R$) *
                            </span>
                            <input
                                type="number"
                                value={draft.price}
                                onChange={(change) =>
                                    updateDraft(
                                        'price',
                                        Number(change.target.value),
                                    )
                                }
                                min={0.01}
                                step={0.01}
                                required
                                className="w-full rounded-xl border border-[#dfe3d8] bg-white px-3.5 py-3 text-sm text-[#254542] outline-none focus:border-[#d58765] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                            />
                        </label>
                    )}
                </div>
                <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-[#3d5850] dark:text-[#dce3d8]">
                        Imagem do evento *
                    </span>
                    <span className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#cbd4c8] bg-[#f7f7f1] px-4 py-4 text-xs font-medium text-[#668071] transition hover:border-[#97b09a] hover:bg-[#f1f5ed] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#d1d8ce] dark:hover:bg-[#284744]">
                        <Upload size={16} />
                        {draft.image
                            ? 'Imagem adicionada — escolher outra'
                            : 'Selecionar uma imagem'}
                        <input
                            type="file"
                            accept="image/*"
                            required={!draft.image}
                            className="sr-only"
                            onChange={(change) => {
                                const file = change.target.files?.[0];
                                if (file) {
                                    updateDraft(
                                        'image',
                                        URL.createObjectURL(file),
                                    );
                                }
                            }}
                        />
                    </span>
                    {draft.image && (
                        <span className="mt-2 flex items-center gap-2 text-[11px] text-[#52745a] dark:text-[#cce0c7]">
                            <ImageIcon size={14} />
                            Imagem pronta para envio
                        </span>
                    )}
                </label>
                <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#eeece3] pt-4 sm:flex-row sm:items-center dark:border-[#38544e]">
                    <p className="text-[11px] text-[#839087] dark:text-[#b2c0ba]">
                        Seu evento será enviado como <strong>Pendente</strong>.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full px-4 py-2.5 text-xs font-semibold text-[#69776e] hover:bg-[#f0efe8] dark:text-[#c1cec3] dark:hover:bg-[#284744]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-full bg-[#d96341] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#bf5537]"
                        >
                            {event
                                ? 'Reenviar para análise'
                                : 'Enviar para análise'}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

function OrganizerAccessModal({ onClose }: { onClose: () => void }) {
    return (
        <Modal
            title="Acesse sua conta"
            eyebrow="Área do sistema"
            onClose={onClose}
        >
            <p className="mb-5 text-sm leading-6 text-[#718078] dark:text-[#c1cec3]">
                Entre para acessar as ferramentas do seu perfil no Turismo67.
            </p>
            <Form
                {...loginStore.form()}
                resetOnSuccess={['password']}
                disableWhileProcessing
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <label className="grid gap-2">
                            <span className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]">
                                E-mail
                            </span>
                            <span className="relative">
                                <Mail
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a9a8f]"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="voce@exemplo.com"
                                    className="h-12 w-full rounded-xl border border-[#e2e4da] bg-white pr-3 pl-10 text-sm text-[#254542] outline-none placeholder:text-[#9aa39a] focus:border-[#86a083] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                />
                            </span>
                            {errors.email && (
                                <span
                                    className="text-xs text-[#b54736]"
                                    role="alert"
                                >
                                    {errors.email}
                                </span>
                            )}
                        </label>
                        <label className="grid gap-2">
                            <span className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]">
                                Senha
                            </span>
                            <span className="relative">
                                <LockKeyhole
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a9a8f]"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Digite sua senha"
                                    className="h-12 w-full rounded-xl border border-[#e2e4da] bg-white pr-3 pl-10 text-sm text-[#254542] outline-none placeholder:text-[#9aa39a] focus:border-[#86a083] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                />
                            </span>
                            {errors.password && (
                                <span
                                    className="text-xs text-[#b54736]"
                                    role="alert"
                                >
                                    {errors.password}
                                </span>
                            )}
                            <Link
                                href={passwordReset()}
                                className="self-end text-xs font-semibold text-[#bd5738] transition hover:text-[#8f412d]"
                            >
                                Esqueci minha senha
                            </Link>
                        </label>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#193b3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285552] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Entrando...' : 'Entrar'}
                            {!processing && <ArrowRight size={16} />}
                        </button>
                    </>
                )}
            </Form>
            <div className="mt-4 border-t border-[#eeece3] pt-4 text-center dark:border-[#38544e]">
                <p className="text-sm text-[#69776e] dark:text-[#c1cec3]">
                    Ainda não tem conta?{' '}
                    <Link
                        href={register()}
                        className="font-semibold text-[#bd5738] transition hover:text-[#8f412d]"
                    >
                        Criar conta de organizador
                    </Link>
                </p>
            </div>
        </Modal>
    );
}

function OrganizerRegistrationModal({
    passwordRules,
    onClose,
}: {
    passwordRules?: string;
    onClose: () => void;
}) {
    return (
        <Modal
            title="Criar conta de organizador"
            eyebrow="Faça parte da agenda"
            onClose={onClose}
        >
            <p className="mb-5 text-sm leading-6 text-[#718078] dark:text-[#c1cec3]">
                Cadastre-se para divulgar e acompanhar seus eventos no
                Turismo67.
            </p>
            <Form
                {...registerStore.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <label className="grid gap-2">
                            <span className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]">
                                Nome completo
                            </span>
                            <span className="relative">
                                <UserRound
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a9a8f]"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Seu nome completo"
                                    className="h-12 w-full rounded-xl border border-[#e2e4da] bg-white pr-3 pl-10 text-sm text-[#254542] outline-none placeholder:text-[#9aa39a] focus:border-[#86a083] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                />
                            </span>
                            {errors.name && (
                                <span
                                    className="text-xs text-[#b54736]"
                                    role="alert"
                                >
                                    {errors.name}
                                </span>
                            )}
                        </label>
                        <label className="grid gap-2">
                            <span className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]">
                                E-mail
                            </span>
                            <span className="relative">
                                <Mail
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a9a8f]"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="voce@exemplo.com"
                                    className="h-12 w-full rounded-xl border border-[#e2e4da] bg-white pr-3 pl-10 text-sm text-[#254542] outline-none placeholder:text-[#9aa39a] focus:border-[#86a083] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                />
                            </span>
                            {errors.email && (
                                <span
                                    className="text-xs text-[#b54736]"
                                    role="alert"
                                >
                                    {errors.email}
                                </span>
                            )}
                        </label>
                        <label className="grid gap-2">
                            <span className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]">
                                Senha
                            </span>
                            <span className="relative">
                                <LockKeyhole
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a9a8f]"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    passwordrules={passwordRules}
                                    placeholder="Crie uma senha"
                                    className="h-12 w-full rounded-xl border border-[#e2e4da] bg-white pr-3 pl-10 text-sm text-[#254542] outline-none placeholder:text-[#9aa39a] focus:border-[#86a083] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                />
                            </span>
                            {errors.password && (
                                <span
                                    className="text-xs text-[#b54736]"
                                    role="alert"
                                >
                                    {errors.password}
                                </span>
                            )}
                        </label>
                        <label className="grid gap-2">
                            <span className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]">
                                Confirme sua senha
                            </span>
                            <span className="relative">
                                <LockKeyhole
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a9a8f]"
                                />
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    passwordrules={passwordRules}
                                    placeholder="Digite a senha novamente"
                                    className="h-12 w-full rounded-xl border border-[#e2e4da] bg-white pr-3 pl-10 text-sm text-[#254542] outline-none placeholder:text-[#9aa39a] focus:border-[#86a083] dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                />
                            </span>
                            {errors.password_confirmation && (
                                <span
                                    className="text-xs text-[#b54736]"
                                    role="alert"
                                >
                                    {errors.password_confirmation}
                                </span>
                            )}
                        </label>
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-[#193b3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285552] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing
                                ? 'Criando conta...'
                                : 'Criar conta de organizador'}
                            {!processing && <ArrowRight size={16} />}
                        </button>
                    </>
                )}
            </Form>
            <div className="mt-4 border-t border-[#eeece3] pt-4 text-center dark:border-[#38544e]">
                <p className="text-sm text-[#69776e] dark:text-[#c1cec3]">
                    Já tem uma conta?{' '}
                    <Link
                        href={login()}
                        className="font-semibold text-[#bd5738] transition hover:text-[#8f412d]"
                    >
                        Entrar
                    </Link>
                </p>
            </div>
        </Modal>
    );
}

export default function Welcome({
    showOrganizerLogin = false,
    showOrganizerRegister = false,
    passwordRules,
    auth,
}: {
    showOrganizerLogin?: boolean;
    showOrganizerRegister?: boolean;
    passwordRules?: string;
    auth?: { user: { id: number; name: string; role: PanelRole } | null };
}) {
    const [events, setEvents] = useState(MOCK_EVENTS);
    const [curators, setCurators] = useState(MOCK_CURATORS);
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [profile, setProfile] = useState<Profile>(
        auth?.user?.role ?? 'visitor',
    );
    const [viewingAgenda, setViewingAgenda] = useState(false);
    const [accessOpen, setAccessOpen] = useState(
        showOrganizerLogin && !auth?.user,
    );
    const [registrationOpen, setRegistrationOpen] = useState(
        showOrganizerRegister && !auth?.user,
    );
    const [selectedEvent, setSelectedEvent] = useState<TourismEvent | null>(
        null,
    );
    const [eventForm, setEventForm] = useState<TourismEvent | null | undefined>(
        undefined,
    );
    const [curatorSection, setCuratorSection] = useState('queue');
    const [adminSection, setAdminSection] = useState('events');

    useEffect(() => {
        if (!auth?.user) return;

        setProfile(auth.user.role);
        setViewingAgenda(false);
        setAccessOpen(false);
        setRegistrationOpen(false);
    }, [auth?.user?.id, auth?.user?.role]);

    useEffect(() => {
        if (auth?.user) return;

        setProfile('visitor');
        setViewingAgenda(false);
        setAccessOpen(showOrganizerLogin);
        setRegistrationOpen(showOrganizerRegister);
    }, [auth?.user, showOrganizerLogin, showOrganizerRegister]);

    function openAccess() {
        setAccessOpen(true);
    }

    function saveEvent(draft: EventDraft, id?: number) {
        if (id) {
            setEvents((current) =>
                current.map((event) =>
                    event.id === id
                        ? {
                              ...event,
                              ...draft,
                              status: 'Pendente',
                              reviewedBy: undefined,
                              rejectionReason: undefined,
                          }
                        : event,
                ),
            );
            toast.success('Evento corrigido e enviado para nova análise.');
        } else {
            setEvents((current) => [
                {
                    ...draft,
                    id: Math.max(...current.map((event) => event.id)) + 1,
                    status: 'Pendente',
                },
                ...current,
            ]);
            toast.success('Evento enviado para análise da curadoria.');
        }
        setEventForm(undefined);
    }

    function setEventStatus(
        id: number,
        status: EventStatus,
        rejectionReason?: string,
        reviewedBy?: string,
    ) {
        setEvents((current) =>
            current.map((event) =>
                event.id === id
                    ? { ...event, status, rejectionReason, reviewedBy }
                    : event,
            ),
        );
    }

    function addCurator(name: string, email: string) {
        setCurators((current) => [
            ...current,
            {
                id: Math.max(...current.map((curator) => curator.id), 0) + 1,
                name,
                email,
                active: true,
            },
        ]);
        toast.success('Perfil de curador adicionado.');
    }

    function addCategory(name: string) {
        if (
            !name ||
            categories.some(
                (category) =>
                    category.toLocaleLowerCase('pt-BR') ===
                    name.toLocaleLowerCase('pt-BR'),
            )
        ) {
            toast.error('Essa categoria já existe ou não é válida.');
            return;
        }
        setCategories((current) => [...current, name]);
        toast.success('Categoria adicionada.');
    }

    return (
        <>
            <Head title="Agenda cultural de Campo Grande" />
            <div className="min-h-screen bg-[#fbfaf6] text-[#183638] dark:bg-[#102526] dark:text-[#edf0e9]">
                <SiteHeader
                    profile={profile}
                    authenticated={Boolean(auth?.user)}
                    onHome={() => {
                        if (profile !== 'visitor') setViewingAgenda(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDemoOpen={() => openAccess()}
                    onSignOut={() => {
                        setProfile('visitor');
                        setViewingAgenda(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
                {profile === 'visitor' || viewingAgenda ? (
                    <PublicAgenda
                        events={events}
                        categories={categories}
                        onSelectEvent={setSelectedEvent}
                        onLoginOpen={openAccess}
                        onReturnToProfile={
                            profile !== 'visitor' && viewingAgenda
                                ? () => {
                                      setViewingAgenda(false);
                                      window.scrollTo({
                                          top: 0,
                                          behavior: 'smooth',
                                      });
                                  }
                                : undefined
                        }
                        returnToProfileLabel={
                            profile !== 'visitor'
                                ? `Voltar para a área de ${profileAreaLabels[profile]}`
                                : undefined
                        }
                    />
                ) : (
                    <PanelLayout
                        onHome={() => {
                            setViewingAgenda(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        {profile === 'organizer' ? (
                            <OrganizerPanel
                                events={events}
                                onCreate={() => setEventForm(null)}
                                onEdit={setEventForm}
                            />
                        ) : profile === 'curator' ? (
                            <CuratorPanel
                                events={events}
                                tab={
                                    curatorSection === 'all' ? 'all' : 'pending'
                                }
                                onTabChange={(tab) =>
                                    setCuratorSection(
                                        tab === 'all' ? 'all' : 'queue',
                                    )
                                }
                                onApprove={(id) => {
                                    setEventStatus(
                                        id,
                                        'Aprovado',
                                        undefined,
                                        auth?.user?.name ??
                                            'Curadoria Turismo67',
                                    );
                                    toast.success(
                                        'Evento aprovado e publicado.',
                                    );
                                }}
                                onReject={(id, reason) => {
                                    setEventStatus(
                                        id,
                                        'Reprovado',
                                        reason,
                                        auth?.user?.name ??
                                            'Curadoria Turismo67',
                                    );
                                    toast.success(
                                        'Motivo enviado ao organizador.',
                                    );
                                }}
                            />
                        ) : (
                            <AdminPanel
                                events={events}
                                curators={curators}
                                categories={categories}
                                activeTab={
                                    adminSection as
                                        | 'events'
                                        | 'curators'
                                        | 'categories'
                                }
                                onTabChange={setAdminSection}
                                onAddCurator={addCurator}
                                onToggleCurator={(id) =>
                                    setCurators((current) =>
                                        current.map((curator) =>
                                            curator.id === id
                                                ? {
                                                      ...curator,
                                                      active: !curator.active,
                                                  }
                                                : curator,
                                        ),
                                    )
                                }
                                onAddCategory={addCategory}
                                onRemoveCategory={(name) =>
                                    setCategories((current) =>
                                        current.filter(
                                            (category) => category !== name,
                                        ),
                                    )
                                }
                            />
                        )}
                    </PanelLayout>
                )}
                {profile !== 'visitor' && !viewingAgenda && (
                    <footer className="border-t border-[#e9e6da] px-5 py-5 text-center text-[11px] text-[#849087] dark:border-[#314a46] dark:text-[#aebcb7]">
                        Turismo67 · Dados demonstrativos para apresentação.
                    </footer>
                )}
                {selectedEvent && (
                    <EventDetails
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
                {eventForm !== undefined && (
                    <EventFormModal
                        event={eventForm ?? undefined}
                        categories={categories}
                        onClose={() => setEventForm(undefined)}
                        onSave={saveEvent}
                    />
                )}
                {accessOpen && (
                    <OrganizerAccessModal
                        onClose={() => setAccessOpen(false)}
                    />
                )}
                {registrationOpen && (
                    <OrganizerRegistrationModal
                        passwordRules={passwordRules}
                        onClose={() => setRegistrationOpen(false)}
                    />
                )}
            </div>
        </>
    );
}
