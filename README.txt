EFDA website kit
================
locales/   en.json (source), am.json and om.json (DRAFTS - native-speaker review required before launch).
           Namespaces: common, home, about, projects, contact. Same keys in every language.
logo/      efda-globe-forest.svg   - primary mark on light backgrounds
           efda-globe-reversed.svg - on forest / dark backgrounds
           efda-globe-white.svg    - one-colour on laterite or photos
           efda-favicon.svg        - simplified 16-32 px version
           Gaps between tiles are real transparent cut-outs (SVG mask).
photos/    Photos from EFDA's 2024 profile, upscaled 2x. Low-res originals - replace with a new shoot.
           Apply the duotone treatment in CSS (see build document), never bake it into the files.
Build spec: see the "EFDA Website - Build Document" doc.
