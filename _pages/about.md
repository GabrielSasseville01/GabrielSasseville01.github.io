---
permalink: /
title: "About"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I'm Gabriel Sasseville, a second-year PhD student in Computer Science at [Mila](https://mila.quebec/en) and Université de Montréal, supervised by [Pierre-Luc Bacon](https://pierrelucbacon.com/). My research focuses on post-training and reinforcement learning for large language model (LLM) based coding agents, with an emphasis on safety, robustness, and secure code generation.

Before starting my PhD, I completed an M.Sc. in Astrophysics at Université de Montréal and McGill University, where I developed diffusion models for probabilistic interpolation of multi-wavelength observations of Sagittarius A*, the supermassive black hole at the center of the Milky Way. During my master's I also worked as an AI research scientist at Environment and Climate Change Canada, building LSTM-based streamflow forecasting models for the Great Lakes region that outperformed ECCC's operational physically-based system (NSRPS).

Current Research
======
My current work explores how reparameterized policy gradients, adversarial post-training, and execution-grounded verifiers can make coding agents more capable and more robust under realistic threat models. Recent and in-progress projects include:

- **Enabling Reparameterized Policy Gradients for LLM Post-training** — accepted at the NeurIPS 2025 FLLMPT workshop (with Michel Ma and Pierre-Luc Bacon). A principled framework for computing reparameterized policy gradients during RL fine-tuning that is less constrained by the base policy's prior than standard score-function estimators like GRPO.
- **FALCON: Secure Agentic Coding through Counterexample-Grounded Feedback** — ICLR 2026 submission, in collaboration with FPT AI Research. A counterexample-grounded verification framework that separates attack exploration from behavioral verification using execution traces, used both for test-time repair and as an RL reward.
- **MCP-AT: Reinforcement Learning for Coding Agents under Tool Poisoning** — ACL ARR 2026 submission. A two-stage adversarial post-training recipe (adversarial SFT + RL with security-violation penalties) that approximately halves targeted attack success on SWE-bench Verified under Model Context Protocol tool-description poisoning.

Research Interests
======
- **LLM Post-training and Alignment**: RLHF, reparameterized policy gradients, reward modeling
- **Coding Agents**: safe, reliable, and verifiable code-generation and software-engineering agents
- **Agentic Robustness**: adversarial training against prompt-injection and tool-poisoning attacks (MCP)
- **Secure Code Generation**: counterexample-grounded and execution-based security feedback
- **Scientific Machine Learning** (prior work): generative models for astrophysical and environmental time series
