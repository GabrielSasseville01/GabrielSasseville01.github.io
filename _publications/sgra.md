---
title: "Probabilistic Interpolation of Sagittarius A*'s Multi-Wavelength Light Curves Using Diffusion Models"
collection: publications
category: manuscripts
permalink: /publication/sgra
excerpt: 'First-authored paper submitted to ApJ, currently under review.'
date: 2025-08-20
venue: 'Astrophysical Journal'
---

**Abstract**

Understanding the variability of Sagittarius A* (Sgr A*) requires coordinated, multi-wavelength observations that span the electromagnetic spectrum. In this work, we focus on data from four key observatories: Chandra in the X-ray (2–8 keV), GRAVITY on the Very Large Telescope in the near-infrared (2.2 $\mu m$), Spitzer in the infrared (4.5 $\mu m$), and ALMA in the submillimeter (340 GHz). These multi-band observations are essential for probing the physics of accretion and emission near the black hole’s event horizon, yet they suffer from irregular sampling, band-dependent noise, and substantial data gaps. These limitations complicate efforts to robustly identify flares and measure cross-band time lags, key diagnostics of the physical processes driving variability. To address this challenge, we introduce a diffusion-based generative model, for interpolating sparse, multivariate astrophysical time series. This represents the first application of score-based diffusion models to astronomical time series. We also present the first transformer-based model for light curve reconstruction that includes calibrated uncertainty estimates. The models are trained on simulated light curves constructed to match the statistical and observational characteristics of real Sgr A* data. These simulations capture correlated multi-band variability, realistic observation cadences, and wavelength-specific noise. We compare our models against a multi-output Gaussian Process. The diffusion model achieves superior accuracy and competitive calibration across both simulated and real datasets, demonstrating the promise of diffusion models for high-fidelity, uncertainty-aware reconstruction of multi-wavelength variability in Sgr A*.