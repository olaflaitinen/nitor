
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON_KEY) are set in .env.local');
  (process as any).exit(1);
}

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`🌱 Initializing Seed for: ${supabaseUrl}`);

// --- MOCK DATA ---

const USERS = [
  {
    id: 'u1', // Fixed IDs for relationship mapping
    email: 'elena.rossi@mit.edu',
    raw_user_meta_data: {
        full_name: 'Dr. Elena Rossi',
        handle: '@elena_rossi',
        avatar_url: 'https://picsum.photos/id/64/200/200',
        institution: 'MIT Media Lab',
        role: 'Associate Professor, Computational Neuroscience',
        nitor_score: 84.5,
        verified: true,
        bio: 'Exploring the intersection of biological neural networks and silicon. Advocate for Open Science.'
    }
  },
  {
    id: 'u2',
    email: 'aelius.thorne@cern.ch',
    raw_user_meta_data: {
        full_name: 'Prof. Aelius Thorne',
        handle: '@aelius_q',
        avatar_url: 'https://picsum.photos/id/1005/200/200',
        institution: 'CERN Theory Division',
        role: 'Senior Theoretical Physicist',
        nitor_score: 96.2,
        verified: true,
        bio: 'Chasing ghosts in the standard model. Quantum Field Theory & Loop Quantum Gravity.'
    }
  },
  {
    id: 'u3',
    email: 'julia.mendel@mpg.de',
    raw_user_meta_data: {
        full_name: 'Dr. Julia Mendel',
        handle: '@j_mendel',
        avatar_url: 'https://picsum.photos/id/338/200/200',
        institution: 'Max Planck Institute',
        role: 'Postdoctoral Researcher',
        nitor_score: 62.8,
        verified: true,
        bio: 'CRISPR-Cas9 applications in extremophiles. Synthesizing life at the edge.'
    }
  }
];

const CONTENT = [
  // --- POSTS (Short Form) ---
  {
    author_id: 'u2', // Aelius
    type: 'post',
    content: `We are revisiting the Hamiltonian formulation for the specific case of non-abelian gauge fields.

The time evolution is given by:
$$ i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi $$

Where $\\hat{H}$ includes the interaction term $\\lambda \\phi^4$. Preliminary results suggest a symmetry breaking at $T > T_c$.`,
    likes: 342,
    reposts: 89
  },
  {
    author_id: 'u1', // Elena
    type: 'post',
    content: `Just finished reviewing the latest submissions for *Nature Neuroscience*. The shift towards transformer-based models in decoding visual cortex signals is undeniable.

Is it biological mimicry or just high-dimensional regression?
$$ f: \\mathbb{R}^n \\to \\mathbb{R}^m $$`,
    likes: 125,
    reposts: 45
  },
  {
    author_id: 'u2', // Aelius
    type: 'post',
    content: `Does anyone else find the Navier-Stokes existence and smoothness problem particularly taunting today?

$$ \\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla) \\mathbf{u} = -\\frac{1}{\\rho} \\nabla p + \\nu \\nabla^2 \\mathbf{u} + \\mathbf{g} $$

The turbulence terms are refusing to converge in the new simulation.`,
    likes: 890,
    reposts: 210
  },
  {
    author_id: 'u3', // Julia
    type: 'post',
    content: `Observing unexpected methylation patterns in *Thermococcus gammatolerans*. The radiation resistance might be linked to a novel DNA repair mechanism we haven't classified yet. #Genetics #Extremophiles`,
    likes: 56,
    reposts: 12
  },
  {
    author_id: 'u2', // Aelius
    type: 'post',
    content: `A quick refresher on the Black-Scholes equation for my econ-physics students. It is essentially a heat equation!

$$ \\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS \\frac{\\partial V}{\\partial S} - rV = 0 $$`,
    likes: 230,
    reposts: 55
  },

  // --- ARTICLES (Long Form) ---
  {
    author_id: 'u3', // Julia
    type: 'article',
    title: "Genetic Drift in Isolated Extremophile Populations",
    abstract: "This study examines the allele frequency changes in Thermococcus gammatolerans populations isolated in deep-sea hydrothermal vents. Using a modified Wright-Fisher model, we demonstrate that random sampling effects dominate natural selection in these micro-environments.",
    keywords: ["Genetics", "Evolution", "Extremophiles", "Stochastic Modeling"],
    content: `## Introduction

The mechanisms of evolution in high-pressure, high-temperature environments remain poorly understood. Traditional models of natural selection often fail to account for the extreme isolation experienced by vent-dwelling organisms.

## Methodology

We sequenced 500 samples from the Mid-Atlantic Ridge.

### Mathematical Model

The probability of fixation for a new allele with selective advantage $s$ is given approximately by:

$$ P_{fix} = \\frac{1 - e^{-2N_e s p}}{1 - e^{-2N_e s}} $$

Where $N_e$ is the effective population size. In our observed vents, $N_e$ is remarkably small ($< 1000$), suggesting that **drift** is the primary driver of genetic variance.

## Results

Our sequencing data shows a high frequency of synonymous mutations that offer no survival advantage, consistent with the neutral theory.`,
    likes: 120,
    reposts: 45
  },
  {
    author_id: 'u2', // Aelius
    type: 'article',
    title: "On the Metric Tensor of Rotating Black Holes",
    abstract: "A revisit of the Kerr metric solution to the Einstein field equations. We propose a novel coordinate transformation that simplifies the event horizon singularity analysis.",
    keywords: ["General Relativity", "Black Holes", "Astrophysics", "Mathematics"],
    content: `## The Kerr Metric

The geometry of spacetime around a rotating massive body is described by the Kerr metric. The line element in Boyer-Lindquist coordinates is:

$$ ds^2 = -\\left(1 - \\frac{2Mr}{\\Sigma}\\right)dt^2 - \\frac{4Mra \\sin^2\\theta}{\\Sigma} dt d\\phi + \\frac{\\Sigma}{\\Delta}dr^2 $$

Where:
$$ \\Sigma = r^2 + a^2 \\cos^2\\theta $$
$$ \\Delta = r^2 - 2Mr + a^2 $$

## Singularity Analysis

Traditionally, the ring singularity is analyzed by mapping $r=0$. We propose a transformation $u = 1/r$ that reveals a hidden symmetry near the ergosphere.

## Implications

This formulation suggests that information retrieval from the ergoregion might be theoretically possible without violating causality, provided $\\Omega > \\Omega_{crit}$.`,
    likes: 890,
    reposts: 210
  }
];

// --- SEED FUNCTION ---

async function seed() {
  try {
    // 1. Clear existing tables (Optional - careful in prod!)
    console.log('🧹 Cleaning existing data...');
    await supabase.from('content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert Users (Profiles)
    // Note: In a real scenario, we create Auth users first. 
    // Here we insert directly into profiles assuming public access or service role bypass.
    console.log('👥 Creating Users...');
    
    for (const user of USERS) {
        const { error } = await supabase
            .from('profiles')
            .insert({
                id: user.id, // Explicit ID to match content relations
                full_name: user.raw_user_meta_data.full_name,
                handle: user.raw_user_meta_data.handle,
                avatar_url: user.raw_user_meta_data.avatar_url,
                institution: user.raw_user_meta_data.institution,
                academic_title: user.raw_user_meta_data.role,
                bio: user.raw_user_meta_data.bio,
                nitor_score: user.raw_user_meta_data.nitor_score,
                verified: user.raw_user_meta_data.verified,
                updated_at: new Date().toISOString(),
            });
        
        if (error) console.error(`Error creating user ${user.raw_user_meta_data.handle}:`, error.message);
    }

    // 3. Insert Content
    console.log('📝 Creating Content...');
    
    for (const item of CONTENT) {
        const isArticle = item.type === 'article';
        
        const { error } = await supabase
            .from('content')
            .insert({
                author_id: item.author_id,
                type: item.type,
                body: item.content, // Mapped to 'body' in DB
                title: isArticle ? item.title : null,
                abstract: isArticle ? item.abstract : null,
                keywords: isArticle ? item.keywords : null,
                likes_count: item.likes,
                reposts_count: item.reposts,
                created_at: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString() // Random recent date
            });

        if (error) console.error(`Error creating content for ${item.author_id}:`, error.message);
    }

    console.log('✅ Seeding Complete!');
    (process as any).exit(0);

  } catch (err) {
    console.error('❌ Unexpected error during seed:', err);
    (process as any).exit(1);
  }
}

seed();
