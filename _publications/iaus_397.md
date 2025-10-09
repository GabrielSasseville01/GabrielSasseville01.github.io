---
title: "Probabilistic Interpolation of Sagittarius A*'s Multi-Wavelength Light Curves Using Machine Learning"
collection: publications
category: conference
permalink: /publication/iaus_397
excerpt: 'Conference paper for IAUS 397: UniversAI'
date: 2025-09-03
venue: 'IAUS 397'
---

**Abstract**

Understanding the variability of Sagittarius A* (Sgr A*) requires coordinated, multi-wavelength observations. However, these observations suffer from irregular sampling, noise, and large data gaps, limiting our ability to identify flares and infer cross-wavelength time lags. We address this challenge using machine learning models designed for sparse, multivariate time series. In particular, we introduce a diffusion-based generative model, representing the first application of score-based diffusion models to astronomical time series. We also use a transformer-based model, and benchmark both against a multi-output Gaussian Process. The models are trained on simulated light curves that replicate the cadence, noise, and cross-band correlations of real Sgr A* data, including observations from ALMA, Spitzer, GRAVITY, and Chandra. Our results show that the diffusion model outperforms other methods in accuracy and uncertainty calibration, on both synthetic and real data. This work highlights the potential of generative models for reconstructing astrophysical variability from incomplete observations.