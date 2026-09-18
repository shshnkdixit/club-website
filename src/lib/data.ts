import { 
  AIDomain, 
  Project, 
  ClubEvent, 
  ResearchPaper, 
  TeamMember, 
  Testimonial, 
  Achievement, 
  SiteSettings, 
  CodingQuest, 
  RoadmapMilestone, 
  Resource,
  AdminUser,
  EventRSVP,
  ClubMember,
  JoinFormConfig,
  QuestSubmission
} from '@/types';

export const INITIAL_DOMAINS: AIDomain[] = [
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    shortDesc: 'Foundational intelligence architectures, symbolic reasoning, and intelligent automated systems.',
    fullDesc: 'We investigate core AI paradigms encompassing knowledge representation, automated reasoning, constraint satisfaction, and multi-agent coordination systems solving complex real-world challenges.',
    iconName: 'Cpu',
    technologies: ['Expert Systems', 'Search Heuristics', 'Knowledge Graphs', 'Ontology', 'Automated Reasoning'],
    keyConcepts: ['Symbolic AI', 'A* Search', 'Constraint Optimization', 'Game Theory', 'State Space Search'],
    activeProjectsCount: 8,
    researchFocus: 'Symbolic-Neural Hybrids & Neurosymbolic AI',
    color: '#00CFFF',
    glowColor: 'rgba(0, 207, 255, 0.4)'
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    shortDesc: 'Statistical learning algorithms, predictive modeling, and scalable feature engineering.',
    fullDesc: 'From supervised regression to unsupervised clustering and ensemble algorithms, we train high-precision statistical models capable of extracting insights from petabyte-scale datasets.',
    iconName: 'BrainCircuit',
    technologies: ['Scikit-Learn', 'XGBoost', 'LightGBM', 'Pandas', 'NumPy', 'MLflow'],
    keyConcepts: ['Gradient Boosting', 'Support Vector Machines', 'Dimensionality Reduction', 'Cross Validation', 'Bayesian Inference'],
    activeProjectsCount: 12,
    researchFocus: 'Robust Statistical Learning under Extreme Covariate Shift',
    color: '#6C63FF',
    glowColor: 'rgba(108, 99, 255, 0.4)'
  },
  {
    id: 'deep-learning',
    name: 'Deep Learning',
    shortDesc: 'Multi-layer neural network architectures, custom loss functions, and backpropagation at scale.',
    fullDesc: 'Exploring cutting-edge deep convolutional networks, residual blocks, recurrent memory mechanisms, and deep tensor graphs accelerated on high-performance GPU clusters.',
    iconName: 'Layers',
    technologies: ['PyTorch', 'TensorFlow', 'JAX', 'CUDA', 'Triton', 'TensorRT'],
    keyConcepts: ['Backpropagation', 'Residual Networks', 'Batch Normalization', 'Attention Mechanisms', 'Optimization Algorithms'],
    activeProjectsCount: 15,
    researchFocus: 'Efficient Backpropagation & Sparse Tensor Quantization',
    color: '#9B5CFF',
    glowColor: 'rgba(155, 92, 255, 0.4)'
  },
  {
    id: 'generative-ai',
    name: 'Generative AI',
    shortDesc: 'Large language models, latent diffusion synthesis, transformers, and multimodal generation.',
    fullDesc: 'Pioneering multimodal generative synthesis across text, high-resolution imagery, 3D assets, audio waveforms, and code synthesis using Transformer backbones and Latent Diffusion Models.',
    iconName: 'Sparkles',
    technologies: ['Transformers', 'Stable Diffusion', 'Llama 3', 'LoRA', 'LangChain', 'vLLM', 'ComfyUI'],
    keyConcepts: ['Self-Attention', 'Latent Diffusion', 'Classifier-Free Guidance', 'Quantized LoRA (QLoRA)', 'Direct Preference Optimization (DPO)'],
    activeProjectsCount: 14,
    researchFocus: 'Sub-quadratic Context Windows & Mechanistic Interpretability',
    color: '#00F5D4',
    glowColor: 'rgba(0, 245, 212, 0.4)'
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    shortDesc: 'Spatial perception, 3D point clouds, real-time object detection, and visual segmentation.',
    fullDesc: 'Transforming pixel streams and LiDAR telemetry into spatial understanding. We develop state-of-the-art architectures for real-time edge detection, semantic segmentation, and neural radiance fields (NeRFs).',
    iconName: 'Scan',
    technologies: ['OpenCV', 'YOLOv10', 'Segment Anything (SAM)', 'NeRF Studio', 'MediaPipe', 'Albumentations'],
    keyConcepts: ['Spatial Convolutions', 'Feature Pyramid Networks', '3D Gaussian Splatting', 'Optical Flow', 'Pose Estimation'],
    activeProjectsCount: 11,
    researchFocus: 'Ultra-low Latency Edge Vision & Real-time Monocular Depth',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)'
  },
  {
    id: 'natural-language-processing',
    name: 'Natural Language Processing',
    shortDesc: 'Contextual semantic embeddings, neural machine translation, and Retrieval-Augmented Generation.',
    fullDesc: 'Decoding linguistic structure and semantic nuance. We engineer retrieval-augmented knowledge bases, multilingual tokenizers, and parameter-efficient fine-tuning for domain-specific NLP.',
    iconName: 'MessageSquareCode',
    technologies: ['Hugging Face', 'spaCy', 'ChromaDB', 'FAISS', 'Sentence Transformers', 'Ollama'],
    keyConcepts: ['Tokenization', 'Vector Embeddings', 'Vector Search (HNSW)', 'RAG Pipelines', 'Contextual Reranking'],
    activeProjectsCount: 9,
    researchFocus: 'Hallucination Mitigation via Graph-Augmented RAG',
    color: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.4)'
  },
  {
    id: 'robotics',
    name: 'Robotics & Automation',
    shortDesc: 'Autonomous kinematics, ROS2 middleware, sensor fusion, and cyber-physical control loops.',
    fullDesc: 'Bridging digital cognition and physical actuation. We build micro-rovers, 6-DoF robotic arms, SLAM mapping modules, and edge-deployed control nodes powered by NVIDIA Jetson.',
    iconName: 'Bot',
    technologies: ['ROS2 Humble', 'Gazebo', 'NVIDIA Isaac Sim', 'Arduino', 'Jetson Orin', 'MoveIt2'],
    keyConcepts: ['Forward/Inverse Kinematics', 'Visual SLAM', 'PID Control', 'Kalman Filtering', 'Path Planning (RRT*)'],
    activeProjectsCount: 7,
    researchFocus: 'Zero-shot Sim-to-Real Transfer for Quadruped Locomotion',
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.4)'
  },
  {
    id: 'data-science',
    name: 'Data Science & Big Data',
    shortDesc: 'Distributed stream analytics, anomaly detection, and probabilistic statistical inference.',
    fullDesc: 'Transforming unstructured noise into strategic clarity through automated ETL pipelines, probabilistic time-series forecasting, and interactive telemetry dashboards.',
    iconName: 'BarChart3',
    technologies: ['Apache Spark', 'DuckDB', 'Plotly', 'Polars', 'Dask', 'Airflow'],
    keyConcepts: ['Time Series Decomposition', 'Hypothesis Testing', 'Anomaly Detection', 'Feature Stores', 'A/B Testing Frameworks'],
    activeProjectsCount: 8,
    researchFocus: 'Probabilistic Forecasting in Non-stationary Financial Streams',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)'
  },
  {
    id: 'reinforcement-learning',
    name: 'Reinforcement Learning',
    shortDesc: 'Markov decision processes, policy gradient methods, and deep Q-learning in simulation.',
    fullDesc: 'Training autonomous agents to master dynamic environments through reward optimization, exploration vs exploitation balancing, and distributed self-play architectures.',
    iconName: 'Gamepad2',
    technologies: ['Gymnasium', 'Stable-Baselines3', 'Ray RLlib', 'MuJoCo', 'PettingZoo'],
    keyConcepts: ['PPO & DDPG', 'Actor-Critic Methods', 'Reward Shaping', 'Curiosity-Driven Exploration', 'Multi-Agent RL'],
    activeProjectsCount: 6,
    researchFocus: 'Safe Reinforcement Learning with Hard Constrained Action Spaces',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)'
  },
  {
    id: 'ai-agents',
    name: 'Autonomous AI Agents',
    shortDesc: 'Multi-agent orchestration, tool calling, autonomous planning, and self-correcting loops.',
    fullDesc: 'Engineering self-directed agentic ecosystems equipped with long-term memory, episodic reflection, external tool execution, and collaborative hierarchical planning.',
    iconName: 'Workflow',
    technologies: ['LangGraph', 'CrewAI', 'AutoGen', 'DSPy', 'OpenAI Swarm', 'FastAPI'],
    keyConcepts: ['ReAct Framework', 'Tool-Use Reflection', 'Hierarchical State Machines', 'Vector Memory Retrieval', 'Self-Correction Loops'],
    activeProjectsCount: 10,
    researchFocus: 'Scalable Consensus Protocols in Asynchronous Agent Swarms',
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.4)'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'neuro-vision-v2',
    title: 'NeuroVision Edge: Real-time Object Telemetry',
    domain: 'computer-vision',
    category: 'Computer Vision',
    tagline: 'Sub-5ms ultra-low latency edge object tracking and 3D bounding box estimation.',
    description: 'An optimized edge vision pipeline using TensorRT and lightweight CNN backbones for autonomous drone navigation in GPS-denied environments.',
    longDescription: 'NeuroVision Edge delivers 120 FPS object identification and tracking on embedded NVIDIA Jetson platforms. Features custom spatial attention modules, anchor-free bounding regression, and Kalman-filtered trajectory prediction.',
    technologies: ['PyTorch', 'TensorRT', 'YOLOv10', 'CUDA', 'OpenCV', 'ROS2'],
    teamMembers: ['Aarav Sharma', 'Sanya Patel', 'Rohan Gupta'],
    githubUrl: 'https://github.com/aiml-club/neuro-vision-edge',
    demoUrl: '#sim-cv',
    stars: 342,
    featured: true,
    simulatorType: 'computer-vision',
    metrics: [
      { label: 'Latency', value: '4.2 ms' },
      { label: 'mAP@50', value: '94.8%' },
      { label: 'FPS on Jetson', value: '118 FPS' }
    ],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'synapse-bot-6dof',
    title: 'SynapseArm: 6-DoF Neural Kinematics',
    domain: 'robotics',
    category: 'Robotics',
    tagline: 'Autonomous manipulation with inverse kinematics solved via neural policy learning.',
    description: 'A 6-Axis robotic arm controller executing precision micro-assembly through deep reinforcement learning and closed-loop visual servoing.',
    longDescription: 'Replaces traditional numerical Jacobian solvers with a millisecond deep neural policy trained across 50,000 simulated domain randomized MuJoCo physics environments.',
    technologies: ['ROS2', 'MuJoCo', 'PyTorch', 'C++', 'Python', 'NVIDIA Isaac'],
    teamMembers: ['Vikram Malhotra', 'Ananya Deshmukh', 'Kabir Verma'],
    githubUrl: 'https://github.com/aiml-club/synapse-arm-kinematics',
    demoUrl: '#sim-robotics',
    stars: 520,
    featured: true,
    simulatorType: 'robotics',
    metrics: [
      { label: 'Precision', value: '±0.04 mm' },
      { label: 'Cycle Time', value: '0.8s' },
      { label: 'Training Steps', value: '5M' }
    ],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'deep-synapse-visualizer',
    title: 'DeepSynapse: Interactive Neural Graph Engine',
    domain: 'deep-learning',
    category: 'Deep Learning',
    tagline: 'Real-time 3D tensor propagation and gradient flow visualization.',
    description: 'A high-performance interactive visualizer for forward passes, attention weights, and gradient backpropagation in deep neural networks.',
    longDescription: 'DeepSynapse allows students and researchers to inspect latent feature maps, neuron activations, and vanishing gradients in real-time as training batches stream across the model.',
    technologies: ['Three.js', 'WebGL', 'TypeScript', 'Web Workers', 'PyTorch ONNX'],
    teamMembers: ['Priya Nair', 'Karthik Rao', 'Devika Sen'],
    githubUrl: 'https://github.com/aiml-club/deep-synapse-visualizer',
    demoUrl: '#sim-neural',
    stars: 489,
    featured: true,
    simulatorType: 'neural-network',
    metrics: [
      { label: 'Render Rate', value: '60 FPS' },
      { label: 'Max Node Graph', value: '100,000+' },
      { label: 'Weight Precision', value: 'FP32/FP16' }
    ],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'swarm-nexus-agents',
    title: 'SwarmNexus: Multi-Agent Consensus Graph',
    domain: 'ai-agents',
    category: 'AI Agents',
    tagline: 'Decentralized autonomous AI agent orchestration with self-verifying consensus.',
    description: 'A hierarchical multi-agent framework where specialized planner, executor, and critique agents solve complex software engineering and research queries.',
    longDescription: 'SwarmNexus orchestrates autonomous agents communicating via JSON-RPC protocol. Uses graph-based state machines, vector-backed episodic memory, and automatic rollback on verification failure.',
    technologies: ['LangGraph', 'Python', 'FastAPI', 'ChromaDB', 'DSPy', 'React'],
    teamMembers: ['Aditya Joshi', 'Meera Swaminathan', 'Tanmay Roy'],
    githubUrl: 'https://github.com/aiml-club/swarm-nexus-orchestrator',
    demoUrl: '#sim-agent',
    stars: 671,
    featured: true,
    simulatorType: 'ai-agent',
    metrics: [
      { label: 'Task Success', value: '91.4%' },
      { label: 'Swarm Size', value: 'Up to 32 Nodes' },
      { label: 'Token Efficiency', value: '+42%' }
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'omni-gen-multimodal',
    title: 'OmniGen: Latent Diffusion for Scientific Assets',
    domain: 'generative-ai',
    category: 'Generative AI',
    tagline: 'Text-to-3D protein geometry and molecular lattice synthesis.',
    description: 'Fine-tuned diffusion models generating physically plausible molecular surfaces and protein-ligand binding pockets.',
    longDescription: 'Trained on BioPDB and AlphaFold structures, OmniGen generates high-fidelity PDB files and interactive 3D chemical meshes conditioned on natural language biochemical descriptions.',
    technologies: ['Diffusers', 'PyTorch', 'RDKit', 'LoRA', 'Three.js'],
    teamMembers: ['Riya Kapoor', 'Siddharth Menon'],
    githubUrl: 'https://github.com/aiml-club/omni-gen-proteins',
    demoUrl: '/projects',
    stars: 280,
    featured: false,
    simulatorType: 'none',
    metrics: [
      { label: 'Resolution', value: '1.2 Ångström' },
      { label: 'Inference', value: '1.8s' }
    ],
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'bio-rag-academic',
    title: 'BioRAG: Citation-Grounding Academic Search',
    domain: 'natural-language-processing',
    category: 'NLP',
    tagline: 'Zero-hallucination semantic search over 2.4 million biomedical papers.',
    description: 'Graph-augmented retrieval pipeline combining vector embeddings with knowledge graph triples for verified literature synthesis.',
    longDescription: 'Features reciprocal rank fusion (RRF) between dense FAISS index and BM25 sparse index with Cross-Encoder reranking, generating bullet-proof answers with exact line-level PubMed citations.',
    technologies: ['Hugging Face', 'FAISS', 'Neo4j', 'FastAPI', 'Next.js'],
    teamMembers: ['Rahul Nair', 'Tanya Oberoi'],
    githubUrl: 'https://github.com/aiml-club/bio-rag-search',
    stars: 395,
    featured: false,
    simulatorType: 'none',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
  }
];

export const INITIAL_EVENTS: ClubEvent[] = [
  {
    id: 'event-genai-2026',
    title: 'Generative AI & Agentic Workflows Masterclass',
    type: 'Workshop',
    date: '2026-08-28T10:00:00',
    time: '10:00 AM – 04:00 PM',
    endDate: '2026-08-28T16:00:00',
    venue: 'Turing Hall Room 402',
    location: 'Turing Hall Room 402 / Discord Stream',
    status: 'UPCOMING',
    isUpcoming: true,
    isLive: false,
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000',
    mediaType: 'image',
    speaker: {
      name: 'Dr. Evelyn Vance',
      role: 'Principal AI Researcher',
      organization: 'DeepMind Fellow & University Professor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
    },
    description: 'Hands-on architectural deep dive into building production-grade autonomous agent systems with LangGraph, DSPy, and custom tool-calling LLMs.',
    longDescription: 'Join us for a 6-hour intensive bootcamp where you will build an end-to-end multi-agent research assistant. We will cover fine-tuning with LoRA, direct preference optimization, agentic memory loops, and sub-second local LLM inference with vLLM.',
    totalSeats: 150,
    registeredCount: 132,
    tags: ['Generative AI', 'Agents', 'Transformers', 'DSPy', 'Hands-on'],
    requirements: ['Laptop with Python 3.10+', 'Basic PyTorch familiarity', 'GitHub account']
  },
  {
    id: 'event-hackathon-2026',
    title: 'AI DevFlow 2.0: 48-Hour National Autonomous Hackathon Sprint',
    type: 'Hackathon',
    date: '2026-08-21T18:00:00',
    time: '06:00 PM (LIVE NOW)',
    endDate: '2026-08-23T18:00:00',
    venue: 'Main Campus Innovation Hub & Discord Lab',
    location: 'Main Innovation Hub / Quantum Lab Annex',
    status: 'LIVE',
    isUpcoming: false,
    isLive: true,
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000',
    mediaType: 'image',
    speaker: {
      name: 'Panel of 12 Industry Mentors',
      role: 'Lead ML Engineers',
      organization: 'Top AI Labs & Robotics Startups'
    },
    description: '48 hours of non-stop building and deployment. Create autonomous robots, edge vision pipelines, and multi-agent systems for $15,000+ prize pool.',
    longDescription: 'The flagship sprint of the semester. Tracks include Autonomous Robotics, Healthcare Vision, Agentic Automation, and Foundation Model Fine-Tuning. Free H100 cloud compute clusters allocated to all teams.',
    totalSeats: 300,
    registeredCount: 284,
    tags: ['Hackathon', 'Live Sprint', 'Cash Prize', 'Robotics', 'Compute Grant'],
    requirements: ['Team of 2-4 members', 'Student UID', 'GitHub Account']
  },
  {
    id: 'event-cv-splatting',
    title: '3D Gaussian Splatting & Real-Time Neural Rendering',
    type: 'Bootcamp',
    date: '2026-09-12T14:00:00',
    time: '02:00 PM – 06:00 PM',
    endDate: '2026-09-12T18:00:00',
    venue: 'Robotics Control Lab Room 402',
    location: 'Block 1, Robotics Lab Room 402',
    status: 'UPCOMING',
    isUpcoming: true,
    isLive: false,
    posterUrl: 'https://images.unsplash.com/photo-1633493106185-5259942a0e41?q=80&w=1000',
    mediaType: 'image',
    speaker: {
      name: 'Arjun Mehta',
      role: 'CV Research Lead',
      organization: 'AI/ML Club'
    },
    description: 'Learn real-time neural radiance fields (NeRF), drone photogrammetry capture, and 3D Gaussian Splatting CUDA kernel optimization.',
    totalSeats: 100,
    registeredCount: 78,
    tags: ['Computer Vision', '3D Splatting', 'CUDA', 'NeRF', 'Real-Time']
  },
  {
    id: 'event-pytorch-foundations',
    title: 'Zero to Hero PyTorch GPU Training Loops Workshop',
    type: 'Workshop',
    date: '2026-07-15T11:00:00',
    time: '11:00 AM – 03:00 PM',
    venue: 'Turing Hall 101 / Recorded',
    location: 'Turing Hall 101',
    status: 'COMPLETED',
    isUpcoming: false,
    isLive: false,
    posterUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000',
    mediaType: 'image',
    recapUrl: 'https://github.com/aiml-club',
    speaker: {
      name: 'Elena Rostova',
      role: 'Core AI Fellow',
      organization: 'AI & ML Club'
    },
    description: 'Comprehensive walkthrough of autograd backpropagation, custom dataset loaders, mixed-precision FP16 training, and multi-GPU DDP orchestration.',
    totalSeats: 120,
    registeredCount: 120,
    tags: ['PyTorch', 'GPU Training', 'Autograd', 'CUDA', 'Recap Available']
  },
  {
    id: 'event-reinforce-symposium',
    title: 'Deep Reinforcement Learning & Quadruped Control Symposium',
    type: 'Research Session',
    date: '2026-09-26T15:00:00',
    time: '03:00 PM – 06:30 PM',
    venue: 'Quantum Hall Annex / Discord Live',
    location: 'Quantum Hall Annex',
    status: 'UPCOMING',
    isUpcoming: true,
    isLive: false,
    posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000',
    mediaType: 'image',
    speaker: {
      name: 'Prof. Marcus Zhao',
      role: 'Director of Autonomous Systems',
      organization: 'Cybernetics Institute'
    },
    description: 'Sim-to-real domain randomization strategies, impedance control laws, and MuJoCo physical AI simulation pipelines.',
    totalSeats: 120,
    registeredCount: 95,
    tags: ['Robotics', 'RL', 'Control Systems', 'MuJoCo']
  }
];

export const INITIAL_RESEARCH: ResearchPaper[] = [
  {
    id: 'paper-neuro-quant',
    title: 'Sub-4-Bit Activation Quantization for Real-Time Edge Vision Transformers',
    authors: ['Aarav Sharma', 'Dr. Evelyn Vance', 'Sanya Patel'],
    domain: 'computer-vision',
    status: 'Published',
    conference: 'IEEE CVPR 2026 (Student Track)',
    year: 2026,
    abstract: 'We present a novel mixed-precision quantization strategy that achieves 3.8-bit effective integer arithmetic with under 0.4% mAP degradation on COCO benchmarks, enabling ViT deployment on 10W edge hardware.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/aiml-club/sub4bit-vit',
    demoUrl: '#',
    citationBibtex: `@inproceedings{sharma2026sub4bit,\n  title={Sub-4-Bit Activation Quantization for Real-Time Edge Vision Transformers},\n  author={Sharma, Aarav and Vance, Evelyn and Patel, Sanya},\n  booktitle={IEEE CVPR Workshops},\n  year={2026}\n}`,
    keywords: ['Edge AI', 'Quantization', 'Vision Transformers', 'Low Power'],
    metrics: { label: 'Speedup', value: '4.1x faster' }
  },
  {
    id: 'paper-agent-swarm',
    title: 'Hierarchical Consensus Protocols for Asynchronous Autonomous AI Agent Swarms',
    authors: ['Aditya Joshi', 'Meera Swaminathan', 'Prof. Marcus Zhao'],
    domain: 'ai-agents',
    status: 'Under Review',
    conference: 'NeurIPS 2026',
    year: 2026,
    abstract: 'Investigating Byzantine fault tolerance and self-correcting state synchronization in distributed multi-agent workflows executing non-deterministic API tool invocations.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/aiml-club/agent-swarm-consensus',
    citationBibtex: `@article{joshi2026hierarchical,\n  title={Hierarchical Consensus Protocols for Asynchronous Autonomous AI Agent Swarms},\n  author={Joshi, Aditya and Swaminathan, Meera and Zhao, Marcus},\n  journal={arXiv preprint arXiv:2604.08912},\n  year={2026}\n}`,
    keywords: ['Multi-Agent', 'Consensus', 'Fault Tolerance', 'LLM Planning'],
    metrics: { label: 'Fault Recovery', value: '99.2%' }
  },
  {
    id: 'paper-sim2real-arm',
    title: 'Sim-to-Real Policy Transfer for Precision Micro-Assembly via Adversarial Domain Perturbation',
    authors: ['Vikram Malhotra', 'Ananya Deshmukh'],
    domain: 'robotics',
    status: 'Published',
    conference: 'ICRA 2026',
    year: 2026,
    abstract: 'Demonstrating sub-millimeter insertion tolerances on unmodeled physical components without tactile sensors by leveraging adversarial domain randomization in MuJoCo physics simulation.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/aiml-club/sim2real-assembly',
    citationBibtex: `@inproceedings{malhotra2026sim2real,\n  title={Sim-to-Real Policy Transfer for Precision Micro-Assembly},\n  author={Malhotra, Vikram and Deshmukh, Ananya},\n  booktitle={IEEE ICRA},\n  year={2026}\n}`,
    keywords: ['Robotics', 'Sim-to-Real', 'Manipulation', 'Reinforcement Learning'],
    metrics: { label: 'Tolerance', value: '±0.04mm' }
  },
  {
    id: 'paper-graph-rag',
    title: 'Graph-Augmented Dynamic Reranking for Low-Hallucination Biomedical Syntheses',
    authors: ['Rahul Nair', 'Tanya Oberoi', 'Devika Sen'],
    domain: 'natural-language-processing',
    status: 'Preprint',
    year: 2026,
    abstract: 'Combining semantic vector embeddings with biomedical ontology graph hops to achieve 98.6% verifiable factual accuracy on medical literature question answering benchmarks.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/aiml-club/graph-biomed-rag',
    keywords: ['NLP', 'RAG', 'Knowledge Graphs', 'Hallucination Mitigation'],
    metrics: { label: 'Factuality', value: '98.6%' }
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-fac-1',
    name: 'Dr. Evelyn Vance',
    role: 'Faculty Coordinator & Chief Advisor',
    domain: 'artificial-intelligence',
    department: 'Department of Computer Science & AI',
    bio: 'Lead researcher in neural-symbolic systems and distributed ML. 15+ years advising university technology initiatives and publishing in top AI venues.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    email: 'evelyn.vance@university.edu',
    skills: ['Neural-Symbolic AI', 'Distributed ML', 'Advising', 'Grant Research'],
    isFaculty: true,
    specialization: 'Foundational AI & Research Ethics',
    orgLevel: 1,
    treeOrder: 1,
    initials: 'EV',
    spocTitle: 'Faculty Mentor'
  },
  {
    id: 'team-pres',
    name: 'Harsh Vardhan Singh',
    role: 'Club President',
    domain: 'artificial-intelligence',
    department: 'Computer Science & Engineering (CSE)',
    year: 'Final Year (Senior)',
    bio: 'Pioneered the club autonomous intelligence initiative and hardware testbeds. Building next-gen autonomous systems and managing university AI chapters.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    skills: ['PyTorch', 'TensorRT', 'C++', 'System Design', 'Strategic Leadership'],
    orgLevel: 2,
    reportsToId: 'team-fac-1',
    treeOrder: 1,
    initials: 'HV',
    spocTitle: 'President'
  },
  {
    id: 'team-vp',
    name: 'Iqra Khan',
    role: 'Vice President',
    domain: 'ai-agents',
    department: 'AI & Data Science',
    year: 'Final Year (Senior)',
    bio: 'Orchestrating club operations, research initiatives, and hackathons. Specializes in multi-agent coordination and graph neural networks.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    skills: ['LangGraph', 'Python', 'Agent Swarms', 'Operations', 'Public Speaking'],
    orgLevel: 2,
    reportsToId: 'team-pres',
    treeOrder: 2,
    initials: 'IK',
    spocTitle: 'Vice President'
  },
  {
    id: 'team-lead-gr',
    name: 'Gauransh Rai Mohnani',
    role: 'Operations & Research SPOC',
    domain: 'deep-learning',
    department: 'Computer Science & AI',
    year: '3rd Year (Junior)',
    bio: 'Managing club reading circles, compute infrastructure access, and research fellowship pipelines.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    skills: ['PyTorch', 'Deep Learning', 'Transformers', 'Community Building'],
    orgLevel: 3,
    reportsToId: 'team-vp',
    treeOrder: 1,
    initials: 'GR',
    spocTitle: 'Research SPOC'
  },
  {
    id: 'team-lead-ap',
    name: 'Aadrika Pandey',
    role: 'Marketing Team SPOC',
    domain: 'generative-ai',
    department: 'Design & Human-Computer Interaction',
    year: '3rd Year (Junior)',
    bio: 'Directing club design language, 3D interactive graphics, conference branding, and community outreach campaigns.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    skills: ['Three.js', 'Figma', 'WebGL', 'Brand Architecture', 'Social Outreach'],
    orgLevel: 3,
    reportsToId: 'team-vp',
    treeOrder: 2,
    initials: 'AP',
    spocTitle: 'Marketing Team SPOC'
  },
  {
    id: 'team-lead-tk',
    name: 'Tejas Kumar',
    role: 'Technical Team SPOC',
    domain: 'robotics',
    department: 'Robotics & Computer Systems',
    year: '3rd Year (Junior)',
    bio: 'Architecting ROS2 micro-controller systems, hardware testbeds, and leading the algorithm development squad.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    skills: ['ROS2', 'MuJoCo', 'C++', 'Embedded Systems', 'Isaac Sim'],
    orgLevel: 3,
    reportsToId: 'team-vp',
    treeOrder: 3,
    initials: 'TK',
    spocTitle: 'Technical Team SPOC'
  },
  {
    id: 'team-lead-ds',
    name: 'Divyansh Shukla',
    role: 'Event Management SPOC',
    domain: 'computer-vision',
    department: 'Information Technology',
    year: '3rd Year (Junior)',
    bio: 'Orchestrating university-wide AI hackathons, guest researcher lectures, and industry sponsor keynotes.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    skills: ['Hackathon Management', 'Logistics', 'Speaker Relations', 'Sponsorship'],
    orgLevel: 3,
    reportsToId: 'team-vp',
    treeOrder: 4,
    initials: 'DS',
    spocTitle: 'Event Management SPOC'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rohan Deshmukh',
    program: 'B.Tech CSE (Class of 2025)',
    year: 'Alumni',
    role: 'Machine Learning Engineer',
    companyOrPlacement: 'Placed at AI Research Lab ($120k+)',
    quote: 'The AI/ML Club was the single most transformative experience of my university years. Building real-world edge robotics and publishing papers gave me an immense competitive edge.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    domain: 'computer-vision'
  },
  {
    id: 'test-2',
    name: 'Sanya Khurana',
    program: 'B.Tech AI & Data (Class of 2025)',
    year: 'Alumni',
    role: 'Generative AI Specialist',
    companyOrPlacement: 'Placed at Top Tech Foundation',
    quote: 'From organizing our first 36-hour hackathon to working alongside brilliant faculty mentors, the club provides an authentic AI laboratory environment found nowhere else.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    domain: 'generative-ai'
  },
  {
    id: 'test-3',
    name: 'Devraj Sen',
    program: 'M.Tech Robotics',
    year: 'Postgraduate Member',
    role: 'Robotics Lead Fellow',
    companyOrPlacement: 'Autonomous Vehicle Lab',
    quote: 'The direct hands-on access to GPU compute clusters, Jetson hardware, and collaborative research teams made publishing at ICRA possible during my degree.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop',
    domain: 'robotics'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: '1st Place - National Autonomous AI Hackathon',
    category: 'Hackathon Win',
    year: '2025',
    description: 'Outperformed 280+ university teams nationwide with our SwarmNexus multi-agent disaster response framework.',
    issuer: 'Ministry of Technology & Innovation',
    rankOrMetric: 'Grand Champions ($10,000 Prize)',
    badgeIcon: 'Trophy'
  },
  {
    id: 'ach-2',
    title: '3 Peer-Reviewed Papers Accepted at CVPR & ICRA',
    category: 'Research Publication',
    year: '2025 - 2026',
    description: 'Undergraduate and postgraduate club members published first-author papers on edge quantization and robot kinematics.',
    issuer: 'IEEE & Computer Vision Foundation',
    rankOrMetric: 'Top 5% Student Research',
    badgeIcon: 'Award'
  },
  {
    id: 'ach-3',
    title: 'NVIDIA Hardware & Jetson AI Grant Awardee',
    category: 'Grant & Funding',
    year: '2025',
    description: 'Secured 8 NVIDIA Jetson AGX Orin units and 10,000 hours of cloud GPU compute for undergraduate research.',
    issuer: 'NVIDIA Academic AI Program',
    rankOrMetric: '$45,000 in Compute Grants',
    badgeIcon: 'Zap'
  },
  {
    id: 'ach-4',
    title: 'Best University Technical Society of the Year',
    category: 'Certification',
    year: '2025',
    description: 'Recognized across the entire university consortium for outstanding community impact and technical workshops.',
    issuer: 'University Academic Council',
    rankOrMetric: '5-Star Excellence Rating',
    badgeIcon: 'Star'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  clubName: 'AI/ML CLUB',
  tagline: 'BUILD THE INTELLIGENCE OF TOMORROW',
  heroHeadline: 'BUILD THE INTELLIGENCE OF TOMORROW',
  heroSubheadline: 'Explore Artificial Intelligence, Machine Learning, Robotics, Computer Vision and Generative AI in an immersive student-led research laboratory.',
  stats: {
    members: 580,
    projects: 54,
    workshops: 28,
    hackathons: 16,
    publications: 11,
    prizePool: '$35,000+'
  },
  announcement: {
    enabled: true,
    text: '🚀 Applications are OPEN for Fall 2026 Cohort & HACK.AI 2026 Registration is Live!',
    linkUrl: '/join',
    linkText: 'Apply Now →'
  },
  socialLinks: {
    discord: 'https://discord.gg/aiml-club',
    whatsapp: 'https://chat.whatsapp.com/aiml-club',
    linkedin: 'https://linkedin.com/company/aiml-club',
    github: 'https://github.com/aiml-club',
    instagram: 'https://instagram.com/aiml_club'
  }
};

export const INITIAL_QUESTS: CodingQuest[] = [
  {
    id: 'quest-potw-attention',
    title: 'Scaled Dot-Product Attention from Scratch (PyTorch)',
    slug: 'scaled-dot-product-attention',
    domain: 'deep-learning',
    category: 'PyTorch & Deep Learning',
    difficulty: 'Hard',
    bountyPoints: 500,
    solversCount: 42,
    isProblemOfTheWeek: true,
    expiresAt: '2026-08-28T23:59:59',
    tags: ['Transformers', 'PyTorch', 'Linear Algebra', 'Causal Masking', 'Multi-Head'],
    shortSummary: 'Implement the fundamental Transformer scaled dot-product attention equation with causal masking and numerical stability.',
    problemStatement: `Implement the scaled dot-product attention function defined in "Attention Is All You Need" (Vaswani et al.):

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}} + M\\right)V$$

Your implementation must support:
1. Arbitrary batch size and multi-head tensor dimensions: \`(B, num_heads, seq_len, d_k)\`.
2. An optional additive or boolean causal mask \`M\` that masks out future tokens by injecting \`-inf\` (or \`-1e9\`) prior to softmax.
3. Numerical stabilization with safe logit max subtraction before exponentiation.
4. Dropout applied to the attention probability matrix if training mode is active.`,
    inputFormat: 'Tensors Q, K, V of shape (B, H, S, D), optional mask of shape (B, 1, S, S) or (1, 1, S, S), and dropout probability p (float).',
    outputFormat: 'Tuple of (output_tensor, attention_weights) where output is (B, H, S, D) and attention_weights is (B, H, S, S).',
    constraints: [
      '1 <= B <= 64 (Batch Size)',
      '1 <= H <= 16 (Attention Heads)',
      '1 <= S <= 2048 (Sequence Length)',
      '16 <= D <= 128 (Head Dimension dk)',
      'Tensor operations must be fully vectorized without explicit Python loops.'
    ],
    sampleTestCases: [
      {
        input: 'Q = torch.randn(2, 4, 8, 32), K = torch.randn(2, 4, 8, 32), V = torch.randn(2, 4, 8, 32)',
        output: 'out.shape == (2, 4, 8, 32), attn.shape == (2, 4, 8, 8)',
        explanation: 'Standard unmasked self-attention across 8 tokens with 4 attention heads.'
      },
      {
        input: 'mask = torch.triu(torch.ones(8, 8), diagonal=1).bool()',
        output: 'attn[..., 0, 1:] == 0.0',
        explanation: 'Causal autoregressive upper triangular mask prevents token 0 from attending to token 1..7.'
      }
    ],
    starterCode: {
      python: `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

def scaled_dot_product_attention(
    q: torch.Tensor, 
    k: torch.Tensor, 
    v: torch.Tensor, 
    mask: torch.Tensor | None = None,
    dropout_p: float = 0.0,
    training: bool = False
) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Args:
        q: (B, H, S_q, D) Queries
        k: (B, H, S_k, D) Keys
        v: (B, H, S_v, D) Values
        mask: (B, 1, S_q, S_k) or broadcastable bool/float tensor
        dropout_p: Dropout probability
        training: Whether model is in training mode
    Returns:
        output: (B, H, S_q, D)
        attention_weights: (B, H, S_q, S_k)
    """
    # TODO: Calculate scaled query-key dot product
    # TODO: Apply causal mask if provided
    # TODO: Compute softmax probabilities along last dimension
    # TODO: Multiply attention weights with values tensor
    pass
`
    },
    hints: [
      'Scale by 1.0 / math.sqrt(q.size(-1)) before softmax to prevent gradient vanishing in large dimensions.',
      'Use torch.matmul(q, k.transpose(-2, -1)) for multi-head batch matrix multiplication.',
      'When mask is a boolean tensor, use logits.masked_fill(mask == 1, float("-inf")).'
    ]
  },
  {
    id: 'quest-numpy-conv2d',
    title: 'Vectorized 2D Convolution with NumPy Stride Tricks',
    slug: 'vectorized-2d-conv-numpy',
    domain: 'computer-vision',
    category: 'Python & NumPy',
    difficulty: 'Easy',
    bountyPoints: 100,
    solversCount: 156,
    isProblemOfTheWeek: false,
    tags: ['NumPy', 'Broadcasting', '2D-Conv', 'im2col', 'Stride'],
    shortSummary: 'Implement a vectorized single-channel 2D spatial convolution kernel without using nested Python for-loops.',
    problemStatement: `Perform a 2D spatial cross-correlation / convolution operation over a 2D grayscale image using a given 2D filter kernel.

Given an input matrix $I \\in \\mathbb{R}^{H \\times W}$ and a kernel $K \\in \\mathbb{R}^{k_h \\times k_w}$ with padding $P$ and stride $S$, produce the output feature map $O \\in \\mathbb{R}^{H_{out} \\times W_{out}}$:

$$O(i, j) = \\sum_{m=0}^{k_h-1} \\sum_{n=0}^{k_w-1} I_{\\text{pad}}(i \\cdot S + m, j \\cdot S + n) \\cdot K(m, n)$$`,
    inputFormat: 'image: np.ndarray (H, W), kernel: np.ndarray (Kh, Kw), stride: int = 1, padding: int = 0',
    outputFormat: 'np.ndarray (H_out, W_out) of float32 values',
    constraints: [
      '3 <= H, W <= 1024',
      '1 <= Kh, Kw <= 15 (Odd dimensions)',
      'stride in {1, 2}',
      'Zero explicit pixel-by-pixel for-loops allowed in the innermost convolution step.'
    ],
    sampleTestCases: [
      {
        input: 'image = np.ones((5, 5)), kernel = np.ones((3, 3)), stride=1, padding=0',
        output: 'output.shape == (3, 3), output[0, 0] == 9.0',
        explanation: '3x3 sum filter over 5x5 image of ones produces 3x3 output with constant value 9.'
      }
    ],
    starterCode: {
      python: `import numpy as np
from numpy.lib.stride_tricks import as_strided

def conv2d_vectorized(
    image: np.ndarray, 
    kernel: np.ndarray, 
    stride: int = 1, 
    padding: int = 0
) -> np.ndarray:
    """
    Perform vectorized 2D convolution with numpy stride tricks or im2col.
    """
    # TODO: Apply zero padding to image
    # TODO: Extract sliding windows with as_strided or index broadcasting
    # TODO: Compute tensor dot product with kernel
    pass
`
    },
    hints: [
      'Use np.pad(image, padding, mode="constant") for padding.',
      'as_strided can create sliding window views in O(1) memory before contracting with np.tensordot.'
    ]
  },
  {
    id: 'quest-cv-nms',
    title: 'Fast Intersection-over-Union & Non-Maximum Suppression',
    slug: 'fast-iou-and-nms',
    domain: 'computer-vision',
    category: 'Computer Vision',
    difficulty: 'Medium',
    bountyPoints: 250,
    solversCount: 98,
    isProblemOfTheWeek: false,
    tags: ['Computer Vision', 'YOLO', 'Bounding Boxes', 'NMS', 'IoU'],
    shortSummary: 'Implement batched Intersection-over-Union calculation and Greedy Non-Maximum Suppression for object detector bounding boxes.',
    problemStatement: `Object detection models output hundreds of overlapping candidate bounding boxes for a single object. 

Your task is to implement **Greedy Non-Maximum Suppression (NMS)**:
1. Given a list of bounding boxes in $(x_1, y_1, x_2, y_2)$ format and their confidence scores, sort the boxes descending by score.
2. Select the box with the highest score and suppress all remaining boxes whose **Intersection over Union (IoU)** with the selected box exceeds a given threshold $\\tau_{\\text{IoU}}$.
3. Repeat iteratively until all boxes are either selected or suppressed.`,
    inputFormat: 'boxes: Tensor/ndarray of shape (N, 4), scores: shape (N,), iou_threshold: float, score_threshold: float = 0.05',
    outputFormat: 'List or 1D array of retained box integer indices.',
    constraints: [
      '1 <= N <= 10,000 candidate bounding boxes',
      '0.0 <= iou_threshold <= 1.0',
      'Coordinates satisfy x1 < x2 and y1 < y2.'
    ],
    sampleTestCases: [
      {
        input: 'boxes = [[10, 10, 50, 50], [12, 12, 48, 48]], scores = [0.9, 0.75], iou_threshold = 0.5',
        output: '[0]',
        explanation: 'Box 0 and Box 1 have >0.85 IoU. Box 1 is suppressed because Box 0 has a higher score.'
      }
    ],
    starterCode: {
      python: `import numpy as np

def compute_iou(boxA: np.ndarray, boxB: np.ndarray) -> float:
    """Compute IoU between two [x1, y1, x2, y2] bounding boxes."""
    # TODO: Calculate intersection area
    # TODO: Calculate union area = areaA + areaB - intersection
    pass

def non_maximum_suppression(
    boxes: np.ndarray, 
    scores: np.ndarray, 
    iou_threshold: float = 0.5, 
    score_threshold: float = 0.1
) -> list[int]:
    """
    Greedy NMS implementation.
    Returns indices of retained bounding boxes.
    """
    # TODO: Filter by score_threshold
    # TODO: Sort descending by score
    # TODO: Iterate and suppress overlapping boxes
    pass
`
    },
    hints: [
      'Intersection coordinates: xx1 = max(x1[i], x1[order]), yy1 = max(y1[i], y1[order]), xx2 = min(x2[i], x2[order]), yy2 = min(y2[i], y2[order]).',
      'Compute area with max(0, xx2 - xx1) * max(0, yy2 - yy1).'
    ]
  },
  {
    id: 'quest-nlp-bpe',
    title: 'Byte-Pair Encoding (BPE) Subword Vocabulary Builder',
    slug: 'byte-pair-encoding-tokenizer',
    domain: 'natural-language-processing',
    category: 'NLP & LLMs',
    difficulty: 'Medium',
    bountyPoints: 250,
    solversCount: 84,
    isProblemOfTheWeek: false,
    tags: ['NLP', 'Tokenization', 'BPE', 'GPT', 'Transformers'],
    shortSummary: 'Train a Byte-Pair Encoding (BPE) tokenizer from scratch by iteratively extracting and merging the most frequent adjacent symbol pairs.',
    problemStatement: `Byte-Pair Encoding (BPE) is the core tokenization algorithm used in GPT-4, LLaMA, and modern Large Language Models.

Implement a BPE trainer:
1. Initialize vocabulary with all individual characters present in the corpus.
2. Segment every word in the training corpus into space-separated characters with an end-of-word symbol \`</w>\`.
3. For $k$ merge iterations:
   - Count the frequency of all adjacent character/token pairs across the corpus.
   - Find the most frequent pair $(c_1, c_2)$.
   - Merge all occurrences of $(c_1, c_2)$ into a new single token $c_1c_2$ in both the vocabulary and the segmented words.
4. Return the learned merge rules and final vocabulary.`,
    inputFormat: 'corpus: list[str], num_merges: int',
    outputFormat: 'tuple of (vocab: dict[str, int], merges: list[tuple[str, str]])',
    constraints: [
      'Corpus size: 10 <= len(corpus) <= 50,000 words',
      '1 <= num_merges <= 1,000',
      'Case-sensitive UTF-8 handling.'
    ],
    sampleTestCases: [
      {
        input: 'corpus = ["low", "lowest", "newer", "wider"], num_merges = 5',
        output: 'merges[0] == ("e", "r") or ("l", "o")',
        explanation: 'Frequently recurring adjacent syllables like "er" and "lo" are merged into subword units.'
      }
    ],
    starterCode: {
      python: `from collections import Counter, defaultdict

def train_bpe(
    corpus: list[str], 
    num_merges: int = 100
) -> tuple[dict[str, int], list[tuple[str, str]]]:
    """
    Trains a Byte-Pair Encoding subword vocabulary.
    Returns:
        vocab: dict mapping token to token_id
        merges: list of merged token pairs in chronological order
    """
    # TODO: Build initial word frequency dictionary with character splits
    # TODO: Loop num_merges times:
    #       - Find most frequent adjacent pair
    #       - Replace occurrences across all words
    #       - Record merge rule
    pass
`
    },
    hints: [
      'Represent words as tuples of characters: ("l", "o", "w", "</w>") with their corpus count.',
      'Use Counter to efficiently count adjacent pairs: (w[i], w[i+1]) weighted by word frequency.'
    ]
  },
  {
    id: 'quest-rl-replay',
    title: 'Prioritized Experience Replay with Sum-Tree Data Structure',
    slug: 'prioritized-experience-replay-sumtree',
    domain: 'reinforcement-learning',
    category: 'Reinforcement Learning',
    difficulty: 'Hard',
    bountyPoints: 500,
    solversCount: 39,
    isProblemOfTheWeek: false,
    tags: ['Reinforcement Learning', 'DQN', 'Data Structures', 'SumTree', 'PyTorch'],
    shortSummary: 'Implement a binary Sum-Tree data structure and proportional Prioritized Experience Replay (PER) buffer for Deep Q-Networks.',
    problemStatement: `Standard DQN uniformly samples past transitions from a buffer. Prioritized Experience Replay (PER) instead samples transitions with probability proportional to their TD error priority:

$$P(i) = \\frac{p_i^\\alpha}{\\sum_k p_k^\\alpha}$$

To sample in $O(\\log N)$ time, implement:
1. **SumTree**: A complete binary tree where parent nodes store the sum of their child nodes' priority values.
2. **ReplayBuffer**:
   - \`add(priority, transition)\`: Adds experience and updates tree in $O(\\log N)$.
   - \`sample(batch_size, beta)\`: Stratified sampling with importance sampling weights $w_i = (N \\cdot P(i))^{-\\beta}$ normalized by $\\max_i w_i$.
   - \`update_priorities(indices, priorities)\`: Updates TD errors for sampled transitions.`,
    inputFormat: 'Capacity C: int, alpha: float = 0.6, beta: float = 0.4',
    outputFormat: 'Object supporting .add(), .sample(), and .update_priorities()',
    constraints: [
      'Buffer capacity C up to 100,000 transitions',
      'Sampling complexity must be O(B log C) where B is batch size',
      'Weights must be computed with numerical stability to avoid zero-division.'
    ],
    sampleTestCases: [
      {
        input: 'tree = SumTree(4); tree.add(3.0); tree.add(1.0); tree.total()',
        output: '4.0',
        explanation: 'Binary sum of priorities at root node is 4.0.'
      }
    ],
    starterCode: {
      python: `import numpy as np

class SumTree:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.tree = np.zeros(2 * capacity - 1)
        self.data = np.zeros(capacity, dtype=object)
        self.write_idx = 0
        self.n_entries = 0

    def add(self, priority: float, data: object):
        """Insert priority and data in O(log N)."""
        pass

    def get(self, s: float) -> tuple[int, float, object]:
        """Retrieve leaf index, priority, and data for value s."""
        pass

class PrioritizedReplayBuffer:
    def __init__(self, capacity: int, alpha: float = 0.6, beta: float = 0.4):
        self.tree = SumTree(capacity)
        self.alpha = alpha
        self.beta = beta
        self.epsilon = 1e-5

    def add(self, error: float, transition: tuple):
        pass

    def sample(self, batch_size: int) -> tuple[list, np.ndarray, list[int]]:
        pass
`
    },
    hints: [
      'In a 0-indexed array, for index i, left child is 2*i + 1, right child is 2*i + 2, and parent is (i - 1) // 2.',
      'Divide priority segment [0, total_priority] into batch_size uniform ranges to ensure stratified sampling.'
    ]
  },
  {
    id: 'quest-agent-react',
    title: 'Deterministic ReAct Agent Loop & Tool Schema Router',
    slug: 'react-agent-loop-router',
    domain: 'ai-agents',
    category: 'Autonomous Agents',
    difficulty: 'Medium',
    bountyPoints: 300,
    solversCount: 61,
    isProblemOfTheWeek: false,
    tags: ['AI Agents', 'ReAct', 'Tool-Use', 'JSON Schema', 'State Machine'],
    shortSummary: 'Build an autonomous ReAct (Reason + Act) execution state machine with tool-calling schemas, step reflection, and cycle prevention.',
    problemStatement: `Implement a deterministic **ReAct Agent Execution Engine**:
1. Takes a user prompt and a registry of typed executable tools with JSON argument schemas.
2. Implements the interleaved Thought $\\rightarrow$ Action $\\rightarrow$ Observation loop.
3. Automatically parses tool call signatures from LLM output tokens (e.g. \`Action: tool_name(arg1=val1)\`).
4. Executes the local Python tool, returns the output as an \`Observation\`, and injects it back into agent working memory.
5. Halts and returns the final response when \`Final Answer:\` is detected or max iterations ($M=10$) is reached.`,
    inputFormat: 'user_goal: str, tools_registry: dict[str, callable], max_steps: int = 8',
    outputFormat: 'dict containing "final_answer", "trajectory": list of (thought, action, observation), and "total_steps".',
    constraints: [
      'Graceful error handling when a tool throws an Exception (Observation: "Error: ...")',
      'Infinite loop detection if identical action is called 3 consecutive times.',
      'Deterministic structured trajectory logging.'
    ],
    sampleTestCases: [
      {
        input: 'Goal: "What is 45 * 82 and then calculate its square root?" with calculator tool',
        output: 'trajectory length == 2, final_answer ~= "60.745"',
        explanation: 'Agent computes 3690 in step 1, then computes sqrt(3690) in step 2.'
      }
    ],
    starterCode: {
      python: `import re
from typing import Callable, Any

class ReActAgent:
    def __init__(self, tools: dict[str, Callable], max_iterations: int = 10):
        self.tools = tools
        self.max_iterations = max_iterations

    def run(self, goal: str, llm_mock_fn: Callable[[str], str]) -> dict[str, Any]:
        """
        Execute the Thought -> Action -> Observation loop until Final Answer.
        """
        trajectory = []
        memory = f"Goal: {goal}\\n"
        
        # TODO: Execute ReAct state machine loop
        # TODO: Parse Action: tool_name(args)
        # TODO: Execute tool and capture Observation
        # TODO: Detect Final Answer
        pass
`
    },
    hints: [
      'Use regex re.search(r"Action:\\s*([a-zA-Z_0-9]+)\\((.*?)\\)", text) to extract tool name and parameters.',
      'Always append the observation back to the prompt memory before querying the LLM for the next thought.'
    ]
  },
  {
    id: 'quest-numpy-knn',
    title: 'Matrix Cosine Similarity & Top-K Vector Search',
    slug: 'cosine-similarity-knn-numpy',
    domain: 'data-science',
    category: 'Python & NumPy',
    difficulty: 'Easy',
    bountyPoints: 150,
    solversCount: 130,
    isProblemOfTheWeek: false,
    tags: ['Vector DB', 'Embeddings', 'NumPy', 'Cosine Similarity', 'k-NN'],
    shortSummary: 'Build an in-memory vector similarity search engine calculating batch cosine similarities and top-k retrieval.',
    problemStatement: `Given a matrix of $N$ document embeddings $D \\in \\mathbb{R}^{N \\times d}$ and a batch of $Q$ query vectors $Q \\in \\mathbb{R}^{Q \\times d}$, compute the pairwise **Cosine Similarity**:

$$\\text{Sim}(q, d_i) = \\frac{q \\cdot d_i}{\\|q\\|_2 \\|d_i\\|_2}$$

For each query vector, return the indices and similarity scores of the top-$k$ nearest neighbors sorted descending by similarity.`,
    inputFormat: 'queries: np.ndarray (Q, d), database: np.ndarray (N, d), k: int',
    outputFormat: 'tuple of (top_indices: np.ndarray (Q, k), top_scores: np.ndarray (Q, k))',
    constraints: [
      '1 <= Q <= 100 queries',
      '1 <= N <= 100,000 database vectors',
      '16 <= d <= 1536 embedding dimensions',
      '1 <= k <= min(N, 100)'
    ],
    sampleTestCases: [
      {
        input: 'queries = [[1, 0, 0]], database = [[1, 0, 0], [0, 1, 0], [0.707, 0.707, 0]], k = 2',
        output: 'indices[0] == [0, 2], scores[0] ~= [1.0, 0.707]',
        explanation: 'Vector [1,0,0] is closest to itself (1.0) and [0.707, 0.707, 0] (0.707).'
      }
    ],
    starterCode: {
      python: `import numpy as np

def vector_search_knn(
    queries: np.ndarray, 
    database: np.ndarray, 
    k: int = 5
) -> tuple[np.ndarray, np.ndarray]:
    """
    Vectorized batch cosine similarity top-k search.
    Returns:
        top_indices: shape (Q, k)
        top_scores: shape (Q, k)
    """
    # TODO: L2-normalize queries and database vectors
    # TODO: Compute dot products matrix of shape (Q, N)
    # TODO: Use np.argpartition or argsort to find top-k indices and values
    pass
`
    },
    hints: [
      'Pre-normalizing vectors with queries / np.linalg.norm(queries, axis=1, keepdims=True) simplifies cosine similarity to a single matrix multiplication: queries_norm @ db_norm.T.',
      'np.argpartition is faster than full argsort for large N when k << N.'
    ]
  }
];

// ──────────────────────────────────────────
// CURRICULUM ROADMAP (4-PHASE TRAJECTORY)
// ──────────────────────────────────────────
export const INITIAL_ROADMAP: RoadmapMilestone[] = [
  // ── PHASE 1: FOUNDATIONS ──
  {
    id: 'roadmap-p1-m1',
    phaseNumber: 1,
    phaseName: 'Phase 1: Foundations',
    phaseTheme: 'Emerald Cyber',
    title: 'Git Workflows, GitHub & Open-Source Collaboration',
    timeline: 'Week 1 - 2 (Month 1)',
    status: 'COMPLETED',
    completionPercentage: 100,
    description: 'Master version control architectures, feature branching strategies, semantic commit conventions, and collaborative Pull Request reviews.',
    keyTopics: ['Git Branching Models', 'Fork & PR Lifecycle', 'Merge Conflict Resolution', 'GitHub Actions CI/CD Basics'],
    deliverables: ['Configured SSH Keys & GPG Signing', 'Merged First Open-Source Club PR', 'Automated GitHub Action Workflow'],
    toolsAndTech: ['Git', 'GitHub', 'GitHub CLI', 'Markdown', 'Pre-Commit Hooks']
  },
  {
    id: 'roadmap-p1-m2',
    phaseNumber: 1,
    phaseName: 'Phase 1: Foundations',
    phaseTheme: 'Emerald Cyber',
    title: 'Python for AI & High-Performance NumPy Vectorization',
    timeline: 'Week 3 - 5 (Month 1)',
    status: 'COMPLETED',
    completionPercentage: 100,
    description: 'Write idiomatic object-oriented Python, optimize vectorized matrix operations in NumPy, and eliminate slow Python for-loops using stride tricks.',
    keyTopics: ['Broadcasting Rules', 'N-Dimensional Strides', 'Memory Views vs Copies', 'Vectorized Tensor Operations'],
    deliverables: ['Vectorized 2D Convolution in NumPy', 'Matrix Top-K Cosine KNN Search', 'Benchmark Suite with 100x Speedup'],
    toolsAndTech: ['Python 3.12', 'NumPy', 'SciPy', 'Jupyter Lab', 'cProfile']
  },
  {
    id: 'roadmap-p1-m3',
    phaseNumber: 1,
    phaseName: 'Phase 1: Foundations',
    phaseTheme: 'Emerald Cyber',
    title: 'Essential Linear Algebra, Multivariate Calculus & ML Probability',
    timeline: 'Week 6 - 8 (Month 2)',
    status: 'COMPLETED',
    completionPercentage: 100,
    description: 'Build rigorous mathematical intuition for gradients, Jacobians, Hessians, eigenvalues, and maximum likelihood estimation in deep networks.',
    keyTopics: ['Matrix Decompositions (SVD, Eigendecomp)', 'Partial Derivatives & Chain Rule', 'Loss Surface Geometry', 'Bayes Theorem & Distributions'],
    deliverables: ['From-Scratch Micrograd Autograd Engine', 'Analytical vs Numerical Gradient Checker', 'Gradient Descent Visualizer'],
    toolsAndTech: ['SymPy', 'Matplotlib', 'Micrograd', 'Desmos 3D']
  },

  // ── PHASE 2: BUILD SPRINT ──
  {
    id: 'roadmap-p2-m1',
    phaseNumber: 2,
    phaseName: 'Phase 2: Build Sprint',
    phaseTheme: 'Cyan Neon',
    title: 'PyTorch Deep Learning Fundamentals & GPU Training Loops',
    timeline: 'Week 9 - 11 (Month 3)',
    status: 'IN PROGRESS',
    completionPercentage: 75,
    description: 'Construct custom PyTorch nn.Modules, write efficient multi-threaded DataLoaders, and train neural networks with mixed-precision on CUDA GPUs.',
    keyTopics: ['torch.autograd Computational Graphs', 'Custom Dataset & DataLoader', 'AdamW vs Lion Optimizers', 'Mixed-Precision AMP (fp16/bf16)'],
    deliverables: ['Multi-Layer Perceptron Trained on MNIST/FashionMNIST', 'Custom Learning Rate Warmup Scheduler', 'WandB Experiment Tracking Dashboard'],
    toolsAndTech: ['PyTorch 2.3', 'CUDA 12', 'Weights & Biases', 'TorchVision', 'Timm']
  },
  {
    id: 'roadmap-p2-m2',
    phaseNumber: 2,
    phaseName: 'Phase 2: Build Sprint',
    phaseTheme: 'Cyan Neon',
    title: 'Convolutional Networks & Computer Vision Deployment Pipelines',
    timeline: 'Week 12 - 14 (Month 3-4)',
    status: 'IN PROGRESS',
    completionPercentage: 50,
    description: 'Implement modern vision architectures (ResNet, ConvNeXt, YOLO), data augmentation pipelines, and real-time bounding box detectors with OpenCV.',
    keyTopics: ['Residual Connections & Normalization Layers', 'Fast IoU & Non-Maximum Suppression', 'YOLO Object Detection Architecture', 'ONNX Runtime Export'],
    deliverables: ['Real-Time Webcam Face & Gesture Detector', 'Fine-Tuned YOLOv8 on Custom Dataset', 'TensorRT Optimized Edge Pipeline (<15ms latency)'],
    toolsAndTech: ['OpenCV 4', 'Ultralytics YOLOv8', 'Albumentations', 'ONNX Runtime', 'DeepStream']
  },
  {
    id: 'roadmap-p2-m3',
    phaseNumber: 2,
    phaseName: 'Phase 2: Build Sprint',
    phaseTheme: 'Cyan Neon',
    title: 'AI DevFlow 48-Hour Mid-Semester Hackathon & Model Sprint',
    timeline: 'Week 15 - 16 (Month 4)',
    status: 'IN PROGRESS',
    completionPercentage: 30,
    description: 'Intensive 48-hour student hackathon where multidisciplinary teams build and ship fully functional production AI applications from concept to cloud.',
    keyTopics: ['Rapid AI Prototyping', 'FastAPI & WebSockets Inference', 'Dockerized Model Serving', 'Streamlit / Next.js Frontend'],
    deliverables: ['Live Working Prototype with Public URL', '3-Minute Video Demo & Technical Pitch', 'Open-Source GitHub Repository with README'],
    toolsAndTech: ['FastAPI', 'Docker', 'Next.js', 'Hugging Face Spaces', 'PostgreSQL']
  },

  // ── PHASE 3: ADVANCED TRACKS ──
  {
    id: 'roadmap-p3-m1',
    phaseNumber: 3,
    phaseName: 'Phase 3: Advanced Tracks',
    phaseTheme: 'Fuchsia Matrix',
    title: 'Transformer Architectures, Attention & LoRA LLM Fine-Tuning',
    timeline: 'Week 17 - 19 (Month 5)',
    status: 'UPCOMING',
    completionPercentage: 0,
    description: 'Deep dive into Self-Attention mathematics, Causal Masking, RoPE positional embeddings, and parameter-efficient fine-tuning (PEFT/LoRA) on open weights.',
    keyTopics: ['FlashAttention 2 & KV Caching', 'Rotary Positional Embeddings (RoPE)', 'QLoRA 4-bit Quantization', 'Supervised Fine-Tuning (SFT) & DPO'],
    deliverables: ['Custom GPT Decoder from Scratch in PyTorch', 'Fine-Tuned LLaMA-3 / Mistral on Domain Data', 'vLLM Accelerated Serving Endpoint'],
    toolsAndTech: ['Transformers', 'PEFT', 'TRL', 'Unsloth', 'vLLM', 'FlashAttention']
  },
  {
    id: 'roadmap-p3-m2',
    phaseNumber: 3,
    phaseName: 'Phase 3: Advanced Tracks',
    phaseTheme: 'Fuchsia Matrix',
    title: 'Retrieval-Augmented Generation (RAG) & Vector Database Architecture',
    timeline: 'Week 20 - 22 (Month 5-6)',
    status: 'UPCOMING',
    completionPercentage: 0,
    description: 'Build enterprise-grade RAG systems combining semantic embeddings, hybrid keyword search (BM25), cross-encoder re-ranking, and hallucination guardrails.',
    keyTopics: ['Dense Embedding Models (BGE/E5)', 'HNSW & IVF Vector Indexing', 'Cross-Encoder Re-Ranking', 'Context Precision & Ragas Evaluation'],
    deliverables: ['Campus Knowledge Base Hybrid Search System', 'Agentic Query Rewriting & Router', 'RAG Triad Benchmark Score >0.88'],
    toolsAndTech: ['Qdrant', 'Pinecone', 'LangChain', 'LlamaIndex', 'Ragas', 'Cohere API']
  },
  {
    id: 'roadmap-p3-m3',
    phaseNumber: 3,
    phaseName: 'Phase 3: Advanced Tracks',
    phaseTheme: 'Fuchsia Matrix',
    title: 'Autonomous Multi-Agent Swarms & ReAct Execution State Machines',
    timeline: 'Week 23 - 24 (Month 6)',
    status: 'UPCOMING',
    completionPercentage: 0,
    description: 'Design deterministic autonomous agentic loops featuring dynamic tool-calling routers, multi-agent debate protocols, and persistent graph memory.',
    keyTopics: ['ReAct (Reason + Act) Interleaved Execution', 'LangGraph Stateful Cycles', 'Human-in-the-Loop Safeguards', 'Model Context Protocol (MCP)'],
    deliverables: ['Multi-Agent Code Review & Debugging Assistant', 'Automated Web Research & Report Generator', 'MCP-Compliant Tool Integration'],
    toolsAndTech: ['LangGraph', 'CrewAI', 'FastAPI', 'MCP SDK', 'Pydantic']
  },

  // ── PHASE 4: FINALE SHOWCASE ──
  {
    id: 'roadmap-p4-m1',
    phaseNumber: 4,
    phaseName: 'Phase 4: Finale Showcase',
    phaseTheme: 'Gold Trophy',
    title: 'Annual Campus AI Project Expo, Robotics Arena & Industry Demo Day',
    timeline: 'Week 25 - 26 (Month 7)',
    status: 'UPCOMING',
    completionPercentage: 0,
    description: 'The pinnacle event of the AI & ML Club: over 500 attendees, live interactive robotics demonstrations, hardware testbeds, and venture capital jury.',
    keyTopics: ['Live Hardware & Robotics Teleoperation', 'Production System Stability', 'Technical Pitching & Storytelling', 'User Experience & Latency Optimization'],
    deliverables: ['Live Exhibition Booth & Demonstration', 'Printed Research Posters & Technical One-Pagers', 'Public GitHub Release & Documentation'],
    toolsAndTech: ['ROS2', 'Three.js Simulators', 'WebAssembly', 'Edge TPUs', 'NVIDIA Jetson']
  },
  {
    id: 'roadmap-p4-m2',
    phaseNumber: 4,
    phaseName: 'Phase 4: Finale Showcase',
    phaseTheme: 'Gold Trophy',
    title: 'Peer-Reviewed Paper Publications, Preprints & Conference Submissions',
    timeline: 'Week 27 - 28 (Month 7)',
    status: 'UPCOMING',
    completionPercentage: 0,
    description: 'Format student research breakthroughs into formal academic papers submitted to NeurIPS, CVPR, ICLR, and student research symposiums.',
    keyTopics: ['Academic LaTeX Formatting', 'Ablation Study Rigor', 'Statistical Significance Testing', 'Open-Source Reproducibility Package'],
    deliverables: ['Complete arXiv-Ready PDF Paper', 'Reproducible Code & Model Weights Release', 'Peer-Review Response Letter Draft'],
    toolsAndTech: ['LaTeX / Overleaf', 'BibTeX', 'ArXiv', 'Papers with Code', 'Hugging Face']
  },
  {
    id: 'roadmap-p4-m3',
    phaseNumber: 4,
    phaseName: 'Phase 4: Finale Showcase',
    phaseTheme: 'Gold Trophy',
    title: 'Venture Fellowships, Open-Source Grants & Ecosystem Handover',
    timeline: 'Week 29 - 30 (Month 7)',
    status: 'UPCOMING',
    completionPercentage: 0,
    description: 'Transition mature club projects into venture-backed startups, open-source foundations, and onboard the incoming leadership cohort.',
    keyTopics: ['Grant Applications (Y Combinator, Emergent Ventures)', 'Open-Source Governance & Apache 2.0 Licensing', 'Leadership Mentorship & Transition', 'Alumni Network Integration'],
    deliverables: ['Venture Pitch Deck & Financial Model', 'Comprehensive Project Handoff Documentation', 'Club Alumni Advisory Board Induction'],
    toolsAndTech: ['Notion', 'Discord Community', 'Stripe Atlas', 'Open-Source Governance']
  }
];

// ──────────────────────────────────────────
// KNOWLEDGE VAULT (CURATED STUDY RESOURCES)
// ──────────────────────────────────────────
export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-karpathy-zero-to-hero',
    title: 'Neural Networks: Zero to Hero Masterclass',
    description: 'The world-renowned video course covering backpropagation from scratch (micrograd), language models (makemore), and full GPT architectures by Andrej Karpathy.',
    category: 'Machine Learning',
    type: 'Video',
    author: 'Andrej Karpathy',
    url: 'https://karpathy.ai/zero-to-hero.html',
    iconName: 'Video',
    tags: ['Micrograd', 'Backprop', 'PyTorch', 'Language Models', 'GPT'],
    featured: true,
    addedAt: '2026-08-01'
  },
  {
    id: 'res-fastai-practical-dl',
    title: 'Practical Deep Learning for Coders (2026 Edition)',
    description: 'Top-down, hands-on deep learning curriculum teaching neural networks, computer vision, tabular modeling, and NLP without requiring years of advanced math.',
    category: 'Machine Learning',
    type: 'Course',
    author: 'fast.ai / Jeremy Howard',
    url: 'https://course.fast.ai/',
    iconName: 'BookOpen',
    tags: ['Fast.ai', 'Computer Vision', 'PyTorch', 'Practical ML', 'Deployment'],
    featured: true,
    addedAt: '2026-08-01'
  },
  {
    id: 'res-deeplearning-genai-llm',
    title: 'Generative AI with Large Language Models (LLMs)',
    description: 'Comprehensive curriculum by Andrew Ng & AWS on LLM training pipelines, instruction fine-tuning, PEFT/LoRA, RLHF, and generative agent architectures.',
    category: 'Generative AI',
    type: 'Course',
    author: 'DeepLearning.AI & AWS',
    url: 'https://www.deeplearning.ai/courses/generative-ai-with-llms/',
    iconName: 'Sparkles',
    tags: ['LLM', 'LoRA', 'RLHF', 'Fine-Tuning', 'Prompt Engineering'],
    featured: true,
    addedAt: '2026-08-05'
  },
  {
    id: 'res-stanford-cs231n',
    title: 'CS231n: Deep Learning for Computer Vision',
    description: 'Stanford University flagship course on spatial convolution, visual recognition, attention mechanisms, object detection, segmentation, and generative models.',
    category: 'Computer Vision',
    type: 'Course',
    author: 'Stanford University',
    url: 'https://cs231n.stanford.edu/',
    iconName: 'Layers',
    tags: ['CNN', 'Vision Transformers', 'Object Detection', 'Segmentation', 'PyTorch'],
    featured: true,
    addedAt: '2026-08-02'
  },
  {
    id: 'res-langchain-rag-docs',
    title: 'LangChain & LlamaIndex RAG Masterclass Documentation',
    description: 'Production architecture guides and API reference for building Retrieval-Augmented Generation systems, vector store indices, and context-aware agents.',
    category: 'Generative AI',
    type: 'Documentation',
    author: 'LangChain & LlamaIndex',
    url: 'https://python.langchain.com/docs/tutorials/rag/',
    iconName: 'FileText',
    tags: ['RAG', 'Vector DB', 'Embeddings', 'LangChain', 'LlamaIndex'],
    featured: false,
    addedAt: '2026-08-08'
  },
  {
    id: 'res-pytorch-official-tutorials',
    title: 'PyTorch Official Documentation & Recipes',
    description: 'The authoritative reference manual and interactive recipes for torch.nn, autograd, torch.compile, distributed data parallel (DDP), and mobile quantization.',
    category: 'AI',
    type: 'Documentation',
    author: 'PyTorch Core Team',
    url: 'https://pytorch.org/tutorials/',
    iconName: 'Cpu',
    tags: ['PyTorch', 'Autograd', 'CUDA', 'TorchScript', 'DDP'],
    featured: false,
    addedAt: '2026-08-03'
  },
  {
    id: 'res-python-data-analysis',
    title: 'Python for Data Analysis & NumPy Mastery Guide',
    description: 'The definitive guide to manipulating, processing, and cleaning datasets with NumPy, Pandas, and IPython by the original creator of Pandas.',
    category: 'Python',
    type: 'Article',
    author: 'Wes McKinney / O’Reilly',
    url: 'https://wesmckinney.com/book/',
    iconName: 'BookOpen',
    tags: ['Python', 'NumPy', 'Pandas', 'Vectorization', 'Data Wrangling'],
    featured: false,
    addedAt: '2026-08-04'
  },
  {
    id: 'res-pro-git-book',
    title: 'Pro Git: Modern Branching Models & PR Workflows',
    description: 'Complete open-source guide to mastering Git internals, semantic rebase workflows, interactive stashing, cherry-picking, and remote repository governance.',
    category: 'Git & GitHub',
    type: 'Documentation',
    author: 'Scott Chacon & Ben Straub',
    url: 'https://git-scm.com/book/en/v2',
    iconName: 'GitBranch',
    tags: ['Git', 'GitHub', 'Rebase', 'Workflows', 'Version Control'],
    featured: false,
    addedAt: '2026-08-01'
  },
  {
    id: 'res-build-gpt-karpathy',
    title: 'Let\'s build GPT: from scratch, in code, spelled out',
    description: 'A 2-hour coding tutorial building a character-level Generative Pre-trained Transformer from raw PyTorch tensors, following the exact GPT-2 architecture.',
    category: 'Generative AI',
    type: 'Tutorial',
    author: 'Andrej Karpathy',
    url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    iconName: 'Video',
    tags: ['GPT-2', 'Self-Attention', 'PyTorch', 'Tokenization', 'NanoGPT'],
    featured: true,
    addedAt: '2026-08-06'
  },
  {
    id: 'res-illustrated-transformer',
    title: 'The Illustrated Transformer & Visual Guide to Attention',
    description: 'Visual step-by-step breakdown of how multi-head self-attention, encoder-decoder architectures, and softmax probability distributions function geometrically.',
    category: 'Generative AI',
    type: 'Article',
    author: 'Jay Alammar',
    url: 'https://jalammar.github.io/illustrated-transformer/',
    iconName: 'FileText',
    tags: ['Transformer', 'Attention', 'NLP', 'Visualization', 'Linear Algebra'],
    featured: true,
    addedAt: '2026-08-07'
  },
  {
    id: 'res-3blue1brown-math-ml',
    title: 'Essence of Linear Algebra & Neural Networks',
    description: 'Incomparable 3D geometric visualizations of matrix transformations, eigenvectors, gradient descent vector fields, and backpropagation derivatives.',
    category: 'AI',
    type: 'Video',
    author: '3Blue1Brown (Grant Sanderson)',
    url: 'https://www.3blue1brown.com/topics/linear-algebra',
    iconName: 'Video',
    tags: ['Linear Algebra', 'Calculus', 'Visualization', 'Vectors', 'Math for ML'],
    featured: true,
    addedAt: '2026-08-02'
  },
  {
    id: 'res-yolov8-ultralytics',
    title: 'Real-Time YOLOv8 Object Detection & Tracking with OpenCV',
    description: 'Step-by-step technical tutorial for training, validating, and deploying YOLOv8 state-of-the-art vision models for detection, segmentation, and pose tracking.',
    category: 'Computer Vision',
    type: 'Tutorial',
    author: 'Ultralytics',
    url: 'https://docs.ultralytics.com/',
    iconName: 'Layers',
    tags: ['YOLOv8', 'Object Detection', 'OpenCV', 'Bounding Boxes', 'Real-Time CV'],
    featured: false,
    addedAt: '2026-08-09'
  },
  {
    id: 'res-kaggle-learn-tracks',
    title: 'Kaggle Learn: Interactive Micro-Courses in Machine Learning',
    description: 'Hands-on browser-based exercises covering feature engineering, categorical variables, XGBoost, model explainability (SHAP), and geospatial analysis.',
    category: 'Data Science',
    type: 'Course',
    author: 'Kaggle',
    url: 'https://www.kaggle.com/learn',
    iconName: 'BookOpen',
    tags: ['Kaggle', 'XGBoost', 'Feature Engineering', 'EDA', 'Scikit-Learn'],
    featured: false,
    addedAt: '2026-08-05'
  },
  {
    id: 'res-huggingface-nlp-course',
    title: 'Hugging Face NLP & Transformers Complete Course',
    description: 'Master the Hugging Face ecosystem: tokenizers, datasets, model hub, fine-tuning BERT/RoBERTa/T5, sequence-to-sequence generation, and deployment.',
    category: 'Generative AI',
    type: 'Course',
    author: 'Hugging Face',
    url: 'https://huggingface.co/learn/nlp-course',
    iconName: 'Sparkles',
    tags: ['Hugging Face', 'NLP', 'BERT', 'Tokenizers', 'Fine-Tuning'],
    featured: true,
    addedAt: '2026-08-04'
  },
  {
    id: 'res-google-colab-tool',
    title: 'Google Colaboratory Free GPU & TPU Cloud Platform',
    description: 'Zero-configuration cloud Jupyter notebook environment with free NVIDIA T4/V100 GPU compute and seamless Google Drive storage synchronization.',
    category: 'Python',
    type: 'Tool',
    author: 'Google Research',
    url: 'https://colab.research.google.com/',
    iconName: 'Terminal',
    tags: ['Colab', 'GPU', 'Jupyter', 'Cloud Compute', 'Python'],
    featured: false,
    addedAt: '2026-08-01'
  },
  {
    id: 'res-hf-spaces-gradio-tool',
    title: 'Hugging Face Spaces & Gradio Web App Deployment',
    description: 'Build and deploy full-stack interactive machine learning web applications in pure Python with Gradio, Streamlit, and Docker container support.',
    category: 'AI',
    type: 'Tool',
    author: 'Hugging Face',
    url: 'https://huggingface.co/spaces',
    iconName: 'Globe',
    tags: ['Gradio', 'Streamlit', 'Deployment', 'Spaces', 'Frontend for AI'],
    featured: false,
    addedAt: '2026-08-08'
  },
  {
    id: 'res-lilian-weng-agents',
    title: 'LLM Powered Autonomous Agents: Architectural Overview',
    description: 'In-depth research breakdown of agent planning (Task Decomposition, Multi-plan), Short/Long-Term Memory architectures, and Tool-Use integration.',
    category: 'AI',
    type: 'Article',
    author: 'Lilian Weng (OpenAI / Research)',
    url: 'https://lilianweng.github.io/posts/2023-06-23-agent/',
    iconName: 'Cpu',
    tags: ['AI Agents', 'ReAct', 'Planning', 'Memory', 'System Design'],
    featured: true,
    addedAt: '2026-08-09'
  },
  {
    id: 'res-scikit-learn-guide',
    title: 'Scikit-Learn Machine Learning in Python Official Guide',
    description: 'Comprehensive tutorials, mathematical formulations, and API documentation for classification, regression, clustering, dimensionality reduction, and model validation.',
    category: 'Machine Learning',
    type: 'Documentation',
    author: 'Scikit-Learn Developers',
    url: 'https://scikit-learn.org/stable/user_guide.html',
    iconName: 'BookOpen',
    tags: ['Scikit-Learn', 'Classification', 'Regression', 'Clustering', 'Python'],
    featured: false,
    addedAt: '2026-08-03'
  }
];

// ──────────────────────────────────────────
// ADMIN CMS USERS & STAFF SEED
// ──────────────────────────────────────────
export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-superadmin-00',
    name: 'Sudhanshu Singh',
    email: 'sudhanshu.singh@bytexl.in',
    role: 'SUPERADMIN',
    password: 'Sidanjali1@',
    createdAt: '2026-08-21',
    lastLogin: '2026-08-21T22:54:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'
  },
  {
    id: 'user-superadmin-01',
    name: 'Dr. Aris Thorne',
    email: 'superadmin@aimlclub.edu',
    role: 'SUPERADMIN',
    password: 'super2026password',
    createdAt: '2026-01-10',
    lastLogin: '2026-08-21T18:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'
  },
  {
    id: 'user-admin-01',
    name: 'Elena Rostova',
    email: 'admin@aimlclub.edu',
    role: 'ADMIN',
    password: 'admin2026password',
    createdAt: '2026-02-15',
    lastLogin: '2026-08-21T19:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400'
  },
  {
    id: 'user-admin-02',
    name: 'Marcus Vance',
    email: 'marcus@aimlclub.edu',
    role: 'ADMIN',
    password: 'admin2026password',
    createdAt: '2026-03-01',
    lastLogin: '2026-08-20T14:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400'
  }
];

// ──────────────────────────────────────────
// CLUB REGISTERED MEMBERS DIRECTORY SEED
// ──────────────────────────────────────────
export const INITIAL_MEMBERS: ClubMember[] = [
  {
    id: 'mem-001',
    memberId: 'AIML-2026-0042',
    name: 'Aarav Sharma',
    uid: '24BCS10042',
    email: 'aarav.sharma@campus.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    skills: ['PyTorch', 'YOLOv8', 'OpenCV', 'FastAPI'],
    joinedDate: '2026-01-15',
    role: 'Core Member (Computer Vision)',
    status: 'Active',
    githubUrl: 'https://github.com/aarav-sharma-ai'
  },
  {
    id: 'mem-002',
    memberId: 'AIML-2026-0089',
    name: 'Sophia Chen',
    uid: '24BAI10089',
    email: 'sophia.chen@campus.edu',
    phone: '+1 (555) 345-6789',
    department: 'Artificial Intelligence & Machine Learning',
    year: '2nd Year',
    skills: ['Transformers', 'LangChain', 'RAG', 'Python'],
    joinedDate: '2026-02-01',
    role: 'Researcher (Generative AI)',
    status: 'Active',
    githubUrl: 'https://github.com/sophia-chen-ml'
  },
  {
    id: 'mem-003',
    memberId: 'AIML-2026-0114',
    name: 'Rohan Patel',
    uid: '23BDS10114',
    email: 'rohan.patel@campus.edu',
    phone: '+1 (555) 456-7890',
    department: 'Data Science & Analytics',
    year: '4th Year',
    skills: ['NumPy', 'Scikit-Learn', 'Feature Engineering', 'XGBoost'],
    joinedDate: '2025-08-20',
    role: 'Lead Mentor (Data Science)',
    status: 'Active',
    githubUrl: 'https://github.com/rohan-data-craft'
  },
  {
    id: 'mem-004',
    memberId: 'AIML-2026-0158',
    name: 'Zara Al-Mansoor',
    uid: '24BROB10158',
    email: 'zara.almansoor@campus.edu',
    phone: '+1 (555) 567-8901',
    department: 'Robotics & Automation',
    year: '2nd Year',
    skills: ['ROS2', 'Reinforcement Learning', 'Mujoco', 'PyTorch'],
    joinedDate: '2026-02-18',
    role: 'Core Member (Robotics)',
    status: 'Active',
    githubUrl: 'https://github.com/zara-robotics'
  },
  {
    id: 'mem-005',
    memberId: 'AIML-2026-0205',
    name: 'Devin K. Miller',
    uid: '25BCS10205',
    email: 'devin.miller@campus.edu',
    phone: '+1 (555) 678-9012',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    skills: ['Python', 'Git', 'NumPy', 'Math for ML'],
    joinedDate: '2026-03-05',
    role: 'Junior Fellow',
    status: 'Active',
    githubUrl: 'https://github.com/devin-m-builder'
  }
];

// ──────────────────────────────────────────
// EVENT ATTENDEE RSVPS SEED
// ──────────────────────────────────────────
export const INITIAL_EVENT_RSVPS: EventRSVP[] = [
  {
    id: 'rsvp-001',
    eventId: 'event-genai-masterclass',
    eventTitle: 'Generative AI & LLM Fine-Tuning Masterclass',
    studentName: 'Aarav Sharma',
    studentUid: '24BCS10042',
    email: 'aarav.sharma@campus.edu',
    phone: '+1 (555) 234-5678',
    department: 'CSE',
    year: '3rd Year',
    registeredAt: '2026-08-18T10:15:00Z',
    status: 'Confirmed'
  },
  {
    id: 'rsvp-002',
    eventId: 'event-genai-masterclass',
    eventTitle: 'Generative AI & LLM Fine-Tuning Masterclass',
    studentName: 'Sophia Chen',
    studentUid: '24BAI10089',
    email: 'sophia.chen@campus.edu',
    phone: '+1 (555) 345-6789',
    department: 'AI & ML',
    year: '2nd Year',
    registeredAt: '2026-08-18T11:20:00Z',
    status: 'Confirmed'
  },
  {
    id: 'rsvp-003',
    eventId: 'event-cv-splatting',
    eventTitle: '3D Gaussian Splatting & Real-Time Neural Rendering',
    studentName: 'Zara Al-Mansoor',
    studentUid: '24BROB10158',
    email: 'zara.almansoor@campus.edu',
    phone: '+1 (555) 456-7890',
    department: 'Robotics',
    year: '2nd Year',
    registeredAt: '2026-08-19T09:40:00Z',
    status: 'Confirmed'
  },
  {
    id: 'rsvp-004',
    eventId: 'event-rl-symposium',
    eventTitle: 'Deep Reinforcement Learning & Autonomous Agents Symposium',
    studentName: 'Devin K. Miller',
    studentUid: '25BCS10205',
    email: 'devin.miller@campus.edu',
    phone: '+1 (555) 567-8901',
    department: 'CSE',
    year: '1st Year',
    registeredAt: '2026-08-20T14:30:00Z',
    status: 'Confirmed'
  }
];

// ──────────────────────────────────────────
// JOIN FORM DYNAMIC CONFIGURATION SEED
// ──────────────────────────────────────────
export const INITIAL_JOIN_CONFIG: JoinFormConfig = {
  admissionsOpen: true,
  closureNotice: 'Applications for the current cohort are currently closed. The Spring 2027 application window will open in November 2026.',
  nextCohortDate: 'Spring 2027 (Nov 2026)',
  portalBadge: 'MEMBERSHIP RECRUITMENT PORTAL',
  formTitle: 'APPLY TO JOIN THE AI/ML CLUB',
  formSubtitle: 'Fill out your technical background, select your AI interest tracks, and submit your research statement. Applications are reviewed on a rolling basis.',
  submitButtonText: 'SUBMIT APPLICATION & JOIN DIRECTORY',
  successTitle: 'WELCOME TO THE AI/ML CLUB!',
  successMessage: 'Your application has been received and approved. You are now officially enrolled in the AI/ML Club Directory.',
  departments: [
    'Computer Science & Engineering (CSE)',
    'Artificial Intelligence & Machine Learning (AI & ML)',
    'Data Science & Analytics',
    'Robotics & Automation',
    'Electronics & Communication Engineering (ECE)',
    'Electrical & Computing Engineering',
    'Mathematics & Scientific Computing'
  ],
  academicYears: [
    '1st Year (Freshman)',
    '2nd Year (Sophomore)',
    '3rd Year (Junior)',
    '4th Year (Senior)',
    'Postgraduate / Masters',
    'PhD Scholar'
  ],
  domainInterests: [
    'Generative AI & LLMs',
    'Computer Vision & 3D Gaussian Splatting',
    'Robotics & Physical AI',
    'Reinforcement Learning & Game AI',
    'Autonomous AI Agents & Multi-Agent Swarms',
    'AI Safety & Neural Interpretability'
  ],
  membershipPerks: [
    'Access to High-Performance Cloud GPU Clusters (H100/A100)',
    'Direct 1-on-1 Mentorship from Faculty and Industry AI Researchers',
    'Fully Sponsored Registrations for Hackathons & AI Conferences',
    'Exclusive Invitation to Private Networking Dinners with Tech Founders',
    'Official Club GitHub Organization & Research Fellowship Badging'
  ],
  customFields: [
    {
      id: 'field-exp',
      label: 'Prior Coding & AI Experience',
      type: 'select',
      placeholder: 'Select your experience level',
      helperText: 'Helps us match you with research mentors and project teams.',
      required: false,
      options: [
        'Beginner (Learning Python & Basic Math)',
        'Intermediate (Built ML models / PyTorch / Computer Vision)',
        'Advanced (Trained LLMs, published papers, or production AI)'
      ]
    },
    {
      id: 'field-why',
      label: 'Why do you want to join the AI/ML Club?',
      type: 'textarea',
      placeholder: 'Tell us what research domains or projects you are excited to build...',
      helperText: 'A brief 1-2 sentence statement on your aspirations.',
      required: false
    }
  ],
  showPhoneField: true,
  showPortfolioField: true,
  showSocialLinks: true,
  showDomainInterests: true,
  showStatementOfPurpose: true,
  sopPrompt: 'Statement of Purpose / Research Interests',
  lastUpdated: '2026-08-21'
};

// ──────────────────────────────────────────
// CODING QUESTS STUDENT SUBMISSIONS SEED
// ──────────────────────────────────────────
export const INITIAL_SUBMISSIONS: QuestSubmission[] = [
  {
    id: 'sub-01',
    questId: 'quest-potw-attention',
    questTitle: 'Scaled Dot-Product Attention from Scratch (PyTorch)',
    studentName: 'Aarav Sharma',
    studentUID: '23BCS10042',
    githubRepoUrl: 'https://github.com/aaravsharma/custom-attention-pytorch',
    solutionNotes: 'Implemented vectorized dot-product attention with optional causal masking matrix and dropout regularization. All test assertions pass.',
    status: 'Verified',
    pointsAwarded: 500,
    reviewerNotes: 'Clean tensor ops, zero loops, correctly handles 4D batch broadcasting.',
    submittedAt: '2026-08-19T14:22:00Z'
  },
  {
    id: 'sub-02',
    questId: 'quest-potw-attention',
    questTitle: 'Scaled Dot-Product Attention from Scratch (PyTorch)',
    studentName: 'Sophia Chen',
    studentUID: '24BAI10088',
    githubRepoUrl: 'https://github.com/sophiachen/transformer-attention',
    solutionNotes: 'Used torch.matmul and torch.softmax with scale factor 1/sqrt(d_k). Tested against torch.nn.MultiheadAttention.',
    status: 'Pending Review',
    submittedAt: '2026-08-20T11:45:00Z'
  },
  {
    id: 'sub-03',
    questId: 'quest-numpy-vectorize',
    questTitle: 'NumPy Vectorized Cosine Similarity Matrix',
    studentName: 'Rohan Patel',
    studentUID: '23BCS10115',
    githubRepoUrl: 'https://github.com/rohanpatel/numpy-cosine-fast',
    solutionNotes: 'Computed dot product using np.dot and normalized row-wise with np.linalg.norm with epsilon stability.',
    status: 'Verified',
    pointsAwarded: 150,
    reviewerNotes: 'Excellent performance and memory footprint.',
    submittedAt: '2026-08-18T16:10:00Z'
  },
  {
    id: 'sub-04',
    questId: 'quest-unet-segmentation',
    questTitle: 'U-Net Architecture Implementation from Scratch',
    studentName: 'Priya Sundaram',
    studentUID: '24BCS10241',
    githubRepoUrl: 'https://github.com/priyasun/unet-scratch-pytorch',
    solutionNotes: 'Built double conv blocks with skip connections and transposed convolutions for upsampling.',
    status: 'Needs Revision',
    reviewerNotes: 'Skip connection channel concatenation dimension mismatch on odd input resolutions. Fix padding.',
    submittedAt: '2026-08-17T09:30:00Z'
  },
  {
    id: 'sub-05',
    questId: 'quest-rl-qlearning',
    questTitle: 'Deep Q-Network (DQN) with Replay Buffer',
    studentName: 'Liam Vance',
    studentUID: '23BCS10304',
    githubRepoUrl: 'https://github.com/liamvance/dqn-cartpole-solver',
    solutionNotes: 'Implemented experience replay buffer with prioritized sampling and epsilon-greedy exploration schedule.',
    status: 'Pending Review',
    submittedAt: '2026-08-21T18:05:00Z'
  }
];
