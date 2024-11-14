// src\screen(구버전)\healthscreen\tabs\data.js
// src\screen(구버전)\healthscreen\tabs\data.js
// src/screen(구버전)/healthscreen/tabs/data.js

/*
건강검진 수치들에 대한 데이터입니다. resUrinaryProtein의 경우 음성과 양성으로 구분되므로 metrics_info에서 단위, 상한, 하한 을 제공하지 않습니다. 
정상범위의 상한 값만 존재하는 몇몇 값들은 normal_range_lower_limit이 없습니다. 
정상범위의 하한 값만 존재하는 몇몇 값들은 normal_range_upper_limit이 없습니다. 
*/
export const metrics_info = {
    "resGFR": {"unit": "mL/min", "normal_range_lower_limit": 60},
    "resSerumCreatinine": {"unit": "mg/dL", "normal_range_upper_limit": 1.6},
    "resBloodPressureSystolic": {"unit": "mmHg", "normal_range_upper_limit": 120},  // 수축기 혈압
    "resBloodPressureDiastolic": {"unit": "mmHg", "normal_range_upper_limit": 80},  // 이완기 혈압
    "resFastingBloodSugar": {"unit": "mg/dL", "normal_range_upper_limit": 100},    // 공복 혈당
    "resTotalCholesterol": {"unit": "mg/dL", "normal_range_upper_limit": 200},
    "resHDLCholesterol":{"unit": "mg/dL", "normal_range_lower_limit":60},
    "resLDLCholesterol": {"unit": "mg/dL", "normal_range_upper_limit": 130},
    "resHemoglobin": {"unit": "g/dL", "normal_range_upper_limit": {"male":16.5, "female": 15.5}, "normal_range_lower_limit":{"male":13, "female": 12}},
    "resAST": {"unit": "U/L", "normal_range_upper_limit": 40},
    "resALT": {"unit": "U/L", "normal_range_upper_limit": 35},
    "resyGPT": {"unit": "U/L", "normal_range_upper_limit": {"male":77, "female": 45}, "normal_range_lower_limit":{"male":64, "female": 36}},
}

/*
건강검진 수치들에 대하여 간단한 분석을 제공할 때 사용되는 텍스트들입니다.
이 텍스트들은 각 수치가 정상 범위 내에 있지 않을 때 발생할 수 있는 증상과 관련된 조언들을 포함합니다.
*/
export const analysis_text = {
    "resGFR": {
        "normal": "사구체여과율이 정상입니다. 사구체여과율은 콩팥이 혈액 속 노폐물을 걸러내는 능력을 나타냅니다.",
        "too_low": "사구체여과율이 낮습니다. 사구체여과율은 콩팥이 혈액을 정화하는 능력을 보여줍니다. 낮은 수치는 콩팥 기능 저하를 의미하며, 피로, 부종, 고혈압 등의 증상이 있을 수 있습니다. 콩팥 건강을 위해 전문의와 상담이 권장됩니다.",
        "too_high": "사구체여과율이 높습니다. 이는 콩팥이 과하게 작동하고 있음을 나타낼 수 있습니다. 콩팥의 지속적인 관리가 필요하며, 전문가와 상담하는 것이 좋습니다."
    },
    "resSerumCreatinine": {
        "normal": "혈청 크레아티닌 수치가 정상입니다. 혈청 크레아티닌은 콩팥이 노폐물을 얼마나 잘 배출하는지를 알려주는 지표입니다.",
        "too_low": "혈청 크레아티닌 수치가 낮습니다. 혈청 크레아티닌은 근육에서 생성되는 노폐물로, 낮은 수치는 근육량이 줄었거나 간 기능에 문제가 있을 수 있습니다. 상태 확인을 위해 지속적인 관찰이 필요합니다.",
        "too_high": "혈청 크레아티닌 수치가 높습니다. 콩팥이 노폐물을 제대로 배출하지 못할 가능성을 나타냅니다. 콩팥 건강을 위해 신장 전문의와 상담이 필요합니다."
    },
    "resUrinaryProtein": {
        "negative": "요단백이 검출되지 않았습니다. 요단백은 소변 내 단백질로, 검출되지 않으면 콩팥이 정상적으로 기능하고 있음을 의미합니다.",
        "positive": "요단백이 검출되었습니다. 이는 콩팥에 손상이 있을 가능성을 나타내며, 피로, 부종, 혈뇨 등의 증상이 동반될 수 있습니다. 콩팥 건강을 위해 신장 전문의와의 상담이 필요합니다."
    },
    "resBloodPressureSystolic": {
        "normal": "수축기 혈압이 정상입니다. 심혈관 건강을 유지하기 위해 규칙적인 운동과 균형 잡힌 식단을 유지하세요.",
        "too_low": "수축기 혈압이 너무 낮습니다. 이는 저혈압과 관련이 있을 수 있으며, 어지러움, 피로, 심한 경우 실신 등의 증상이 나타날 수 있습니다. 전문가와 상담이 필요합니다.",
        "too_high": "수축기 혈압이 너무 높습니다. 이는 고혈압의 징후일 수 있으며, 두통, 가슴 통증, 심계항진 등의 증상이 나타날 수 있습니다. 생활습관 개선과 약물 치료가 필요할 수 있습니다."
    },
    "resBloodPressureDiastolic": {
        "normal": "이완기 혈압이 정상입니다. 심혈관 건강을 유지하기 위해 스트레스를 관리하고 규칙적인 운동을 하세요.",
        "too_low": "이완기 혈압이 너무 낮습니다. 이는 저혈압의 징후일 수 있으며, 피로감, 어지러움, 시야 흐림 등의 증상이 나타날 수 있습니다. 의료 전문가와의 상담을 권장합니다.",
        "too_high": "이완기 혈압이 너무 높습니다. 이는 고혈압의 징후일 수 있으며, 심장에 부담이 갈 수 있으므로 조절이 필요합니다. 생활습관 개선과 약물 치료를 고려해야 합니다."
    },
    "resFastingBloodSugar": {
        "normal": "공복 혈당이 정상입니다. 당뇨병 예방을 위해 규칙적인 운동과 건강한 식단을 유지하세요.",
        "too_low": "공복 혈당이 너무 낮습니다. 저혈당증이 발생할 수 있으며, 어지러움, 발한, 혼란 등의 증상이 나타날 수 있습니다. 당분 섭취가 필요할 수 있으며, 전문가와 상담하세요.",
        "too_high": "공복 혈당이 너무 높습니다. 이는 당뇨병의 징후일 수 있으며, 갈증, 잦은 배뇨, 피로 등의 증상이 나타날 수 있습니다. 식이 조절과 운동, 약물 치료가 필요할 수 있습니다."
    },
    "resTotalCholesterol": {
        "normal": "총 콜레스테롤 수치가 정상입니다. 심혈관 건강을 유지하려면 균형 잡힌 식단과 규칙적인 운동을 유지하세요.",
        "too_low": "총 콜레스테롤 수치가 너무 낮습니다. 이는 영양 부족이나 간 질환과 관련이 있을 수 있습니다. 전문의와의 상담이 필요합니다.",
        "too_high": "총 콜레스테롤 수치가 너무 높습니다. 이는 동맥경화증의 위험을 증가시킬 수 있으며, 식이 조절과 운동, 필요시 약물 치료가 필요합니다."
    },
    "resHDLCholesterol": {
        "normal": "HDL 콜레스테롤 수치가 정상입니다. 이는 심혈관 질환 예방에 도움이 됩니다.",
        "too_low": "HDL 콜레스테롤 수치가 너무 낮습니다. 이는 심혈관 질환의 위험을 증가시킬 수 있으며, 규칙적인 운동과 건강한 지방 섭취를 권장합니다.",
        "too_high": "HDL 콜레스테롤 수치가 너무 높습니다. 드물게 고지혈증과 관련이 있을 수 있으며, 전문가와 상담하는 것이 좋습니다."
    },
    "resLDLCholesterol": {
        "normal": "LDL 콜레스테롤 수치가 정상입니다. 심혈관 건강을 유지하려면 식이와 운동을 지속하세요.",
        "too_low": "LDL 콜레스테롤 수치가 너무 낮습니다. 이는 영양 부족과 관련이 있을 수 있습니다. 전문의와 상담이 필요합니다.",
        "too_high": "LDL 콜레스테롤 수치가 너무 높습니다. 이는 동맥경화증의 위험을 증가시킬 수 있으며, 식이 조절과 약물 치료가 필요할 수 있습니다."
    },
    "resHemoglobin": {
        "normal": "헤모글로빈 수치가 정상입니다. 철분이 풍부한 식단을 유지하고, 전반적인 건강을 유지하세요.",
        "too_low": "헤모글로빈 수치가 너무 낮습니다. 빈혈의 징후일 수 있으며, 피로, 어지러움, 창백한 피부 등의 증상이 나타날 수 있습니다. 철분 보충제나 식이 조절이 필요할 수 있습니다.",
        "too_high": "헤모글로빈 수치가 너무 높습니다. 이는 혈액 농도가 높다는 것을 의미할 수 있으며, 탈수 또는 폐 질환과 관련이 있을 수 있습니다. 전문가와 상담이 필요합니다."
    },
    "resAST": {
        "normal": "AST 수치가 정상입니다. 간 기능이 정상적으로 작동하고 있음을 의미합니다.",
        "too_low": "AST 수치가 너무 낮습니다. 이는 일반적으로 문제가 되지 않지만, 간 기능 저하와 관련이 있을 수 있습니다.",
        "too_high": "AST 수치가 너무 높습니다. 간 손상, 근육 손상 또는 심장 질환과 관련이 있을 수 있으며, 전문의와의 상담이 필요합니다."
    },
    "resALT": {
        "normal": "ALT 수치가 정상입니다. 간 건강을 유지하고 있음을 의미합니다.",
        "too_low": "ALT 수치가 너무 낮습니다. 일반적으로 문제가 되지 않지만, 간 기능 저하와 관련이 있을 수 있습니다.",
        "too_high": "ALT 수치가 너무 높습니다. 간 손상 또는 염증의 징후일 수 있으며, 알코올 섭취를 줄이고 간에 무리를 주는 약물을 피하세요. 전문가와의 상담이 필요합니다."
    },
    "resyGPT": {
        "normal": "r-GTP 수치가 정상입니다. 간과 담즙의 건강을 유지하고 있음을 나타냅니다.",
        "too_low": "r-GTP 수치가 너무 낮습니다. 이는 일반적으로 문제가 되지 않지만, 간 기능 저하와 관련이 있을 수 있습니다.",
        "too_high": "r-GTP 수치가 너무 높습니다. 이는 간 손상이나 알코올 섭취와 관련이 있을 수 있으며, 알코올 섭취를 줄이고 전문가와 상담하는 것이 필요합니다."
    },
};
