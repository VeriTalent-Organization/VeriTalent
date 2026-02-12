"""
Competency Signal Generator

Generates AI-backed competency signals from talent data using weighted multi-source validation.

Signal Source Weighting (100%):
- CV / Profile Analysis: 15%
- Professional Recommendations (PR): 15%
- Verified Certifications (V.Cert): 20%
- TAPI Intelligence: 20%
- Work Experience References (Ref): 20%
- Base Signal Mark: 10%

Signal Level Classification:
- 0-30: Poor (Weak or insufficient validation)
- 31-50: Low (Limited single-source evidence)
- 51-60: Good (Moderate multi-source validation)
- 61-75: Very Good (Strong consistent validation)
- 76-100: Excellent (Highly credible multi-dimensional validation)
"""
from typing import Optional

from src.models.competency import CompetencySignal, Evidence, SourceBreakdown
from src.services.llm_service import LLMService
from src.services.embedding_service import EmbeddingService


class CompetencySignalGenerator:
    """Service for generating competency signals."""

    def __init__(self):
        self.llm_service = LLMService()
        self.embedding_service = EmbeddingService()

    async def generate(
        self,
        talent_id: str,
        cv_data: Optional[dict] = None,
        professional_recommendations: list[dict] = None,
        verified_certifications: list[dict] = None,
        tapi_data: list[dict] = None,
        work_references: list[dict] = None,
        work_samples: list[dict] = None,
    ) -> list[CompetencySignal]:
        """
        Generate competency signals from available talent data using weighted sources.
        
        Args:
            talent_id: Unique identifier for the talent
            cv_data: Parsed CV data (15% weight)
            professional_recommendations: Verified endorsements (15% weight)
            verified_certifications: Authenticated credentials (20% weight)
            tapi_data: TAPI performance intelligence (20% weight)
            work_references: Employment references (20% weight)
            work_samples: Project evidence (supplementary)
            
        Returns:
            List of CompetencySignal objects with multi-source validation
        """
        professional_recommendations = professional_recommendations or []
        verified_certifications = verified_certifications or []
        tapi_data = tapi_data or []
        work_references = work_references or []
        work_samples = work_samples or []
        
        signals = []
        
        # Extract skills from CV (15% weight)
        if cv_data:
            cv_signals = await self._generate_from_cv(cv_data)
            signals.extend(cv_signals)
        
        # Enhance with professional recommendations (15% weight)
        if professional_recommendations:
            signals = await self._enhance_with_professional_recommendations(signals, professional_recommendations)
        
        # Add verified certifications (20% weight)
        if verified_certifications:
            signals = await self._add_certification_evidence(signals, verified_certifications)
        
        # Add TAPI intelligence (20% weight)
        if tapi_data:
            signals = await self._add_tapi_evidence(signals, tapi_data)
        
        # Add work references (20% weight)
        if work_references:
            signals = await self._add_work_reference_evidence(signals, work_references)
        
        # Add work sample evidence (supplementary)
        if work_samples:
            signals = await self._add_work_sample_evidence(signals, work_samples)
        
        # Calculate final weighted scores (includes 10% base signal)
        signals = self._calculate_weighted_scores(signals)
        
        return signals

    async def _generate_from_cv(self, cv_data: dict) -> list[CompetencySignal]:
        """Generate initial signals from CV data (15% weight)."""
        signals = []
        
        skills = cv_data.get("skills", [])
        work_experience = cv_data.get("work_experience", [])
        
        for skill in skills:
            skill_name = skill if isinstance(skill, str) else skill.get("name", "")
            
            # Find evidence in work experience
            evidence = []
            for exp in work_experience:
                responsibilities = exp.get("responsibilities", [])
                achievements = exp.get("achievements", [])
                
                for item in responsibilities + achievements:
                    if skill_name.lower() in item.lower():
                        evidence.append(
                            Evidence(
                                source="CV",
                                confidence=0.7,
                                snippet=item[:200],
                                weight_contribution=0.0,  # Calculated later
                            )
                        )
            
            signals.append(
                CompetencySignal(
                    skill=skill_name,
                    score=0,  # Will be calculated later
                    level="Poor",  # Will be determined by weighted score
                    evidence=evidence,
                    confidence=0.0,  # Calculated from all sources
                )
            )
        
        return signals

    async def _enhance_with_professional_recommendations(
        self,
        signals: list[CompetencySignal],
        recommendations: list[dict],
    ) -> list[CompetencySignal]:
        """Enhance signals with professional recommendations (15% weight)."""
        for signal in signals:
            for rec in recommendations:
                rec_text = rec.get("text", "") or rec.get("recommendation", "")
                
                if signal.skill.lower() in rec_text.lower():
                    signal.evidence.append(
                        Evidence(
                            source="PR",
                            confidence=0.9,
                            snippet=rec_text[:200],
                            weight_contribution=0.0,  # Calculated later
                        )
                    )
                    signal.verified = True
                    signal.verified_by = rec.get("issuer", "Professional")
        
        return signals

    async def _add_certification_evidence(
        self,
        signals: list[CompetencySignal],
        certifications: list[dict],
    ) -> list[CompetencySignal]:
        """Add verified certification evidence (20% weight)."""
        for signal in signals:
            for cert in certifications:
                cert_name = cert.get("name", "")
                cert_skills = cert.get("skills", [])
                
                if signal.skill.lower() in cert_name.lower() or \
                   signal.skill in cert_skills:
                    signal.evidence.append(
                        Evidence(
                            source="V.Cert",
                            confidence=1.0,  # Verified credentials
                            snippet=f"{cert_name} - {cert.get('issuer', 'Unknown')}",
                            weight_contribution=0.0,  # Calculated later
                        )
                    )
                    signal.verified = True
        
        return signals

    async def _add_tapi_evidence(
        self,
        signals: list[CompetencySignal],
        tapi_data: list[dict],
    ) -> list[CompetencySignal]:
        """Add TAPI intelligence evidence (20% weight)."""
        for signal in signals:
            for tapi in tapi_data:
                tapi_skills = tapi.get("skills_demonstrated", [])
                performance_score = tapi.get("performance_score", 0)
                
                if signal.skill in tapi_skills or \
                   signal.skill.lower() in tapi.get("summary", "").lower():
                    signal.evidence.append(
                        Evidence(
                            source="TAPI",
                            confidence=performance_score / 100.0,
                            snippet=tapi.get("summary", "")[:200],
                            weight_contribution=0.0,  # Calculated later
                        )
                    )
        
        return signals

    async def _add_work_reference_evidence(
        self,
        signals: list[CompetencySignal],
        references: list[dict],
    ) -> list[CompetencySignal]:
        """Add work experience reference evidence (20% weight)."""
        for signal in signals:
            for ref in references:
                ref_text = ref.get("feedback", "") or ref.get("text", "")
                
                if signal.skill.lower() in ref_text.lower():
                    signal.evidence.append(
                        Evidence(
                            source="Ref",
                            confidence=0.85,
                            snippet=ref_text[:200],
                            weight_contribution=0.0,  # Calculated later
                        )
                    )
                    signal.verified = True
        
        return signals

    async def _add_work_sample_evidence(
        self,
        signals: list[CompetencySignal],
        work_samples: list[dict],
    ) -> list[CompetencySignal]:
        """Add work sample evidence (supplementary - enhances CV score)."""
        for signal in signals:
            for sample in work_samples:
                sample_text = sample.get("description", "")
                technologies = sample.get("technologies", [])
                
                if signal.skill.lower() in sample_text.lower() or \
                   signal.skill in technologies:
                    # Work samples enhance CV validation
                    signal.evidence.append(
                        Evidence(
                            source="CV",  # Enhances CV evidence
                            confidence=0.85,
                            snippet=sample_text[:200],
                            weight_contribution=0.0,  # Calculated later
                        )
                    )
        
        return signals

    def _calculate_weighted_scores(
        self,
        signals: list[CompetencySignal],
    ) -> list[CompetencySignal]:
        """
        Calculate final scores using weighted multi-source validation.
        
        Weighting:
        - CV: 15%
        - PR: 15%
        - V.Cert: 20%
        - TAPI: 20%
        - Ref: 20%
        - Base Signal: 10%
        """
        for signal in signals:
            # Initialize breakdown
            breakdown = SourceBreakdown()
            
            # Count evidence by source
            cv_evidence = [e for e in signal.evidence if e.source == "CV"]
            pr_evidence = [e for e in signal.evidence if e.source == "PR"]
            cert_evidence = [e for e in signal.evidence if e.source == "V.Cert"]
            tapi_evidence = [e for e in signal.evidence if e.source == "TAPI"]
            ref_evidence = [e for e in signal.evidence if e.source == "Ref"]
            
            # Calculate source scores (max weight × evidence strength)
            # CV: 15% max
            if cv_evidence:
                cv_confidence = sum(e.confidence for e in cv_evidence) / len(cv_evidence)
                cv_strength = min(1.0, len(cv_evidence) / 3)  # 3+ pieces = full strength
                breakdown.cv_analysis = 15.0 * cv_confidence * cv_strength
            
            # PR: 15% max
            if pr_evidence:
                pr_confidence = sum(e.confidence for e in pr_evidence) / len(pr_evidence)
                pr_strength = min(1.0, len(pr_evidence) / 2)  # 2+ recommendations = full strength
                breakdown.professional_recommendations = 15.0 * pr_confidence * pr_strength
            
            # V.Cert: 20% max
            if cert_evidence:
                cert_confidence = sum(e.confidence for e in cert_evidence) / len(cert_evidence)
                cert_strength = min(1.0, len(cert_evidence) / 2)  # 2+ certs = full strength
                breakdown.verified_certifications = 20.0 * cert_confidence * cert_strength
            
            # TAPI: 20% max
            if tapi_evidence:
                tapi_confidence = sum(e.confidence for e in tapi_evidence) / len(tapi_evidence)
                tapi_strength = min(1.0, len(tapi_evidence) / 3)  # 3+ activities = full strength
                breakdown.tapi_intelligence = 20.0 * tapi_confidence * tapi_strength
            
            # Ref: 20% max
            if ref_evidence:
                ref_confidence = sum(e.confidence for e in ref_evidence) / len(ref_evidence)
                ref_strength = min(1.0, len(ref_evidence) / 2)  # 2+ references = full strength
                breakdown.work_references = 20.0 * ref_confidence * ref_strength
            
            # Base signal: 10% (applied to all verified profiles)
            breakdown.base_signal = 10.0
            
            # Calculate final score
            final_score = (
                breakdown.cv_analysis +
                breakdown.professional_recommendations +
                breakdown.verified_certifications +
                breakdown.tapi_intelligence +
                breakdown.work_references +
                breakdown.base_signal
            )
            
            signal.score = int(min(100, final_score))
            signal.source_breakdown = breakdown
            
            # Calculate overall confidence
            all_evidence = signal.evidence
            if all_evidence:
                signal.confidence = sum(e.confidence for e in all_evidence) / len(all_evidence)
            else:
                signal.confidence = 0.0
            
            # Determine level based on score
            if signal.score >= 76:
                signal.level = "Excellent"
            elif signal.score >= 61:
                signal.level = "Very Good"
            elif signal.score >= 51:
                signal.level = "Good"
            elif signal.score >= 31:
                signal.level = "Low"
            else:
                signal.level = "Poor"
            
            # Update evidence weight contributions
            for evidence in signal.evidence:
                if evidence.source == "CV":
                    evidence.weight_contribution = breakdown.cv_analysis
                elif evidence.source == "PR":
                    evidence.weight_contribution = breakdown.professional_recommendations
                elif evidence.source == "V.Cert":
                    evidence.weight_contribution = breakdown.verified_certifications
                elif evidence.source == "TAPI":
                    evidence.weight_contribution = breakdown.tapi_intelligence
                elif evidence.source == "Ref":
                    evidence.weight_contribution = breakdown.work_references
        
        return signals

    async def get_stored_signals(self, talent_id: str) -> list[CompetencySignal]:
        """Retrieve stored competency signals for a talent."""
        # TODO: Implement database retrieval
        return []

    async def refresh_signals(self, talent_id: str) -> dict:
        """Trigger refresh of competency signals."""
        # TODO: Implement async job queue
        return {"job_id": f"refresh-{talent_id}"}
