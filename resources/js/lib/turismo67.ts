export type EventStatus = 'Pendente' | 'Aprovado' | 'Reprovado';

export type TourismEvent = {
    id: number;
    name: string;
    description: string;
    category: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    address: string;
    image: string;
    ticketType: 'Gratuito' | 'Pago';
    price: number;
    status: EventStatus;
    organizer: string;
    reviewedBy?: string;
    rejectionReason?: string;
};

export type EventDraft = Omit<
    TourismEvent,
    'id' | 'status' | 'reviewedBy' | 'rejectionReason'
>;

export type Curator = {
    id: number;
    name: string;
    email: string;
    active: boolean;
};

export function dateFromToday(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

export function formatEventDate(
    date: string,
    options?: Intl.DateTimeFormatOptions,
) {
    return new Intl.DateTimeFormat('pt-BR', options).format(
        new Date(`${date}T12:00:00`),
    );
}

const image = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

export const MOCK_CATEGORIES = [
    'Música',
    'Feiras',
    'Gastronomia',
    'Exposição',
    'Teatro',
    'Dança',
];

export const MOCK_EVENTS: TourismEvent[] = [
    {
        id: 1,
        name: 'Festival Raízes do Cerrado',
        description:
            'Uma tarde para celebrar os sons, sabores e histórias de Mato Grosso do Sul. Artistas locais, feira criativa e comida regional em um encontro para toda a família.',
        category: 'Música',
        date: dateFromToday(3),
        startTime: '16:00',
        endTime: '22:00',
        venue: 'Parque das Nações Indígenas',
        address: 'Av. Afonso Pena, s/n — Santa Fé',
        image: image('photo-1501386761578-eac5c94b800a'),
        ticketType: 'Gratuito',
        price: 0,
        status: 'Aprovado',
        organizer: 'Coletivo Raízes',
        reviewedBy: 'Ana Ribeiro',
    },
    {
        id: 2,
        name: 'Feira Criativa do Horto',
        description:
            'Encontre arte autoral, cerâmica, moda independente e pequenos produtores em uma feira ao ar livre, com música e atividades para crianças.',
        category: 'Feiras',
        date: dateFromToday(5),
        startTime: '09:00',
        endTime: '17:00',
        venue: 'Horto Florestal',
        address: 'R. Joel Dibo, s/n — Centro',
        image: image('photo-1531058020387-3be344556be6'),
        ticketType: 'Gratuito',
        price: 0,
        status: 'Aprovado',
        organizer: 'Feira Criativa CG',
        reviewedBy: 'João Mendes',
    },
    {
        id: 3,
        name: 'Sabores da Nossa Terra',
        description:
            'Uma experiência gastronômica dedicada à cozinha sul-mato-grossense, com pratos especiais, ingredientes do Cerrado e música ao vivo.',
        category: 'Gastronomia',
        date: dateFromToday(7),
        startTime: '18:30',
        endTime: '23:00',
        venue: 'Armazém Cultural',
        address: 'Av. Calógeras, 3.065 — Centro',
        image: image('photo-1414235077428-338989a2e8c0'),
        ticketType: 'Pago',
        price: 35,
        status: 'Aprovado',
        organizer: 'Rota Gastronômica MS',
        reviewedBy: 'Ana Ribeiro',
    },
    {
        id: 4,
        name: 'Pantanal em cores',
        description:
            'Exposição coletiva de fotografia e ilustração sobre a paisagem, a fauna e os modos de vida do Pantanal.',
        category: 'Exposição',
        date: dateFromToday(10),
        startTime: '10:00',
        endTime: '19:00',
        venue: 'Museu da Imagem e do Som',
        address: 'Av. Fernando Corrêa da Costa, 559 — Centro',
        image: image('photo-1577083552431-6e5fd01aa342'),
        ticketType: 'Gratuito',
        price: 0,
        status: 'Aprovado',
        organizer: 'Ateliê Campo Grande',
        reviewedBy: 'Pedro Lima',
    },
    {
        id: 5,
        name: 'Noite de teatro no Sesc',
        description:
            'Uma comédia sobre encontros inesperados, histórias de família e as pequenas surpresas de viver em uma cidade grande.',
        category: 'Teatro',
        date: dateFromToday(12),
        startTime: '20:00',
        endTime: '21:30',
        venue: 'Sesc Teatro Prosa',
        address: 'R. Anhanduí, 200 — Centro',
        image: image('photo-1503095396549-807759245b35'),
        ticketType: 'Pago',
        price: 20,
        status: 'Aprovado',
        organizer: 'Grupo Cena Aberta',
        reviewedBy: 'João Mendes',
    },
    {
        id: 6,
        name: 'Dança na praça',
        description:
            'Apresentações de dança e oficinas abertas para quem quiser experimentar novos ritmos e celebrar a cultura da cidade.',
        category: 'Dança',
        date: dateFromToday(15),
        startTime: '17:00',
        endTime: '20:00',
        venue: 'Praça do Rádio Clube',
        address: 'Av. Afonso Pena, 3.477 — Centro',
        image: image('photo-1504609813442-a8924e83f76e'),
        ticketType: 'Gratuito',
        price: 0,
        status: 'Aprovado',
        organizer: 'Movimento em Cena',
        reviewedBy: 'Ana Ribeiro',
    },
    {
        id: 7,
        name: 'Sons da cidade',
        description:
            'Show ao ar livre com artistas independentes de Campo Grande.',
        category: 'Música',
        date: dateFromToday(4),
        startTime: '19:00',
        endTime: '22:00',
        venue: 'Praça do Peixe',
        address: 'R. Bom Pastor, 1.100 — Vilas Boas',
        image: image('photo-1459749411175-04bf5292ceea'),
        ticketType: 'Gratuito',
        price: 0,
        status: 'Pendente',
        organizer: 'Marina Costa',
    },
    {
        id: 8,
        name: 'Circuito de arte urbana',
        description:
            'Um passeio guiado pelos murais e intervenções artísticas do centro.',
        category: 'Exposição',
        date: dateFromToday(8),
        startTime: '15:00',
        endTime: '17:00',
        venue: 'Praça Ary Coelho',
        address: 'R. 14 de Julho, s/n — Centro',
        image: image('photo-1531058020387-3be344556be6'),
        ticketType: 'Pago',
        price: 15,
        status: 'Pendente',
        organizer: 'Marina Costa',
    },
    {
        id: 9,
        name: 'Encontro de produtores do Cerrado',
        description: 'Encontro de pequenos produtores e cozinheiros da região.',
        category: 'Gastronomia',
        date: dateFromToday(9),
        startTime: '11:00',
        endTime: '18:00',
        venue: 'Praça Belmar Fidalgo',
        address: 'R. Dom Aquino, 2.536 — Centro',
        image: image('photo-1555939594-58d7cb561ad1'),
        ticketType: 'Gratuito',
        price: 0,
        status: 'Reprovado',
        organizer: 'Marina Costa',
        reviewedBy: 'João Mendes',
        rejectionReason:
            'Informe os produtores participantes e os produtos que estarão disponíveis no evento.',
    },
    {
        id: 10,
        name: 'Mostra de cinema regional',
        description: 'Curtas-metragens de realizadores da região.',
        category: 'Exposição',
        date: dateFromToday(2),
        startTime: '19:30',
        endTime: '21:00',
        venue: 'Cine Cultura',
        address: 'Av. Afonso Pena, 5.420 — Santa Fé',
        image: image('photo-1489599849927-2ee91cede3ba'),
        ticketType: 'Gratuito',
        price: 0,
        status: 'Aprovado',
        organizer: 'Cine MS',
        reviewedBy: 'Pedro Lima',
    },
    {
        id: 11,
        name: 'Memórias do Centro',
        description: 'Encontro cultural já realizado.',
        category: 'Teatro',
        date: dateFromToday(-4),
        startTime: '18:00',
        endTime: '20:00',
        venue: 'Praça Ary Coelho',
        address: 'R. 14 de Julho, s/n — Centro',
        image: image('photo-1503095396549-807759245b35'),
        ticketType: 'Gratuito',
        price: 0,
        status: 'Aprovado',
        organizer: 'Coletivo Centro',
        reviewedBy: 'Ana Ribeiro',
    },
];

export const MOCK_CURATORS: Curator[] = [
    {
        id: 1,
        name: 'João Mendes',
        email: 'joao@turismo67.demo',
        active: true,
    },
    {
        id: 2,
        name: 'Ana Ribeiro',
        email: 'ana@turismo67.demo',
        active: true,
    },
    {
        id: 3,
        name: 'Pedro Lima',
        email: 'pedro@turismo67.demo',
        active: false,
    },
];
