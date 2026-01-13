# FoodLink - Scrum Backlog
## Feature Development Focus

**Total Epics:** 5  
**Total Sprints:** 3  
**Focus:** Feature Development Only (No Bugs, DevOps, or Documentation)

---

## 📊 Sprint Distribution

| Sprint | Epics | Total Story Points | Focus Areas |
|--------|-------|-------------------|-------------|
| **Sprint 1** | Epic 1, Epic 2 (Part 1) | 25 | Authentication, Family Dashboard, Inventory Core |
| **Sprint 2** | Epic 2 (Part 2), Epic 3 | 35 | Inventory Advanced, Shopping, Restaurant, Shop |
| **Sprint 3** | Epic 4, Epic 5 | 31 | NGO, Community, AI Features, Analytics |

**Total Story Points:** 100

---

# EPIC 1: User Authentication & Role Management
**Sprint:** Sprint 1  
**Story Points:** 12  
**Priority:** Critical

## Story 1.1: Authentication System Implementation
**Story Points:** 7  
**Priority:** Critical  
**Sprint:** Sprint 1

### Description
Implement complete authentication system with JWT token management, role-based access control, and secure session handling.

### Tasks
1. **Setup JWT Authentication Service** (2 points)
   - **Sub-task 1.1.1:** Create auth service module with login, register, logout functions
   - **Sub-task 1.1.2:** Implement token refresh mechanism
   - **Sub-task 1.1.3:** Add token expiration handling
   - **Location:** `src/modules/auth/auth.service.ts`

2. **Implement Protected Routes** (2 points)
   - **Sub-task 1.1.4:** Create route protection middleware
   - **Sub-task 1.1.5:** Add role-based route guards
   - **Sub-task 1.1.6:** Implement redirect logic for unauthorized access
   - **Location:** `src/app/middleware.ts` or `src/lib/auth-guard.ts`

3. **User Store Integration** (1 point)
   - **Sub-task 1.1.7:** Integrate authentication with Zustand user store
   - **Sub-task 1.1.8:** Add user state management (logged in, role, profile)
   - **Sub-task 1.1.9:** Implement auto-logout on token expiration
   - **Location:** `src/store/user.store.ts`

### Acceptance Criteria
- [ ] Users can register with email/password
- [ ] Users can login and receive JWT token
- [ ] Protected routes redirect to login if not authenticated
- [ ] Role-based access control works correctly
- [ ] Token refresh works automatically
- [ ] Logout clears all user data

---

## Story 1.3: Role Selection & Navigation
**Story Points:** 5  
**Priority:** High  
**Sprint:** Sprint 1

### Description
Implement role selection page and role-based navigation system with proper routing.

### Tasks
1. **Role Selection Page** (2 points)
   - **Sub-task 1.3.1:** Create role selection UI with role cards
   - **Sub-task 1.3.2:** Implement role selection logic
   - **Sub-task 1.3.3:** Store selected role in Zustand store
   - **Location:** `src/app/role-selection/page.tsx`, `src/components/role-selection/`

2. **Role-Based Navigation** (2 points)
   - **Sub-task 1.3.4:** Create navigation components for each role
   - **Sub-task 1.3.5:** Implement sidebar navigation
   - **Sub-task 1.3.6:** Add active route highlighting
   - **Location:** `src/components/shared/Navbar.tsx`, role-specific navbars

3. **Route Protection by Role** (1 point)
   - **Sub-task 1.3.7:** Add role-based route guards
   - **Sub-task 1.3.8:** Redirect users to appropriate dashboard based on role
   - **Sub-task 1.3.9:** Handle role switching
   - **Location:** `src/app/(dashboard)/layout.tsx`

### Acceptance Criteria
- [ ] Users can select their role after login
- [ ] Navigation shows only relevant routes for selected role
- [ ] Users are redirected to correct dashboard based on role
- [ ] Role switching works seamlessly

---

# EPIC 2: Family Dashboard & Inventory Management
**Sprint:** Sprint 1 (Part 1), Sprint 2 (Part 2)  
**Story Points:** 37  
**Priority:** Critical

## Story 2.1: Family Dashboard Implementation
**Story Points:** 5  
**Priority:** Critical  
**Sprint:** Sprint 1

### Description
Create comprehensive family dashboard with inventory summary, expiring items alerts, XP tracking, and quick access widgets.

### Tasks
1. **Dashboard Layout & Structure** (2 points)
   - **Sub-task 2.1.1:** Create dashboard page layout
   - **Sub-task 2.1.2:** Implement responsive grid system
   - **Sub-task 2.1.3:** Add dashboard header with user info
   - **Location:** `src/app/(dashboard)/family/page.tsx`

2. **Inventory Summary Widget** (1 point)
   - **Sub-task 2.1.4:** Display total items count
   - **Sub-task 2.1.5:** Show items by category breakdown
   - **Sub-task 2.1.6:** Add quick stats cards
   - **Location:** `src/components/family/InventorySummary.tsx`

3. **Expiring Items Alert Widget** (1 point)
   - **Sub-task 2.1.7:** List items expiring in next 3 days
   - **Sub-task 2.1.8:** Add urgency indicators (color coding)
   - **Sub-task 2.1.9:** Implement "Use Now" quick actions
   - **Location:** `src/components/family/ExpiringSoonList.tsx`

4. **XP Progress & Gamification Widget** (1 point)
   - **Sub-task 2.1.10:** Display current XP and level
   - **Sub-task 2.1.11:** Show progress bar to next level
   - **Sub-task 2.1.12:** Add recent achievements/badges
   - **Location:** `src/components/family/XPProgressBar.tsx`, `src/components/family/BadgeShowcase.tsx`

### Acceptance Criteria
- [ ] Dashboard loads with real-time data
- [ ] All widgets are responsive and functional
- [ ] Expiring items show correct urgency levels
- [ ] XP progress updates in real-time
- [ ] Quick actions work correctly

---

## Story 2.2: Inventory Management System
**Story Points:** 8  
**Priority:** Critical  
**Sprint:** Sprint 1

### Description
Build complete inventory management system with add, edit, delete, category organization, and expiry tracking.

### Tasks
1. **Inventory List View** (2 points)
   - **Sub-task 2.2.1:** Create inventory item list component
   - **Sub-task 2.2.2:** Implement category filtering
   - **Sub-task 2.2.3:** Add search functionality
   - **Location:** `src/app/(dashboard)/family/inventory/page.tsx`

2. **Add/Edit Inventory Item** (2 points)
   - **Sub-task 2.2.4:** Create inventory item form
   - **Sub-task 2.2.5:** Add form validation with Zod
   - **Sub-task 2.2.6:** Implement item creation/editing
   - **Location:** `src/components/family/InventoryAddDrawer.tsx`

3. **Inventory Item Card Component** (1 point)
   - **Sub-task 2.2.7:** Design item card with expiry date, quantity, category
   - **Sub-task 2.2.8:** Add quick actions (edit, delete, consume)
   - **Sub-task 2.2.9:** Implement visual expiry indicators
   - **Location:** `src/components/family/InventoryItemCard.tsx`

4. **Consumption Logging** (2 points)
   - **Sub-task 2.2.10:** Create consumption log form
   - **Sub-task 2.2.11:** Track consumption history
   - **Sub-task 2.2.12:** Update inventory quantities automatically
   - **Location:** `src/components/family/RecentLogs.tsx`

5. **Inventory Store Integration** (1 point)
   - **Sub-task 2.2.13:** Integrate with inventory Zustand store
   - **Sub-task 2.2.14:** Add inventory CRUD operations
   - **Sub-task 2.2.15:** Implement local state management
   - **Location:** `src/store/inventory.store.ts`

### Acceptance Criteria
- [ ] Users can add items with all required fields
- [ ] Items can be edited and deleted
- [ ] Category filtering works correctly
- [ ] Search finds items by name
- [ ] Consumption logging updates inventory
- [ ] Expiry dates are tracked and displayed

---

## Story 2.4: Shopping List Module
**Story Points:** 5  
**Priority:** Medium  
**Sprint:** Sprint 2

### Description
Create shopping list feature with smart suggestions, price comparison, and bulk buying opportunities.

### Tasks
1. **Shopping List UI** (2 points)
   - **Sub-task 2.4.1:** Create shopping list page
   - **Sub-task 2.4.2:** Add item management (add, remove, check off)
   - **Sub-task 2.4.3:** Implement list persistence
   - **Location:** `src/app/shopping/page.tsx`

2. **Smart Shopping Suggestions** (2 points)
   - **Sub-task 2.4.4:** Generate suggestions based on inventory
   - **Sub-task 2.4.5:** Show items running low
   - **Sub-task 2.4.6:** Suggest based on consumption patterns
   - **Location:** `src/components/family/SmartShoppingWidget.tsx`

3. **Price Comparison Widget** (1 point)
   - **Sub-task 2.4.7:** Display price comparison across shops
   - **Sub-task 2.4.8:** Show bulk buying opportunities
   - **Sub-task 2.4.9:** Add budget tracking
   - **Location:** `src/components/family/ShoppingPriceCompare.tsx`, `src/components/family/BulkBuyOpportunities.tsx`

### Acceptance Criteria
- [ ] Users can create and manage shopping lists
- [ ] Smart suggestions are relevant
- [ ] Price comparison shows accurate data
- [ ] Bulk buying opportunities are highlighted
- [ ] Lists persist across sessions

---

## Story 2.5: Meal Planner & Nutrition Tracking
**Story Points:** 13  
**Priority:** High  
**Sprint:** Sprint 2

### Description
Build meal planning calendar with recipe suggestions and nutrition tracking features.

### Tasks
1. **Meal Planner Calendar** (5 points)
   - **Sub-task 2.5.1:** Create weekly meal calendar component
   - **Sub-task 2.5.2:** Add meal scheduling functionality
   - **Sub-task 2.5.3:** Implement drag-and-drop meal assignment
   - **Location:** `src/components/family/WeeklyCalendar.tsx`, `src/components/family/MealPlannerWidget.tsx`

2. **Recipe Suggestions** (3 points)
   - **Sub-task 2.5.4:** Generate recipe suggestions based on inventory
   - **Sub-task 2.5.5:** Show recipes using expiring items
   - **Sub-task 2.5.6:** Display recipe details and ingredients
   - **Location:** `src/components/family/RecipeSuggestions.tsx`

3. **Nutrition Tracking** (5 points)
   - **Sub-task 2.5.7:** Create nutrition tracking dashboard
   - **Sub-task 2.5.8:** Track daily macro and micronutrients
   - **Sub-task 2.5.9:** Display nutrition goals and progress
   - **Sub-task 2.5.10:** Add deficiency alerts
   - **Location:** `src/components/family/nutrition/` components

### Acceptance Criteria
- [ ] Users can plan meals for the week
- [ ] Recipe suggestions are relevant to inventory
- [ ] Nutrition tracking is accurate
- [ ] Goals and progress are displayed clearly
- [ ] Alerts work correctly

---

## Story 2.6: Family Preferences & Settings
**Story Points:** 3  
**Priority:** Medium  
**Sprint:** Sprint 2

### Description
Implement family preferences management and settings configuration.

### Tasks
1. **Family Preferences Form** (2 points)
   - **Sub-task 2.6.1:** Create preferences form component
   - **Sub-task 2.6.2:** Add dietary restrictions selection
   - **Sub-task 2.6.3:** Implement family size and budget settings
   - **Location:** `src/components/family/FamilyPreferencesForm.tsx`

2. **Settings Management** (1 point)
   - **Sub-task 2.6.4:** Create settings page
   - **Sub-task 2.6.5:** Add notification preferences
   - **Sub-task 2.6.6:** Implement data export functionality
   - **Location:** `src/app/settings/page.tsx`

### Acceptance Criteria
- [ ] Users can set family preferences
- [ ] Dietary restrictions are saved and applied
- [ ] Settings persist across sessions
- [ ] Data export works correctly

---

## Story 2.7: Environmental Impact Tracking
**Story Points:** 3  
**Priority:** Medium  
**Sprint:** Sprint 2

### Description
Create environmental impact tracking with CO₂ savings and waste reduction metrics.

### Tasks
1. **Impact Metrics Calculation** (1 point)
   - **Sub-task 2.7.1:** Calculate CO₂ savings from waste reduction
   - **Sub-task 2.7.2:** Track waste reduction metrics
   - **Sub-task 2.7.3:** Compute environmental impact score
   - **Location:** `src/modules/analytics/impact-calculator.service.ts`

2. **Impact Visualization** (2 points)
   - **Sub-task 2.7.4:** Create impact dashboard component
   - **Sub-task 2.7.5:** Display CO₂ savings charts
   - **Sub-task 2.7.6:** Show waste reduction trends
   - **Location:** `src/components/family/EnvironmentalImpact.tsx`

### Acceptance Criteria
- [ ] Impact metrics are calculated accurately
- [ ] Visualizations display correctly
- [ ] Trends are shown over time
- [ ] CO₂ savings are tracked

---

# EPIC 3: Business Stakeholder Features (Restaurant & Shop)
**Sprint:** Sprint 2  
**Story Points:** 20  
**Priority:** High

## Story 3.1: Restaurant Dashboard & Inventory
**Story Points:** 5  
**Priority:** High  
**Sprint:** Sprint 2

### Description
Create restaurant dashboard with inventory management, menu analysis, and surplus tracking.

### Tasks
1. **Restaurant Dashboard** (2 points)
   - **Sub-task 3.1.1:** Create dashboard layout
   - **Sub-task 3.1.2:** Add inventory summary
   - **Sub-task 3.1.3:** Display expiring stock alerts
   - **Sub-task 3.1.4:** Show waste risk indicators
   - **Location:** `src/app/(dashboard)/restaurant/page.tsx`

2. **Restaurant Inventory Management** (2 points)
   - **Sub-task 3.1.5:** Create inventory tracking system
   - **Sub-task 3.1.6:** Add category organization
   - **Sub-task 3.1.7:** Implement expiry date tracking
   - **Sub-task 3.1.8:** Add stock alerts
   - **Location:** `src/components/restaurant/RestaurantInventory.tsx`

3. **Menu Analysis Widget** (1 point)
   - **Sub-task 3.1.9:** Track menu item performance
   - **Sub-task 3.1.10:** Show waste prediction scores
   - **Sub-task 3.1.11:** Identify popular/low-performing items
   - **Location:** `src/components/restaurant/MenuAnalysis.tsx`

### Acceptance Criteria
- [ ] Dashboard displays restaurant-specific metrics
- [ ] Inventory can be managed effectively
- [ ] Expiry alerts work correctly
- [ ] Menu analysis shows accurate data
- [ ] All features are role-specific

---

## Story 3.2: Restaurant Surplus & Donation Management
**Story Points:** 4  
**Priority:** High  
**Sprint:** Sprint 2

### Description
Implement surplus food tracking and donation coordination system for restaurants.

### Tasks
1. **Surplus Management UI** (2 points)
   - **Sub-task 3.2.1:** Create surplus item tracking
   - **Sub-task 3.2.2:** Add donation assignment functionality
   - **Sub-task 3.2.3:** Implement status tracking (pending, assigned, completed)
   - **Location:** `src/components/restaurant/SurplusManagement.tsx`

2. **Donation History** (1 point)
   - **Sub-task 3.2.4:** Display complete donation log
   - **Sub-task 3.2.5:** Show recipient information
   - **Sub-task 3.2.6:** Track donation impact metrics
   - **Location:** `src/components/restaurant/DonationHistory.tsx`

3. **NGO Matching** (1 point)
   - **Sub-task 3.2.7:** Match surplus items with NGO capacity
   - **Sub-task 3.2.8:** Show available NGOs
   - **Sub-task 3.2.9:** Enable donation assignment
   - **Location:** `src/components/restaurant/NGOMatching.tsx`

### Acceptance Criteria
- [ ] Surplus items can be tracked
- [ ] Donations can be assigned to NGOs
- [ ] Status updates work correctly
- [ ] Donation history is accurate
- [ ] NGO matching is functional

---

## Story 3.3: Shop Dashboard & Inventory
**Story Points:** 4  
**Priority:** High  
**Sprint:** Sprint 2

### Description
Build shop dashboard with SKU management, expiry alerts, and surplus queue.

### Tasks
1. **Shop Dashboard** (1 point)
   - **Sub-task 3.3.1:** Create dashboard with SKU count
   - **Sub-task 3.3.2:** Display expiring items today
   - **Sub-task 3.3.3:** Show markdown candidates
   - **Location:** `src/app/(dashboard)/shop/page.tsx`

2. **Shop Inventory Management** (2 points)
   - **Sub-task 3.3.4:** Create SKU tracking system
   - **Sub-task 3.3.5:** Add barcode integration
   - **Sub-task 3.3.6:** Implement stock level monitoring
   - **Location:** `src/components/shop/ShopInventory.tsx`

3. **Expiry Alerts & Markdown Suggestions** (1 point)
   - **Sub-task 3.3.7:** Show items expiring soon
   - **Sub-task 3.3.8:** Suggest markdown prices
   - **Sub-task 3.3.9:** Add priority alerts
   - **Location:** `src/components/shop/ExpiryAlerts.tsx`

### Acceptance Criteria
- [ ] Dashboard shows shop-specific metrics
- [ ] SKU tracking works correctly
- [ ] Expiry alerts are accurate
- [ ] Markdown suggestions are relevant
- [ ] Barcode scanning works (if implemented)

---

## Story 3.4: Shop Surplus & Price Management
**Story Points:** 4  
**Priority:** Medium  
**Sprint:** Sprint 2

### Description
Implement surplus queue management and dynamic pricing for expiring items.

### Tasks
1. **Surplus Queue Management** (1 point)
   - **Sub-task 3.4.1:** Create surplus item queue
   - **Sub-task 3.4.2:** Add status tracking
   - **Sub-task 3.4.3:** Enable destination selection (donation, discount, disposal)
   - **Location:** `src/components/shop/SurplusQueue.tsx`

2. **Price Mapping & Discounts** (2 points)
   - **Sub-task 3.4.4:** Create dynamic price management
   - **Sub-task 3.4.5:** Add discount suggestions for expiring items
   - **Sub-task 3.4.6:** Track price history
   - **Location:** `src/components/shop/PriceMapping.tsx`

3. **Analytics & Reports** (1 point)
   - **Sub-task 3.4.7:** Display waste trends
   - **Sub-task 3.4.8:** Show markdown recovery trends
   - **Sub-task 3.4.9:** Add revenue impact analysis
   - **Location:** `src/components/shop/ShopAnalytics.tsx`

### Acceptance Criteria
- [ ] Surplus queue is manageable
- [ ] Price discounts can be applied
- [ ] Analytics show accurate trends
- [ ] Reports are exportable
- [ ] All features work correctly

---

## Story 3.5: Business Analytics Dashboard
**Story Points:** 3  
**Priority:** Medium  
**Sprint:** Sprint 2

### Description
Create comprehensive analytics dashboard for restaurants and shops with waste trends and revenue impact.

### Tasks
1. **Analytics Data Aggregation** (1 point)
   - **Sub-task 3.5.1:** Aggregate waste data by time period
   - **Sub-task 3.5.2:** Calculate revenue impact from markdowns
   - **Sub-task 3.5.3:** Prepare donation impact metrics
   - **Location:** `src/modules/analytics/business-analytics.service.ts`

2. **Analytics Visualization** (2 points)
   - **Sub-task 3.5.4:** Create waste trends charts
   - **Sub-task 3.5.5:** Display revenue impact graphs
   - **Sub-task 3.5.6:** Show donation contribution metrics
   - **Location:** `src/components/restaurant/BusinessAnalytics.tsx`, `src/components/shop/BusinessAnalytics.tsx`

### Acceptance Criteria
- [ ] Analytics display accurate data
- [ ] Charts are interactive and responsive
- [ ] Trends are clearly visualized
- [ ] Revenue impact is calculated correctly

---

# EPIC 4: NGO Operations & Community Engagement
**Sprint:** Sprint 3  
**Story Points:** 18  
**Priority:** High

## Story 4.1: NGO Dashboard & Donation Management
**Story Points:** 6  
**Priority:** High  
**Sprint:** Sprint 3

### Description
Create comprehensive NGO dashboard with donation offers, capacity management, and pickup scheduling.

### Tasks
1. **NGO Dashboard** (2 points)
   - **Sub-task 4.1.1:** Create dashboard with capacity utilization
   - **Sub-task 4.1.2:** Display today's scheduled pickups
   - **Sub-task 4.1.3:** Show pending donation offers
   - **Location:** `src/app/(dashboard)/ngo/page.tsx`

2. **Donation Offers Management** (2 points)
   - **Sub-task 4.1.4:** View all donation offers
   - **Sub-task 4.1.5:** Filter by status (pending, accepted, declined)
   - **Sub-task 4.1.6:** Add accept/decline actions
   - **Sub-task 4.1.7:** Show urgency indicators
   - **Location:** `src/components/ngo/DonationOffers.tsx`

3. **Capacity Management** (1 point)
   - **Sub-task 4.1.8:** Set daily capacity (in kg)
   - **Sub-task 4.1.9:** Track current utilization
   - **Sub-task 4.1.10:** Add capacity alerts
   - **Location:** `src/components/ngo/CapacityManagement.tsx`

4. **Pickup Scheduling** (1 point)
   - **Sub-task 4.1.11:** Schedule food pickups
   - **Sub-task 4.1.12:** Assign volunteers
   - **Sub-task 4.1.13:** Track pickup status
   - **Location:** `src/components/ngo/PickupScheduling.tsx`

### Acceptance Criteria
- [ ] Dashboard shows accurate capacity data
- [ ] Donation offers can be accepted/declined
- [ ] Capacity limits are enforced
- [ ] Pickup scheduling works correctly
- [ ] All features are role-specific

---

## Story 4.2: NGO Partners & Impact Tracking
**Story Points:** 4  
**Priority:** Medium  
**Sprint:** Sprint 3

### Description
Implement partner management, impact tracking, and feedback collection for NGOs.

### Tasks
1. **Partners Management** (1 point)
   - **Sub-task 4.2.1:** Display partner profiles (restaurants, shops, families)
   - **Sub-task 4.2.2:** Show partner performance metrics
   - **Sub-task 4.2.3:** Add communication history
   - **Location:** `src/components/ngo/PartnersManagement.tsx`

2. **Impact Analytics** (2 points)
   - **Sub-task 4.2.4:** Display impact trend charts
   - **Sub-task 4.2.5:** Show meals distributed statistics
   - **Sub-task 4.2.6:** Add partner contribution analysis
   - **Location:** `src/components/ngo/ImpactAnalytics.tsx`

3. **Feedback Collection** (1 point)
   - **Sub-task 4.2.7:** Create recipient feedback forms
   - **Sub-task 4.2.8:** Track feedback status
   - **Sub-task 4.2.9:** Collect impact stories
   - **Location:** `src/components/ngo/FeedbackCollection.tsx`

### Acceptance Criteria
- [ ] Partner profiles are accessible
- [ ] Impact metrics are accurate
- [ ] Feedback can be collected
- [ ] Analytics display correctly
- [ ] All features work as expected

---

## Story 4.3: Community Feed & Sharing
**Story Points:** 4  
**Priority:** Medium  
**Sprint:** Sprint 3

### Description
Build community feed with surplus food sharing, leftovers management, and social interactions.

### Tasks
1. **Community Feed** (2 points)
   - **Sub-task 4.3.1:** Create community feed page
   - **Sub-task 4.3.2:** Display community posts
   - **Sub-task 4.3.3:** Add filter by category and distance
   - **Sub-task 4.3.4:** Implement post interactions (like, comment)
   - **Location:** `src/app/(dashboard)/community/page.tsx`, `src/components/community/CommunityFeedCard.tsx`

2. **Surplus Food Sharing** (1 point)
   - **Sub-task 4.3.5:** Create post composer for surplus food
   - **Sub-task 4.3.6:** Add distance-based filtering
   - **Sub-task 4.3.7:** Implement claim functionality
   - **Location:** `src/components/community/PostComposer.tsx`, `src/components/community/SurplusPostCard.tsx`

3. **Leftovers Management** (1 point)
   - **Sub-task 4.3.8:** Post leftover items
   - **Sub-task 4.3.9:** Browse available leftovers
   - **Sub-task 4.3.10:** Track sharing history
   - **Location:** `src/components/community/LeftoverItemCard.tsx`

### Acceptance Criteria
- [ ] Community feed displays posts correctly
- [ ] Users can post surplus food
- [ ] Distance filtering works
- [ ] Claim functionality works
- [ ] Social interactions are functional

---

## Story 4.4: Community Leaderboard & Events
**Story Points:** 4  
**Priority:** Low  
**Sprint:** Sprint 3

### Description
Implement community leaderboard, kitchen events, and gamification features.

### Tasks
1. **Leaderboard** (1 point)
   - **Sub-task 4.4.1:** Display community rankings
   - **Sub-task 4.4.2:** Show XP points comparison
   - **Sub-task 4.4.3:** Add category-based leaderboards
   - **Location:** `src/components/community/LeaderboardTable.tsx`

2. **Community Kitchen Events** (2 points)
   - **Sub-task 4.4.4:** Display upcoming kitchen events
   - **Sub-task 4.4.5:** Add RSVP functionality
   - **Sub-task 4.4.6:** Show event details
   - **Location:** `src/components/community/KitchenEventCard.tsx`

3. **Impact Stats & Gamification** (1 point)
   - **Sub-task 4.4.7:** Show community-wide impact metrics
   - **Sub-task 4.4.8:** Display personal contribution stats
   - **Sub-task 4.4.9:** Add achievement highlights
   - **Location:** `src/components/community/CommunityImpactStats.tsx`

### Acceptance Criteria
- [ ] Leaderboard shows accurate rankings
- [ ] Events can be viewed and RSVP'd
- [ ] Impact stats are correct
- [ ] Gamification features work
- [ ] All features are engaging

---

# EPIC 5: AI-Powered Analytics & Optimization
**Sprint:** Sprint 3  
**Story Points:** 13  
**Priority:** High

## Story 5.1: AI Consumption Pattern Analyzer
**Story Points:** 5  
**Priority:** High  
**Sprint:** Sprint 3

### Description
Implement AI-powered consumption pattern analysis that detects trends, predicts waste, and identifies nutritional imbalances.

### Tasks
1. **Consumption Data Collection** (1 point)
   - **Sub-task 5.1.1:** Aggregate consumption logs by day and category
   - **Sub-task 5.1.2:** Prepare data for AI analysis
   - **Sub-task 5.1.3:** Create data transformation utilities
   - **Location:** `src/modules/ai/consumption-pattern.service.ts`

2. **AI API Integration** (2 points)
   - **Sub-task 5.1.4:** Integrate with OpenAI ChatGPT API
   - **Sub-task 5.1.5:** Create prompt templates for consumption analysis
   - **Sub-task 5.1.6:** Handle API responses and errors
   - **Location:** `src/lib/server/ai.service.ts`, `src/app/api/ai/consumption-pattern/route.ts`

3. **Pattern Analysis UI** (1 point)
   - **Sub-task 5.1.7:** Display consumption heatmap
   - **Sub-task 5.1.8:** Show over/under-consumption patterns
   - **Sub-task 5.1.9:** Highlight nutritional imbalances
   - **Location:** `src/components/family/AIConsumptionPatterns.tsx`

4. **Waste Prediction Display** (1 point)
   - **Sub-task 5.1.10:** Show items likely to be wasted in 3-7 days
   - **Sub-task 5.1.11:** Display confidence levels
   - **Sub-task 5.1.12:** Add actionable recommendations
   - **Location:** `src/components/family/AIWasteEstimation.tsx`

### Acceptance Criteria
- [ ] AI analyzes consumption patterns correctly
- [ ] Heatmap displays weekly trends
- [ ] Waste predictions are accurate (70%+ confidence)
- [ ] Recommendations are actionable
- [ ] UI handles API errors gracefully

---

## Story 5.2: AI Meal Optimization Engine
**Story Points:** 5  
**Priority:** High  
**Sprint:** Sprint 3

### Description
Build AI-powered meal optimization that creates weekly meal plans based on budget, inventory, and nutrition requirements.

### Tasks
1. **Meal Planning Data Preparation** (1 point)
   - **Sub-task 5.2.1:** Collect available inventory items
   - **Sub-task 5.2.2:** Gather user preferences and dietary restrictions
   - **Sub-task 5.2.3:** Prepare budget constraints
   - **Location:** `src/modules/ai/meal-optimization.service.ts`

2. **AI Meal Plan Generation** (2 points)
   - **Sub-task 5.2.4:** Create AI prompt for meal optimization
   - **Sub-task 5.2.5:** Generate weekly meal plan
   - **Sub-task 5.2.6:** Ensure nutrition requirements are met
   - **Sub-task 5.2.7:** Prioritize expiring items
   - **Location:** `src/app/api/ai/meal-optimization/route.ts`

3. **Meal Plan UI** (1 point)
   - **Sub-task 5.2.8:** Display weekly meal calendar
   - **Sub-task 5.2.9:** Show recipes and ingredients
   - **Sub-task 5.2.10:** Add meal plan editing capability
   - **Location:** `src/components/family/AIMealOptimization.tsx`, `src/components/family/MealPlannerWidget.tsx`

4. **Shopping List Generation** (1 point)
   - **Sub-task 5.2.11:** Auto-generate shopping list from meal plan
   - **Sub-task 5.2.12:** Show estimated costs
   - **Sub-task 5.2.13:** Highlight items already in inventory
   - **Location:** `src/components/family/SmartShoppingWidget.tsx`

### Acceptance Criteria
- [ ] Meal plans fit within budget
- [ ] Plans prioritize expiring inventory items
- [ ] Nutrition requirements are met
- [ ] Users can edit generated meal plans
- [ ] Shopping lists are accurate

---

## Story 5.3: SDG Impact Scoring Engine
**Story Points:** 3  
**Priority:** Medium  
**Sprint:** Sprint 3

### Description
Create SDG impact scoring system that evaluates user progress in waste reduction and nutrition improvement.

### Tasks
1. **Impact Metrics Calculation** (1 point)
   - **Sub-task 5.3.1:** Calculate waste reduction metrics
   - **Sub-task 5.3.2:** Measure nutrition improvement
   - **Sub-task 5.3.3:** Track sustainability indicators
   - **Location:** `src/modules/ai/sdg-impact.service.ts`

2. **SDG Score Generation** (1 point)
   - **Sub-task 5.3.4:** Generate personalized SDG score (0-100)
   - **Sub-task 5.3.5:** Break down by category (Waste, Nutrition, Sustainability)
   - **Sub-task 5.3.6:** Calculate weekly trends
   - **Location:** `src/app/api/ai/sdg-impact/route.ts`

3. **SDG Score UI** (1 point)
   - **Sub-task 5.3.7:** Display SDG score with visualizations
   - **Sub-task 5.3.8:** Show category breakdowns
   - **Sub-task 5.3.9:** Provide actionable next steps
   - **Location:** `src/components/family/AISDGImpact.tsx`

### Acceptance Criteria
- [ ] SDG scores are calculated accurately
- [ ] Scores update based on user actions
- [ ] Category breakdowns are clear
- [ ] Recommendations are relevant
- [ ] Trends are displayed correctly

---

## 📊 Sprint Summary

### Sprint 1 (25 Story Points)
- **Epic 1:** User Authentication & Role Management (12 points)
  - Authentication System (7)
  - Role Selection & Navigation (5)
- **Epic 2 (Part 1):** Family Dashboard & Inventory Core (13 points)
  - Family Dashboard (5)
  - Inventory Management (8)

### Sprint 2 (35 Story Points)
- **Epic 2 (Part 2):** Family Features Advanced (24 points)
  - Shopping List (5)
  - Meal Planner & Nutrition (13)
  - Family Preferences (3)
  - Environmental Impact (3)
- **Epic 3:** Business Stakeholder Features (20 points)
  - Restaurant Dashboard (5)
  - Restaurant Surplus (4)
  - Shop Dashboard (4)
  - Shop Surplus (4)
  - Business Analytics (3)

### Sprint 3 (31 Story Points)
- **Epic 4:** NGO Operations & Community (18 points)
  - NGO Dashboard (6)
  - NGO Partners (4)
  - Community Feed (4)
  - Community Leaderboard (4)
- **Epic 5:** AI-Powered Features (13 points)
  - AI Consumption Patterns (5)
  - AI Meal Optimization (5)
  - SDG Impact Scoring (3)

---

## 📋 Jira Import Instructions

### Epic Creation
1. Create 5 Epics as listed above
2. Link each Epic to the appropriate Sprint
3. Add labels: `feature-development`, `foodlink`

### Story Creation
1. Create Stories under each Epic
2. Set Story Points as indicated
3. Set Priority: Critical, High, Medium, Low
4. Link to appropriate Sprint
5. Add labels from story descriptions

### Task & Sub-task Creation
1. Create Tasks under each Story
2. Create Sub-tasks under each Task
3. Assign story points to sub-tasks where indicated
4. Link all to parent Story

### Custom Fields
- **Epic Link:** Link to parent Epic
- **Sprint:** Assign to Sprint 1, 2, or 3
- **Story Points:** Use Fibonacci scale (1, 2, 3, 5, 8)
- **Priority:** Critical, High, Medium, Low
- **Labels:** Feature-specific labels

---

**Document Version:** 1.0  
**Created:** 2024  
**Total Story Points:** 100  
**Focus:** Feature Development Only

