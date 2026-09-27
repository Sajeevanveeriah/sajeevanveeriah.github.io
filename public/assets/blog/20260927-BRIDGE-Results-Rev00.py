"""Recalculate published BRIDGE table values. Python 3, standard library only.
Source: https://arxiv.org/html/2609.03497v1, Tables 4 and 5.
This checks arithmetic; it does not run a policy, simulator or physical robot.
Run: python 20260927-BRIDGE-Results-Rev00.py
"""
import json
import math

PUBLISHED = {
    'Bumi': {'success_percent': 91.87, 'kinematic_error': 0.0381, 'dynamic_error': 0.0458, 'human_likeness': 0.4321},
    'K1': {'success_percent': 92.66, 'kinematic_error': 0.0396, 'dynamic_error': 0.0472, 'human_likeness': 0.4198},
    'ToddlerBot': {'success_percent': 88.23, 'kinematic_error': 0.0413, 'dynamic_error': 0.0533, 'human_likeness': 0.3883},
    'BRIDGE': {'success_percent': 94.83, 'kinematic_error': 0.0260, 'dynamic_error': 0.0384, 'human_likeness': 0.5252},
}

def audit():
    scores = []
    for name, row in PUBLISHED.items():
        score = math.exp(-(0.5 * row['kinematic_error'] + 0.5 * row['dynamic_error']) / 0.05)
        # Each printed error may differ by 0.00005 after rounding. The
        # combined exponent therefore has uncertainty at most 0.001.
        tolerance = score * math.expm1(0.001) + 0.00005
        delta = abs(score - row['human_likeness'])
        scores.append({'platform': name, 'recomputed_score': round(score, 6),
                       'reported_score': row['human_likeness'],
                       'absolute_difference': round(delta, 6),
                       'rounding_tolerance': round(tolerance, 6),
                       'within_rounding_tolerance': delta <= tolerance})
        assert delta <= tolerance, (name, delta, tolerance)
    bridge = PUBLISHED['BRIDGE']['success_percent']
    baseline = PUBLISHED['K1']['success_percent']
    gap = bridge - baseline
    relative_success_gain = 100 * gap / baseline
    relative_failure_reduction = 100 * ((100 - baseline) - (100 - bridge)) / (100 - baseline)
    assert round(gap, 2) == 2.17
    assert round(relative_failure_reduction, 2) == 29.56
    return {'scope': 'Arithmetic audit of published rounded aggregates; no independent robotics benchmark',
            'source': 'https://arxiv.org/html/2609.03497v1',
            'published_results': PUBLISHED, 'score_checks': scores,
            'bridge_vs_k1': {'success_gap_percentage_points': round(gap, 2),
                             'relative_success_gain_percent': round(relative_success_gain, 2),
                             'relative_failure_reduction_percent': round(relative_failure_reduction, 2)},
            'checks_passed': 6}

if __name__ == '__main__':
    print(json.dumps(audit(), indent=2))
