const { useState, useMemo } = React;

// ─── FULL SYNTHESIS MATRIX DATA ─────────────────────────────────────────────
// Each paper analyzed across: approach, method, evaluation, assumptions, gaps
// Papers can appear in multiple affinity clusters simultaneously

const papers = [
  // ── SEA ICE PHYSICS & OBSERVATION ─────────────────────────────────────
  {
    id: "fang2022",
    short: "Fang et al. 2022",
    title: "A Modified Thermodynamic Sea Ice Model",
    year: 2022,
    domainCluster: "Ice Physics",
    approach: ["theory", "empirical"],
    method: ["simulation", "physics-model"],
    evaluation: ["case-study"],
    assumptions: ["static-environment", "no-ship-interaction", "large-scale-only"],
    gap: "No coupling to ship navigation cost; model is climate-scale not operational-scale",
    keyContrib: "3-layer thermodynamic ice model; +45cm thickness accuracy vs Winton",
  },
  {
    id: "hwang2022",
    short: "Hwang & Wang 2022",
    title: "Multi-Scale Satellite Observations of Arctic Sea Ice Floe Size Distribution",
    year: 2022,
    domainCluster: "Ice Physics",
    approach: ["empirical"],
    method: ["data-driven", "remote-sensing"],
    evaluation: ["real-world"],
    assumptions: ["satellite-data-available", "summer-ice-conditions", "no-operational-use"],
    gap: "FSD observations not yet connected to ship navigation cost functions or path planners",
    keyContrib: "3-stage floe lifecycle model; power-law FSD α≈2 at fracture, 2.4–3.8 at melt",
  },
  {
    id: "manucharyan2022",
    short: "Manucharyan & Montemuro 2022",
    title: "SubZero: Sea Ice Model With Explicit Floe Life Cycle",
    year: 2022,
    domainCluster: "Ice Physics",
    approach: ["theory", "systems"],
    method: ["simulation", "physics-model"],
    evaluation: ["case-study"],
    assumptions: ["idealized-geometry", "no-ship-interaction", "computationally-intensive"],
    gap: "High computational cost; not yet usable for real-time ship navigation planning",
    keyContrib: "Novel floe-scale model with time-evolving shapes; reproduces power-law FSD naturally",
  },
  {
    id: "ecco2015",
    short: "Forget et al. 2015",
    title: "ECCO Version 4: Non-Linear Inverse Modeling for Global Ocean State Estimation",
    year: 2015,
    domainCluster: "Ice Physics",
    approach: ["theory", "systems"],
    method: ["physics-model", "data-assimilation"],
    evaluation: ["real-world"],
    assumptions: ["large-scale-only", "historical-data-dependent", "no-real-time"],
    gap: "Retrospective only; not usable for real-time Arctic route planning without forecasting extension",
    keyContrib: "First truly global ECCO estimate including Arctic; adjoint-based data synthesis",
  },
  {
    id: "ecco2021",
    short: "ECCO Consortium 2021",
    title: "ECCO V4 Release 4: Global Ocean and Sea-Ice State Estimate",
    year: 2021,
    domainCluster: "Ice Physics",
    approach: ["systems"],
    method: ["data-assimilation"],
    evaluation: ["real-world"],
    assumptions: ["historical-data-dependent", "no-real-time", "research-use-only"],
    gap: "Dataset, not a method — needs downstream integration into navigational decision pipelines",
    keyContrib: "Updated ECCO dataset; nonlinear free surface; improved Arctic ocean/ice coverage",
  },

  // ── NEW: ICE PHYSICS (added papers) ───────────────────────────────────
  {
    id: "andersson2021",
    short: "Andersson et al. 2021",
    title: "Seasonal Arctic Sea Ice Forecasting with Probabilistic Deep Learning (IceNet)",
    year: 2021,
    domainCluster: "Ice Physics",
    approach: ["empirical", "systems"],
    method: ["learning-based", "data-assimilation"],
    evaluation: ["real-world", "benchmark"],
    assumptions: ["climate-simulation-data-sufficient", "monthly-resolution-adequate", "6-month-lead-time-relevant"],
    gap: "Probabilistic forecast at seasonal scale — not yet integrated into operational ship route planners or real-time navigation systems",
    keyContrib: "IceNet: probabilistic U-Net trained on climate simulations; outperforms dynamical model SEAS5 at seasonal lead times for sea ice extent",
  },
  {
    id: "durand2024",
    short: "Durand et al. 2024",
    title: "Data-Driven Surrogate Modeling of High-Resolution Sea-Ice Thickness in the Arctic",
    year: 2024,
    domainCluster: "Ice Physics",
    approach: ["empirical", "systems"],
    method: ["learning-based", "simulation"],
    evaluation: ["benchmark"],
    assumptions: ["neXtSIM-output-representative", "12h-lead-time-sufficient", "Arctic-wide-domain"],
    gap: "Surrogate model iteratively applied up to 1 year but loses fine-scale structure; not yet integrated with ship navigation planning at operational resolution",
    keyContrib: "U-Net surrogate for neXtSIM ice thickness at 10km resolution; up to 50% error reduction over persistence; runs at fraction of physics model cost",
  },

  // ── SHIP–ICE INTERACTION & STRUCTURAL ─────────────────────────────────
    {
    id: "kim2020ann",
    short: "Kim et al. 2020",
    title: "Prediction of Ice Resistance for Ice-Going Ships in Level Ice Using ANN",
    year: 2020,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "systems"],
    method: ["learning-based", "data-driven"],
    evaluation: ["real-world", "benchmark"],
    assumptions: ["level-ice-only", "model-and-fullscale-data-available", "7-parameters-sufficient"],
    gap: "Level ice only; fast ANN predictor not yet embedded as a real-time cost function in any path planner — the missing bridge",
    keyContrib: "ANN maps 7 ship/ice params to ice resistance; validated vs Otso & Polar Star full-scale; more accurate than semi-empirical formulas",
  },
  {
    id: "dpdem2021",
    short: "Liu & Ji 2021",
    title: "DPDEM: Ice Resistance on Ship Hulls in Escort Operations",
    year: 2021,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "theory"],
    method: ["simulation", "physics-model"],
    evaluation: ["benchmark", "real-world"],
    assumptions: ["level-ice-only", "known-ice-parameters", "no-navigation-planning"],
    gap: "Level-ice assumption; no broken ice fields; not integrated with route planner",
    keyContrib: "Dilated-polyhedron DEM for 6-DOF ship-ice; validated against Lindqvist/Riska formulas",
  },
  {
    id: "jou2019",
    short: "Jou et al. 2019",
    title: "Bonded DEM for Ship-Ice Interactions in Broken and Unbroken Sea Ice",
    year: 2019,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "theory"],
    method: ["simulation", "physics-model"],
    evaluation: ["benchmark"],
    assumptions: ["known-ice-parameters", "controlled-scenarios", "no-propulsion-model"],
    gap: "No propulsion or navigation feedback; purely structural — cannot inform real-time routing",
    keyContrib: "Bonded-sphere DEM predicting floe-ice failure modes; validated vs DEM simulations",
  },
  {
    id: "wang2024dpdem",
    short: "Wang et al. 2024",
    title: "Ice-Floating Platform Interaction Simulated by DPDEM",
    year: 2024,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "theory"],
    method: ["simulation", "physics-model"],
    evaluation: ["benchmark"],
    assumptions: ["moored-platform-only", "known-ice-thickness", "6DOF-rigid-body"],
    gap: "Static moored platform; results not transferable to self-propelled navigation scenarios",
    keyContrib: "6-DOF moored platform under drifting ice; ice heeling moment and structural forces",
  },
  {
    id: "pradana2019",
    short: "Raditya Pradana et al. 2019",
    title: "Efficient DEM Simulation of Managed Ice Actions on Moored Floating Platforms",
    year: 2019,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "systems"],
    method: ["simulation", "physics-model"],
    evaluation: ["benchmark", "real-world"],
    assumptions: ["2D-simplification", "managed-ice-conditions", "moored-platform"],
    gap: "2D DEM limitation; managed ice (broken, not level) — validation vs HSVA but not full 3D",
    keyContrib: "2D polygonal DEM for managed ice + mooring integration; validated vs HSVA model test",
  },
  {
    id: "liu2025cal",
    short: "Liu et al. 2025",
    title: "Deep-Learning Parametric Calibration of DEM for Sea Ice Breakage",
    year: 2025,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "systems"],
    method: ["learning-based", "simulation"],
    evaluation: ["benchmark"],
    assumptions: ["synthetic-training-data", "uniaxial-compression-and-bending-only", "no-ship-dynamics"],
    gap: "Training on synthetic DEM data only; real-world validation of calibrated parameters limited",
    keyContrib: "Neural net maps macro ice properties → DEM meso-parameters; <6% error in validation",
  },
  {
    id: "liu2026scale",
    short: "Liu et al. 2026",
    title: "Scale Effect of DEM Simulations for Ice Resistance in Level Ice",
    year: 2026,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "theory"],
    method: ["simulation", "physics-model"],
    evaluation: ["benchmark", "real-world"],
    assumptions: ["level-ice-only", "froude-cauchy-similarity", "known-ice-strength"],
    gap: "Only level ice; scale effects in broken ice fields (operational Arctic setting) unaddressed",
    keyContrib: "Scale-effect analysis in DEM; <24% deviation vs empirical formulas at full scale",
  },
  {
    id: "sawamura2022",
    short: "Sawamura 2022",
    title: "Numerical Simulation of Ice-Going Ships (Encyclopedia)",
    year: 2022,
    domainCluster: "Ship-Ice Interaction",
    approach: ["theory"],
    method: ["survey"],
    evaluation: ["none"],
    assumptions: ["survey-only", "no-new-data"],
    gap: "Survey with no new results; gap identification left to reader",
    keyContrib: "Taxonomy of ice-ship numerical simulation methods",
  },
  {
    id: "he2025",
    short: "He et al. 2025",
    title: "Dynamic Ice Load Identification via Green's Function Method",
    year: 2025,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "theory"],
    method: ["physics-model", "data-driven"],
    evaluation: ["real-world", "benchmark"],
    assumptions: ["known-structural-model", "sensor-data-available", "quasi-static-assumption-invalid"],
    gap: "Load identification post-hoc; no forward prediction for pre-voyage planning",
    keyContrib: "GFM > ICM for dynamic loads; static assumption causes up to 42% error",
  },
  {
    id: "sun2025",
    short: "Sun et al. 2025",
    title: "Risk Assessment Framework for Structural Failures of Polar Ships",
    year: 2025,
    domainCluster: "Ship-Ice Interaction",
    approach: ["empirical", "theory"],
    method: ["static-analysis", "physics-model"],
    evaluation: ["case-study"],
    assumptions: ["known-load-distribution", "deterministic-ice-conditions"],
    gap: "Structural risk not connected to navigation decisions or real-time avoidance",
    keyContrib: "Fatigue + structural reliability framework under ice loads for polar ships",
  },

  // ── NAVIGATION & PATH PLANNING IN ICE ─────────────────────────────────
  {
    id: "autoicenav2025",
    short: "de Schaetzen et al. 2025",
    title: "AUTO-IceNav: Local Navigation in Broken Ice Fields",
    year: 2025,
    domainCluster: "Ice Navigation",
    approach: ["systems", "empirical"],
    method: ["optimization", "physics-model"],
    evaluation: ["benchmark", "real-world"],
    assumptions: ["known-ice-field-state", "receding-horizon-replanning", "no-learning"],
    gap: "Ice state assumed known and static within planning horizon; no adaptation to uncertain dynamics",
    keyContrib: "Lattice planner with kinetic-energy-loss cost; physical testbed validated",
  },
  {
    id: "icra2023",
    short: "de Schaetzen et al. 2023",
    title: "Real-Time Navigation for Autonomous Surface Vehicles in Ice-Covered Waters",
    year: 2023,
    domainCluster: "Ice Navigation",
    approach: ["systems"],
    method: ["optimization"],
    evaluation: ["benchmark", "real-world"],
    assumptions: ["known-ice-concentration", "channel-navigation-only", "no-dynamic-prediction"],
    gap: "No ice dynamics prediction; receding-horizon limited by sensor range and update rate",
    keyContrib: "Novel cost-to-go heuristic for channel navigation; real-world validated",
  },
  {
    id: "zhong2025learned",
    short: "Zhong et al. 2025",
    title: "Autonomous Navigation in Ice with Learned Ship-Ice Interaction Predictions",
    year: 2025,
    domainCluster: "Ice Navigation",
    approach: ["systems", "empirical"],
    method: ["learning-based", "optimization"],
    evaluation: ["benchmark", "real-world"],
    assumptions: ["ice-dynamics-learnable-from-data", "occupancy-grid-representation", "simulation-to-real-transfer"],
    gap: "Sim-to-real transfer of learned ice dynamics not fully validated; coarse occupancy estimation",
    keyContrib: "First learned ice-dynamics model cached into graph-search planner; significantly fewer collisions",
  },
  {
    id: "kio2024",
    short: "Kio et al. 2024",
    title: "Safe Navigation in Ice with Cooperating UAV-MASS",
    year: 2024,
    domainCluster: "Ice Navigation",
    approach: ["systems"],
    method: ["simulation"],
    evaluation: ["case-study"],
    assumptions: ["UAV-available", "perfect-UAV-sensing", "Unreal-Engine-environment"],
    gap: "Full simulation only; real UAV-ship coordination with comms delays untested",
    keyContrib: "UAV maps ice via LiDAR → Ice Numerals → RRT route planning for MASS",
  },
  {
    id: "veggeland2025",
    short: "Veggeland et al. 2025",
    title: "Autonomous System for Multimodal Sea Ice Mapping From Ships",
    year: 2025,
    domainCluster: "Ice Navigation",
    approach: ["systems", "empirical"],
    method: ["data-driven", "remote-sensing"],
    evaluation: ["real-world"],
    assumptions: ["ship-mounted-LiDAR-available", "GNSS-available", "offline-processing"],
    gap: "Offline mapping system — not yet real-time; mapping result not fed back to planner",
    keyContrib: "LiDAR+camera 3D point cloud for in-situ ice characterization; factor-graph localization",
  },
  {
    id: "aopf2025",
    short: "Acevedo & Spinelli 2025",
    title: "Attention-Oriented Pathfinding for Polar Fleet Coordination",
    year: 2025,
    domainCluster: "Ice Navigation",
    approach: ["systems", "empirical"],
    method: ["learning-based", "optimization"],
    evaluation: ["benchmark"],
    assumptions: ["spatio-temporal-data-available", "fleet-communication", "simplified-ice-model"],
    gap: "Highly simplified ice model; no structural ship-ice interaction; simulation only",
    keyContrib: "Attention-based graph navigation for polar fleets; +15% fuel, -18% trip time",
  },
  {
    id: "hu2025northeast",
    short: "Hu et al. 2025",
    title: "Adaptive Route Planning in Northeast Passage Using Double DQN",
    year: 2025,
    domainCluster: "Ice Navigation",
    approach: ["empirical", "systems"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["gridworld-simplification", "meteo-data-available", "no-ice-physics"],
    gap: "Grid-based RL ignores ship dynamics and ice-ship interaction physics entirely",
    keyContrib: "DDQN integrating wind/current data for Arctic route optimization",
  },
  {
    id: "zhou2025",
    short: "Zhou et al. 2025",
    title: "Optimized Sea Ice Recognition from Remote Sensing for Polar Path Planning",
    year: 2025,
    domainCluster: "Ice Navigation",
    approach: ["systems", "empirical"],
    method: ["learning-based", "remote-sensing"],
    evaluation: ["benchmark"],
    assumptions: ["satellite-imagery-available", "detection-not-real-time", "no-ship-motion"],
    gap: "Detection pipeline not yet integrated with real-time onboard ship planners",
    keyContrib: "YOLOv5-based small floe detection from satellite imagery for path planning input",
  },
  {
    id: "li2025dl",
    short: "Li 2025",
    title: "Deep Learning-Driven Sea Ice Prediction for Arctic Sea Routes",
    year: 2025,
    domainCluster: "Ice Navigation",
    approach: ["empirical"],
    method: ["survey", "learning-based"],
    evaluation: ["none"],
    assumptions: ["data-available", "DL-models-generalize"],
    gap: "Survey only; no novel contribution; integration of DL ice forecasts into route planners unexplored",
    keyContrib: "Review of DL ice forecasting for Arctic routing; highlights spatiotemporal data fusion",
  },
  {
    id: "gu2026",
    short: "Gu et al. 2026",
    title: "Risk Management of Ship Independent Navigation in Ice-Covered Arctic Waters",
    year: 2026,
    domainCluster: "Ice Navigation",
    approach: ["empirical", "theory"],
    method: ["static-analysis", "data-driven"],
    evaluation: ["case-study"],
    assumptions: ["accident-reports-representative", "bayesian-network-structure-correct", "discrete-states"],
    gap: "Retrospective risk model; not integrated with real-time navigation decision systems",
    keyContrib: "MS-FTA + Bayesian network early-warning for Arctic collision/besetting risk",
  },
  {
    id: "zhi2023",
    short: "Zhi et al. 2023",
    title: "Data-Driven Risk Analysis of Arctic Ship Navigation Accidents",
    year: 2023,
    domainCluster: "Ice Navigation",
    approach: ["empirical"],
    method: ["data-driven", "static-analysis"],
    evaluation: ["real-world"],
    assumptions: ["accident-data-complete", "historical-patterns-repeat", "no-causal-model"],
    gap: "Descriptive not prescriptive; accident patterns identified but not connected to avoidance strategies",
    keyContrib: "Analysis of 2,638 Arctic accidents (2005-2017); data-driven accident prediction model",
  },

  {
    id: "lee2021polaris",
    short: "Lee et al. 2021",
    title: "Ship Route Planning in Arctic Ocean Based on POLARIS",
    year: 2021,
    domainCluster: "Ice Navigation",
    approach: ["systems", "empirical"],
    method: ["optimization", "physics-model"],
    evaluation: ["real-world"],
    assumptions: ["POLARIS-risk-index-valid", "GA-optimizer-sufficient", "Araon-icebreaker-representative"],
    gap: "Uses deterministic ice data; no uncertainty quantification; not autonomous — still requires human mission parameters; speed/heading optimized jointly but replanning not real-time",
    keyContrib: "First system linking POLARIS risk index + A* seed + genetic algorithm for Arctic route optimization; validated on Araon icebreaker voyages",
  },
  {
    id: "choi2015",
    short: "Choi et al. 2015",
    title: "Arctic Sea Route Path Planning Based on an Uncertain Ice Prediction Model",
    year: 2015,
    domainCluster: "Ice Navigation",
    approach: ["theory", "empirical"],
    method: ["optimization", "simulation"],
    evaluation: ["benchmark"],
    assumptions: ["ensemble-ice-model-captures-uncertainty", "heuristic-search-sufficient", "time-varying-ice-representable-as-graph"],
    gap: "Foundational formulation but ice model is simplified; no ship dynamics or ice-ship interaction; no RL — defines the problem that subsequent RL papers implicitly address",
    keyContrib: "First stochastic Arctic route planner using ensemble ice model uncertainty; dynamic path reliability metric; heuristic A* under time-varying stochastic conditions",
  },
  {
    id: "polar_code",
    short: "IMO Polar Code 2017",
    title: "International Code for Ships Operating in Polar Waters (Polar Code)",
    year: 2017,
    domainCluster: "Ice Navigation",
    approach: ["theory"],
    method: ["static-analysis"],
    evaluation: ["none"],
    assumptions: ["fixed-ice-categories", "human-operator-present", "deterministic-risk-indexing"],
    gap: "Regulatory framework — defines constraints all deployed systems must satisfy but provides no autonomous decision-making methods; gap between regulations and autonomous implementations unaddressed",
    keyContrib: "IMO framework defining polar ship classes, POLARIS risk indexing, and operational limits; baseline compliance requirement for any deployed Arctic MASS",
  },
    // ── CONVOY & FLEET OPERATIONS ──────────────────────────────────────────
  {
    id: "zhang2019convoy",
    short: "Zhang et al. 2019",
    title: "Multi-Ship Following Model for Icebreaker Convoy Operations",
    year: 2019,
    domainCluster: "Convoy Ops",
    approach: ["empirical", "theory"],
    method: ["physics-model", "data-driven"],
    evaluation: ["real-world"],
    assumptions: ["continuous-icebreaking-conditions", "AIS-data-available", "single-icebreaker-leader"],
    gap: "No communication between ships; deterministic model ignores uncertainty in ice thickness",
    keyContrib: "Car-following adapted for ice convoys; calibrated with AIS + ice model data",
  },
  {
    id: "zhang2020comm",
    short: "Zhang et al. 2020",
    title: "Multi-Ship Following with Inter-Ship Communication in Ice",
    year: 2020,
    domainCluster: "Convoy Ops",
    approach: ["empirical", "theory"],
    method: ["physics-model", "data-driven"],
    evaluation: ["real-world"],
    assumptions: ["communication-available", "linear-stability-sufficient", "following-ships-homogeneous"],
    gap: "Communication model simplified; no autonomous decision-making integrated",
    keyContrib: "Adds v2v communication to ice convoy model; improves stability and speed prediction",
  },

  // ── SHIP MOTION MODELING & CONTROL ────────────────────────────────────
  {
    id: "fossen2021",
    short: "Fossen 2021",
    title: "Handbook of Marine Craft Hydrodynamics and Motion Control",
    year: 2021,
    domainCluster: "Ship Dynamics",
    approach: ["theory"],
    method: ["physics-model"],
    evaluation: ["none"],
    assumptions: ["calm-water-default", "linear-approximations-acceptable"],
    gap: "No ice-water interaction; foundational text not specific to Arctic conditions",
    keyContrib: "6-DOF dynamics framework; reference for all hydrodynamic modeling in field",
  },
  {
    id: "mathioudakis2025",
    short: "Mathioudakis et al. 2025",
    title: "Towards Real-World Validation of a Physics-Based Ship Motion Prediction Model",
    year: 2025,
    domainCluster: "Ship Dynamics",
    approach: ["empirical", "systems"],
    method: ["physics-model"],
    evaluation: ["real-world"],
    assumptions: ["open-water-only", "container-ship-specific", "GPS-data-available"],
    gap: "Open water only; no ice; not validated in Arctic conditions",
    keyContrib: "Physics-based 3D container ship model validated against real voyages",
  },
  {
    id: "papandreou2025",
    short: "Papandreou et al. 2025",
    title: "Interpretable Data-Driven Ship Dynamics Model",
    year: 2025,
    domainCluster: "Ship Dynamics",
    approach: ["empirical", "systems"],
    method: ["learning-based", "physics-model"],
    evaluation: ["real-world"],
    assumptions: ["synthetic-training-data", "open-water-only", "3DOF-model"],
    gap: "No ice interaction; 3-DOF only; not applicable to Arctic ice-going vessel dynamics",
    keyContrib: "Physics-constrained data-driven model; 51-57% accuracy improvement over pure physics",
  },
  {
    id: "chen2021resnet",
    short: "Chen & Xiu 2021",
    title: "Generalized Residual Network for Deep Learning of Unknown Dynamical Systems",
    year: 2021,
    domainCluster: "Ship Dynamics",
    approach: ["theory", "empirical"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["sufficient-observation-data", "residual-structure-valid", "chaotic-systems-learnable"],
    gap: "General method, not domain-specific; not validated on ship or ice dynamics",
    keyContrib: "ResNet as model corrector for unknown dynamics; applicable to ship motion learning",
  },
  {
    id: "sheng2025traj",
    short: "Sheng et al. 2025",
    title: "Ship Trajectory Prediction via Dual Attention Diffusion Model",
    year: 2025,
    domainCluster: "Ship Dynamics",
    approach: ["empirical", "systems"],
    method: ["learning-based"],
    evaluation: ["benchmark", "real-world"],
    assumptions: ["AIS-data-available", "open-water-trajectories", "historical-patterns-repeat"],
    gap: "AIS data from open coastal waters; not applicable to ice conditions where trajectories differ fundamentally",
    keyContrib: "Diffusion + dual attention for probabilistic trajectory prediction; outperforms baselines on AIS data",
  },

  // ── AUTONOMOUS NAVIGATION (GENERAL) ───────────────────────────────────
  {
    id: "oturk2022",
    short: "Öztürk et al. 2022",
    title: "Review of Path Planning Algorithms in MASS: Navigation Safety Perspective",
    year: 2022,
    domainCluster: "MASS Navigation",
    approach: ["theory"],
    method: ["survey"],
    evaluation: ["none"],
    assumptions: ["open-water-default", "COLREGS-applicable"],
    gap: "Ice navigation not covered; survey limited to open-water COLREGS scenarios",
    keyContrib: "Systematic review of path planning algorithms for MASS; identifies COLREGS compliance gaps",
  },
  {
    id: "alamoush2025",
    short: "Alamoush & Ölçer 2025",
    title: "Maritime Autonomous Surface Ships: Architecture for Autonomous Navigation",
    year: 2025,
    domainCluster: "MASS Navigation",
    approach: ["systems"],
    method: ["survey"],
    evaluation: ["none"],
    assumptions: ["open-water-default", "sensor-fusion-feasible"],
    gap: "Architecture review only; ice-specific sensing and planning not addressed",
    keyContrib: "GNC architecture review for MASS; sensor fusion and situational awareness framework",
  },
  {
    id: "xue2011",
    short: "Xue et al. 2011",
    title: "Automatic Simulation of Ship Navigation (Potential Field Method)",
    year: 2011,
    domainCluster: "MASS Navigation",
    approach: ["systems", "empirical"],
    method: ["optimization"],
    evaluation: ["benchmark"],
    assumptions: ["static-obstacles-only", "open-water", "no-dynamics"],
    gap: "Static obstacles only; no ice, no dynamic environments; foundational but outdated",
    keyContrib: "Potential field method for ship route-finding and collision avoidance; practical baseline",
  },
  {
    id: "hagen2022",
    short: "Hagen et al. 2022",
    title: "Scenario-Based MPC for COLREGS Compliant Ship Collision Avoidance",
    year: 2022,
    domainCluster: "MASS Navigation",
    approach: ["systems", "theory"],
    method: ["optimization"],
    evaluation: ["benchmark"],
    assumptions: ["other-ship-intent-predictable", "open-water", "finite-action-set"],
    gap: "Open water only; multi-step gains marginal; not applicable to ice obstacle fields",
    keyContrib: "Multi-step SBMPC for COLREGS; shows diminishing returns of additional planning steps",
  },
  {
    id: "menges2024",
    short: "Menges et al. 2024",
    title: "Nonlinear MPC for Enhanced Navigation of Autonomous Surface Vessels",
    year: 2024,
    domainCluster: "MASS Navigation",
    approach: ["systems", "theory"],
    method: ["optimization"],
    evaluation: ["benchmark"],
    assumptions: ["disturbances-estimable", "APF-cost-adequate", "COLREGS-rule-subset"],
    gap: "Simulation only; no ice; disturbance observer limited to wind/wave/current not ice forces",
    keyContrib: "NMPC + APF + disturbance observer; COLREGS-aware with environmental force correction",
  },
  {
    id: "potocnik2025",
    short: "Potočnik 2025",
    title: "MPC for Autonomous Ship Navigation with COLREG Compliance",
    year: 2025,
    domainCluster: "MASS Navigation",
    approach: ["systems"],
    method: ["optimization"],
    evaluation: ["benchmark"],
    assumptions: ["chart-data-available", "open-water", "discrete-COLREG-rules"],
    gap: "Open water and chart-based planning; no ice; rules encode COLREGS not ice regulations",
    keyContrib: "MPC + chart-based path planning with full COLREG compliance",
  },
  {
    id: "tran2025",
    short: "Tran et al. 2025",
    title: "Distributed MPC for Autonomous Ships on Inland Waterways",
    year: 2025,
    domainCluster: "MASS Navigation",
    approach: ["systems", "theory"],
    method: ["optimization"],
    evaluation: ["benchmark"],
    assumptions: ["ships-communicate", "inland-waterways", "convex-geometry"],
    gap: "Inland waterway only; ADMM coordination not tested in ice; ice obstacles are non-communicating",
    keyContrib: "ADMM-based distributed MPC for multi-ship collaborative collision avoidance",
  },
  {
    id: "song2025",
    short: "Song et al. 2025",
    title: "Improved MPC for Path Tracking in Ship Autonomous Berthing",
    year: 2025,
    domainCluster: "MASS Navigation",
    approach: ["systems"],
    method: ["optimization"],
    evaluation: ["benchmark"],
    assumptions: ["calm-water", "known-port-geometry", "no-ice"],
    gap: "Port berthing only; highly specific scenario; no transferability to open Arctic waters",
    keyContrib: "Nonlinear MPC + neural network for berthing path tracking accuracy and stability",
  },
  {
    id: "diamppi2026",
    short: "Zhao et al. 2026",
    title: "DIA-MPPI: Diffusion-Inspired Control for Multi-AUV Path Optimization",
    year: 2026,
    domainCluster: "MASS Navigation",
    approach: ["systems", "empirical"],
    method: ["learning-based", "optimization"],
    evaluation: ["benchmark"],
    assumptions: ["underwater-environment", "AUVs-communicate", "DCPA-TCPA-sufficient-for-risk"],
    gap: "AUV underwater scenario; not validated for surface ships or ice environments",
    keyContrib: "Diffusion annealing in MPPI for better exploration/convergence; dual-metric collision risk",
  },

  // ── REINFORCEMENT LEARNING FOR NAVIGATION ─────────────────────────────
  {
    id: "alam2023",
    short: "Alam et al. 2023",
    title: "AI on the Water: Applying DRL to Autonomous Vessel Navigation",
    year: 2023,
    domainCluster: "RL Navigation",
    approach: ["empirical", "systems"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["3DOF-model", "open-water-obstacles", "KCS-hydrodynamics-available"],
    gap: "Open water only; no ice; static/dynamic obstacles modeled as circles not physical ice floes",
    keyContrib: "DQN for KCS vessel path-following + collision avoidance; demonstrates DRL feasibility",
  },
  {
    id: "jin2025",
    short: "Jin et al. 2025",
    title: "Unmanned Surface Vehicle Navigation: World Model Enhanced RL",
    year: 2025,
    domainCluster: "RL Navigation",
    approach: ["empirical", "systems"],
    method: ["learning-based"],
    evaluation: ["real-world"],
    assumptions: ["disturbances-latent-learnable", "PGM-structure-valid", "lagoon-environment-generalizes"],
    gap: "Tested in lagoon; no ice; disturbance model not trained for ice force dynamics",
    keyContrib: "Latent world model with double features for USV disturbance robustness; field-tested",
  },
  {
    id: "zheng2025",
    short: "Zheng et al. 2025",
    title: "World Model RL for Autonomous Ship Safe Collision Avoidance",
    year: 2025,
    domainCluster: "RL Navigation",
    approach: ["empirical", "systems"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["VAE-latent-space-sufficient", "training-scenarios-representative", "no-ice"],
    gap: "No ice; obstacle model is other ships/buoys not ice floes; real-world gap not tested",
    keyContrib: "VAE + transformer world model + tree search for collision avoidance; reduces real-data need",
  },
  {
    id: "herremans2023",
    short: "Herremans et al. 2023",
    title: "Autonomous Port Navigation Using Model-Based RL",
    year: 2023,
    domainCluster: "RL Navigation",
    approach: ["systems", "empirical"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["ranging-sensors-available", "randomized-training-environments", "port-geometry-static"],
    gap: "Port/inland only; no ice; model-based RL not tested in dynamic natural environments",
    keyContrib: "Model-based RL for complex port navigation; outperforms DWA and model-free RL",
  },
  {
    id: "lesy2024robust",
    short: "Lesy et al. 2024",
    title: "Evaluating Robustness of RL Algorithms for Autonomous Shipping",
    year: 2024,
    domainCluster: "RL Navigation",
    approach: ["empirical"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["IWT-simulator-representative", "disturbances-bounded", "no-ice"],
    gap: "IWT only; robustness to ice-specific disturbances (impact forces, current) untested",
    keyContrib: "SAC more robust than MuZero to env disturbances; systematic RL robustness evaluation",
  },
  {
    id: "lesy2025offline",
    short: "Lesy et al. 2025",
    title: "Robust Offline RL for Autonomous Vessel Navigation",
    year: 2025,
    domainCluster: "RL Navigation",
    approach: ["empirical"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["expert-dataset-available", "IWT-domain", "offline-data-representative"],
    gap: "No ice; offline RL training data from non-Arctic scenarios may not transfer",
    keyContrib: "CQL/BC offline RL achieves online SAC performance; dataset quality analysis",
  },
  {
    id: "vaaler2024",
    short: "Vaaler et al. 2024",
    title: "Modular RL + Predictive Safety Filters for Safe Marine Navigation",
    year: 2024,
    domainCluster: "RL Navigation",
    approach: ["systems", "theory"],
    method: ["learning-based", "optimization"],
    evaluation: ["benchmark"],
    assumptions: ["safety-constraints-known", "Cybership-II-model", "simulated-environment"],
    gap: "Simulation only; safety filter assumes known constraints — ice forces are uncertain and unmodeled",
    keyContrib: "PSF wraps arbitrary RL policy to enforce safety constraints; modular and policy-agnostic",
  },
  {
    id: "vanneste2022",
    short: "Vanneste et al. 2022",
    title: "Safety Aware Path Planning Using Model Predictive RL for Inland Waterways",
    year: 2022,
    domainCluster: "RL Navigation",
    approach: ["systems", "empirical"],
    method: ["learning-based", "optimization"],
    evaluation: ["benchmark"],
    assumptions: ["occupancy-grid-adequate", "static-obstacles", "inland-waterways"],
    gap: "Inland waterways; static obstacles; no dynamic ice or environmental disturbances",
    keyContrib: "MPRL waypoint planner on occupancy grids; outperforms PPO and Frenet planner",
  },
  {
    id: "benchpush2025",
    short: "Zhong et al. 2025 (BenchPush)",
    title: "Bench-Push: Benchmarking Pushing-Based Navigation for Mobile Robots",
    year: 2025,
    domainCluster: "RL Navigation",
    approach: ["systems"],
    method: ["simulation"],
    evaluation: ["benchmark"],
    assumptions: ["simulation-representative", "pushing-adequate-for-ice-interaction", "homogeneous-obstacles"],
    gap: "Benchmark in simulation; real ice-pushing dynamics far more complex than simulated blocks",
    keyContrib: "Unified benchmark for pushing navigation including ice-navigation tasks; novel metrics",
  },

  // ── SIMULATORS, TOOLS & HUMAN FACTORS ─────────────────────────────────
  {
    id: "kong2024sim",
    short: "Kong & Roh 2024",
    title: "Ship Navigation Simulator for Virtual Data Generation",
    year: 2024,
    domainCluster: "Tools & HF",
    approach: ["systems"],
    method: ["simulation"],
    evaluation: ["case-study"],
    assumptions: ["VR-physics-representative", "sensor-models-accurate", "no-ice-physics"],
    gap: "No ice physics in simulator; cannot generate Arctic training data",
    keyContrib: "VR-based ship simulator generating AIS + camera data; scalable sensor validation",
  },
  {
    id: "rahmawati2025",
    short: "Rahmawati et al. 2025",
    title: "AIS Data and Ship Simulator Integration in Maritime Safety: A Review",
    year: 2025,
    domainCluster: "Tools & HF",
    approach: ["human-centered"],
    method: ["survey"],
    evaluation: ["none"],
    assumptions: ["AIS-data-complete", "simulators-realistic"],
    gap: "Survey only; ice-specific AIS patterns and simulator integration unexplored",
    keyContrib: "Systematic review of AIS + simulator use in safety; taxonomy of research areas",
  },
  {
    id: "zhang2025xai",
    short: "Zhang & Xu 2025",
    title: "Explainable AI for MASS: Adaptive Interfaces and Human-AI Collaboration",
    year: 2025,
    domainCluster: "Tools & HF",
    approach: ["human-centered", "systems"],
    method: ["survey"],
    evaluation: ["none"],
    assumptions: ["shore-based-operators-sufficient", "transparency-improves-safety", "no-ice-context"],
    gap: "No ice-specific transparency needs addressed; Arctic operator scenarios unexplored",
    keyContrib: "Synthesis of 100 XAI/transparency studies for MASS; GNC-stack transparency framework",
  },
  {
    id: "nwm2025",
    short: "Bar et al. 2025",
    title: "Navigation World Models (LeCun)",
    year: 2025,
    domainCluster: "Tools & HF",
    approach: ["empirical", "theory"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["egocentric-video-generalizes", "visual-planning-transferable", "no-ice-domain"],
    gap: "General navigation — not maritime; not tested in ice; visual priors from non-Arctic domains",
    keyContrib: "1B-param diffusion transformer predicting future visual observations for trajectory planning",
  },
  {
    id: "navgpt2025",
    short: "Ma et al. 2025",
    title: "Navigation-GPT: LLMs for Navigation Applications",
    year: 2025,
    domainCluster: "Tools & HF",
    approach: ["systems", "empirical"],
    method: ["learning-based"],
    evaluation: ["benchmark"],
    assumptions: ["LLM-knowledge-sufficient", "COLREGs-formalizable-in-text", "no-ice-rules"],
    gap: "No ice-specific regulations encoded; Arctic routing rules not in COLREGS scope",
    keyContrib: "Dual-core LLM for navigation; ReAct prompting + fine-tuned COLREGS model",
  },
];

// ─── DIMENSION DEFINITIONS ───────────────────────────────────────────────────
const APPROACHES = {
  theory: { label: "Theory", color: "#7C83FD", desc: "Formal/analytical contributions" },
  empirical: { label: "Empirical", color: "#FC5C7D", desc: "Data/experiment driven" },
  systems: { label: "Systems", color: "#43E97B", desc: "Built and deployed artifacts" },
  "human-centered": { label: "Human-Centered", color: "#FA8231", desc: "User/operator focus" },
};

const METHODS = {
  "physics-model": { label: "Physics Model", color: "#4FACFE" },
  "learning-based": { label: "Learning-Based", color: "#F953C6" },
  optimization: { label: "Optimization", color: "#43CBFF" },
  simulation: { label: "Simulation", color: "#9708CC" },
  "data-driven": { label: "Data-Driven", color: "#FF6B6B" },
  "data-assimilation": { label: "Data Assimilation", color: "#FFE66D" },
  "static-analysis": { label: "Static Analysis", color: "#A8EDEA" },
  "remote-sensing": { label: "Remote Sensing", color: "#96FBC4" },
  survey: { label: "Survey", color: "#B8C6DB" },
};

const EVALUATIONS = {
  "real-world": { label: "Real-World", color: "#00B09B" },
  benchmark: { label: "Benchmark/Sim", color: "#96C93D" },
  "case-study": { label: "Case Study", color: "#F7971E" },
  none: { label: "No Evaluation", color: "#555" },
};

const ASSUMPTIONS = {
  "no-ice": { label: "No Ice", color: "#FF4757", critical: true },
  "open-water": { label: "Open Water", color: "#FF6B81", critical: true },
  "known-ice-parameters": { label: "Known Ice Params", color: "#FFA502" },
  "level-ice-only": { label: "Level Ice Only", color: "#FF6348" },
  "no-real-time": { label: "No Real-Time", color: "#747D8C" },
  "simulation-only": { label: "Sim Only", color: "#57606F" },
  "AIS-data-available": { label: "AIS Available", color: "#2ED573" },
  "large-scale-only": { label: "Large Scale Only", color: "#5352ED" },
};

const DOMAIN_COLORS = {
  "Ice Physics": "#4FC3F7",
  "Ship-Ice Interaction": "#FF8A65",
  "Ice Navigation": "#81C784",
  "Convoy Ops": "#CE93D8",
  "Ship Dynamics": "#FFD54F",
  "MASS Navigation": "#4DB6AC",
  "RL Navigation": "#F48FB1",
  "Tools & HF": "#A5D6A7",
};

// ─── IDENTIFIED GAPS (from matrix analysis) ──────────────────────────────────
const gaps = [
  {
    id: "g1",
    title: "No Real-World Arctic RL Evaluation",
    severity: "critical",
    description: "Every RL paper is tested in simulation or inland waterways. Zero RL approaches are validated in actual ice-covered Arctic conditions. This is the largest validation gap in the entire matrix.",
    affectedClusters: ["RL Navigation", "Ice Navigation"],
    papersCount: 9,
  },
  {
    id: "g2",
    title: "Ice Forecasts → Navigation Planning Disconnect",
    severity: "critical",
    description: "IceNet (Andersson 2021) and the Durand 2024 surrogate provide fast, accurate sea ice forecasts, yet no navigation planner in this set consumes them as input. The prediction–planning interface is the dominant unaddressed integration gap.",
    affectedClusters: ["Ice Physics", "Ice Navigation", "RL Navigation"],
    papersCount: 7,
  },
  {
    id: "g3",
    title: "ANN Ice Resistance Not Used in Planners",
    severity: "critical",
    description: "Kim et al. 2020 provides a fast ANN for real-time ice resistance prediction — exactly what a path planner needs. Yet no planner in this set uses it as a cost function. DEM models (Liu, Jou, Wang) are too slow for real-time use; the ANN bridge exists but is not connected.",
    affectedClusters: ["Ship-Ice Interaction", "Ice Navigation"],
    papersCount: 10,
  },
  {
    id: "g4",
    title: "Ship Dynamics Models Exclude Ice Forces",
    severity: "major",
    description: "All ship dynamics models (Fossen, Mathioudakis, Papandreou) are validated in open water only. No physics-based 6-DOF motion model incorporates ice resistance — the Kim 2020 ANN and DEM results are never fed back into motion prediction.",
    affectedClusters: ["Ship Dynamics"],
    papersCount: 5,
  },
  {
    id: "g5",
    title: "Regulatory Compliance Gap for Autonomous Systems",
    severity: "major",
    description: "The Polar Code defines mandatory constraints (ice classes, POLARIS limits) for all Arctic vessels. POLARIS is used in Lee 2021 for routing but no RL or MASS navigation paper encodes Polar Code compliance. Any deployed system must satisfy these rules, yet they are invisible in the ML/RL cluster.",
    affectedClusters: ["Ice Navigation", "RL Navigation", "MASS Navigation"],
    papersCount: 2,
  },
  {
    id: "g6",
    title: "Uncertainty-Aware Planning Under-Explored",
    severity: "major",
    description: "Choi 2015 formulates Arctic routing as a stochastic problem using ensemble ice models, but this foundational framing is largely ignored by subsequent RL and MPC planners which assume deterministic ice states. Probabilistic ice forecasts (IceNet, Durand) exist but are not consumed by planners that could exploit them.",
    affectedClusters: ["Ice Navigation", "RL Navigation", "Ice Physics"],
    papersCount: 3,
  },
  {
    id: "g7",
    title: "Broken Ice Fields Under-Addressed by RL",
    severity: "major",
    description: "Only AUTO-IceNav and Zhong 2025 directly address broken ice fields. RL methods treat ice as generic circular obstacles without modeling floe dynamics, pushing forces, or structural loading. Bench-Push begins to address this but only in simulation.",
    affectedClusters: ["RL Navigation", "Ice Navigation"],
    papersCount: 3,
  },
  {
    id: "g8",
    title: "Offline RL + Arctic Voyage Data Unexplored",
    severity: "opportunity",
    description: "Offline RL (Lesy 2025) enables training without risky real-world ice interaction. Arctic AIS voyage logs combined with ice model data (ECCO, IceNet) could form the offline dataset. No paper attempts this combination, yet the ingredients exist across the matrix.",
    affectedClusters: ["RL Navigation", "Ice Physics"],
    papersCount: 2,
  },
  {
    id: "g9",
    title: "Convoy Operations Not Automated",
    severity: "opportunity",
    description: "Zhang 2019/2020 describe convoy following dynamics empirically but produce no autonomous decision policy. POLARIS-based routing (Lee 2021) optimizes a single ship. No system jointly optimizes icebreaker-convoy speed, spacing, and route under dynamic ice conditions.",
    affectedClusters: ["Convoy Ops", "RL Navigation", "Ice Navigation"],
    papersCount: 3,
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
function SynthesisMatrix() {
  const [activeView, setActiveView] = useState("matrix"); // matrix | affinity | gaps
  const [filterApproach, setFilterApproach] = useState(null);
  const [filterMethod, setFilterMethod] = useState(null);
  const [filterEval, setFilterEval] = useState(null);
  const [filterCluster, setFilterCluster] = useState(null);
  const [hoveredPaper, setHoveredPaper] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const filteredPapers = useMemo(() => papers.filter(p => {
    if (filterApproach && !p.approach.includes(filterApproach)) return false;
    if (filterMethod && !p.method.includes(filterMethod)) return false;
    if (filterEval && !p.evaluation.includes(filterEval)) return false;
    if (filterCluster && p.domainCluster !== filterCluster) return false;
    return true;
  }), [filterApproach, filterMethod, filterEval, filterCluster]);

  const selected = selectedPaper ? papers.find(p => p.id === selectedPaper) : null;

  return (
    <div style={{ minHeight:"100vh", background:"#0b0d14", color:"#dde3ef", fontFamily:"'IBM Plex Mono', 'Courier New', monospace", fontSize:13 }}>
      {/* TOP BAR */}
      <div style={{ background:"#10131e", borderBottom:"1px solid #1e2535", padding:"20px 32px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:4, color:"#4FC3F7", textTransform:"uppercase", marginBottom:4 }}>
              Synthesis Matrix · {papers.length} Papers · 4 Dimensions · 9 Gaps
            </div>
            <h1 style={{ margin:0, fontSize:"clamp(14px,2vw,22px)", fontFamily:"'Georgia',serif", color:"#f0f4ff", fontWeight:700 }}>
              Autonomous Navigation in Ice-Covered Arctic Waters
            </h1>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {[["matrix","Matrix"],["affinity","Affinity Map"],["gaps","Gap Analysis"]].map(([v,l]) => (
              <button key={v} onClick={()=>setActiveView(v)} style={{
                background: activeView===v ? "rgba(79,195,247,0.15)" : "transparent",
                border: `1px solid ${activeView===v ? "#4FC3F7" : "#2a3040"}`,
                borderRadius:5, color: activeView===v ? "#4FC3F7" : "#5a6a7a",
                padding:"7px 16px", cursor:"pointer", fontFamily:"inherit", fontSize:11,
                letterSpacing:1, textTransform:"uppercase",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:"24px 32px", maxWidth:1500, margin:"0 auto" }}>

        {/* ── MATRIX VIEW ─────────────────────────────────────────────── */}
        {activeView === "matrix" && (
          <>
            {/* FILTERS */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
              <FilterChips label="Approach" options={Object.entries(APPROACHES).map(([k,v])=>({k,label:v.label,color:v.color}))} active={filterApproach} onToggle={k => setFilterApproach(filterApproach===k?null:k)} />
              <FilterChips label="Method" options={Object.entries(METHODS).map(([k,v])=>({k,label:v.label,color:v.color}))} active={filterMethod} onToggle={k => setFilterMethod(filterMethod===k?null:k)} />
              <FilterChips label="Evaluation" options={Object.entries(EVALUATIONS).map(([k,v])=>({k,label:v.label,color:v.color}))} active={filterEval} onToggle={k => setFilterEval(filterEval===k?null:k)} />
              <FilterChips label="Cluster" options={Object.keys(DOMAIN_COLORS).map(k=>({k,label:k,color:DOMAIN_COLORS[k]}))} active={filterCluster} onToggle={k => setFilterCluster(filterCluster===k?null:k)} />
              {(filterApproach||filterMethod||filterEval||filterCluster) && (
                <button onClick={()=>{setFilterApproach(null);setFilterMethod(null);setFilterEval(null);setFilterCluster(null)}} style={{ background:"rgba(255,71,87,0.15)", border:"1px solid rgba(255,71,87,0.4)", borderRadius:4, color:"#FF4757", padding:"5px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:11 }}>
                  Clear ({filteredPapers.length}/{papers.length})
                </button>
              )}
            </div>

            {/* TABLE - scrollable container so sticky header works correctly */}
            <div style={{ maxHeight:"calc(100vh - 280px)", overflow:"auto", overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", width:"100%", fontSize:11 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width:160, textAlign:"left", position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 0 0 #1e2535" }}>Paper</th>
                    <th style={{ ...thStyle, width:70, position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 0 0 #1e2535" }}>Year</th>
                    <th style={{ ...thStyle, width:120, position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 0 0 #1e2535" }}>Domain Cluster</th>
                    <th style={{ ...thStyle, width:160, position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 0 0 #1e2535" }}>Approach</th>
                    <th style={{ ...thStyle, width:180, position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 0 0 #1e2535" }}>Method</th>
                    <th style={{ ...thStyle, width:130, position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 0 0 #1e2535" }}>Evaluation</th>
                    <th style={{ ...thStyle, width:220, position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 0 0 #1e2535" }}>Key Assumptions</th>
                    <th style={{ ...thStyle, width:280, position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 0 0 #1e2535" }}>Research Gap / Opportunity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPapers.map((p, i) => {
                    const isHovered = hoveredPaper === p.id;
                    const isSelected = selectedPaper === p.id;
                    return (
                      <tr key={p.id}
                        onMouseEnter={()=>setHoveredPaper(p.id)}
                        onMouseLeave={()=>setHoveredPaper(null)}
                        onClick={()=>setSelectedPaper(selectedPaper===p.id?null:p.id)}
                        style={{
                          background: isSelected ? "rgba(79,195,247,0.08)" : isHovered ? "rgba(255,255,255,0.03)" : i%2===0 ? "#0d0f1a" : "#0b0d14",
                          cursor:"pointer",
                          borderLeft: isSelected ? "3px solid #4FC3F7" : "3px solid transparent",
                          transition:"background 0.15s",
                        }}>
                        <td style={{ ...tdStyle, fontWeight:600, color: isSelected ? "#4FC3F7" : "#dde3ef" }}>
                          {p.short}
                          {isSelected && (
                            <div style={{ fontWeight:400, color:"#6a7a8a", fontSize:10, marginTop:2, maxWidth:150, lineHeight:1.4 }}>{p.keyContrib}</div>
                          )}
                        </td>
                        <td style={{ ...tdStyle, textAlign:"center", color:"#5a6a7a" }}>{p.year}</td>
                        <td style={{ ...tdStyle }}>
                          <span style={{ background:`${DOMAIN_COLORS[p.domainCluster]}20`, color:DOMAIN_COLORS[p.domainCluster], border:`1px solid ${DOMAIN_COLORS[p.domainCluster]}50`, borderRadius:4, padding:"2px 7px", fontSize:10, whiteSpace:"nowrap" }}>
                            {p.domainCluster}
                          </span>
                        </td>
                        <td style={{ ...tdStyle }}>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                            {p.approach.map(a => (
                              <span key={a} style={{ background:`${APPROACHES[a]?.color}25`, color:APPROACHES[a]?.color, border:`1px solid ${APPROACHES[a]?.color}50`, borderRadius:3, padding:"1px 5px", fontSize:10, whiteSpace:"nowrap" }}>{APPROACHES[a]?.label}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ ...tdStyle }}>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                            {p.method.map(m => (
                              <span key={m} style={{ background:`${METHODS[m]?.color}20`, color:METHODS[m]?.color, border:`1px solid ${METHODS[m]?.color}40`, borderRadius:3, padding:"1px 5px", fontSize:10, whiteSpace:"nowrap" }}>{METHODS[m]?.label}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ ...tdStyle }}>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                            {p.evaluation.map(e => (
                              <span key={e} style={{ background:`${EVALUATIONS[e]?.color}20`, color:EVALUATIONS[e]?.color, border:`1px solid ${EVALUATIONS[e]?.color}40`, borderRadius:3, padding:"1px 5px", fontSize:10, whiteSpace:"nowrap" }}>{EVALUATIONS[e]?.label}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color:"#8a9ab0", fontSize:10, lineHeight:1.5 }}>
                          {p.assumptions.slice(0,3).map(a => (
                            <div key={a} style={{ display:"flex", alignItems:"center", gap:4, marginBottom:2 }}>
                              <span style={{ color: ["no-ice","open-water","level-ice-only","no-real-time"].includes(a) ? "#FF4757" : "#5a6a7a" }}>▸</span>
                              <span>{a.replace(/-/g," ")}</span>
                            </div>
                          ))}
                        </td>
                        <td style={{ ...tdStyle, color:"#6a7a8a", fontSize:10, lineHeight:1.5, fontStyle:"italic" }}>
                          {p.gap}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* LEGEND */}
            <div style={{ marginTop:32, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
              {[
                { title:"Approach", items:Object.entries(APPROACHES).map(([k,v])=>({label:v.label,color:v.color,desc:v.desc})) },
                { title:"Method", items:Object.entries(METHODS).map(([k,v])=>({label:v.label,color:v.color})) },
                { title:"Evaluation", items:Object.entries(EVALUATIONS).map(([k,v])=>({label:v.label,color:v.color})) },
              ].map(({ title, items }) => (
                <div key={title} style={{ background:"#10131e", border:"1px solid #1e2535", borderRadius:8, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, letterSpacing:2, color:"#4FC3F7", textTransform:"uppercase", marginBottom:10 }}>{title}</div>
                  {items.map(it => (
                    <div key={it.label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:it.color, flexShrink:0 }} />
                      <span style={{ fontSize:11, color:"#8a9ab0" }}>{it.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── AFFINITY MAP VIEW ────────────────────────────────────────── */}
        {activeView === "affinity" && (
          <div>
            <p style={{ color:"#5a6a7a", fontSize:12, marginBottom:24, lineHeight:1.7 }}>
              Papers clustered simultaneously across 4 affinity dimensions. The same paper appears in multiple groups. Hover a cluster to see its papers. This reveals hidden patterns across domain boundaries.
            </p>

            {/* APPROACH AFFINITY */}
            <AffinitySection title="By Approach" subtitle="What kind of research contribution is this?">
              {Object.entries(APPROACHES).map(([key, { label, color, desc }]) => {
                const pps = papers.filter(p => p.approach.includes(key));
                return (
                  <AffinityCluster key={key} label={label} color={color} desc={desc} papers={pps} />
                );
              })}
            </AffinitySection>

            {/* METHOD AFFINITY */}
            <AffinitySection title="By Method" subtitle="What technique does the paper primarily use?">
              {Object.entries(METHODS).map(([key, { label, color }]) => {
                const pps = papers.filter(p => p.method.includes(key));
                if (pps.length === 0) return null;
                return <AffinityCluster key={key} label={label} color={color} papers={pps} />;
              })}
            </AffinitySection>

            {/* EVALUATION AFFINITY */}
            <AffinitySection title="By Evaluation Strategy" subtitle="How is the contribution validated?">
              {Object.entries(EVALUATIONS).map(([key, { label, color }]) => {
                const pps = papers.filter(p => p.evaluation.includes(key));
                if (pps.length === 0) return null;
                return <AffinityCluster key={key} label={label} color={color} papers={pps} />;
              })}
            </AffinitySection>

            {/* ASSUMPTION AFFINITY */}
            <AffinitySection title="By Critical Assumptions" subtitle="What hidden assumptions limit applicability?">
              {[
                { key:"no-ice", label:"Assumes No Ice / Open Water", color:"#FF4757", filter: p => p.assumptions.some(a=>["no-ice","open-water","calm-water","inland-waterways"].includes(a)) },
                { key:"sim-only", label:"Simulation Only (No Real-World)", color:"#747D8C", filter: p => p.evaluation.every(e=>e==="benchmark"||e==="none") && !p.evaluation.includes("real-world") && !p.evaluation.includes("case-study") },
                { key:"real-world-ice", label:"Validated in Real Ice", color:"#00B09B", filter: p => p.evaluation.includes("real-world") && (p.domainCluster==="Ice Navigation"||p.domainCluster==="Ship-Ice Interaction"||p.domainCluster==="Convoy Ops") },
                { key:"survey-no-impl", label:"Survey / No Implementation", color:"#B8C6DB", filter: p => p.method.includes("survey") },
                { key:"physics-grounded", label:"Physics-Grounded (Not Pure ML)", color:"#4FACFE", filter: p => p.method.includes("physics-model") || p.method.includes("data-assimilation") },
                { key:"learning-only", label:"Pure Learning-Based (No Physics)", color:"#F953C6", filter: p => p.method.includes("learning-based") && !p.method.includes("physics-model") && !p.method.includes("optimization") },
              ].map(({ key, label, color, filter }) => {
                const pps = papers.filter(filter);
                return <AffinityCluster key={key} label={label} color={color} papers={pps} />;
              })}
            </AffinitySection>
          </div>
        )}

        {/* ── GAP ANALYSIS VIEW ────────────────────────────────────────── */}
        {activeView === "gaps" && (
          <div>
            <div style={{ background:"rgba(79,195,247,0.06)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:8, padding:"16px 20px", marginBottom:28, fontSize:13, color:"#8ab0cc", lineHeight:1.8 }}>
              <strong style={{ color:"#4FC3F7" }}>Reading the holes:</strong> Gaps identified by scanning empty cells, uniform patterns, and missing cross-cluster connections in the synthesis matrix. Each hole is a hypothesis for a research problem — not a conclusion. (Slide 23: "Holes are hypothesis for research problems, not conclusions.")
            </div>

            <div style={{ display:"grid", gap:16 }}>
              {gaps.map(g => (
                <div key={g.id} style={{
                  background: g.severity==="critical" ? "rgba(255,71,87,0.06)" : g.severity==="major" ? "rgba(255,165,2,0.06)" : "rgba(67,233,123,0.06)",
                  border: `1px solid ${g.severity==="critical" ? "rgba(255,71,87,0.3)" : g.severity==="major" ? "rgba(255,165,2,0.3)" : "rgba(67,233,123,0.3)"}`,
                  borderRadius:10,
                  padding:"20px 24px",
                }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{
                        background: g.severity==="critical" ? "rgba(255,71,87,0.2)" : g.severity==="major" ? "rgba(255,165,2,0.2)" : "rgba(67,233,123,0.2)",
                        color: g.severity==="critical" ? "#FF4757" : g.severity==="major" ? "#FFA502" : "#43E97B",
                        border: `1px solid ${g.severity==="critical" ? "rgba(255,71,87,0.5)" : g.severity==="major" ? "rgba(255,165,2,0.5)" : "rgba(67,233,123,0.5)"}`,
                        borderRadius:4, padding:"2px 8px", fontSize:10, letterSpacing:1, textTransform:"uppercase",
                      }}>{g.severity}</span>
                      <h3 style={{ margin:0, fontSize:15, color:"#dde3ef", fontFamily:"'Georgia',serif" }}>{g.title}</h3>
                    </div>
                  </div>
                  <p style={{ margin:"0 0 12px", fontSize:13, color:"#8a9ab0", lineHeight:1.7 }}>{g.description}</p>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {g.affectedClusters.map(c => (
                      <span key={c} style={{ background:`${DOMAIN_COLORS[c]}20`, color:DOMAIN_COLORS[c], border:`1px solid ${DOMAIN_COLORS[c]}40`, borderRadius:4, padding:"2px 8px", fontSize:10 }}>{c}</span>
                    ))}
                    <span style={{ color:"#4a5568", fontSize:11, alignSelf:"center" }}>— {g.papersCount} papers implicated</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12, marginTop:32 }}>
              {[
                { label:"Papers with real-world validation", value: papers.filter(p=>p.evaluation.includes("real-world")).length, color:"#00B09B" },
                { label:"Papers assuming open water / no ice", value: papers.filter(p=>p.assumptions.some(a=>["no-ice","open-water","calm-water"].includes(a))).length, color:"#FF4757" },
                { label:"Learning-based papers", value: papers.filter(p=>p.method.includes("learning-based")).length, color:"#F953C6" },
                { label:"Survey / no implementation", value: papers.filter(p=>p.method.includes("survey")).length, color:"#747D8C" },
                { label:"Tested in ice specifically", value: papers.filter(p=>p.evaluation.includes("real-world") && ["Ice Navigation","Ship-Ice Interaction","Convoy Ops"].includes(p.domainCluster)).length, color:"#4FC3F7" },
                { label:"Physics-grounded methods", value: papers.filter(p=>p.method.includes("physics-model")).length, color:"#4FACFE" },
              ].map(s => (
                <div key={s.label} style={{ background:"#10131e", border:`1px solid ${s.color}30`, borderRadius:8, padding:"16px 18px" }}>
                  <div style={{ fontSize:28, fontWeight:700, color:s.color, fontFamily:"'Georgia',serif" }}>{s.value}</div>
                  <div style={{ fontSize:11, color:"#5a6a7a", lineHeight:1.5, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
const thStyle = {
  padding:"10px 12px", textAlign:"left", fontWeight:600, fontSize:10,
  letterSpacing:1, textTransform:"uppercase", color:"#4a5568",
  borderBottom:"1px solid #1e2535", borderRight:"1px solid #1e2535",
  background:"#10131e",
};
const tdStyle = {
  padding:"8px 12px", verticalAlign:"top",
  borderBottom:"1px solid #14172a", borderRight:"1px solid #14172a",
};

function FilterChips({ label, options, active, onToggle }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
      <span style={{ fontSize:10, color:"#4a5568", letterSpacing:1, textTransform:"uppercase" }}>{label}:</span>
      {options.map(({ k, label, color }) => (
        <button key={k} onClick={() => onToggle(k)} style={{
          background: active===k ? `${color}25` : "transparent",
          border: `1px solid ${active===k ? color : "#2a3040"}`,
          borderRadius:4, color: active===k ? color : "#4a5568",
          padding:"3px 8px", cursor:"pointer", fontFamily:"inherit", fontSize:10,
          transition:"all 0.15s",
        }}>{label}</button>
      ))}
    </div>
  );
}

function AffinitySection({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom:40 }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:16, fontFamily:"'Georgia',serif", color:"#dde3ef", marginBottom:4 }}>{title}</div>
        <div style={{ fontSize:11, color:"#4a5568" }}>{subtitle}</div>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
        {children}
      </div>
    </div>
  );
}

function AffinityCluster({ label, color, desc, papers }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background:`${color}08`, border:`1px solid ${color}30`,
      borderRadius:8, padding:"12px 16px", minWidth:200, flex:"1 1 200px", maxWidth:340,
      cursor:"pointer", transition:"all 0.2s",
    }} onClick={()=>setOpen(!open)}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ color, fontWeight:700, fontSize:13 }}>{label}</span>
        <span style={{ background:`${color}20`, color, borderRadius:12, padding:"1px 8px", fontSize:11 }}>{papers.length}</span>
      </div>
      {desc && <div style={{ fontSize:10, color:"#4a5568", marginBottom:8 }}>{desc}</div>}
      {open && (
        <div style={{ marginTop:8, paddingTop:8, borderTop:`1px solid ${color}20` }}>
          {papers.map(p => (
            <div key={p.id} style={{ fontSize:10, color:"#8a9ab0", marginBottom:5, lineHeight:1.4 }}>
              <span style={{ color:`${DOMAIN_COLORS[p.domainCluster]}`, marginRight:5 }}>▸</span>
              <span style={{ color:"#aab0bc" }}>{p.short}</span>
              <span style={{ color:"#4a5568" }}> · {p.domainCluster}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SynthesisMatrix />);
