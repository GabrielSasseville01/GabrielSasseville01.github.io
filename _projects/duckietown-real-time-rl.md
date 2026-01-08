---
title: "Testing Real-Time Reinforcement Learning in Duckiematrix"
collection: projects
permalink: /projects/duckietown-real-time-rl
excerpt: 'Exploring the challenges and opportunities of real-time RL in simulated autonomous driving environments, focusing on how computation delays affect agent performance.'
date: 2025-01-01
---

This project explores the challenges and opportunities of **Real-Time Reinforcement Learning** in simulated autonomous driving environments. Traditional RL algorithms assume that the environment remains static during action selection, which breaks down in real-world applications where computation time introduces delays.

## Research Questions

- How should we measure the gap in performance between classical RL and Real-Time RL?
- Does maximum performance degrade with delays?
- From which delay does the task become impossible?
- Can action conditioning compensate for computation delays?

## Key Findings

- **Computation delays significantly degrade classical RL performance**: At 0.1s delay, classical RL fails completely, and even at smaller delays, performance decreases by 9-21% compared to baseline.
- **Action conditioning effectively compensates for delays**: Real-Time RL achieves 20.9% better performance at 0.033s delay and 45.3% better at 0.5s delay compared to classical RL, with dramatically reduced variance.
- **Critical delay threshold**: Both approaches completely fail at 1.0s delays, indicating that delays beyond approximately 0.5-1.0s make the task intractable.

## Methodology

We address computation delays by conditioning the policy on both the previous state and the previous action when sampling a new action. Instead of the classical policy π(a_t | s_t), we use π(a_t | s_{t-1}, a_{t-1}), allowing the policy to learn to predict state evolution intrinsically within the model.

## Demo & Resources

- **Interactive Project Page**: [View the full project](https://gabrielsasseville01.github.io/Duckietown-Real-Time-RL/)
- **GitHub Repository**: [Duckietown Real-Time RL](https://github.com/GabrielSasseville01/Duckietown-Real-Time-RL)

## Authors

Guillaume Gagné-Labelle, **Gabriel Sasseville**, Nicolas Bosteels (2025)

## Technologies

PyTorch, Gymnasium, Duckietown, Duckiematrix, TensorRT
