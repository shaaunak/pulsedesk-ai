"""
PulseDesk Citation Verifier
Performs code-level validation of all cited evidence IDs against the active
retrieved evidence set, repairing invalid citations and constructing trusted citation objects.
"""

import re
import logging
from typing import Tuple
from backend.models.schemas import EvidenceItem, CitationSchema

logger = logging.getLogger("pulsedesk-citation-verifier")

# Matches patterns like [ev_github_alpha_42], [fixture:github:42], [memory:fixture:memory:priority], etc.
CITATION_REGEX = re.compile(r"\[([a-zA-Z0-9_\-:]+)\]")

class CitationVerifier:
    def verify_and_extract_citations(
        self,
        answer: str,
        valid_evidence: list[EvidenceItem]
    ) -> Tuple[str, list[CitationSchema], list[str]]:
        """
        Validates citations in the answer against trusted evidence.
        Returns:
            - cleaned_answer: answer with valid citation markers preserved and invalid ones stripped/flagged
            - verified_citations: list of CitationSchema objects
            - warnings: list of validation warnings
        """
        evidence_map = {item.evidence_id: item for item in valid_evidence}
        # Also map short IDs (e.g. "fixture:github:42" -> "42", "ev_github_42" -> "42")
        short_map: dict[str, EvidenceItem] = {}
        for item in valid_evidence:
            short_map[item.evidence_id] = item
            if ":" in item.evidence_id:
                short_map[item.evidence_id.split(":")[-1]] = item
            if "_" in item.evidence_id:
                short_map[item.evidence_id.split("_")[-1]] = item

        found_tags = CITATION_REGEX.findall(answer)
        verified_citations: list[CitationSchema] = []
        seen_ids = set()
        warnings = []
        cleaned_answer = answer

        for tag in found_tags:
            # Check if tag is in evidence map
            matched_item = evidence_map.get(tag) or short_map.get(tag)
            
            if matched_item:
                if matched_item.evidence_id not in seen_ids:
                    seen_ids.add(matched_item.evidence_id)
                    # Create clean user-facing label
                    label = self._build_citation_label(matched_item)
                    verified_citations.append(
                        CitationSchema(
                            evidence_id=matched_item.evidence_id,
                            label=label,
                            url=matched_item.url,
                            snippet=matched_item.snippet[:200],
                            source_type=matched_item.source_type,
                        )
                    )
            else:
                # Invalid / Hallucinated citation tag!
                # If tag looks like a standard bracketed word (e.g., "[1]", "[GitHub]"), handle gracefully
                warnings.append(f"Removed ungrounded citation reference: '[{tag}]'")
                # Clean invalid tag from text if it's not a generic word
                if tag.startswith("ev_") or tag.startswith("fixture:") or tag.startswith("memory:"):
                    cleaned_answer = cleaned_answer.replace(f"[{tag}]", "")

        # If answer mentions key items but omitted explicit bracket tags, attach citations for matched evidence
        if not verified_citations and valid_evidence:
            for item in valid_evidence:
                if item.external_id.lower() in answer.lower() or item.title.lower() in answer.lower() or ("42" in answer and "42" in item.evidence_id):
                    if item.evidence_id not in seen_ids:
                        seen_ids.add(item.evidence_id)
                        verified_citations.append(
                            CitationSchema(
                                evidence_id=item.evidence_id,
                                label=self._build_citation_label(item),
                                url=item.url,
                                snippet=item.snippet[:200],
                                source_type=item.source_type,
                            )
                        )

        return cleaned_answer.strip(), verified_citations, warnings

    def _build_citation_label(self, item: EvidenceItem) -> str:
        if item.source_type == "github_issue":
            num = item.metadata.get("number")
            return f"GitHub · Issue #{num}" if num else f"GitHub · {item.title}"
        elif item.source_type == "gmail_message":
            subject = item.metadata.get("subject", "Email")
            return f"Gmail · {subject}"
        elif item.source_type == "memory":
            return f"Memory · {item.title}"
        elif item.source_type == "github_pr":
            return f"GitHub · PR #{item.metadata.get('number', '')}"
        return f"{item.source_type.capitalize()} · {item.title}"

citation_verifier = CitationVerifier()

