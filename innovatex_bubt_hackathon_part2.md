**Hackathon Project Brief – Part 2 (Onsite 10-Hour Challenge) ![](Aspose.Words.caa13031-6afd-4d00-b31f-1db20410446b.001.png)**

**SDG 2 & SDG 12:** AI-Powered Food Management & Sustainability Platform 

**Context** 

This document is to be shared ONLY at the start of the 10-hour onsite hackathon. It builds directly on top of the Part 1 base project. Teams are expected to extend their existing platform into an intelligent, impactful solution that uses AI to reduce hunger, promote food security, and encourage responsible consumption in alignment with SDG 2 and SDG 12. 

**Objective for Part 2** 

**Upgrade your Part 1 platform into a meaningful AI-assisted sustainability tool that:** 

- Analyzes user consumption patterns, 
- Predicts waste and nutrient gaps, 
- Optimizes meal plans and budgets, 
- Provides alerts and mentorship via a chatbot, 
- Generates personalized impact analytics, 
- Optionally connects to local sharing opportunities. 

**All features must be implemented in a realistic, technically sound manner using actual logic, AI APIs, or open-source tools.** 

**PART 2 – CORE REQUIREMENTS (ONSITE)** 

1. **AI Consumption Pattern Analyzer (Advanced)** 
- Extend logging to identify weekly trends from user data (e.g., high fruit intake on weekends). 
- Detect over-consumption or under-consumption in categories. 
- Predict items likely to be wasted in 3–7 days using user patterns (simple formulas or LLM reasoning). 
- Flag imbalanced patterns (e.g., low veggies). 
- Generate heatmap-style data insights (JSON output; UI optional for visualization). 
2. **AI Meal Optimization Engine** 
- Optimize a weekly meal plan to fit the user’s budget. 
- Prioritize using available inventory items to reduce waste. 
- Ensure minimum nutrition requirements (use dummy nutrient rules). 
- Suggest alternatives based on local cost data (dummy dataset allowed). 
- Provide a shopping list with estimated costs. 
- Implementation options: Rule-based logic enhanced with LLMs for optimization. 


5. **AI Waste Estimation Model** 
- Estimate wasted grams or money lost from patterns. 
- Show weekly and monthly projections. 
- Compare to community averages (use dummy dataset). 
- Implementation options: Simple predictive formulas or ML APIs. 

7. **SDG Impact Scoring Engine** 
- Use AI to evaluate user progress in waste reduction and nutrition improvement. 
- Output a “Personal SDG Score” (e.g., 0–100 scale). 
- Generate weekly insights on improvements. 
- Provide actionable next steps (e.g., “Focus on veggies to boost score by 10%”). 

**BONUS FEATURES (Choose at least one to implement)**

1. **Local Food Surplus / Sharing Opportunities** 
- Integrate dummy or real data for discovering surplus food nearby 
- Could include a map view, listing view, or simple matching system 
2. **Nutrient Gap Prediction** 
- Analyze user consumption history 
- Predict likely nutrient deficiencies 
- Suggest foods/meals to fill the gaps 
3. **Admin Panel** 
- Manage seeded data (foods, nutrients, categories, etc.) 
- View analytics such as active users, popular foods, nutrient trends 
4. **Multi-Language Support** 
- Add support for at least one more language (e.g., Spanish, French, Tagalog, etc.) 
- Could include UI translation files, localized strings, or dynamic language switching 

**Notes for Teams** 

- Focus first on getting a reliable, end-to-end experience working. 
- Use AI thoughtfully: quality is more important than buzzwords. 
- All external services used must be clearly documented in your README. 
