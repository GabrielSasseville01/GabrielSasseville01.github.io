---
title: "Application of the LSTM model for streamflow forecasting in the Great-Lakes region"
collection: publications
category: manuscripts
permalink: /publication/lstm_hydro
excerpt: 'Conference paper for American Geophysical Union 2025'
date: 2025-10-07
venue: 'American Geophysical Union'
---

**Abstract**

The Long Short-Term Memory (LSTM) model is a deep learning method that has proven very competitive with regard to streamflow predictions over recent years. In contrast with basic recurrent neural networks, the LSTM’s memory line allows the model to retain information over long periods of time, solving the vanishing gradient problem. In this work, we applied the LSTM model in the region of the Great Lakes, first in a “hindcast” mode when fed with dynamic forcings coming from the Canadian Surface Reanalysis version 3.1 (CaSR v3.1) produced at Environment and Climate Change Canada (ECCC), and then in a “forecasting” mode when simply replacing the last days of the 365-days lookback window of the data cube provided to the LSTM model with actual forecasts from ECCC’s Global Deterministic Prediction System (GDPS). To do so, the model was first trained over 2001-2017 and with a set of 212 streamflow gauges in the Great-Lakes region, and tested over 2018-2022, when using only CaSR 3.1 as the source of the dynamic forcings needed by the model to evaluate its temporal robustness. Then, the model was trained over the period 2001-2021, and applied over a full hydrologic year spanning over 2021/2022 in a forecast mode, producing streamflow forecasts up to 6 days. These LSTM forecasts are compared to the streamflow forecasts that were performed with the National Surface and River Prediction System, which consists of ECCC’s distributed and physically-based hydrologic forecasting system. While the LSTM already shows very promising results when compared to NSRPS forecasts, there is still room for improving the LSTM forecasts and combining the strengths of both systems, as well as further work needed to prepare the LSTM model for operational deployment at ECCC.