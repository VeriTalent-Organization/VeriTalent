# **💼 VERITALENT — PRODUCT REQUIREMENTS DOCUMENT (PRD)**

### *Your Intelligence for Smarter Hiring*

---

# **1\. PRODUCT OVERVIEW**

## **1.1 Product Summary**

VeriTalent is an AI-powered Talent Intelligence Copilot that helps organizations screen smarter, hire faster and reduce bias through verified references, AI Signals for competency and automated candidate profiling.

It also empowers talents to build verifiable, portable digital career identities backed by trusted issuers and AI insights.

## **1.2 Key Modules**

* Talent Identity & Profile System (VeriTalent ID, VeriTalent AI Card)  
* Employer & Organization Accounts  
* AI Screening Interface (Fit Scoring, Ranking, Insights)  
* Referencing and Verification  
* Career Repository & Competency Signals  
* Unified Multi-role / Multi-email Identity System

---

# **2\. PROBLEM STATEMENT**

## **2.1 Current Challenges**

* Hiring processes are slow, subjective and heavily manual  
* Reference checks are inconsistent, unverifiable or easily manipulated  
* Talents lack a credible way to validate competencies or past experience  
* Employers struggle to assess candidate quality beyond the CV

## **2.2 Opportunities**

Using AI \+ verified data to:

* Reduce screening time  
* Eliminate unconscious bias  
* Standardize verifiable references  
* Build portable, trust-based talent identities  
* Enable data-rich decision-making for employers  
* AI agent to review and signal competencies of learners and interns

---

# **3\. CORE VALUE PROPOSITION**

| Stakeholder | Value Delivered |
| ----- | ----- |
| **Employers / Recruiters** | AI-driven screening, verified references, candidate fit scoring & ranking |
| **Talents / Professionals** | Verified identity, competency signals, AI growth insights, career visibility |

---

# **4\. STRATEGIC OBJECTIVES**

* Automate screening & reference verification  
* Minimize hiring bias through AI insights  
* Give individuals a portable, verifiable career identity  
* Build an interoperable talent intelligence layer  
* Integrate with ATS systems for enterprise adoption

---

# **5\. TARGET USERS & PERSONAS**

## **5.1 Talents (Individuals)**

Students, graduates, freelancers, early-career, mid-career professionals.  
 **Goals:** Verified profiles, visibility, job opportunities  
 **Pain Points:** Unverifiable credentials, low credibility, limited career insights

## **5.2 Employers / Recruiters**

Internal HR teams, hiring managers, independent recruiters.  
 **Goals:** Faster screening, reliable verification  
 **Pain Points:** Bias, manual processes, slow reference checks

## **5.3 Organization Admins / Representatives**

Companies, institutions, registrars, academic leads.  
 **Goals:** Issue references, manage verification workflows, signal competency   
 **Pain Points:** Fragmented systems, no standard verification format 

---

# **6\. REGISTRATION & ONBOARDING SYSTEM**

## **6.1 Unified Identity Architecture**

Each user has:

* Single VeriTalent Account  
* Primary Email \+ Linked Emails (institutional/professional)  
* Roles: Talent, Independent Recruiter, Organization Admin  
* Unique Talent ID (VT/\#\#\#\#-XX)

## **6.2 Multi-Role Access**

One user can seamlessly switch between:

* Talent Profile  
* Independent Recruiter  
* Organization Admin

Role selection appears at login and via top navigation.

## **6.3 Multi-Email Logic**

* Users can link multiple emails (personal, work, school)  
* Any linked email can be used to login  
* Organization verification uses domain or LinkedIn company validation  
* All emails unify under one user identity

## **6.4 Onboarding Flows**

### **A. Talent Onboarding**

1. Sign up → Email/Google/LinkedIn  
2. Create VeriTalent ID  
3. Upload CV or import LinkedIn  
4. AI auto-parses into VeriTalent AI Card  
5. Access Talent Dashboard  
6. Request references  
7. Apply to Jobs  
8. LPI Integrations & Reports

### **B. Independent Recruiter / Manager Onboarding**

1. Add role or sign up  
2. Access Recruiter Dashboard  
3. Manage job postings, screen applicants  
4. Issue professional recommendations

### **C. Organization Admin Onboarding**

1. Register organization  
2. Domain verification / document validation  
3. Add team members & roles  
4. Access Organization Dashboards (Main VeriTalent & Institutional LPI Agent)  
5. Manage screening & reference issuance through Main VeriTalent dashboard   
6. Manage learners/interns submissions and generated reports through the Institutional LPI Agent

---

# **7\. FEATURE SET & REQUIREMENTS**

# **7.1 TALENT FEATURES**

### **1\. Sign In**

* Email/password  
* Google SSO  
* LinkedIn SSO

### **2\. Profile Creation**

* CV upload (PDF/DOC/DOCX)  
* LinkedIn import  
* AI auto-parsing  
* Auto VeriTalent ID generation

### **3\. VeriTalent AI Card**

Contains:

* Candidate Career Snapshot  
* Skills & Competency Signals (LPI   
* Verified references (VeriTalent Repository)  
* AI career insights  
* Shareable link  
* Export PDF

### **4\. Competency Signals**

AI evaluates:

* Skills and Experience quality  
* Work and Learning reports  
* Reference and Recommendations  
* Soft/hard skill indicators

Levels: Beginner → Intermediate → Advanced

### **5\. Reference Module**

* Request references  
* Track status  
* Receive verified references

### **6\. Job Recommendation Engine**

* AI-matched job listings  
* One-click apply  
* Track applications

### **7\. Profile Management**

* Edit info  
* Update career history  
* Manage linked emails

---

# **7.2 INDEPENDENT RECRUITER / MANAGER FEATURES**

### **1\. Dashboard**

* Screening activity feed

### **2\. Applicant Intake**

Three ways:

1. Direct applications (Job Posting)  
2. Upload list of VeriTalent IDs  
3. Bulk CV upload → auto AI parsing (System generates Draft VeriTalent AI Cards for candidates without VeriTalent IDs)

### **3\. Screening Interface**

* AI Fit Score  
* Ranking view  
* Applicant's AI Card view  
* Shortlist  
* Evaluation & interview notes

### **4\. Professional Recommendations**

* Issue recommendations  
* View all issued recommendations

### **5\. Notifications**

* Reference changes  
* Application updates

### **6\. Profile**

* Status: Professional Designation & Organization Name  
* Manage tokens  
* Multi-role navigation

---

# **7.3 ORGANIZATION ADMIN FEATURES**

### **1\. Organization Verification**

* Domain validation  
* LinkedIn page validation  
* Document upload option

### **2\. Job Posting & Screening**

* Create & manage job posts  
* Bulk screening  
* Fit scoring & ranking

### **3\. Verification & Reference Issuance**

Issue:

* Work references  
* Other References (eg Performance, Membership, Studentship, Acknowledgement etc)  
* Certificate Verification

### **4\. Custom Pricing Setup**

* For Certificate Verification

### **5\. Institutional LP Agent Dashboard**

* Integrations for learners/interns submissions  
* AI processing with report   
* Summary/Report generation and competency signals 

### **6\. Team Management**

* Add/remove team members  
* Assign Admin/Recruiter roles  
* Manage tokens

---

# **8\. VERITALENT AI CARD — STRUCTURE**

### **HEADER**

* Name  
* VeriTalent ID  
* Profile verification status

### **BASIC INFO**

* Role or career objective  
* Location  
* Education  
* LinkedIn

### **CAREER SNAPSHOT**

* Bio  
* Work experience summary  
* Education summary

### **SKILLS & COMPETENCY SIGNALS**

* Hard & soft skills  
* Skill levels  
* Validation source

### **REFERENCES (VeriTalent Repository)**

* Work  
* Academic  
* Community  
* Status (pending/verified) \+ date

### **AI INSIGHTS**

* Suggested roles  
* Growth recommendations  
* Fit Score (employer-only)

### **ACTIONS**

* Download PDF  
* Share  
* Edit  
* Request reference

---

# **9\. TECHNICAL REQUIREMENTS**

## **Backend**

* Unified Identity System  
* Multi-email mapping service  
* AI CV parsing engine  
* Screening engine \+ scoring model  
* Reference verification service  
* Organization registry & domain checker  
* LPI Agent 

## **Frontend**

* Modular dashboards  
* Role switch interface  
* Step-based onboarding  
* Upload components  
* Responsive UI

## **Integrations**

* LinkedIn API  
* Google OAuth  
* Microsoft OAuth  
* ATS ingestion  
* Email verification 