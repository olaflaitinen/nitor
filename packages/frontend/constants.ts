
import { User, Post, Notification, Comment } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Dr. Elena Rossi',
  handle: '@elena_rossi',
  avatarUrl: 'https://picsum.photos/id/64/200/200',
  institution: 'MIT Media Lab',
  role: 'Associate Professor, Computational Neuroscience',
  nitorScore: 84.5,
  verified: true,
  bio: 'Exploring the intersection of biological neural networks and silicon. Advocate for Open Science.',
  followersCount: 1204,
  followingCount: 450,
  publicationsCount: 32,
};

const USER_PHYSICIST: User = {
  id: 'u2',
  name: 'Prof. Aelius Thorne',
  handle: '@aelius_q',
  avatarUrl: 'https://picsum.photos/id/1005/200/200',
  institution: 'CERN Theory Division',
  role: 'Senior Theoretical Physicist',
  nitorScore: 96.2,
  verified: true,
  bio: 'Chasing ghosts in the standard model. Quantum Field Theory & Loop Quantum Gravity.',
  followersCount: 8900,
  followingCount: 120,
  publicationsCount: 145,
};

const USER_BIOLOGIST: User = {
  id: 'u3',
  name: 'Dr. Julia Mendel',
  handle: '@j_mendel',
  avatarUrl: 'https://picsum.photos/id/338/200/200',
  institution: 'Max Planck Institute',
  role: 'Postdoctoral Researcher',
  nitorScore: 62.8,
  verified: true,
  bio: 'CRISPR-Cas9 applications in extremophiles.',
  followersCount: 560,
  followingCount: 800,
  publicationsCount: 8,
};

export const MOCK_USERS = [CURRENT_USER, USER_PHYSICIST, USER_BIOLOGIST];

// Mock Comments for threaded view
const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: USER_PHYSICIST,
    content: "Interesting derivation, but have you considered the non-perturbative effects at the boundary? The term $ \\oint_{\\partial \\Sigma} A \\cdot dl $ might not vanish.",
    timestamp: '2h ago',
    likes: 12,
    replies: [
        {
            id: 'c2',
            author: CURRENT_USER,
            content: "That is a valid point. In our simulation, we assumed a closed manifold, but for practical applications, the boundary conditions are indeed critical.",
            timestamp: '1h ago',
            likes: 4,
            replies: []
        }
    ]
  },
  {
    id: 'c3',
    author: USER_BIOLOGIST,
    content: "Can we apply this to biological lattice structures? The topology seems similar to microtubule formations.",
    timestamp: '45m ago',
    likes: 8,
    replies: []
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: USER_PHYSICIST,
    content: "We are revisiting the Hamiltonian formulation for the specific case of non-abelian gauge fields. \n\nThe time evolution is given by:\n$$ i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi $$\n\nWhere $\\hat{H}$ includes the interaction term $\\lambda \\phi^4$. Preliminary results suggest a symmetry breaking at $T > T_c$.",
    timestamp: '2h ago',
    likes: 342,
    reposts: 89,
    comments: 45,
    pinned: true,
    commentsList: MOCK_COMMENTS
  },
  {
    id: 'p2',
    author: USER_BIOLOGIST,
    isArticle: true,
    title: "Genetic Drift in Isolated Extremophile Populations",
    abstract: "This study examines the allele frequency changes in *Thermococcus gammatolerans* populations isolated in deep-sea hydrothermal vents. Using a modified Wright-Fisher model, we demonstrate that random sampling effects dominate natural selection in these micro-environments.",
    keywords: ["Genetics", "Evolution", "Extremophiles", "Stochastic Modeling"],
    content: "## Introduction\n\nThe mechanisms of evolution in high-pressure, high-temperature environments remain poorly understood. \n\n## Methodology\nWe sequenced 500 samples. \n\n### Mathematical Model\nThe probability of fixation for a new allele with selective advantage $s$ is given approximately by:\n$$ P_{fix} = \\frac{1 - e^{-2N_e s p}}{1 - e^{-2N_e s}} $$\n\nWhere $N_e$ is the effective population size.",
    timestamp: '5h ago',
    likes: 120,
    reposts: 45,
    comments: 12,
    commentsList: []
  },
  {
    id: 'p3',
    author: USER_PHYSICIST,
    isArticle: true,
    title: "On the Metric Tensor of Rotating Black Holes",
    abstract: "A revisit of the Kerr metric solution to the Einstein field equations. We propose a novel coordinate transformation that simplifies the event horizon singularity analysis.",
    keywords: ["General Relativity", "Black Holes", "Astrophysics", "Mathematics"],
    content: "The line element in Boyer-Lindquist coordinates is:\n\n$$ ds^2 = -\\left(1 - \\frac{2Mr}{\\Sigma}\\right)dt^2 - \\frac{4Mra \\sin^2\\theta}{\\Sigma} dt d\\phi + \\frac{\\Sigma}{\\Delta}dr^2 $$\n\nThis remains the cornerstone of our understanding of rotating bodies.",
    timestamp: '1d ago',
    likes: 890,
    reposts: 210,
    comments: 156,
    commentsList: MOCK_COMMENTS
  },
  {
    id: 'p4',
    author: CURRENT_USER,
    content: "Just finished reviewing the latest submissions for *Nature Neuroscience*. The shift towards transformer-based models in decoding visual cortex signals is undeniable. \n\nIs it biological mimicry or just high-dimensional regression? $\\mathbb{R}^n \\to \\mathbb{R}^m$",
    timestamp: 'Just now',
    likes: 12,
    reposts: 2,
    comments: 0,
    commentsList: []
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'n1',
        type: 'citation',
        actor: USER_BIOLOGIST,
        targetPreview: 'Genetic Drift in Isolated...',
        timestamp: '20m ago',
        read: false
    },
    {
        id: 'n2',
        type: 'endorse', // Like
        actor: USER_PHYSICIST,
        targetPreview: 'Just finished reviewing...',
        timestamp: '2h ago',
        read: false
    },
    {
        id: 'n3',
        type: 'reply',
        actor: USER_PHYSICIST,
        targetPreview: 'That is a valid point...',
        timestamp: '5h ago',
        read: true
    },
    {
        id: 'n4',
        type: 'follow',
        actor: USER_BIOLOGIST,
        timestamp: '1d ago',
        read: true
    }
];