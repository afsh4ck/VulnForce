
import type { CVSS, Severity } from './types';

// CVSS v3.1 calculation logic adapted from the specification.
// For full details, see: https://www.first.org/cvss/v3.1/specification

const metrics = {
    AV: { N: 0.85, A: 0.62, L: 0.55, P: 0.2 },
    AC: { L: 0.77, H: 0.44 },
    PR: { N: 0.85, L: 0.62, H: 0.27 }, // Scope Unchanged
    PR_S: { N: 0.85, L: 0.68, H: 0.5 }, // Scope Changed
    UI: { N: 0.85, R: 0.62 },
    C: { N: 0, L: 0.22, H: 0.56 },
    I: { N: 0, L: 0.22, H: 0.56 },
    A: { N: 0, L: 0.22, H: 0.56 },
};

const ceil = (n: number) => Math.ceil(n * 10) / 10;

export function getCVSS(cvss: Omit<CVSS, 'score' | 'vectorString'>): string {
    return `CVSS:3.1/AV:${cvss.attackVector}/AC:${cvss.attackComplexity}/PR:${cvss.privilegesRequired}/UI:${cvss.userInteraction}/S:${cvss.scope}/C:${cvss.confidentiality}/I:${cvss.integrity}/A:${cvss.availability}`;
}

export function getScore(vectorString: string): number {
    const parts = vectorString.split('/');
    if (parts.length < 8) return 0.0;

    const values: Record<string, string> = {};
    parts.forEach(part => {
        const [key, val] = part.split(':');
        if (key && val) {
            values[key] = val;
        }
    });

    const scopeChanged = values['S'] === 'C';

    const av = metrics.AV[values['AV'] as keyof typeof metrics.AV] || 0;
    const ac = metrics.AC[values['AC'] as keyof typeof metrics.AC] || 0;
    const ui = metrics.UI[values['UI'] as keyof typeof metrics.UI] || 0;
    const c = metrics.C[values['C'] as keyof typeof metrics.C] || 0;
    const i = metrics.I[values['I'] as keyof typeof metrics.I] || 0;
    const a = metrics.A[values['A'] as keyof typeof metrics.A] || 0;
    
    let pr;
    if(scopeChanged) {
        pr = metrics.PR_S[values['PR'] as keyof typeof metrics.PR_S] || 0;
    } else {
        pr = metrics.PR[values['PR'] as keyof typeof metrics.PR] || 0;
    }

    const impactSubScore = 1 - ((1 - c) * (1 - i) * (1 - a));
    
    let impact;
    if (scopeChanged) {
        impact = 7.52 * (impactSubScore - 0.029) - 3.25 * Math.pow(impactSubScore - 0.02, 15);
    } else {
        impact = 6.42 * impactSubScore;
    }
    
    if (impact <= 0) return 0.0;

    const exploitability = 8.22 * av * ac * pr * ui;

    let baseScore;
    if (scopeChanged) {
        baseScore = ceil(Math.min(1.08 * (impact + exploitability), 10));
    } else {
        baseScore = ceil(Math.min(impact + exploitability, 10));
    }

    return baseScore;
}


export function getSeverity(score: number): Severity {
  if (score >= 9.0) return 'Critical';
  if (score >= 7.0) return 'High';
  if (score >= 4.0) return 'Medium';
  if (score >= 0.1) return 'Low';
  return 'Informational';
}
