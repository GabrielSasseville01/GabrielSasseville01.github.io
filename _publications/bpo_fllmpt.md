---
title: "Enabling Reparameterized Policy Gradients for LLM Post-training"
collection: publications
category: conferences
permalink: /publication/bpo_fllmpt
excerpt: 'Accepted at the NeurIPS 2025 Workshop on Foundations and Limits of Learning from Model Preferences and Trajectories (FLLMPT).'
date: 2025-10-01
venue: 'NeurIPS 2025 Workshop (FLLMPT)'
---

**Authors:** Michel Ma, Gabriel Sasseville, Pierre-Luc Bacon.

**Abstract**

The score-function (SF) estimator serves as the basis for nearly all reinforcement-learning pipelines currently used to fine-tune large language models (LLMs). While general, these methods rely exclusively on samples to derive an estimate of the policy gradient, which leads to high variance and a limited ability to explore beyond a base policy's distribution. Conversely, one could elect to directly differentiate through a reparameterized objective to fully leverage a reward model's gradient toward improvement rather than estimating it through samples. That said, reparameterized policy gradients have yet to be explored in this area because of the added complexity of differentiating through a discrete sampling objective, and because such gradients have historically been avoided by RL practitioners due to their instability in longer-horizon tasks. In this paper, we reexamine these concerns and provide a principled framework for efficiently computing the reparameterized policy gradient for fine-tuning LLMs with RL. In experiments spanning both preference alignment and reasoning, we show that our method is less constrained by the policy's priors, leading to higher training rewards compared to SF algorithms such as Group Relative Policy Optimization (GRPO). We also highlight an unwanted consequence of directly using a reward model's gradients with respect to reward hacking.
