---
title: "MCP-AT: Reinforcement Learning for Coding Agents under Tool Poisoning"
collection: publications
category: conferences
permalink: /publication/mcpat_acl
excerpt: 'Under review at ACL Rolling Review (ACL ARR 2026).'
date: 2025-10-01
venue: 'ACL ARR 2026 (under review)'
---

**Authors:** Doseok Jang, Gabriel Sasseville, Tue Le, Anh Nguyen Hoang, Nghi D. Q. Bui, Pierre-Luc Bacon.

**Abstract**

Reinforcement learning for coding agents has become a standard component of modern post-training pipelines, but it typically optimizes raw task completion and test passing. At the same time, Model Context Protocol (MCP) servers have emerged as a popular mechanism for extending agent capabilities, exposing an attack vector in which malicious servers inject instructions into tool documentation. Test-passing rewards alone do not distinguish legitimate work from unauthorized actions, so an agent can be rewarded for solving a task while following a malicious injected instruction. We introduce **MCP-AT**, a two-stage post-training recipe that combines adversarial supervised fine-tuning (SFT) with task-oriented reinforcement learning and explicit security-violation penalties. SFT teaches task completion in the presence of poisoned tool descriptions, while subsequent RL combines verifiable task rewards with penalties on offending tool-call arguments and refreshes attacks against the current policy. Evaluating Qwen3-14B policies on clean and poisoned SWE-bench Verified tasks, MCP-AT approximately halves targeted attack success rate relative to adversarial SFT and raises robust solve (task completion without the targeted violation under attack) from 9.1% to 17.6%, with the relative benefit transferring to a held-out attacker. These results suggest that adversarial post-training can strengthen resistance to tool-description poisoning while improving coding performance.
